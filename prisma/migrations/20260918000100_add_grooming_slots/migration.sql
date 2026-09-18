CREATE TABLE "grooming_slots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "time" TEXT NOT NULL,
    "max_bookings" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "grooming_slots_time_key" ON "grooming_slots"("time");
CREATE INDEX "grooming_slots_is_active_idx" ON "grooming_slots"("is_active");