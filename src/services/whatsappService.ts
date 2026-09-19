import { getSiteUrl } from '@/lib/site-url';

type WhatsAppProvider = 'FONNTE' | 'WABLAS';
type Environment = Record<string, string | undefined>;

interface SendOptions {
  environment?: Environment;
  fetcher?: typeof fetch;
}

interface OrderItemMessage {
  name: string;
  quantity: number;
  subtotal: number;
}

export function normalizeWhatsAppPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  const normalized = digits.startsWith('0')
    ? `62${digits.slice(1)}`
    : digits.startsWith('8') ? `62${digits}` : digits;
  return /^62\d{8,13}$/.test(normalized) ? normalized : null;
}

export async function sendWhatsAppMessage(
  phone: string,
  message: string,
  options: SendOptions = {}
): Promise<boolean> {
  const environment = options.environment ?? process.env;
  const provider = environment.WHATSAPP_PROVIDER?.toUpperCase() as WhatsAppProvider | undefined;
  const token = environment.WHATSAPP_API_TOKEN?.trim();
  const target = normalizeWhatsAppPhone(phone);
  if (!provider || !token || !target) return false;

  const endpoint = environment.WHATSAPP_API_URL?.trim()
    || (provider === 'FONNTE' ? 'https://api.fonnte.com/send' : '');
  if (!endpoint || !['FONNTE', 'WABLAS'].includes(provider)) return false;

  try {
    const response = provider === 'FONNTE'
      ? await (options.fetcher ?? fetch)(endpoint, {
          method: 'POST',
          headers: {
            Authorization: token,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ target, message, countryCode: '62' }),
        })
      : await (options.fetcher ?? fetch)(endpoint, {
          method: 'POST',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: target, message }),
        });
    if (!response.ok) {
      console.error(`WhatsApp ${provider} request failed with status ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`WhatsApp ${provider} request failed`, error);
    return false;
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function buildOrderWhatsAppMessage(params: {
  customerName: string;
  orderNumber: string;
  items: OrderItemMessage[];
  totalAmount: number;
}) {
  const itemLines = params.items.map((item) =>
    `- ${item.name} x${item.quantity}: ${formatCurrency(item.subtotal)}`
  ).join('\n');
  return [
    `Halo Kak ${params.customerName}, pesanan #${params.orderNumber} telah kami terima.`,
    '',
    'Rincian pesanan:',
    itemLines,
    `Total: ${formatCurrency(params.totalAmount)}`,
    '',
    `Lacak pesanan: ${getSiteUrl()}/pesanan?order=${encodeURIComponent(params.orderNumber)}`,
  ].join('\n');
}

export function buildBookingWhatsAppMessage(params: {
  customerName: string;
  bookingLabel: string;
  serviceName: string;
  petName: string;
  schedule: string;
  trackingNumber?: string;
}) {
  const lines = [
    `Halo Kak ${params.customerName}, booking #${params.bookingLabel} telah kami terima.`,
    '',
    `Layanan: ${params.serviceName}`,
    `Hewan: ${params.petName}`,
    `Jadwal: ${params.schedule}`,
  ];
  if (params.trackingNumber) {
    lines.push('', `Lacak booking: ${getSiteUrl()}/pesanan?booking=${encodeURIComponent(params.trackingNumber)}`);
  }
  return lines.join('\n');
}

export const whatsappService = {
  sendOrderConfirmation(params: {
    customerPhone: string;
    customerName: string;
    orderNumber: string;
    items: OrderItemMessage[];
    totalAmount: number;
  }) {
    return sendWhatsAppMessage(params.customerPhone, buildOrderWhatsAppMessage(params));
  },

  sendBookingConfirmation(params: {
    customerPhone: string;
    customerName: string;
    bookingLabel: string;
    serviceName: string;
    petName: string;
    schedule: string;
    trackingNumber?: string;
  }) {
    return sendWhatsAppMessage(params.customerPhone, buildBookingWhatsAppMessage(params));
  },
};