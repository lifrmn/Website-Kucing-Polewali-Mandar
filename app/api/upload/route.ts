import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin } from '@/lib/authorization';
import { consumeRateLimit } from '@/lib/rate-limit';
import {
  deleteImage,
  ImageValidationError,
  uploadImage,
  validateImageFile,
} from '@/lib/image-upload';

const UPLOAD_FOLDER = 'cikal-pet-care';

export async function POST(request: NextRequest) {
  try {
    const authorization = await authorizeAdmin('uploads:manage');
    if (!authorization.authorized) return authorization.response;

    const uploadLimit = consumeRateLimit(
      `upload:${authorization.session.user.id}`,
      30,
      15 * 60 * 1000
    );
    if (!uploadLimit.allowed) {
      return NextResponse.json(
        { success: false, message: 'Terlalu banyak upload. Silakan coba lagi nanti.' },
        {
          status: 429,
          headers: { 'Retry-After': String(uploadLimit.retryAfterSeconds) },
        }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: 'File tidak ditemukan' },
        { status: 400 }
      );
    }

    const buffer = await validateImageFile(file);
    const result = await uploadImage(buffer, UPLOAD_FOLDER);

    return NextResponse.json({
      success: true,
      message: 'Upload berhasil',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    if (error instanceof ImageValidationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: 'Upload gagal: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove image from Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    const authorization = await authorizeAdmin('uploads:manage');
    if (!authorization.authorized) return authorization.response;

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { success: false, message: 'Public ID tidak ditemukan' },
        { status: 400 }
      );
    }

    if (!new RegExp(`^${UPLOAD_FOLDER}/[A-Za-z0-9_-]+$`).test(publicId)) {
      return NextResponse.json(
        { success: false, message: 'Public ID tidak valid' },
        { status: 400 }
      );
    }

    const result = await deleteImage(publicId);
    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error('Cloudinary menolak penghapusan gambar');
    }

    return NextResponse.json({
      success: true,
      message: 'Gambar berhasil dihapus',
    });
  } catch (error: unknown) {
    console.error('Delete error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghapus gambar: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
