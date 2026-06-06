module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: [
        'query',
        'error',
        'warn'
    ]
});
if ("TURBOPACK compile-time truthy", 1) {
    globalForPrisma.prisma = prisma;
}
const __TURBOPACK__default__export__ = prisma;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/src/services/emailService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "emailService",
    ()=>emailService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/resend/dist/index.mjs [app-route] (ecmascript)");
;
// Initialize Resend with API key from environment variables
const resend = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Resend"](process.env.RESEND_API_KEY);
// Default sender email
const FROM_EMAIL = process.env.EMAIL_FROM || 'Cikal Pet Care Polman <onboarding@resend.dev>';
const emailService = {
    /**
   * Send email using Resend
   */ async sendEmail ({ to, subject, html }) {
        try {
            // Check if Resend is configured
            if (!process.env.RESEND_API_KEY) {
                console.warn('⚠️ RESEND_API_KEY not configured. Email not sent.');
                return false;
            }
            const { data, error } = await resend.emails.send({
                from: FROM_EMAIL,
                to: [
                    to
                ],
                subject: subject,
                html: html
            });
            if (error) {
                console.error('❌ Error sending email:', error);
                return false;
            }
            console.log('✅ Email sent successfully:', data);
            return true;
        } catch (error) {
            console.error('❌ Exception sending email:', error);
            return false;
        }
    },
    /**
   * Send order confirmation email to customer
   */ async sendOrderConfirmationEmail (customerEmail, customerName, orderNumber, items, totalAmount) {
        const subject = `✅ Pesanan Berhasil Dibuat - Order #${orderNumber}`;
        const itemsHtml = items.map((item)=>`
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #333333; font-weight: 600;">${item.name || 'Item'}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          <span style="color: #666666;">${item.quantity}x</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          <span style="color: #333333; font-weight: 600;">
            ${new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(item.unit_price)}
          </span>
        </td>
      </tr>
    `).join('');
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pesanan Berhasil Dibuat</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                      ✅ Pesanan Berhasil Dibuat!
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Halo <strong>${customerName}</strong>,
                    </p>
                    
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Terima kasih telah berbelanja di Cikal Pet Care Polman! Pesanan Anda telah berhasil kami terima.
                    </p>
                    
                    <!-- Order Info Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 8px; border: 2px solid #10b981; margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 20px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 8px 0; color: #666666; font-size: 14px;">Nomor Pesanan:</td>
                              <td align="right" style="padding: 8px 0; color: #10b981; font-size: 16px; font-weight: bold;">
                                #${orderNumber}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #666666; font-size: 14px;">Status:</td>
                              <td align="right" style="padding: 8px 0;">
                                <span style="background-color: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                                  ⏳ Menunggu Pembayaran
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Order Items -->
                    <h3 style="color: #333333; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">
                      📦 Detail Pesanan
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                      <thead>
                        <tr>
                          <th style="padding: 12px; background-color: #e5e7eb; text-align: left; color: #374151; font-size: 14px; font-weight: bold;">Item</th>
                          <th style="padding: 12px; background-color: #e5e7eb; text-align: center; color: #374151; font-size: 14px; font-weight: bold;">Qty</th>
                          <th style="padding: 12px; background-color: #e5e7eb; text-align: right; color: #374151; font-size: 14px; font-weight: bold;">Harga</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colspan="2" style="padding: 16px; background-color: #10b981; text-align: right; color: #ffffff; font-weight: bold; font-size: 16px;">
                            TOTAL:
                          </td>
                          <td style="padding: 16px; background-color: #10b981; text-align: right; color: #ffffff; font-weight: bold; font-size: 18px;">
                            ${new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(totalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                    
                    <!-- Next Steps -->
                    <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                      <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">
                        ⚡ Langkah Selanjutnya:
                      </h4>
                      <ol style="margin: 0; padding-left: 20px; color: #666666; line-height: 1.8;">
                        <li>Silakan lakukan pembayaran sesuai metode yang Anda pilih</li>
                        <li>Upload bukti pembayaran melalui website</li>
                        <li>Kami akan memverifikasi dan memproses pesanan Anda</li>
                      </ol>
                    </div>
                    
                    <!-- Action Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                      <tr>
                        <td align="center">
                          <a href="http://localhost:3000/cara-pembayaran?order=${orderNumber}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                            💳 Cara Pembayaran
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Butuh bantuan? Hubungi kami di:
                    </p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 10px 0;">
                          <span style="color: #10b981; font-weight: bold;">📧 Email:</span>
                          <span style="color: #333333; margin-left: 10px;">info@cikalpetcare.com</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <span style="color: #10b981; font-weight: bold;">📱 WhatsApp:</span>
                          <span style="color: #333333; margin-left: 10px;">0852-5547-8706</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                      Terima kasih telah mempercayai
                    </p>
                    <p style="color: #10b981; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">
                      Cikal Pet Care Polman
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                      Email ini dikirim secara otomatis, mohon tidak membalas email ini.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
        return await this.sendEmail({
            to: customerEmail,
            subject,
            html
        });
    },
    /**
   * Send payment confirmation email to customer
   */ async sendPaymentConfirmationEmail (customerEmail, customerName, orderNumber, totalAmount) {
        const subject = `✅ Pembayaran Dikonfirmasi - Order #${orderNumber}`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pembayaran Dikonfirmasi</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                      🎉 Pembayaran Dikonfirmasi!
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Halo <strong>${customerName}</strong>,
                    </p>
                    
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Terima kasih! Pembayaran Anda telah kami konfirmasi dan pesanan Anda sedang kami proses.
                    </p>
                    
                    <!-- Order Info Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9ff; border-radius: 8px; border: 2px solid #667eea; margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 20px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 8px 0; color: #666666; font-size: 14px;">Nomor Pesanan:</td>
                              <td align="right" style="padding: 8px 0; color: #667eea; font-size: 16px; font-weight: bold;">
                                #${orderNumber}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #666666; font-size: 14px;">Total Pembayaran:</td>
                              <td align="right" style="padding: 8px 0; color: #333333; font-size: 18px; font-weight: bold;">
                                ${new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(totalAmount)}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #666666; font-size: 14px;">Status Pembayaran:</td>
                              <td align="right" style="padding: 8px 0;">
                                <span style="background-color: #10b981; color: #ffffff; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                                  ✅ LUNAS
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #666666; font-size: 14px;">Status Pesanan:</td>
                              <td align="right" style="padding: 8px 0;">
                                <span style="background-color: #3b82f6; color: #ffffff; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                                  📦 DIKONFIRMASI
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Next Steps -->
                    <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                      <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">
                        📌 Langkah Selanjutnya:
                      </h3>
                      <ul style="color: #78350f; margin: 0; padding-left: 20px; line-height: 1.8;">
                        <li>Pesanan Anda sedang kami proses</li>
                        <li>Kami akan mengirimkan update status pesanan via email</li>
                        <li>Cek halaman "Cek Pesanan" untuk tracking real-time</li>
                      </ul>
                    </div>
                    
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Jika ada pertanyaan, jangan ragu untuk menghubungi kami melalui:
                    </p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 10px 0;">
                          <span style="color: #667eea; font-weight: bold;">📧 Email:</span>
                          <span style="color: #333333; margin-left: 10px;">info@cikalpetcare.com</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <span style="color: #667eea; font-weight: bold;">📱 WhatsApp:</span>
                          <span style="color: #333333; margin-left: 10px;">0852-5547-8706</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                      Terima kasih telah berbelanja di
                    </p>
                    <p style="color: #667eea; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">
                      Cikal Pet Care Polman
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                      Email ini dikirim secara otomatis, mohon tidak membalas email ini.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
        return await this.sendEmail({
            to: customerEmail,
            subject,
            html
        });
    },
    /**
   * Send order status update email to customer
   */ async sendOrderStatusUpdateEmail (customerEmail, customerName, orderNumber, orderStatus, totalAmount) {
        const statusConfig = {
            pending: {
                emoji: '⏳',
                text: 'Menunggu Konfirmasi',
                color: '#f59e0b',
                bgColor: '#fffbeb',
                message: 'Pesanan Anda sedang menunggu konfirmasi pembayaran.'
            },
            confirmed: {
                emoji: '✅',
                text: 'Dikonfirmasi',
                color: '#3b82f6',
                bgColor: '#eff6ff',
                message: 'Pesanan Anda telah dikonfirmasi dan akan segera kami proses.'
            },
            processing: {
                emoji: '🔄',
                text: 'Sedang Diproses',
                color: '#8b5cf6',
                bgColor: '#f5f3ff',
                message: 'Pesanan Anda sedang kami proses dengan penuh perhatian.'
            },
            completed: {
                emoji: '🎉',
                text: 'Selesai',
                color: '#10b981',
                bgColor: '#f0fdf4',
                message: 'Pesanan Anda telah selesai! Terima kasih atas kepercayaan Anda.'
            },
            cancelled: {
                emoji: '❌',
                text: 'Dibatalkan',
                color: '#ef4444',
                bgColor: '#fef2f2',
                message: 'Pesanan Anda telah dibatalkan. Jika ada pertanyaan, hubungi kami.'
            }
        };
        const config = statusConfig[orderStatus] || statusConfig.pending;
        const subject = `${config.emoji} Update Pesanan #${orderNumber} - ${config.text}`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Update Status Pesanan</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                      ${config.emoji} Update Status Pesanan
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Halo <strong>${customerName}</strong>,
                    </p>
                    
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Ada update terbaru untuk pesanan Anda:
                    </p>
                    
                    <!-- Status Update Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${config.bgColor}; border-radius: 8px; border: 2px solid ${config.color}; margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 30px; text-align: center;">
                          <div style="font-size: 48px; margin-bottom: 15px;">
                            ${config.emoji}
                          </div>
                          <h2 style="color: ${config.color}; margin: 0 0 10px 0; font-size: 24px; font-weight: bold;">
                            ${config.text}
                          </h2>
                          <p style="color: #666666; margin: 0; font-size: 16px; line-height: 1.6;">
                            ${config.message}
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Order Info -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9ff; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                      <tr>
                        <td>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 8px 0; color: #666666; font-size: 14px;">Nomor Pesanan:</td>
                              <td align="right" style="padding: 8px 0; color: #667eea; font-size: 16px; font-weight: bold;">
                                #${orderNumber}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #666666; font-size: 14px;">Total Pesanan:</td>
                              <td align="right" style="padding: 8px 0; color: #333333; font-size: 16px; font-weight: bold;">
                                ${new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(totalAmount)}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Action Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                      <tr>
                        <td align="center">
                          <a href="http://localhost:3000/pesanan" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                            🔍 Cek Detail Pesanan
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Butuh bantuan? Hubungi kami di:
                    </p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 10px 0;">
                          <span style="color: #667eea; font-weight: bold;">📧 Email:</span>
                          <span style="color: #333333; margin-left: 10px;">info@cikalpetcare.com</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <span style="color: #667eea; font-weight: bold;">📱 WhatsApp:</span>
                          <span style="color: #333333; margin-left: 10px;">0852-5547-8706</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                      Terima kasih telah mempercayai
                    </p>
                    <p style="color: #667eea; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">
                      Cikal Pet Care Polman
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                      Email ini dikirim secara otomatis, mohon tidak membalas email ini.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
        return await this.sendEmail({
            to: customerEmail,
            subject,
            html
        });
    }
};
}),
"[project]/app/api/orders/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$emailService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/emailService.ts [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const orderNumber = searchParams.get('orderNumber');
        // If orderNumber provided, get specific order
        if (orderNumber) {
            const order = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].order.findUnique({
                where: {
                    order_number: orderNumber
                },
                include: {
                    customer: true,
                    orderItems: {
                        include: {
                            product: true,
                            service: true
                        }
                    }
                }
            });
            if (!order) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Pesanan tidak ditemukan'
                }, {
                    status: 404
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data: order
            });
        }
        // Otherwise get all orders
        const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].order.findMany({
            include: {
                customer: true,
                orderItems: {
                    include: {
                        product: true,
                        service: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        // Transform orders to include customer details at root level
        const transformedOrders = orders.map((order)=>({
                id: order.id,
                order_number: order.order_number,
                customer_name: order.customer.name,
                customer_email: order.customer.email,
                customer_phone: order.customer.phone,
                order_type: 'product',
                total_amount: order.total_amount,
                payment_method: order.payment_method,
                payment_status: order.payment_status,
                order_status: order.status,
                created_at: order.created_at,
                items: order.orderItems
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                data: transformedOrders,
                total: transformedOrders.length
            }
        });
    } catch (error) {
        console.error('GET orders error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Gagal mengambil data pesanan'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { customer_name, customer_phone, customer_email, customer_address, items, payment_method, notes } = body;
        // Validation
        if (!customer_name || !customer_phone || !items || items.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Data pelanggan dan item pesanan harus diisi'
            }, {
                status: 400
            });
        }
        // Calculate total
        const subtotal = items.reduce((sum, item)=>{
            return sum + item.unit_price * item.quantity;
        }, 0);
        // Generate order number
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        const orderNumber = `INV-${year}${month}${day}-${random}`;
        // Create customer first
        const customer = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].customer.create({
            data: {
                name: customer_name,
                phone: customer_phone,
                email: customer_email,
                address: customer_address
            }
        });
        // Create order with items
        const order = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].order.create({
            data: {
                order_number: orderNumber,
                customer_id: customer.id,
                subtotal: subtotal,
                total_amount: subtotal,
                payment_method: payment_method || 'qris',
                payment_status: 'pending',
                status: 'pending',
                notes: notes,
                orderItems: {
                    create: items.map((item)=>({
                            product_id: item.item_type === 'product' ? item.item_id : null,
                            service_id: item.item_type === 'service' ? item.item_id : null,
                            quantity: item.quantity,
                            price: item.unit_price
                        }))
                }
            },
            include: {
                customer: true,
                orderItems: {
                    include: {
                        product: true,
                        service: true
                    }
                }
            }
        });
        // Send order confirmation email
        try {
            if (customer_email) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$emailService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["emailService"].sendOrderConfirmationEmail(customer_email, customer_name, orderNumber, items, subtotal);
            }
        } catch (emailError) {
            console.error('Email notification error:', emailError);
        // Don't fail the request if email fails
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: order,
            message: 'Pesanan berhasil dibuat'
        });
    } catch (error) {
        console.error('POST order error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Gagal membuat pesanan'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ec129821._.js.map