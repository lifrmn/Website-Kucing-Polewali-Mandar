'use client'

import { useEffect, useState } from 'react'
import { Save, Mail, MapPin, Settings as SettingsIcon, Truck } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaYoutube } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { defaultSiteSettings, type SiteSettings } from '@/lib/validations/settings'

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<SiteSettings>({ ...defaultSiteSettings })

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        const data = await response.json()
        if (data.success) setSettings(data.data)
        else toast.error(data.error || 'Gagal memuat pengaturan')
      } catch {
        toast.error('Gagal memuat pengaturan')
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleChange = (field: keyof SiteSettings, value: string | boolean | number) => {
    setSettings({ ...settings, [field]: value })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || 'Gagal menyimpan pengaturan')
      toast.success(data.message)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan pengaturan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-gray-600">Memuat pengaturan...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Pengaturan</h1>
        <p className="text-gray-600">Kelola informasi website dan kontak</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Site Information */}
        <div className="rounded-card border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-button bg-primary p-3">
              <SettingsIcon className="w-7 h-7 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Informasi Website</h2>
              <p className="text-sm text-gray-600">Atur nama dan deskripsi website</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Website</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="input-premium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Website</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                rows={3}
                className="input-premium"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="rounded-card border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-button bg-primary p-3">
              <FaWhatsapp className="w-7 h-7 text-[#128C4A]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Informasi Kontak</h2>
              <p className="text-sm text-gray-600">Atur kontak yang dapat dihubungi customer</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <FaWhatsapp className="inline mr-2 w-5 h-5 text-[#128C4A]" />
                WhatsApp
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="input-premium"
                placeholder="+62 812-3456-7890"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Mail className="inline mr-2 w-5 h-5 text-blue-600" />
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="input-premium"
                placeholder="info@cikalpetcare.com"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <MapPin className="inline mr-2 w-5 h-5 text-red-600" />
              Alamat
            </label>
            <textarea
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
              className="input-premium"
              placeholder="Jl. Jend. Sudirman No. 123, Polewali"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Google Maps URL</label>
            <input type="url" value={settings.googleMapsUrl} onChange={(e) => handleChange('googleMapsUrl', e.target.value)} className="input-premium" placeholder="https://maps.google.com/..." />
          </div>
        </div>

        {/* Social Media */}
        <div className="rounded-card border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-button bg-primary p-3">
              <FaInstagram className="w-6 h-6 text-[#E1306C]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Social Media</h2>
              <p className="text-sm text-gray-600">Atur akun social media</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <FaInstagram className="inline mr-2 w-5 h-5 text-[#E1306C]" />
                Instagram Username
              </label>
              <input
                type="text"
                value={settings.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="input-premium"
                placeholder="https://instagram.com/cikalpetcare"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <FaFacebookF className="inline mr-2 w-5 h-5 text-[#1877F2]" />
                Facebook Page
              </label>
              <input
                type="text"
                value={settings.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
                className="input-premium"
                placeholder="https://facebook.com/cikalpetcare"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <FaTiktok className="inline mr-2 w-5 h-5 text-gray-800" />
                TikTok
              </label>
              <input
                type="url"
                value={settings.tiktok}
                onChange={(e) => handleChange('tiktok', e.target.value)}
                className="input-premium"
                placeholder="https://tiktok.com/@cikalpetcare"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <FaYoutube className="inline mr-2 w-5 h-5 text-[#FF0000]" />
                YouTube
              </label>
              <input
                type="url"
                value={settings.youtube}
                onChange={(e) => handleChange('youtube', e.target.value)}
                className="input-premium"
                placeholder="https://youtube.com/@cikalpetcare"
              />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="rounded-card border border-border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Jam Operasional</h2>
            <p className="text-sm text-gray-600">Atur jam buka toko/layanan</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hari Buka</label>
              <input
                type="text"
                value={settings.openDays}
                onChange={(e) => handleChange('openDays', e.target.value)}
                className="input-premium"
                placeholder="Senin - Sabtu"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Jam Buka</label>
              <input
                type="text"
                value={settings.openHours}
                onChange={(e) => handleChange('openHours', e.target.value)}
                className="input-premium"
                placeholder="09:00 - 17:00 WIB"
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="rounded-card border border-border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Pengaturan Pembayaran</h2>
            <p className="text-sm text-gray-600">Atur informasi rekening bank dan QRIS</p>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex items-center gap-3 rounded-button border border-border p-3 text-sm font-semibold"><input type="checkbox" checked={settings.bankTransferActive} onChange={(e) => handleChange('bankTransferActive', e.target.checked)} />Transfer Bank</label>
              <label className="flex items-center gap-3 rounded-button border border-border p-3 text-sm font-semibold"><input type="checkbox" checked={settings.qrisActive} onChange={(e) => handleChange('qrisActive', e.target.checked)} />QRIS</label>
              <label className="flex items-center gap-3 rounded-button border border-border p-3 text-sm font-semibold"><input type="checkbox" checked={settings.codActive} onChange={(e) => handleChange('codActive', e.target.checked)} />Bayar di Tempat</label>
            </div>
            <div className="max-w-xs">
              <label className="block text-sm font-bold text-gray-700 mb-2">DP Penitipan (%)</label>
              <input type="number" min={0} max={100} step={1} value={settings.boardingDepositPercent} onChange={(e) => handleChange('boardingDepositPercent', Number(e.target.value))} className="input-premium" />
              <p className="mt-1 text-xs text-muted">Berlaku untuk transfer bank dan QRIS. COD dibayar di lokasi.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Bank</label>
                <input
                  type="text"
                  value={settings.bankName}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  className="input-premium"
                  placeholder="Bank BRI"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Rekening</label>
                <input
                  type="text"
                  value={settings.bankAccount}
                  onChange={(e) => handleChange('bankAccount', e.target.value)}
                  className="input-premium"
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Atas Nama</label>
                <input
                  type="text"
                  value={settings.bankAccountName}
                  onChange={(e) => handleChange('bankAccountName', e.target.value)}
                  className="input-premium"
                  placeholder="Cikal Pet Care"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">QRIS Image URL</label>
              <input
                type="url"
                value={settings.qrisImageUrl}
                onChange={(e) => handleChange('qrisImageUrl', e.target.value)}
                className="input-premium"
                placeholder="https://example.com/qris.jpg"
              />
            </div>
          </div>
        </div>

        <div className="rounded-card border border-border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-button bg-primary p-3"><Truck className="h-7 w-7 text-secondary" /></div>
            <div><h2 className="text-xl font-bold text-gray-800">Pengantaran Produk</h2><p className="text-sm text-gray-600">Atur pickup, wilayah, dan ongkir produk fisik</p></div>
          </div>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-button border border-border p-3 text-sm font-semibold"><input type="checkbox" checked={settings.deliveryActive} onChange={(event) => handleChange('deliveryActive', event.target.checked)} />Pengantaran aktif</label>
            <label className="flex items-center gap-3 rounded-button border border-border p-3 text-sm font-semibold"><input type="checkbox" checked={settings.pickupActive} onChange={(event) => handleChange('pickupActive', event.target.checked)} />Ambil di toko aktif</label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {([
              ['freeShippingThreshold', 'Batas gratis ongkir'],
              ['polewaliDeliveryFee', 'Ongkir Polewali'],
              ['wonomulyoDeliveryFee', 'Ongkir Wonomulyo'],
              ['tinambungDeliveryFee', 'Ongkir Tinambung'],
              ['otherDeliveryFee', 'Ongkir kecamatan lain'],
            ] as const).map(([field, label]) => <label key={field} className="block text-sm font-bold text-gray-700">{label}<input type="number" min={0} step={1000} value={settings[field]} onChange={(event) => handleChange(field, Number(event.target.value))} className="input-premium mt-2" /></label>)}
          </div>
        </div>

        {/* Save Button */}
        <div className="rounded-card border border-border bg-white p-6 shadow-sm">
          <button
            type="submit"
            disabled={saving}
            className="flex min-h-12 w-full items-center justify-center gap-3 rounded-button bg-primary px-6 py-3 font-semibold text-[#2A2A1A] transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  )
}
