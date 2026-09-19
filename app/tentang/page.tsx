import type { Metadata } from 'next'
import Link from 'next/link'
import { HeartHandshake, MapPin, ShieldCheck } from 'lucide-react'
import { settingsService } from '@/services/settingsService'

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Kenali Cikal Pet Care Polewali Mandar dan layanan profesional untuk berbagai hewan peliharaan.',
  alternates: { canonical: '/tentang' },
}

export default async function AboutPage() {
  const settings = await settingsService.getSiteSettings()

  return (
    <main className="min-h-screen bg-bg pb-20 pt-32">
      <section className="mx-auto max-w-5xl px-6 sm:px-8">
        <p className="font-semibold text-dark-gold">Cikal Pet Care Polewali Mandar</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold text-text md:text-5xl">Perawatan hewan yang jelas, mudah dipesan, dan penuh perhatian.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">{settings.siteDescription}</p>
      </section>

      <section className="mx-auto mt-14 grid max-w-5xl gap-5 px-6 sm:grid-cols-3 sm:px-8">
        {[{ icon: HeartHandshake, title: 'Perhatian pada Setiap Hewan', text: 'Jenis, kondisi kesehatan, dan kebutuhan khusus dicatat saat booking.' }, { icon: ShieldCheck, title: 'Proses yang Jelas', text: 'Jadwal, status booking, dan pembayaran dapat dikonfirmasi dengan aman.' }, { icon: MapPin, title: 'Berada di Polewali Mandar', text: settings.address }].map((item) => <article key={item.title} className="rounded-card border border-border bg-white p-6 shadow-sm"><item.icon className="h-7 w-7 text-dark-gold" aria-hidden="true" /><h2 className="mt-5 text-lg font-bold text-text">{item.title}</h2><p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p></article>)}
      </section>

      <section className="mx-auto mt-14 max-w-5xl px-6 sm:px-8"><div className="rounded-card bg-[#2F2E25] p-7 text-white sm:p-10"><h2 className="text-2xl font-bold">Siap merencanakan perawatan hewan Anda?</h2><p className="mt-3 text-white/70">Lihat layanan sesuai jenis hewan dan pilih jadwal yang tersedia.</p><Link href="/booking" className="mt-6 inline-flex min-h-12 items-center rounded-button bg-primary px-6 font-semibold text-[#2A2A1A]">Booking Sekarang</Link></div></section>
    </main>
  )
}