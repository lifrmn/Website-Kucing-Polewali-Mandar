'use client';

import { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { Copy, Check, QrCode, Building2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

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
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-h1 font-bold text-text">Cara Pembayaran</h1>
          <p className="text-body text-muted">
            Pilih metode pembayaran yang sesuai untuk menyelesaikan pesanan Anda
          </p>
        </div>

        {/* QRIS Payment */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <div>
                <Card.Title>QRIS (Semua E-Wallet & Mobile Banking)</Card.Title>
                <Card.Description>
                  Bayar dengan scan QR code menggunakan aplikasi favorit Anda
                </Card.Description>
              </div>
            </div>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div className="bg-surface2 p-6 rounded-button text-center">
              <div className="w-64 h-64 mx-auto bg-white p-4 rounded-button mb-4">
                {/* Placeholder - Replace with actual QRIS QR code */}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-muted">
                  QR Code Here
                </div>
              </div>
              <p className="text-small text-muted">
                Scan QR code ini dengan aplikasi e-wallet atau mobile banking Anda
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-small font-semibold text-text">Langkah-langkah:</p>
              <ol className="list-decimal list-inside space-y-1 text-small text-text">
                <li>Buka aplikasi e-wallet atau mobile banking Anda (GoPay, OVO, DANA, ShopeePay, dll)</li>
                <li>Pilih menu "Scan QR" atau "QRIS"</li>
                <li>Arahkan kamera ke QR code di atas</li>
                <li>Periksa total pembayaran</li>
                <li>Konfirmasi pembayaran</li>
                <li>Simpan bukti transfer dan upload di halaman pesanan</li>
              </ol>
            </div>
          </Card.Content>
        </Card>

        {/* Bank Transfer */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <Card.Title>Transfer Bank</Card.Title>
                <Card.Description>
                  Transfer ke salah satu rekening bank berikut
                </Card.Description>
              </div>
            </div>
          </Card.Header>
          <Card.Content className="space-y-6">
            {bankAccounts.map((account) => (
              <div key={account.code} className="bg-surface2 p-6 rounded-button space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-h3 font-bold text-text">{account.bank}</p>
                  <div className="px-3 py-1 bg-primary/10 text-primary text-caption font-semibold rounded-full">
                    {account.code}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-caption text-muted">Nomor Rekening</p>
                      <p className="text-body font-mono font-semibold text-text">
                        {account.accountNumber}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(account.accountNumber, account.code)}
                    >
                      {copied === account.code ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-success" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  <div>
                    <p className="text-caption text-muted">Nama Pemilik</p>
                    <p className="text-body font-semibold text-text">{account.accountName}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-2">
              <p className="text-small font-semibold text-text">Langkah-langkah:</p>
              <ol className="list-decimal list-inside space-y-1 text-small text-text">
                <li>Pilih salah satu rekening bank di atas</li>
                <li>Lakukan transfer sesuai total pembayaran yang tertera di halaman pesanan Anda</li>
                <li>Transfer harus <strong>sesuai jumlah nominal</strong> (termasuk 3 digit unik jika ada)</li>
                <li>Simpan bukti transfer</li>
                <li>Upload bukti transfer di halaman "Pesanan Saya"</li>
                <li>Tunggu konfirmasi dari tim kami (maks. 1x24 jam)</li>
              </ol>
            </div>

            <div className="p-4 bg-accent/10 border border-accent rounded-button">
              <p className="text-small text-text">
                <strong>Penting:</strong> Transfer harus dilakukan dalam 24 jam setelah pemesanan. 
                Pesanan akan dibatalkan otomatis jika tidak ada konfirmasi pembayaran.
              </p>
            </div>
          </Card.Content>
        </Card>

        {/* Additional Info */}
        <Card>
          <Card.Header>
            <Card.Title>Informasi Penting</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-caption font-bold">1</span>
              </div>
              <div>
                <p className="text-small font-semibold text-text">Periksa Total Pembayaran</p>
                <p className="text-small text-muted">
                  Pastikan jumlah yang ditransfer sesuai dengan total di halaman pesanan Anda
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-caption font-bold">2</span>
              </div>
              <div>
                <p className="text-small font-semibold text-text">Upload Bukti Transfer</p>
                <p className="text-small text-muted">
                  Setelah transfer, segera upload bukti transfer untuk mempercepat verifikasi
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-caption font-bold">3</span>
              </div>
              <div>
                <p className="text-small font-semibold text-text">Verifikasi Maksimal 24 Jam</p>
                <p className="text-small text-muted">
                  Tim kami akan memverifikasi pembayaran Anda dalam waktu maksimal 1x24 jam
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Contact Support */}
        <div className="text-center space-y-2">
          <p className="text-body text-muted">
            Ada pertanyaan tentang pembayaran?
          </p>
          <a 
            href="https://wa.me/628123456789" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">
              Hubungi Customer Service
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
