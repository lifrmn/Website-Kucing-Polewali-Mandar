-- AlterTable
ALTER TABLE "service_bookings" ADD COLUMN "idempotency_key" TEXT;

-- AlterTable
ALTER TABLE "penitipan_bookings" ADD COLUMN "idempotency_key" TEXT;
ALTER TABLE "penitipan_bookings" ADD COLUMN "admin_notes" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "service_bookings_idempotency_key_key" ON "service_bookings"("idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "penitipan_bookings_idempotency_key_key" ON "penitipan_bookings"("idempotency_key");