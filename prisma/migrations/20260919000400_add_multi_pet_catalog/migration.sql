-- Expand existing general-purpose records only where the service is suitable.
UPDATE "products"
SET "pet_types" = '["CAT","DOG"]', "updated_at" = CURRENT_TIMESTAMP
WHERE "slug" = 'sisir-grooming-professional' AND "pet_types" = '["CAT"]';

UPDATE "products"
SET "pet_types" = '["CAT","DOG","RABBIT"]', "updated_at" = CURRENT_TIMESTAMP
WHERE "slug" = 'pet-carrier-travel-box' AND "pet_types" = '["CAT"]';

UPDATE "services"
SET "supported_pet_types" = '["CAT","DOG","RABBIT"]', "updated_at" = CURRENT_TIMESTAMP
WHERE "slug" = 'grooming-basic' AND "supported_pet_types" = '["CAT"]';

UPDATE "services"
SET "supported_pet_types" = '["CAT","DOG","RABBIT","HAMSTER","BIRD","OTHER"]', "updated_at" = CURRENT_TIMESTAMP
WHERE "slug" IN ('konsultasi-kesehatan', 'pemeriksaan-lengkap') AND "supported_pet_types" = '["CAT"]';

-- Products for each pet group exposed by the public filters.
INSERT OR IGNORE INTO "products" ("id", "name", "slug", "description", "sku", "price", "stock", "category", "pet_types", "image_url", "is_active", "featured", "low_stock_alert", "created_at", "updated_at") VALUES
  (lower(hex(randomblob(16))), 'Dog Food Adult Chicken 2kg', 'dog-food-adult-chicken-2kg', 'Makanan kering untuk anjing dewasa dengan protein ayam dan nutrisi harian seimbang.', 'DOG-FD-2KG', 175000, 18, 'Makanan', '["DOG"]', '/placeholder-product.svg', true, true, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (lower(hex(randomblob(16))), 'Shampoo Anjing Gentle Care 250ml', 'shampoo-anjing-gentle-care-250ml', 'Shampoo khusus anjing untuk membantu membersihkan bulu dan menjaga kelembutannya.', 'DOG-SHP-250', 65000, 24, 'Grooming', '["DOG"]', '/placeholder-product.svg', true, false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (lower(hex(randomblob(16))), 'Dental Chew Anjing', 'dental-chew-anjing', 'Camilan kunyah untuk anjing sebagai bagian dari rutinitas perawatan gigi harian.', 'DOG-DCH-01', 42000, 32, 'Makanan', '["DOG"]', '/placeholder-product.svg', true, false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (lower(hex(randomblob(16))), 'Mainan Tali Anjing', 'mainan-tali-anjing', 'Mainan tali kuat untuk aktivitas tarik dan bermain bersama anjing dengan pengawasan pemilik.', 'DOG-TOY-01', 48000, 20, 'Mainan', '["DOG"]', '/placeholder-product.svg', true, false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (lower(hex(randomblob(16))), 'Mangkuk Makan Stainless', 'mangkuk-makan-stainless', 'Mangkuk makan stainless yang mudah dibersihkan untuk kucing, anjing, dan kelinci.', 'PET-BWL-01', 38000, 30, 'Aksesoris', '["CAT","DOG","RABBIT"]', '/placeholder-product.svg', true, true, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (lower(hex(randomblob(16))), 'Hay Kelinci Timothy 500g', 'hay-kelinci-timothy-500g', 'Timothy hay untuk membantu memenuhi kebutuhan serat harian kelinci dewasa.', 'RBT-HAY-500', 75000, 16, 'Makanan', '["RABBIT"]', '/placeholder-product.svg', true, false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (lower(hex(randomblob(16))), 'Bedding Hewan Kecil', 'bedding-hewan-kecil', 'Alas kandang lembut dan menyerap untuk hamster dan hewan kecil lainnya.', 'SML-BED-01', 35000, 25, 'Kandang', '["HAMSTER"]', '/placeholder-product.svg', true, false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (lower(hex(randomblob(16))), 'Pakan Burung Harian 500g', 'pakan-burung-harian-500g', 'Campuran biji untuk kebutuhan pakan harian burung peliharaan sesuai petunjuk kemasan.', 'BRD-FD-500', 32000, 22, 'Makanan', '["BIRD"]', '/placeholder-product.svg', true, false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (lower(hex(randomblob(16))), 'Pembersih Habitat Multi-Pet 500ml', 'pembersih-habitat-multi-pet-500ml', 'Pembersih habitat untuk area tinggal reptil dan hewan peliharaan lain. Gunakan sesuai petunjuk kemasan.', 'OTH-CLN-500', 58000, 15, 'Grooming', '["OTHER"]', '/placeholder-product.svg', true, false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Dedicated care options avoid presenting cat-specific procedures as universal.
INSERT OR IGNORE INTO "services" ("id", "name", "slug", "description", "type", "supported_pet_types", "duration", "price", "image_url", "is_active", "featured", "max_bookings_per_day", "created_at", "updated_at") VALUES
  (lower(hex(randomblob(16))), 'Grooming Anjing Premium', 'grooming-anjing-premium', 'Perawatan lengkap anjing meliputi mandi, pengeringan, penyisiran, pembersihan telinga, dan potong kuku.', 'grooming', '["DOG"]', 90, 110000, '/placeholder-product.svg', true, true, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (lower(hex(randomblob(16))), 'Perawatan Kelinci dan Hewan Kecil', 'perawatan-kelinci-hewan-kecil', 'Perawatan kebersihan ringan, penyisiran, pemeriksaan kuku, serta konsultasi habitat untuk kelinci dan hewan kecil.', 'grooming', '["RABBIT","HAMSTER"]', 45, 70000, '/placeholder-product.svg', true, false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (lower(hex(randomblob(16))), 'Perawatan Burung', 'perawatan-burung', 'Pemeriksaan kebersihan bulu, kuku, paruh, serta konsultasi perawatan harian burung peliharaan.', 'pemeriksaan', '["BIRD"]', 40, 75000, '/placeholder-product.svg', true, false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (lower(hex(randomblob(16))), 'Konsultasi Hewan Eksotis', 'konsultasi-hewan-eksotis', 'Konsultasi awal kebutuhan perawatan untuk reptil dan jenis hewan lain sebelum menentukan penanganan lanjutan.', 'konsultasi', '["OTHER"]', 45, 100000, '/placeholder-product.svg', true, false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Separate boarding packages retain species-appropriate capacity and care descriptions.
INSERT OR IGNORE INTO "penitipan_packages" ("id", "name", "slug", "description", "price_per_night", "features", "max_pets", "accepted_pet_types", "image_url", "is_active", "featured", "created_at", "updated_at") VALUES
  (lower(hex(randomblob(16))), 'Dog Comfort Room', 'dog-comfort-room', 'Ruang penitipan anjing dengan area istirahat dan aktivitas harian terjadwal.', 90000, 'Area individual, Air minum, Makan sesuai jadwal pemilik, Aktivitas 2x sehari, Pemantauan harian', 1, '["DOG"]', '/placeholder-product.svg', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (lower(hex(randomblob(16))), 'Small Pet Habitat', 'small-pet-habitat', 'Habitat tenang untuk kelinci, hamster, dan hewan kecil dengan alas serta rutinitas pakan terpisah.', 65000, 'Habitat individual, Bedding bersih, Pakan sesuai instruksi, Air minum, Pemantauan harian', 2, '["RABBIT","HAMSTER"]', '/placeholder-product.svg', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (lower(hex(randomblob(16))), 'Bird Care Stay', 'bird-care-stay', 'Area penitipan burung yang tenang dengan jadwal pakan dan kebersihan kandang.', 60000, 'Area tenang, Pakan sesuai instruksi, Air minum, Kebersihan kandang, Pemantauan harian', 2, '["BIRD"]', '/placeholder-product.svg', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (lower(hex(randomblob(16))), 'Custom Pet Care', 'custom-pet-care', 'Penitipan untuk jenis hewan lain setelah kebutuhan habitat, pakan, dan penanganannya dikonsultasikan.', 100000, 'Konsultasi pra-booking, Habitat disesuaikan, Pakan sesuai instruksi, Pemantauan harian', 1, '["OTHER"]', '/placeholder-product.svg', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);