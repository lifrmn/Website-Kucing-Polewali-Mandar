'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Building2, Check, CircleCheck, Copy, Lightbulb, Loader2, QrCode, Search, Upload } from 'lucide-react';
import { CustomerOrderSummary, orderService } from '@/services/orderService';
import { defaultSiteSettings, type SiteSettings } from '@/lib/validations/settings';

export default function PaymentInstructionsPage() {
  const [copied, setCopied] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<CustomerOrderSummary | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ ...defaultSiteSettings });

  useEffect(() => {
    fetch('/api/settings')
      .then((response) => response.json())
      .then((data) => { if (data.success) setSiteSettings(data.data); })
      .catch(() => undefined);
    const number = new URLSearchParams(window.location.search).get('order') || '';
    if (!number) return;
    setOrderNumber(number);
    setPhone(sessionStorage.getItem(`order-phone:${number}`) || '');
  }, []);

  const lookupOrder = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);
    const response = await orderService.lookupCustomerOrder(orderNumber, phone);
    if (response.success && response.data) {
      setOrder(response.data);
      sessionStorage.setItem(`order-phone:${response.data.order_number}`, phone.replace(/\s+/g, ''));
    } else {
      setOrder(null);
      setFeedback({ type: 'error', message: response.error || 'Pesanan tidak ditemukan' });
    }
    setLoading(false);
  };

  const uploadProof = async (event: FormEvent) => {
    event.preventDefault();
    if (!proofFile || !order) return;
    setUploading(true);
    setFeedback(null);
    const response = await orderService.uploadCustomerPaymentProof(order.order_number, phone, proofFile);
    if (response.success && response.data) {
      setOrder(response.data);
      setProofFile(null);
      setFeedback({ type: 'success', message: response.message || 'Bukti pembayaran berhasil dikirim' });
    } else {
      setFeedback({ type: 'error', message: response.error || 'Gagal mengunggah bukti pembayaran' });
    }
    setUploading(false);
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const bankAccounts = siteSettings.bankAccount ? [{
    bank: siteSettings.bankName,
    accountNumber: siteSettings.bankAccount,
    accountName: siteSettings.bankAccountName,
    code: siteSettings.bankName || 'BANK',
  }] : [];

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Poppins','Inter',sans-serif" }}>
      {/* Hero Header */}
      <section className="pt-28 md:pt-36 pb-14" style={{ backgroundColor: '#3b3a2e' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#E6D18B' }}>Cikal Pet Care</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>
            Cara Pembayaran
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Pilih metode pembayaran yang sesuai untuk menyelesaikan pesanan Anda
          </p>
        </div>
        {/* Wave bottom */}
        <div className="overflow-hidden mt-10" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '50px' }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#FAF8F5" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-14 md:py-20">
        <div className="space-y-8">
          <form onSubmit={lookupOrder} className="bg-white rounded-[20px] shadow-md p-8 border-2" style={{ borderColor: '#E8E3DA' }}>
            <h2 className="text-xl font-bold mb-5" style={{ color: '#383838' }}>Konfirmasi Pesanan</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                required
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                placeholder="Nomor pesanan (INV-...)"
                className="h-12 px-4 rounded-xl border-2 focus:ring-2 focus:ring-primary focus:outline-none"
                style={{ borderColor: '#E8E3DA' }}
              />
              <input
                required
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Nomor telepon checkout"
                className="h-12 px-4 rounded-xl border-2 focus:ring-2 focus:ring-primary focus:outline-none"
                style={{ borderColor: '#E8E3DA' }}
              />
            </div>
            <button type="submit" disabled={loading} className="mt-4 w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50" style={{ backgroundColor: '#E6D18B', color: '#2a2a1a' }}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Tampilkan Total Pesanan
            </button>
            {order && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface2 p-4">
                <div><p className="text-sm text-muted">{order.order_number}</p><p className="font-semibold text-text">{order.payment_status.replace(/_/g, ' ')}</p></div>
                <p className="text-xl font-bold text-dark-gold">{formatCurrency(order.total_amount)}</p>
              </div>
            )}
            {feedback && <p className={`mt-4 rounded-button px-4 py-3 text-sm ${feedback.type === 'error' ? 'bg-[#FEE2E2] text-[#B91C1C]' : 'bg-[#DCFCE7] text-[#166534]'}`}>{feedback.message}</p>}
          </form>

          {/* QRIS Payment */}
          <div className="bg-white rounded-[20px] shadow-md p-8 border-2" style={{ borderColor: '#E8E3DA' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E6D18B' }}>
                <QrCode className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: '#383838' }}>QRIS (Semua E-Wallet & Mobile Banking)</h3>
                <p style={{ color: '#707070' }}>Bayar dengan scan QR code menggunakan aplikasi favorit Anda</p>
              </div>
            </div>
            <div className="p-6 rounded-[15px] text-center border-2" style={{ backgroundColor: '#FAF8F5', borderColor: '#E8E3DA' }}>
              {siteSettings.qrisImageUrl && (
                <img src={siteSettings.qrisImageUrl} alt="QRIS Cikal Pet Care" className="mx-auto mb-5 max-h-72 max-w-full object-contain" />
              )}
              <p style={{ color: '#707070' }} className="mb-4">
                {siteSettings.qrisImageUrl
                  ? 'Scan QR code ini dengan aplikasi e-wallet atau mobile banking Anda'
                  : 'QRIS belum tersedia. Silakan gunakan transfer bank atau hubungi kami.'}
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-left" style={{ color: '#707070' }}>
                <li>Buka aplikasi e-wallet atau mobile banking Anda (GoPay, OVO, DANA, ShopeePay, dll)</li>
                <li>Pilih menu "Scan QRIS" atau "Bayar dengan QR"</li>
                <li>Arahkan kamera ke QR code di atas</li>
                <li>Periksa nominal pembayaran dan tekan "Bayar"</li>
              </ol>
            </div>
          </div>

          {/* Bank Transfer */}
          <div className="bg-white rounded-[20px] shadow-md p-8 border-2" style={{ borderColor: '#E8E3DA' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E6D18B' }}>
                <Building2 className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: '#383838' }}>Transfer Bank</h3>
                <p style={{ color: '#707070' }}>Transfer langsung ke rekening kami</p>
              </div>
            </div>
            <div className="space-y-4">
              {bankAccounts.length === 0 && (
                <p className="p-4 rounded-xl bg-amber-50 text-amber-800 text-sm">Rekening transfer belum dikonfigurasi. Silakan hubungi kami sebelum membayar.</p>
              )}
              {bankAccounts.map((account, idx) => (
                <div key={idx} className="p-4 rounded-[12px] border-2" style={{ backgroundColor: '#FAF8F5', borderColor: '#E8E3DA' }}>
                  <h4 className="font-bold mb-3" style={{ color: '#383838' }}>{account.bank}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span style={{ color: '#707070' }}>Nomor Rekening:</span>
                      <span className="font-mono" style={{ color: '#383838' }}>{account.accountNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: '#707070' }}>Atas Nama:</span>
                      <span style={{ color: '#383838' }}>{account.accountName}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(account.accountNumber, account.code)}
                      className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-button bg-primary px-4 py-2 font-semibold text-[#2A2A1A] transition-colors hover:bg-primary-hover"
                    >
                      {copied === account.code ? (
                        <>
                          <Check size={16} />
                          Tersalin
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Salin Nomor Rekening
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          {order && !['CANCELED', 'COMPLETED', 'REFUNDED'].includes(order.status) && (
            <form onSubmit={uploadProof} className="bg-white rounded-[20px] shadow-md p-8 border-2" style={{ borderColor: '#E8E3DA' }}>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E6D18B' }}>
                  <Upload className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#383838' }}>Bukti Pembayaran</h3>
                  <p style={{ color: '#707070' }}>JPG, PNG, atau WebP, maksimal 5MB</p>
                </div>
              </div>
              <input
                required
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setProofFile(event.target.files?.[0] || null)}
                className="block w-full text-sm border-2 rounded-xl p-3"
                style={{ borderColor: '#E8E3DA' }}
              />
              <button type="submit" disabled={uploading || !proofFile} className="mt-4 w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50" style={{ backgroundColor: '#E6D18B', color: '#2a2a1a' }}>
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                Kirim untuk Verifikasi
              </button>
            </form>
          )}

          <div className="rounded-card border border-border bg-white p-5 shadow-sm sm:p-8">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-text"><Lightbulb className="h-5 w-5 text-dark-gold" /> Tips Pembayaran</h3>
            <ul className="space-y-3 text-sm text-muted">
              {['Pastikan nominal pembayaran sesuai dengan total pesanan', 'Simpan bukti pembayaran untuk konfirmasi', 'Hubungi kami jika ada kesalahan dalam pembayaran', 'Pesanan akan diproses setelah pembayaran dikonfirmasi'].map((tip) => (
                <li key={tip} className="flex items-start gap-2"><CircleCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#166534]" /> {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
