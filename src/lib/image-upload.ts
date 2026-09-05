import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedExtensions = new Set(['jpg', 'jpeg', 'png', 'webp']);
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

function detectImageType(buffer: Buffer): 'image/jpeg' | 'image/png' | 'image/webp' | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return 'image/png';
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}

function configureCloudinary() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error('Cloudinary belum dikonfigurasi. Silakan setup di .env');
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function validateImageFile(file: File): Promise<Buffer> {
  if (!allowedTypes.has(file.type)) {
    throw new ImageValidationError('Format file tidak didukung. Gunakan JPG, PNG, atau WebP');
  }

  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !allowedExtensions.has(extension)) {
    throw new ImageValidationError('Ekstensi file tidak didukung');
  }
  if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
    throw new ImageValidationError('Ukuran file terlalu besar. Maksimal 5MB');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (detectImageType(buffer) !== file.type) {
    throw new ImageValidationError('Isi file tidak sesuai dengan format gambar');
  }
  return buffer;
}

export async function uploadImage(buffer: Buffer, folder: string): Promise<UploadApiResponse> {
  configureCloudinary();
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
          { width: 1200, crop: 'limit' },
          { quality: 'auto:good' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else if (result) resolve(result);
        else reject(new Error('Cloudinary tidak mengembalikan hasil upload'));
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteImage(publicId: string) {
  configureCloudinary();
  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}
