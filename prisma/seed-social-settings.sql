-- Seed default social media settings
-- Run this SQL in your database to initialize social media links

INSERT INTO settings (id, key, value, type, description, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'social_instagram', 'https://www.instagram.com/cikalpetcare', 'string', 'Instagram profile URL', NOW(), NOW()),
  (gen_random_uuid(), 'social_facebook', 'https://www.facebook.com/cikalpetcare', 'string', 'Facebook page URL', NOW(), NOW()),
  (gen_random_uuid(), 'social_tiktok', 'https://www.tiktok.com/@cikalpetcare', 'string', 'TikTok profile URL', NOW(), NOW()),
  (gen_random_uuid(), 'social_youtube', 'https://www.youtube.com/@cikalpetcare', 'string', 'YouTube channel URL', NOW(), NOW())
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value,
      updated_at = NOW();
