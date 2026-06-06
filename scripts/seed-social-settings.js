#!/usr/bin/env node

/**
 * Script to seed social media settings
 * Run: node scripts/seed-social-settings.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const socialSettings = [
  {
    key: 'social_instagram',
    value: 'https://www.instagram.com/cikalpetcare',
    type: 'string',
    description: 'Instagram profile URL for footer social bar',
  },
  {
    key: 'social_facebook',
    value: 'https://www.facebook.com/cikalpetcare',
    type: 'string',
    description: 'Facebook page URL for footer social bar',
  },
  {
    key: 'social_tiktok',
    value: 'https://www.tiktok.com/@cikalpetcare',
    type: 'string',
    description: 'TikTok profile URL for footer social bar',
  },
  {
    key: 'social_youtube',
    value: 'https://www.youtube.com/@cikalpetcare',
    type: 'string',
    description: 'YouTube channel URL for footer social bar',
  },
];

async function seedSocialSettings() {
  console.log('🌱 Seeding social media settings...\n');

  for (const setting of socialSettings) {
    try {
      const result = await prisma.settings.upsert({
        where: { key: setting.key },
        create: setting,
        update: {
          value: setting.value,
          description: setting.description,
        },
      });
      
      console.log(`✅ ${setting.key}: ${result.value}`);
    } catch (error) {
      console.error(`❌ Failed to seed ${setting.key}:`, error.message);
    }
  }

  console.log('\n✨ Social media settings seeded successfully!');
}

async function main() {
  try {
    await seedSocialSettings();
  } catch (error) {
    console.error('❌ Error seeding settings:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
