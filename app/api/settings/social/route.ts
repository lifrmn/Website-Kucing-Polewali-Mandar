import { NextResponse } from 'next/server';
import { z } from 'zod';
import { settingsService } from '@/services/settingsService';
import { authorizeAdmin } from '@/lib/authorization';
import { socialSettingsSchema } from '@/lib/validations/settings';
import { getRequestIp } from '@/lib/audit';

/**
 * GET /api/settings/social
 * Fetch social media links
 */
export async function GET() {
  try {
    const links = await settingsService.getSocialMediaLinks();
    return NextResponse.json({ success: true, data: links });
  } catch (error) {
    console.error('Error fetching social links:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social media links' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/settings/social
 * Update social media links
 * Body: { instagram?: string, facebook?: string, tiktok?: string, youtube?: string }
 */
export async function POST(request: Request) {
  try {
    const authorization = await authorizeAdmin('settings:manage');
    if (!authorization.authorized) return authorization.response;

    const input = socialSettingsSchema.parse(await request.json());
    await settingsService.updateSocialMediaLinks(input, {
      userId: authorization.session.user.id,
      ipAddress: getRequestIp(request),
    });

    return NextResponse.json({
      success: true,
      message: 'Social media links updated successfully',
    });
  } catch (error) {
    console.error('Error updating social links:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Tautan media sosial tidak valid', errors: error.issues },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update social media links' },
      { status: 500 }
    );
  }
}
