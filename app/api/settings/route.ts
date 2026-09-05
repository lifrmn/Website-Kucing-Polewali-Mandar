import { NextResponse } from 'next/server';
import { z } from 'zod';

import { authorizeAdmin } from '@/lib/authorization';
import { siteSettingsSchema } from '@/lib/validations/settings';
import { settingsService } from '@/services/settingsService';
import { getRequestIp } from '@/lib/audit';

export async function GET() {
  try {
    const settings = await settingsService.getSiteSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: unknown) {
    console.error('GET settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil pengaturan' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const authorization = await authorizeAdmin('settings:manage');
    if (!authorization.authorized) return authorization.response;

    const input = siteSettingsSchema.parse(await request.json());
    await settingsService.updateSiteSettings(input, {
      userId: authorization.session.user.id,
      ipAddress: getRequestIp(request),
    });
    return NextResponse.json({ success: true, message: 'Pengaturan berhasil disimpan' });
  } catch (error: unknown) {
    console.error('PUT settings error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Data pengaturan tidak valid', errors: error.issues },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Gagal menyimpan pengaturan' },
      { status: 500 }
    );
  }
}