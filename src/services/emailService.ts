import { Resend } from 'resend';

// Initialize Resend lazily — only when API key is present
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Default sender email
const FROM_EMAIL = process.env.EMAIL_FROM || 'Cikal Pet Care Polman <onboarding@resend.dev>';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export const emailService = {
  /**
   * Send email using Resend
   */
  async sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
    try {
      // Check if Resend is configured
      if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️ RESEND_API_KEY not configured. Email not sent.');
        return false;
      }

      const { data, error } = await resend!.emails.send({
        from: FROM_EMAIL,
        to: [to],
        subject: subject,
        html: html,
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
   */
  async sendOrderConfirmationEmail(
    customerEmail: string,
    customerName: string,
    orderNumber: string,
    items: any[],
    totalAmount: number
  ): Promise<boolean> {
    const subject = `✅ Pesanan Berhasil Dibuat - Order #${orderNumber}`;
    
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #333333; font-weight: 600;">${item.name || 'Item'}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          <span style="color: #666666;">${item.quantity}x</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          <span style="color: #333333; font-weight: 600;">
            ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.unit_price)}
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
                            ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalAmount)}
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
      html,
    });
  },

  /**
   * Send payment confirmation email to customer
   */
  async sendPaymentConfirmationEmail(
    customerEmail: string,
    customerName: string,
    orderNumber: string,
    totalAmount: number
  ): Promise<boolean> {
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
                                ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalAmount)}
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
      html,
    });
  },

  /**
   * Send order status update email to customer
   */
  async sendOrderStatusUpdateEmail(
    customerEmail: string,
    customerName: string,
    orderNumber: string,
    orderStatus: string,
    totalAmount: number
  ): Promise<boolean> {
    const statusConfig = {
      pending: {
        emoji: '⏳',
        text: 'Menunggu Konfirmasi',
        color: '#f59e0b',
        bgColor: '#fffbeb',
        message: 'Pesanan Anda sedang menunggu konfirmasi pembayaran.',
      },
      confirmed: {
        emoji: '✅',
        text: 'Dikonfirmasi',
        color: '#3b82f6',
        bgColor: '#eff6ff',
        message: 'Pesanan Anda telah dikonfirmasi dan akan segera kami proses.',
      },
      processing: {
        emoji: '🔄',
        text: 'Sedang Diproses',
        color: '#8b5cf6',
        bgColor: '#f5f3ff',
        message: 'Pesanan Anda sedang kami proses dengan penuh perhatian.',
      },
      completed: {
        emoji: '🎉',
        text: 'Selesai',
        color: '#10b981',
        bgColor: '#f0fdf4',
        message: 'Pesanan Anda telah selesai! Terima kasih atas kepercayaan Anda.',
      },
      cancelled: {
        emoji: '❌',
        text: 'Dibatalkan',
        color: '#ef4444',
        bgColor: '#fef2f2',
        message: 'Pesanan Anda telah dibatalkan. Jika ada pertanyaan, hubungi kami.',
      },
    };

    const config = statusConfig[orderStatus as keyof typeof statusConfig] || statusConfig.pending;
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
                                ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalAmount)}
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
      html,
    });
  },
};
