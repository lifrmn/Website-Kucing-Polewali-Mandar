ALTER TABLE "penitipan_bookings" ADD COLUMN "cat_count" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "penitipan_bookings" ADD COLUMN "vaccination_status" TEXT;
ALTER TABLE "penitipan_bookings" ADD COLUMN "routine_medication" TEXT;
ALTER TABLE "penitipan_bookings" ADD COLUMN "allergies" TEXT;
ALTER TABLE "penitipan_bookings" ADD COLUMN "special_food" TEXT;
ALTER TABLE "penitipan_bookings" ADD COLUMN "boarding_terms_accepted_at" DATETIME;