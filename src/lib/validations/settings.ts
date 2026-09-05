import { z } from 'zod';

const optionalText = (max: number) => z.string().trim().max(max);
const optionalUrl = z.union([
  z.literal(''),
  z.string().trim().url().max(2_000).refine(
    (value) => value.startsWith('https://') || value.startsWith('http://'),
    'URL harus menggunakan HTTP atau HTTPS'
  ),
]);

export const siteSettingsSchema = z.object({
  siteName: optionalText(120),
  siteDescription: optionalText(500),
  whatsapp: optionalText(30),
  email: z.union([z.literal(''), z.string().trim().email().max(254)]),
  address: optionalText(500),
  instagram: optionalUrl,
  facebook: optionalUrl,
  tiktok: optionalUrl,
  youtube: optionalUrl,
  openDays: optionalText(100),
  openHours: optionalText(100),
  bankName: optionalText(100),
  bankAccount: z.string().trim().regex(/^\d{5,30}$|^$/),
  bankAccountName: optionalText(120),
  qrisImageUrl: optionalUrl,
}).strict();

const socialUrl = z.union([
  z.literal(''),
  z.string().trim().url().max(2_000).refine(
    (value) => value.startsWith('https://') || value.startsWith('http://'),
    'URL harus menggunakan HTTP atau HTTPS'
  ),
]);

export const socialSettingsSchema = z.object({
  instagram: socialUrl.optional(),
  facebook: socialUrl.optional(),
  tiktok: socialUrl.optional(),
  youtube: socialUrl.optional(),
}).strict().refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  { message: 'Tidak ada perubahan yang dikirim' }
);

export type SocialSettingsInput = z.infer<typeof socialSettingsSchema>;

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export const defaultSiteSettings: SiteSettings = {
  siteName: 'Cikal Pet Care Polman',
  siteDescription: 'Layanan perawatan hewan kesayangan terpercaya di Polewali Mandar',
  whatsapp: '0852-5547-8706',
  email: 'info@cikalpetcare.com',
  address: 'Darma, Kec. Polewali, Kabupaten Polewali Mandar, Sulawesi Barat 91311',
  instagram: 'https://www.instagram.com/cikalpetcare',
  facebook: 'https://www.facebook.com/cikalpetcare',
  tiktok: 'https://www.tiktok.com/@cikalpetcare',
  youtube: 'https://www.youtube.com/@cikalpetcare',
  openDays: 'Senin - Minggu',
  openHours: '08:00 - 20:00 WITA',
  bankName: '',
  bankAccount: '',
  bankAccountName: '',
  qrisImageUrl: '',
};

export const siteSettingKeys: Record<keyof SiteSettings, string> = {
  siteName: 'site_name',
  siteDescription: 'site_description',
  whatsapp: 'contact_whatsapp',
  email: 'contact_email',
  address: 'contact_address',
  instagram: 'social_instagram',
  facebook: 'social_facebook',
  tiktok: 'social_tiktok',
  youtube: 'social_youtube',
  openDays: 'business_open_days',
  openHours: 'business_open_hours',
  bankName: 'payment_bank_name',
  bankAccount: 'payment_bank_account',
  bankAccountName: 'payment_bank_account_name',
  qrisImageUrl: 'payment_qris_image_url',
};
