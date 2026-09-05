import { Prisma, PrismaClient } from '@prisma/client';

import type { OrderUpdateInput } from '@/lib/validations/order-management';
import { createActivityLog, type AuditContext } from '@/lib/audit';
import { OrderStatus, PaymentStatus } from '@/types/enums';

export type OrderManagementErrorCode = 'ORDER_NOT_FOUND' | 'CANCELED_ORDER_IS_FINAL';

export class OrderManagementError extends Error {
  constructor(public readonly code: OrderManagementErrorCode) {
    super(code);
    this.name = 'OrderManagementError';
  }
}

export function updateManagedOrder(
  database: PrismaClient,
  orderId: string,
  input: OrderUpdateInput,
  audit?: AuditContext
) {
  return database.$transaction(async (tx) => {
    const currentOrder = await tx.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
    if (!currentOrder) throw new OrderManagementError('ORDER_NOT_FOUND');

    if (
      currentOrder.status === OrderStatus.CANCELED &&
      input.status &&
      input.status !== OrderStatus.CANCELED
    ) {
      throw new OrderManagementError('CANCELED_ORDER_IS_FINAL');
    }

    let nextStatus = input.status;
    if (
      input.payment_status === PaymentStatus.PAID &&
      !nextStatus &&
      [OrderStatus.PENDING, OrderStatus.WAITING_VERIFICATION].includes(currentOrder.status as OrderStatus)
    ) {
      nextStatus = OrderStatus.PAID;
    } else if (
      input.payment_status === PaymentStatus.VERIFYING &&
      !nextStatus &&
      currentOrder.status === OrderStatus.PENDING
    ) {
      nextStatus = OrderStatus.WAITING_VERIFICATION;
    } else if (
      input.payment_status === PaymentStatus.FAILED &&
      !nextStatus &&
      currentOrder.status === OrderStatus.WAITING_VERIFICATION
    ) {
      nextStatus = OrderStatus.PENDING;
    } else if (input.payment_status === PaymentStatus.REFUNDED && !nextStatus) {
      nextStatus = OrderStatus.REFUNDED;
    }

    if (nextStatus === OrderStatus.CANCELED && currentOrder.status !== OrderStatus.CANCELED) {
      for (const item of currentOrder.orderItems) {
        if (item.variant_id) {
          await tx.productVariant.updateMany({
            where: { id: item.variant_id },
            data: { stock: { increment: item.quantity } },
          });
        } else if (item.product_id) {
          await tx.product.updateMany({
            where: { id: item.product_id },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    const now = new Date();
    const updateData: Prisma.OrderUncheckedUpdateInput = {};
    if (input.payment_status !== undefined) updateData.payment_status = input.payment_status;
    if (input.admin_notes !== undefined) updateData.admin_notes = input.admin_notes || null;
    if (input.tracking_number !== undefined) updateData.tracking_number = input.tracking_number || null;
    if (nextStatus !== undefined) updateData.status = nextStatus;

    if (input.payment_status === PaymentStatus.PAID) {
      updateData.payment_verified_at = now;
      updateData.paid_at = currentOrder.paid_at ?? now;
    }
    if (nextStatus === OrderStatus.SHIPPED) updateData.shipped_at = currentOrder.shipped_at ?? now;
    if (nextStatus === OrderStatus.COMPLETED) updateData.completed_at = currentOrder.completed_at ?? now;
    if (nextStatus === OrderStatus.CANCELED) updateData.canceled_at = currentOrder.canceled_at ?? now;

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        customer: true,
        orderItems: {
          include: { product: true, variant: true, service: true },
        },
      },
    });

    if (audit) {
      await createActivityLog(tx, {
        ...audit,
        entityType: 'order',
        entityId: orderId,
        orderId,
        action: input.payment_status === PaymentStatus.PAID
          ? 'APPROVE'
          : input.payment_status === PaymentStatus.FAILED
            ? 'REJECT'
            : 'UPDATE',
        description: 'Admin memperbarui status pesanan',
        metadata: {
          previousStatus: currentOrder.status,
          nextStatus: updatedOrder.status,
          previousPaymentStatus: currentOrder.payment_status,
          nextPaymentStatus: updatedOrder.payment_status,
          changedFields: Object.keys(input),
        },
      });
    }

    return updatedOrder;
  }, { isolationLevel: 'Serializable', timeout: 10_000 });
}

export function updateManagedPaymentProof(
  database: PrismaClient,
  orderId: string,
  paymentProofUrl: string,
  audit: AuditContext
) {
  return database.$transaction(async (tx) => {
    const currentOrder = await tx.order.findUnique({ where: { id: orderId } });
    if (!currentOrder) throw new OrderManagementError('ORDER_NOT_FOUND');

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { payment_proof_url: paymentProofUrl },
    });
    await createActivityLog(tx, {
      ...audit,
      entityType: 'order',
      entityId: orderId,
      orderId,
      action: 'UPDATE',
      description: 'Admin memperbarui bukti pembayaran pesanan',
      metadata: { changedFields: ['payment_proof_url'] },
    });
    return updatedOrder;
  });
}
