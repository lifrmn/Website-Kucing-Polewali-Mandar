-- Preserve all existing boarding data while generalizing cat-specific columns.
ALTER TABLE "penitipan_packages" RENAME COLUMN "max_cats" TO "max_pets";
ALTER TABLE "penitipan_packages" ADD COLUMN "accepted_pet_types" TEXT NOT NULL DEFAULT '["CAT"]';

ALTER TABLE "penitipan_bookings" RENAME COLUMN "cat_name" TO "pet_name";
ALTER TABLE "penitipan_bookings" RENAME COLUMN "cat_age" TO "pet_age";
ALTER TABLE "penitipan_bookings" RENAME COLUMN "cat_gender" TO "pet_gender";
ALTER TABLE "penitipan_bookings" RENAME COLUMN "cat_breed" TO "pet_breed";
ALTER TABLE "penitipan_bookings" RENAME COLUMN "cat_health_condition" TO "pet_health_condition";
ALTER TABLE "penitipan_bookings" RENAME COLUMN "cat_count" TO "pet_count";
ALTER TABLE "penitipan_bookings" RENAME COLUMN "cat_photo_url" TO "pet_photo_url";
ALTER TABLE "penitipan_bookings" ADD COLUMN "pet_type" TEXT NOT NULL DEFAULT 'CAT';
ALTER TABLE "penitipan_bookings" ADD COLUMN "pet_type_other" TEXT;

ALTER TABLE "services" ADD COLUMN "supported_pet_types" TEXT NOT NULL DEFAULT '["CAT"]';
ALTER TABLE "products" ADD COLUMN "pet_types" TEXT NOT NULL DEFAULT '["CAT"]';