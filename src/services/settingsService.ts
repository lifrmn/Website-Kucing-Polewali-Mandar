import prisma from '@/lib/prisma';
import { createActivityLog, type AuditContext } from '@/lib/audit';
import {
  defaultSiteSettings,
  siteSettingKeys,
  type SocialSettingsInput,
  type SiteSettings,
} from '@/lib/validations/settings';

export interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

class SettingsService {
  async updateSocialMediaLinks(input: SocialSettingsInput, audit?: AuditContext): Promise<void> {
    const keys: Record<keyof SocialSettingsInput, string> = {
      instagram: 'social_instagram',
      facebook: 'social_facebook',
      tiktok: 'social_tiktok',
      youtube: 'social_youtube',
    };
    await prisma.$transaction(async (tx) => {
      await Promise.all(Object.entries(input).map(([field, value]) => tx.settings.upsert({
        where: { key: keys[field as keyof SocialSettingsInput] },
        create: { key: keys[field as keyof SocialSettingsInput], value: value || '', type: 'string' },
        update: { value: value || '' },
      })));
      if (audit) {
        await createActivityLog(tx, {
          ...audit,
          entityType: 'settings',
          entityId: 'social',
          action: 'UPDATE',
          description: 'Admin memperbarui tautan media sosial',
          metadata: { changedFields: Object.keys(input) },
        });
      }
    });
  }

  async getSiteSettings(): Promise<SiteSettings> {
    const settings = await prisma.settings.findMany({
      where: { key: { in: Object.values(siteSettingKeys) } },
      select: { key: true, value: true },
    });
    const valuesByKey = new Map(settings.map((setting) => [setting.key, setting.value]));
    return Object.fromEntries(
      Object.entries(siteSettingKeys).map(([field, key]) => [
        field,
        valuesByKey.get(key) ?? defaultSiteSettings[field as keyof SiteSettings],
      ])
    ) as SiteSettings;
  }

  async updateSiteSettings(input: SiteSettings, audit?: AuditContext): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await Promise.all(Object.entries(siteSettingKeys).map(([field, key]) => tx.settings.upsert({
        where: { key },
        create: {
          key,
          value: input[field as keyof SiteSettings],
          type: 'string',
        },
        update: { value: input[field as keyof SiteSettings] },
      })));
      if (audit) {
        await createActivityLog(tx, {
          ...audit,
          entityType: 'settings',
          entityId: 'site',
          action: 'UPDATE',
          description: 'Admin memperbarui pengaturan situs',
          metadata: { changedFields: Object.keys(siteSettingKeys) },
        });
      }
    });
  }

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
      return {
        instagram: defaultSiteSettings.instagram,
        facebook: defaultSiteSettings.facebook,
        tiktok: defaultSiteSettings.tiktok,
        youtube: defaultSiteSettings.youtube,
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
