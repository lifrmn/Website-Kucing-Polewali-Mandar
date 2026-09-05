import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { after, before, test } from 'node:test';

import { PrismaClient } from '@prisma/client';

import { reconcileCart } from '../src/services/cartService';

const databasePath = join(tmpdir(), `cikal-cart-${randomUUID()}.db`);
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

async function createProduct(options: { stock?: number; active?: boolean } = {}) {
  const id = randomUUID();
  return prisma.product.create({
    data: {
      id,
      name: `Authoritative Product ${id}`,
      slug: `authoritative-product-${id}`,
      sku: `CART-${id}`,
      price: 75_000,
      stock: options.stock ?? 5,
      category: 'test',
      image_url: '/database-product.jpg',
      is_active: options.active ?? true,
    },
  });
}

test('cart sync returns current database product fields and caps quantity to stock', async () => {
  const product = await createProduct({ stock: 3 });

  const result = await reconcileCart(prisma, [{
    id: product.id,
    type: 'product',
    quantity: 99,
  }]);

  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, []);
  assert.equal(result.changes.length, 1);
  assert.equal(result.items[0].name, product.name);
  assert.equal(result.items[0].price, 75_000);
  assert.equal(result.items[0].image_url, '/database-product.jpg');
  assert.equal(result.items[0].quantity, 3);
  assert.equal(result.items[0].stock, 3);
});

test('cart sync rejects variants owned by another product', async () => {
  const selectedProduct = await createProduct();
  const owner = await createProduct();
  const variant = await prisma.productVariant.create({
    data: {
      product_id: owner.id,
      sku: `CART-VARIANT-${randomUUID()}`,
      name: 'Large',
      attributes: '{"size":"L"}',
      price: 90_000,
      stock: 4,
    },
  });

  const result = await reconcileCart(prisma, [{
    id: selectedProduct.id,
    type: 'product',
    variantId: variant.id,
    quantity: 1,
  }]);

  assert.equal(result.valid, false);
  assert.equal(result.items.length, 0);
  assert.match(result.errors[0], /varian sudah tidak tersedia/i);
});

test('cart sync tolerates malformed legacy variant attributes', async () => {
  const product = await createProduct();
  const variant = await prisma.productVariant.create({
    data: {
      product_id: product.id,
      sku: `CART-LEGACY-${randomUUID()}`,
      name: 'Legacy',
      attributes: '{invalid-json',
      stock: 2,
    },
  });

  const result = await reconcileCart(prisma, [{
    id: product.id,
    type: 'product',
    variantId: variant.id,
    quantity: 1,
  }]);

  assert.equal(result.valid, true);
  assert.deepEqual(result.items[0].variantAttributes, {});
});

test('cart sync removes inactive items', async () => {
  const product = await createProduct({ active: false });

  const result = await reconcileCart(prisma, [{
    id: product.id,
    type: 'product',
    quantity: 1,
  }]);

  assert.equal(result.valid, false);
  assert.equal(result.items.length, 0);
  assert.match(result.errors[0], /tidak tersedia/i);
});

test('cart sync normalizes services and returns their current database price', async () => {
  const id = randomUUID();
  const service = await prisma.service.create({
    data: {
      id,
      name: `Grooming ${id}`,
      slug: `grooming-${id}`,
      type: 'grooming',
      price: 125_000,
      image_url: '/database-service.jpg',
    },
  });

  const result = await reconcileCart(prisma, [{
    id: service.id,
    type: 'service',
    quantity: 4,
  }]);

  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, []);
  assert.equal(result.changes.length, 1);
  assert.equal(result.items[0].quantity, 1);
  assert.equal(result.items[0].price, 125_000);
  assert.equal(result.items[0].name, service.name);
});