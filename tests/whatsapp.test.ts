import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildOrderWhatsAppMessage,
  normalizeWhatsAppPhone,
  sendWhatsAppMessage,
} from '../src/services/whatsappService';

test('WhatsApp phone normalization accepts Indonesian local formats', () => {
  assert.equal(normalizeWhatsAppPhone('0812-3456-7890'), '6281234567890');
  assert.equal(normalizeWhatsAppPhone('+62 812 3456 7890'), '6281234567890');
  assert.equal(normalizeWhatsAppPhone('123'), null);
});

test('Fonnte adapter sends an encoded form without exposing configuration', async () => {
  let request: { url: string; init?: RequestInit } | undefined;
  const result = await sendWhatsAppMessage('081234567890', 'Pesanan diterima', {
    environment: { WHATSAPP_PROVIDER: 'FONNTE', WHATSAPP_API_TOKEN: 'test-token' },
    fetcher: (async (url, init) => {
      request = { url: String(url), init };
      return new Response('{}', { status: 200 });
    }) as typeof fetch,
  });

  assert.equal(result, true);
  assert.equal(request?.url, 'https://api.fonnte.com/send');
  assert.equal(request?.init?.headers && (request.init.headers as Record<string, string>).Authorization, 'test-token');
  assert.match(String(request?.init?.body), /target=6281234567890/);
});

test('Wablas adapter uses the configured endpoint and JSON payload', async () => {
  let payload = '';
  const result = await sendWhatsAppMessage('6281234567890', 'Booking diterima', {
    environment: {
      WHATSAPP_PROVIDER: 'WABLAS',
      WHATSAPP_API_TOKEN: 'token.secret',
      WHATSAPP_API_URL: 'https://example.wablas.com/api/send-message',
    },
    fetcher: (async (_url, init) => {
      payload = String(init?.body);
      return new Response('{}', { status: 200 });
    }) as typeof fetch,
  });

  assert.equal(result, true);
  assert.deepEqual(JSON.parse(payload), { phone: '6281234567890', message: 'Booking diterima' });
});

test('order message includes item details and a tracking link', () => {
  const message = buildOrderWhatsAppMessage({
    customerName: 'Ayu',
    orderNumber: 'INV-TEST-1',
    items: [{ name: 'Makanan Pet', quantity: 2, subtotal: 50_000 }],
    totalAmount: 60_000,
  });
  assert.match(message, /Halo Kak Ayu/);
  assert.match(message, /Makanan Pet x2/);
  assert.match(message, /\/pesanan\?order=INV-TEST-1/);
});