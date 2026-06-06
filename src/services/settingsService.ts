import prisma from '@/lib/prisma';

export interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

class SettingsService {
  /**
   * Get social media links from Settings table
   */
  async getSocialMediaLinks(): Promise<SocialMediaLinks> {
    try {
      const keys = ['social_instagram', 'social_facebook', 'social_tiktok', 'social_youtube'];
      const settings = await prisma.settings.findMany({
        where: {
          key: { in: keys }
        },
        select: {
          key: true,
          value: true,
        }
      });

      const links: SocialMediaLinks = {};
      settings.forEach(setting => {
        const value = setting.value?.trim();
        if (value && value !== '#' && value !== '') {
          switch (setting.key) {
            case 'social_instagram':
              links.instagram = value;
              break;
            case 'social_facebook':
              links.facebook = value;
              break;
            case 'social_tiktok':
              links.tiktok = value;
              break;
            case 'social_youtube':
              links.youtube = value;
              break;
          }
        }
      });

      return links;
    } catch (error) {
      console.error('Failed to fetch social media links:', error);
      // Return default links as fallback
      return {
        instagram: 'https://www.instagram.com/cikalpetcare',
        facebook: 'https://www.facebook.com/cikalpetcare',
        tiktok: 'https://www.tiktok.com/@cikalpetcare',
        youtube: 'https://www.youtube.com/@cikalpetcare',
      };
    }
  }

  /**
   * Update a single setting
   */
  async updateSetting(key: string, value: string): Promise<boolean> {
    try {
      await prisma.settings.upsert({
        where: { key },
        create: {
          key,
          value,
          type: 'string',
        },
        update: {
          value,
        },
      });
      return true;
    } catch (error) {
      console.error(`Failed to update setting ${key}:`, error);
      return false;
    }
  }

  /**
   * Get a single setting value
   */
  async getSetting(key: string, defaultValue?: string): Promise<string | null> {
    try {
      const setting = await prisma.settings.findUnique({
        where: { key },
        select: { value: true },
      });
      return setting?.value || defaultValue || null;
    } catch (error) {
      console.error(`Failed to get setting ${key}:`, error);
      return defaultValue || null;
    }
  }
}

export const settingsService = new SettingsService();
