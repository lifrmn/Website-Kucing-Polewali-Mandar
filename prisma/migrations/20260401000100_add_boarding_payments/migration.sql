ALTER TABLE "penitipan_bookings" ADD COLUMN "payment_method" TEXT NOT NULL DEFAULT 'BANK_TRANSFER';
ALTER TABLE "penitipan_bookings" ADD COLUMN "deposit_amount" REAL NOT NULL DEFAULT 0;
ALTER TABLE "penitipan_bookings" ADD COLUMN "payment_verified_at" DATETIME;