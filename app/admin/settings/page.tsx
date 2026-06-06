'use client'

import { useState } from 'react'
import { Save, MessageCircle, Mail, MapPin, Instagram, Facebook, Settings as SettingsIcon } from 'lucide-react'
import { toast } from 'react-toastify'

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    // Site Info
    siteName: 'Cikal Pet Care Polman',
    siteDescription: 'Layanan perawatan hewan kesayangan terpercaya di Polewali Mandar',
    
    // Contact Info
    whatsapp: '+62 812-3456-7890',
    email: 'info@cikalpetcare.com',
    address: 'Jl. Jend. Sudirman No. 123, Polewali, Sulawesi Barat',
    
    // Social Media
    instagram: '@cikalpetcare',
    facebook: 'cikalpetcare',
    
    // Business Hours
    openDays: 'Senin - Sabtu',
    openHours: '09:00 - 17:00 WIB',
    
    // Payment Info
    bankName: 'Bank BRI',
    bankAccount: '1234567890',
    bankAccountName: 'Cikal Pet Care',
    qrisImageUrl: '',
  })

  const handleChange = (field: string, value: string) => {
    setSettings({ ...settings, [field]: value })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // Simulate saving (in real app, would call API to save to database)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success('Pengaturan berhasil disimpan!')
    setSaving(false)
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
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <SettingsIcon className="w-7 h-7 text-white" />
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Website</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Informasi Kontak</h2>
              <p className="text-sm text-gray-600">Atur kontak yang dapat dihubungi customer</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <MessageCircle className="inline mr-2 w-5 h-5 text-green-600" />
                WhatsApp
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Jl. Jend. Sudirman No. 123, Polewali"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Social Media</h2>
              <p className="text-sm text-gray-600">Atur akun social media</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Instagram className="inline mr-2 w-5 h-5 text-pink-600" />
                Instagram Username
              </label>
              <input
                type="text"
                value={settings.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="@cikalpetcare"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Facebook className="inline mr-2 w-5 h-5 text-blue-600" />
                Facebook Page
              </label>
              <input
                type="text"
                value={settings.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="cikalpetcare"
              />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Senin - Sabtu"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Jam Buka</label>
              <input
                type="text"
                value={settings.openHours}
                onChange={(e) => handleChange('openHours', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="09:00 - 17:00 WIB"
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Pengaturan Pembayaran</h2>
            <p className="text-sm text-gray-600">Atur informasi rekening bank dan QRIS</p>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Bank</label>
                <input
                  type="text"
                  value={settings.bankName}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Bank BRI"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Rekening</label>
                <input
                  type="text"
                  value={settings.bankAccount}
                  onChange={(e) => handleChange('bankAccount', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Atas Nama</label>
                <input
                  type="text"
                  value={settings.bankAccountName}
                  onChange={(e) => handleChange('bankAccountName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com/qris.jpg"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <button
            type="submit"
            disabled={saving}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  )
}
