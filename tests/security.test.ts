import assert from 'node:assert/strict';
import test from 'node:test';

import { sanitizeBlogHtml } from '../src/lib/sanitize-html';
import {
  BookingStatus,
  OrderStatus,
  PaymentStatus,
  UserRole,
  isValidBookingStatus,
  isValidOrderStatus,
  isValidPaymentStatus,
  isValidUserRole,
} from '../src/types/enums';
import {
  calculateShipping,
  checkoutSchema,
  normalizePaymentMethod,
} from '../src/lib/validations/order';
import { ImageValidationError, validateImageFile } from '../src/lib/image-upload';
import { createBlogPostSchema } from '../src/lib/validations/blog';
import {
  defaultSiteSettings,
  siteSettingsSchema,
  socialSettingsSchema,
} from '../src/lib/validations/settings';

test('blog sanitizer removes executable HTML while retaining safe formatting', () => {
  const sanitized = sanitizeBlogHtml(
    '<h2>Judul</h2><script>alert(1)</script><img src="https://example.com/cat.jpg" onerror="alert(1)"><a href="javascript:alert(1)">link</a>'
  );

  assert.match(sanitized, /<h2>Judul<\/h2>/);
  assert.match(sanitized, /https:\/\/example\.com\/cat\.jpg/);
  assert.doesNotMatch(sanitized, /script|onerror|javascript:/i);
});

test('application status validators reject lowercase and unknown values', () => {
  assert.equal(isValidOrderStatus(OrderStatus.PENDING), true);
  assert.equal(isValidOrderStatus('pending'), false);
  assert.equal(isValidPaymentStatus(PaymentStatus.PAID), true);
  assert.equal(isValidPaymentStatus('confirmed'), false);
  assert.equal(isValidBookingStatus(BookingStatus.CHECKED_IN), true);
  assert.equal(isValidBookingStatus('checked-in'), false);
  assert.equal(isValidUserRole(UserRole.SUPER_ADMIN), true);
  assert.equal(isValidUserRole('OWNER'), false);
});

test('checkout validation ignores browser prices and rejects invalid quantity', () => {
  const validPayload = checkoutSchema.parse({
    customer_name: 'Customer Test',
    customer_phone: '081234567890',
    customer_email: 'customer@example.com',
    customer_address: 'Polewali Mandar',
    payment_method: 'transfer',
    items: [{
      item_type: 'product',
      item_id: '123e4567-e89b-12d3-a456-426614174000',
      quantity: 2,
      unit_price: 1,
      subtotal: 2,
    }],
  });

  assert.equal('unit_price' in validPayload.items[0], false);
  assert.equal(normalizePaymentMethod(validPayload.payment_method), 'BANK_TRANSFER');
  assert.equal(calculateShipping(99_999), 10_000);
  assert.equal(calculateShipping(100_000), 0);

  assert.throws(() => checkoutSchema.parse({
    ...validPayload,
    items: [{ ...validPayload.items[0], quantity: -1 }],
  }));
});

test('image validation rejects executable bytes with an image MIME type', async () => {
  const disguisedFile = new File(
    [Buffer.from('<script>alert(1)</script>')],
    'proof.png',
    { type: 'image/png' }
  );

  await assert.rejects(
    validateImageFile(disguisedFile),
    (error: unknown) => error instanceof ImageValidationError
  );
});

test('settings validation rejects unsafe URLs, arbitrary keys, and invalid accounts', () => {
  assert.throws(() => socialSettingsSchema.parse({ instagram: 'javascript:alert(1)' }));
  assert.throws(() => siteSettingsSchema.parse({
    ...defaultSiteSettings,
    qrisImageUrl: 'data:text/html,malicious',
  }));
  assert.throws(() => siteSettingsSchema.parse({
    ...defaultSiteSettings,
    bankAccount: '1234-ABCD',
  }));
  assert.throws(() => siteSettingsSchema.parse({
    ...defaultSiteSettings,
    arbitraryDatabaseKey: 'value',
  }));
});

test('blog validation rejects browser authorship and malformed public fields', () => {
  const validPost = {
    title: 'Merawat Kucing dengan Aman',
    slug: 'merawat-kucing-dengan-aman',
    content: '<p>Konten aman.</p>',
    is_published: false,
  };
  assert.equal(createBlogPostSchema.parse(validPost).slug, validPost.slug);
  assert.throws(() => createBlogPostSchema.parse({ ...validPost, author: 'Impersonated' }));
  assert.throws(() => createBlogPostSchema.parse({ ...validPost, slug: '../admin' }));
  assert.throws(() => createBlogPostSchema.parse({
    ...validPost,
    featured_image: 'javascript:alert(1)',
  }));
});