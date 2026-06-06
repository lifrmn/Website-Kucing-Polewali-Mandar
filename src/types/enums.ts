// ============================================
// ENUM TYPES - Application-Level Type Safety
// SQLite doesn't support native enums, so we define them here
// ============================================

export enum OrderStatus {
  PENDING = 'PENDING',
  WAITING_VERIFICATION = 'WAITING_VERIFICATION',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  VERIFYING = 'VERIFYING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  QRIS = 'QRIS',
  COD = 'COD',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export enum ActivityAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

// Validation helpers
export function isValidOrderStatus(status: string): status is OrderStatus {
  return Object.values(OrderStatus).includes(status as OrderStatus);
}

export function isValidPaymentStatus(status: string): status is PaymentStatus {
  return Object.values(PaymentStatus).includes(status as PaymentStatus);
}

export function isValidPaymentMethod(method: string): method is PaymentMethod {
  return Object.values(PaymentMethod).includes(method as PaymentMethod);
}

export function isValidBookingStatus(status: string): status is BookingStatus {
  return Object.values(BookingStatus).includes(status as BookingStatus);
}

export function isValidUserRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole);
}

export function isValidActivityAction(action: string): action is ActivityAction {
  return Object.values(ActivityAction).includes(action as ActivityAction);
}
