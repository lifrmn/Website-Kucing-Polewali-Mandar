import { NextResponse } from 'next/server';
import { settingsService } from '@/services/settingsService';

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
    const body = await request.json();
    const { instagram, facebook, tiktok, youtube } = body;

    const updates: Promise<boolean>[] = [];

    if (instagram !== undefined) {
      updates.push(settingsService.updateSetting('social_instagram', instagram));
    }
    if (facebook !== undefined) {
      updates.push(settingsService.updateSetting('social_facebook', facebook));
    }
    if (tiktok !== undefined) {
      updates.push(settingsService.updateSetting('social_tiktok', tiktok));
    }
    if (youtube !== undefined) {
      updates.push(settingsService.updateSetting('social_youtube', youtube));
    }

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: 'Social media links updated successfully',
    });
  } catch (error) {
    console.error('Error updating social links:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update social media links' },
      { status: 500 }
    );
  }
}
