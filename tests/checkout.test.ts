import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { after, before, test } from 'node:test';

import { PrismaClient } from '@prisma/client';

import { checkoutSchema } from '../src/lib/validations/order';
import { customerOrderLookupSchema } from '../src/lib/validations/customer-order';
import {
  CheckoutConflictError,
  createCheckout,
} from '../src/services/checkoutService';
import {
  OrderManagementError,
  updateManagedOrder,
} from '../src/services/orderManagementService';
import { OrderStatus, PaymentStatus } from '../src/types/enums';
import { findCustomerOrder } from '../src/services/customerOrderService';

const databasePath = join(tmpdir(), `cikal-checkout-${randomUUID()}.db`);
const databaseUrl = `file:${databasePath.replace(/\\/g, '/')}`;
const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });

before(() => {
  execFileSync(process.execPath, [resolve('node_modules/prisma/build/index.js'), 'migrate', 'deploy'], {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'pipe',
  });
});

after(async () => {
  await prisma.$disconnect();
  for (const suffix of ['', '-journal', '-shm', '-wal']) {
    rmSync(`${databasePath}${suffix}`, { force: true });
  }
});

function checkoutInput(productId: string, quantity: number, variantId?: string) {
  return checkoutSchema.parse({
    customer_name: 'Customer Integration',
    customer_phone: '081234567890',
    customer_email: '',
    customer_address: 'Jalan Testing Polewali',
    payment_method: 'transfer',
    items: [{
      item_type: 'product',
      item_id: productId,
      variant_id: variantId,
      quantity,
      unit_price: 1,
      subtotal: 1,
    }],
  });
}

async function createProduct(price: number, stock: number) {
  const id = randomUUID();
  return prisma.product.create({
    data: {
      id,
      name: `Product ${id}`,
      slug: `product-${id}`,
      sku: `SKU-${id}`,
      price,
      stock,
      category: 'test',
    },
  });
}

test('checkout uses server price, decrements stock, and replays idempotently', async () => {
  const product = await createProduct(25_000, 10);
  const idempotencyKey = randomUUID();

  const first = await createCheckout(prisma, checkoutInput(product.id, 2), idempotencyKey);
  assert.equal(first.replayed, false);
  assert.equal(first.order.orderItems[0].price, 25_000);
  assert.equal(first.order.subtotal, 50_000);
  assert.equal(first.order.shipping_cost, 10_000);
  assert.equal(first.order.total_amount, 60_000);

  const replay = await createCheckout(prisma, checkoutInput(product.id, 2), idempotencyKey);
  assert.equal(replay.replayed, true);
  assert.equal(replay.order.id, first.order.id);
  assert.equal(await prisma.order.count(), 1);
  assert.equal((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).stock, 8);

  const customerAfterReplay = await prisma.customer.findUniqueOrThrow({
    where: { phone: '081234567890' },
  });
  assert.equal(customerAfterReplay.total_orders, 1);
  assert.equal(customerAfterReplay.total_spent, 60_000);

  await createCheckout(prisma, checkoutInput(product.id, 2), randomUUID());
  const repeatCustomer = await prisma.customer.findUniqueOrThrow({
    where: { phone: '081234567890' },
  });
  assert.equal(repeatCustomer.total_orders, 2);
  assert.equal(repeatCustomer.total_spent, 120_000);
});

test('checkout rejects a variant owned by another product', async () => {
  const selectedProduct = await createProduct(10_000, 5);
  const variantOwner = await createProduct(20_000, 5);
  const variant = await prisma.productVariant.create({
    data: {
      product_id: variantOwner.id,
      sku: `VAR-${randomUUID()}`,
      name: 'Wrong owner',
      attributes: '{}',
      price: 30_000,
      stock: 4,
    },
  });

  await assert.rejects(
    createCheckout(prisma, checkoutInput(selectedProduct.id, 1, variant.id), randomUUID()),
    (error: unknown) => error instanceof CheckoutConflictError && error.code === 'VARIANT_UNAVAILABLE'
  );
  assert.equal((await prisma.productVariant.findUniqueOrThrow({ where: { id: variant.id } })).stock, 4);
});

test('checkout requires an active variant and uses its price and stock', async () => {
  const product = await createProduct(20_000, 5);
  const variant = await prisma.productVariant.create({
    data: {
      product_id: product.id,
      sku: `VAR-${randomUUID()}`,
      name: 'Premium',
      attributes: '{"grade":"premium"}',
      price: 35_000,
      stock: 4,
    },
  });

  await assert.rejects(
    createCheckout(prisma, checkoutInput(product.id, 1), randomUUID()),
    (error: unknown) => error instanceof CheckoutConflictError && error.code === 'VARIANT_REQUIRED'
  );

  const checkout = await createCheckout(
    prisma,
    checkoutInput(product.id, 2, variant.id),
    randomUUID()
  );
  assert.equal(checkout.order.orderItems[0].price, 35_000);
  assert.equal(checkout.order.subtotal, 70_000);
  assert.equal((await prisma.productVariant.findUniqueOrThrow({ where: { id: variant.id } })).stock, 2);
  assert.equal((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).stock, 5);

  await updateManagedOrder(prisma, checkout.order.id, { status: OrderStatus.CANCELED });
  assert.equal((await prisma.productVariant.findUniqueOrThrow({ where: { id: variant.id } })).stock, 4);
});

