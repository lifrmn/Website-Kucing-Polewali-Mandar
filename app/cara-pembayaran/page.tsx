'use client';

import { useState } from 'react';
import { Copy, Check, QrCode, Building2 } from 'lucide-react';

export default function PaymentInstructionsPage() {
  const [copied, setCopied] = useState('');
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const bankAccounts = [
    { 
      bank: 'Bank BCA', 
      accountNumber: '1234567890',
      accountName: 'PT Kucingku Indonesia',
      code: 'BCA'
    },
    { 
      bank: 'Bank Mandiri', 
      accountNumber: '9876543210',
      accountName: 'PT Kucingku Indonesia',
      code: 'MANDIRI'
    },
    { 
      bank: 'Bank BNI', 
      accountNumber: '5555666677',
      accountName: 'PT Kucingku Indonesia',
      code: 'BNI'
    },
  ];

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
          {/* QRIS Payment */}
          <div className="bg-white rounded-[20px] shadow-md p-8 border-2" style={{ borderColor: '#E8E3DA' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E6D18B' }}>
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: '#383838' }}>QRIS (Semua E-Wallet & Mobile Banking)</h3>
                <p style={{ color: '#707070' }}>Bayar dengan scan QR code menggunakan aplikasi favorit Anda</p>
              </div>
            </div>
            <div className="p-6 rounded-[15px] text-center border-2" style={{ backgroundColor: '#FAF8F5', borderColor: '#E8E3DA' }}>
              <p style={{ color: '#707070' }} className="mb-4">
                Scan QR code ini dengan aplikasi e-wallet atau mobile banking Anda
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm" style={{ color: '#707070' }} className="text-left">
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
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: '#383838' }}>Transfer Bank</h3>
                <p style={{ color: '#707070' }}>Transfer langsung ke rekening kami</p>
              </div>
            </div>
            <div className="space-y-4">
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
                      className="w-full mt-3 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-white"
                      style={{ backgroundColor: '#E6D18B' }}
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
          <div className="bg-white rounded-[20px] shadow-md p-8 border-2" style={{ borderColor: '#E8E3DA' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#383838' }}>💡 Tips Pembayaran</h3>
            <ul className="space-y-2 text-sm" style={{ color: '#707070' }}>
              <li>✓ Pastikan nominal pembayaran sesuai dengan total pesanan</li>
              <li>✓ Simpan bukti pembayaran untuk konfirmasi</li>
              <li>✓ Hubungi kami jika ada kesalahan dalam pembayaran</li>
              <li>✓ Pesanan akan diproses setelah pembayaran dikonfirmasi</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