test('insufficient stock rolls back all stock and customer changes', async () => {
  const availableProduct = await createProduct(15_000, 5);
  const unavailableProduct = await createProduct(20_000, 1);
  const input = checkoutSchema.parse({
    customer_name: 'Rollback Customer',
    customer_phone: '081298765432',
    customer_address: 'Jalan Rollback Polewali',
    payment_method: 'cod',
    items: [
      { item_type: 'product', item_id: availableProduct.id, quantity: 2 },
      { item_type: 'product', item_id: unavailableProduct.id, quantity: 2 },
    ],
  });

  await assert.rejects(
    createCheckout(prisma, input, randomUUID()),
    (error: unknown) => error instanceof CheckoutConflictError && error.code === 'INSUFFICIENT_STOCK'
  );
  assert.equal((await prisma.product.findUniqueOrThrow({ where: { id: availableProduct.id } })).stock, 5);
  assert.equal((await prisma.product.findUniqueOrThrow({ where: { id: unavailableProduct.id } })).stock, 1);
  assert.equal(await prisma.customer.count({ where: { phone: '081298765432' } }), 0);
  assert.equal(await prisma.order.count({ where: { customer: { phone: '081298765432' } } }), 0);
});

test('order updates persist fields and cancellation restores stock exactly once', async () => {
  const product = await createProduct(40_000, 5);
  const checkout = await createCheckout(prisma, checkoutInput(product.id, 2), randomUUID());
  const actor = await prisma.user.create({
    data: {
      email: `order-audit-${randomUUID()}@example.com`,
      name: 'Order Audit Admin',
      password: 'test-only',
    },
  });

  const paidOrder = await updateManagedOrder(prisma, checkout.order.id, {
    payment_status: PaymentStatus.PAID,
    admin_notes: 'Pembayaran cocok',
    tracking_number: 'RESI-123',
  }, {
    userId: actor.id,
    ipAddress: '127.0.0.1',
  });
  assert.equal(paidOrder.payment_status, PaymentStatus.PAID);
  assert.equal(paidOrder.status, OrderStatus.PAID);
  assert.ok(paidOrder.payment_verified_at);
  assert.ok(paidOrder.paid_at);
  assert.equal(paidOrder.admin_notes, 'Pembayaran cocok');
  assert.equal(paidOrder.tracking_number, 'RESI-123');
  const audit = await prisma.activityLog.findFirstOrThrow({
    where: { order_id: checkout.order.id, user_id: actor.id },
  });
  assert.equal(audit.action, 'APPROVE');
  assert.equal(audit.ip_address, '127.0.0.1');
  assert.match(audit.metadata || '', /"nextPaymentStatus":"PAID"/);
  assert.doesNotMatch(audit.metadata || '', /Pembayaran cocok|RESI-123/);

  await updateManagedOrder(prisma, checkout.order.id, { status: OrderStatus.CANCELED });
  assert.equal((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).stock, 5);

  await updateManagedOrder(prisma, checkout.order.id, { status: OrderStatus.CANCELED });
  assert.equal((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).stock, 5);

  await assert.rejects(
    updateManagedOrder(
      prisma,
      checkout.order.id,
      { status: OrderStatus.PROCESSING },
      { userId: actor.id }
    ),
    (error: unknown) => error instanceof OrderManagementError && error.code === 'CANCELED_ORDER_IS_FINAL'
  );
  assert.equal(await prisma.activityLog.count({ where: { user_id: actor.id } }), 1);
});

test('customer lookup requires matching phone and does not return customer PII', async () => {
  const product = await createProduct(22_000, 3);
  const checkout = await createCheckout(prisma, checkoutInput(product.id, 1), randomUUID());

  const found = await findCustomerOrder(prisma, customerOrderLookupSchema.parse({
    order_number: checkout.order.order_number.toLowerCase(),
    customer_phone: '0812 3456 7890',
  }));
  assert.ok(found);
  assert.equal(found.order_number, checkout.order.order_number);
  assert.equal('customer' in found, false);

  const denied = await findCustomerOrder(prisma, customerOrderLookupSchema.parse({
    order_number: checkout.order.order_number,
    customer_phone: '081200000000',
  }));
  assert.equal(denied, null);
});
