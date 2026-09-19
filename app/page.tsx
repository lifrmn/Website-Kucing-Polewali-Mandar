import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CalendarCheck, Clock3, HeartHandshake, HeartPulse, Home, MapPin, Scissors, ShieldCheck, ShoppingBag, Star } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import { getSiteUrl } from '@/lib/site-url'
import prisma from '@/lib/prisma'
import { settingsService } from '@/services/settingsService'
import PetTypeBadge from '@/components/PetTypeBadge'
import { parsePetTypes } from '@/lib/pet-types'

const PALETTE = {
  bg: '#FAF8F5',
  hero: '#3b3a2e',
  primary: '#E6D18B',
  stats: '#F3EFE8',
  text: '#383838',
  muted: '#707070',
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format(amount)

export default async function HomePage() {
  const [settings, services, packages, products, posts, testimonials, gallery, team] = await Promise.all([
    settingsService.getSiteSettings(),
    prisma.service.findMany({ where: { is_active: true }, orderBy: [{ featured: 'desc' }, { created_at: 'desc' }], take: 6 }),
    prisma.penitipanPackage.findMany({ where: { is_active: true }, orderBy: [{ featured: 'desc' }, { created_at: 'desc' }], take: 3 }),
    prisma.product.findMany({ where: { is_active: true }, orderBy: [{ featured: 'desc' }, { created_at: 'desc' }], take: 4 }),
    prisma.blogPost.findMany({ where: { is_published: true, deleted_at: null }, orderBy: [{ published_at: 'desc' }, { created_at: 'desc' }], take: 3 }),
    prisma.testimonial.findMany({ where: { is_approved: true }, orderBy: [{ is_featured: 'desc' }, { created_at: 'desc' }], take: 6 }),
    prisma.galleryItem.findMany({ where: { is_published: true }, orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }], take: 8 }),
    prisma.teamMember.findMany({ where: { is_published: true }, orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }], take: 6 }),
  ])
  const sameAs = [settings.instagram, settings.facebook, settings.tiktok, settings.youtube].filter(Boolean)
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.siteName,
    url: getSiteUrl(),
    telephone: settings.whatsapp || undefined,
    email: settings.email || undefined,
    address: settings.address || undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  }

  return (
    <div style={{ backgroundColor: PALETTE.bg, fontFamily: "'Poppins', 'Inter', sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd).replace(/</g, '\\u003c') }} />

      {/* ====================================================
          HERO SECTION
          ==================================================== */}
      <section
        className="relative flex min-h-[calc(100svh-48px)] flex-col overflow-hidden"
        style={{ backgroundColor: PALETTE.hero }}
      >
        <div className="absolute inset-0 grid grid-cols-2" aria-label="Anjing dan kucing di Cikal Pet Care Polewali Mandar">
          <Image
            src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&auto=format&fit=crop"
            alt="Anjing di Cikal Pet Care Polewali Mandar"
            fill
            priority
            sizes="50vw"
            unoptimized
            className="!relative h-full object-cover"
          />
          <Image
            src="https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=1200&auto=format&fit=crop"
            alt="Kucing di Cikal Pet Care Polewali Mandar"
            fill
            priority
            sizes="50vw"
            unoptimized
            className="!relative h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#2F2E25]/75 md:bg-[#2F2E25]/68" />
        </div>

        {/* Hero text — left side */}
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-6 pb-8 pt-24 sm:px-8 md:pb-12 md:pt-32 lg:px-12">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: PALETTE.primary }}>
              Cikal Pet Care — Polewali Mandar
            </p>
            <h1
              className="mb-4 text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.1] text-white md:mb-6"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Pet Care Profesional untuk Berbagai Hewan Peliharaan
            </h1>
            <p className="text-base md:text-lg leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Grooming, penitipan, kebutuhan hewan, dan layanan perawatan profesional untuk sahabat kesayangan Anda di Polewali Mandar.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-row">
              <Link
                href="/booking"
                data-testid="hero-booking-cta"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button bg-primary px-4 text-sm font-semibold text-[#2A2A1A] hover:bg-primary-hover sm:px-7 sm:text-base"
              >
                Booking Sekarang <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/layanan" className="inline-flex min-h-12 items-center justify-center rounded-button border border-white/50 bg-[#3B3A2E]/60 px-4 text-sm font-semibold text-white hover:bg-[#3B3A2E]/80 sm:px-7 sm:text-base">Lihat Layanan</Link>
            </div>
          </div>
        </div>

      </section>

      <section className="w-full overflow-x-auto bg-bg px-6 py-6 sm:px-8 md:py-8 lg:px-12">
          <div className="mx-auto grid w-max max-w-6xl grid-cols-4 gap-3 md:w-full md:gap-4">
            {[
              { icon: Scissors, bold: 'Grooming', text: 'profesional', link: '/layanan' },
              { icon: Home, bold: 'Penitipan', text: 'aman & nyaman', link: '/booking' },
              { icon: ShoppingBag, bold: 'Produk', text: 'kebutuhan pet', link: '/produk' },
              { icon: HeartPulse, bold: 'Perawatan', text: 'sesuai kebutuhan', link: '/layanan' },
            ].map((card, i) => (
              <Link
                key={i}
                href={card.link}
                data-testid={i === 0 ? 'feature-grooming-card' : undefined}
                className="group flex h-[112px] w-[150px] cursor-pointer flex-col items-center justify-center rounded-card bg-white p-3 text-center transition-all duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 md:h-[140px] md:w-auto md:p-5"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/35">
                  <card.icon size={24} strokeWidth={2} className="text-secondary" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold text-[#383838] md:text-[15px]">
                  <span className="font-bold">{card.bold}</span> {card.text}
                </p>
              </Link>
            ))}
          </div>
      </section>

      {/* ====================================================
          LAYANAN / GRID SECTION
          ==================================================== */}
      <section className="pb-20 pt-8 md:pb-28 md:pt-16" style={{ backgroundColor: PALETTE.bg }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: PALETTE.text, fontFamily: "'Poppins', sans-serif" }}
            >
              Layanan Populer
            </h2>
            <p style={{ color: PALETTE.muted }} className="text-base max-w-md mx-auto">
              Setiap layanan menjelaskan jenis hewan yang didukung agar pilihan Anda lebih tepat.
            </p>
          </div>

          {services.length === 0 ? <p className="rounded-card border border-border bg-white p-8 text-center text-muted">Layanan belum tersedia saat ini.</p> : <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {services.map((item) => (
              <Link
                key={item.id}
                href="/layanan"
                className="group bg-white rounded-card overflow-hidden border border-border transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <Image
                    src={item.image_url || '/placeholder-product.svg'}
                    alt={item.image_url ? `${item.name} di Cikal Pet Care` : `Ilustrasi layanan ${item.name}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ borderRadius: '20px 20px 0 0' }}
                  />
                  {!item.image_url && <span className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-[10px] font-semibold text-muted">Foto segera tersedia</span>}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-sm" style={{ color: PALETTE.text }}>{item.name}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {parsePetTypes(item.supported_pet_types).map((type) => <PetTypeBadge key={type} type={type} />)}
                  </div>
                  {item.duration && <p className="mt-3 flex items-center gap-1.5 text-xs text-muted"><Clock3 className="h-4 w-4" />{item.duration} menit</p>}
                  <p className="mt-2 font-bold text-dark-gold">Mulai {formatCurrency(item.price)}</p>
                </div>
              </Link>
            ))}
          </div>}

          <div className="text-center mt-12">
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 px-10 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: PALETTE.primary, color: '#2a2a1a', boxShadow: '0 4px 14px rgba(214,184,90,0.35)' }}
            >
              Lihat Semua Layanan
            </Link>
          </div>
        </div>
      </section>

      {packages.length > 0 && <section className="bg-white py-20 md:py-24"><div className="mx-auto max-w-5xl px-6 sm:px-8"><div className="mb-10 text-center"><h2 className="text-3xl font-bold text-text md:text-4xl">Paket Penitipan Hewan</h2><p className="mt-3 text-muted">Pilih paket sesuai jenis hewan, kapasitas, dan fasilitas yang tersedia.</p></div><div className="grid gap-5 md:grid-cols-3">{packages.map((pkg) => { let features: string[] = []; try { const parsed = JSON.parse(pkg.features); features = Array.isArray(parsed) ? parsed : [] } catch { features = pkg.features.split(',').map((item) => item.trim()).filter(Boolean) } return <article key={pkg.id} className="rounded-card border border-border bg-bg p-6"><h3 className="text-xl font-bold text-text">{pkg.name}</h3><div className="mt-3 flex flex-wrap gap-1.5">{parsePetTypes(pkg.accepted_pet_types).map((type) => <PetTypeBadge key={type} type={type} />)}</div><p className="mt-3 text-2xl font-bold text-dark-gold">{formatCurrency(pkg.price_per_night)} <span className="text-sm font-normal text-muted">/ malam</span></p>{features.length > 0 && <ul className="mt-5 space-y-2 text-sm text-muted">{features.slice(0, 5).map((feature) => <li key={feature} className="flex gap-2"><span aria-hidden="true">•</span>{feature}</li>)}</ul>}<p className="mt-4 text-xs text-muted">Kapasitas maksimal {pkg.max_pets} hewan</p><Link href="/booking" className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-button bg-primary px-5 font-semibold text-[#2A2A1A]">Booking</Link></article> })}</div></div></section>}

        {/* Service principles replace unverified marketing metrics. */}
      <section className="relative py-28" style={{ backgroundColor: PALETTE.stats }}>
        {/* Wave top */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,0 L0,0 Z" fill={PALETTE.bg} />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: PALETTE.text, fontFamily: "'Poppins', sans-serif" }}
          >
            Kenapa Memilih Cikal Pet Care
          </h2>
          <p className="text-base mb-16" style={{ color: PALETTE.muted }}>
            Nyaman untuk mereka, tenang untuk Anda.
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Scissors, title: 'Perawatan Profesional', description: 'Layanan diberikan sesuai kebutuhan dan jenis hewan yang didukung.' },
              { icon: ShieldCheck, title: 'Lingkungan Nyaman', description: 'Kebersihan dan kenyamanan menjadi bagian penting dari setiap layanan.' },
              { icon: HeartHandshake, title: 'Layanan Terpercaya', description: 'Kondisi dan kebutuhan khusus hewan dicatat dengan jelas saat booking.' },
              { icon: ShoppingBag, title: 'Kebutuhan Pet Lengkap', description: 'Produk pilihan untuk kebutuhan harian berbagai hewan peliharaan.' },
            ].map((item) => (
              <div key={item.title} className="rounded-card border border-border bg-white p-7 text-left shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-button bg-primary/35"><item.icon className="h-6 w-6 text-secondary" /></div>
                <p className="mb-2 text-xl font-semibold text-text">{item.title}</p>
                <p className="text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave bottom — transition into footer */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d="M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,80 L0,80 Z" fill="#2F2E25" />
          </svg>
        </div>
      </section>

      <section className="bg-bg py-20"><div className="mx-auto max-w-5xl px-6 sm:px-8"><div className="mb-10 text-center"><h2 className="text-3xl font-bold text-text">Cara Booking</h2></div><ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{['Pilih layanan', 'Pilih tanggal', 'Isi data hewan', 'Konfirmasi', 'Pembayaran'].map((step, index) => <li key={step} className="rounded-card border border-border bg-white p-5"><span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-secondary">{index + 1}</span><p className="font-semibold text-text">{step}</p></li>)}</ol></div></section>

      {products.length > 0 && <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-6 sm:px-8"><div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-3xl font-bold text-text">Kebutuhan Pet Pilihan</h2><p className="mt-2 text-muted">Produk sesuai jenis hewan, kebutuhan harian, dan perawatan.</p></div><Link href="/produk" className="font-semibold text-dark-gold">Lihat semua produk <ArrowRight className="inline h-4 w-4" /></Link></div><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{products.map((product) => <Link key={product.id} href={`/produk/${product.slug}`} className="overflow-hidden rounded-card border border-border bg-bg"><div className="relative aspect-square"><Image src={product.image_url || '/placeholder-product.svg'} alt={`Produk ${product.name}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" /></div><div className="p-4"><div className="flex flex-wrap gap-1">{parsePetTypes(product.pet_types).map((type) => <PetTypeBadge key={type} type={type} showLabel={false} />)}</div><h3 className="mt-2 line-clamp-2 font-semibold text-text">{product.name}</h3><p className="mt-2 font-bold text-dark-gold">{formatCurrency(product.price)}</p></div></Link>)}</div></div></section>}

      {posts.length > 0 && <section className="bg-bg py-20"><div className="mx-auto max-w-5xl px-6 sm:px-8"><div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-3xl font-bold text-text">Tips &amp; Edukasi Pet</h2><p className="mt-2 text-muted">Informasi untuk menjaga kesehatan, kebersihan, dan kenyamanan hewan kesayangan Anda.</p></div><Link href="/blog" className="font-semibold text-dark-gold">Baca artikel lainnya <ArrowRight className="inline h-4 w-4" /></Link></div><div className="grid gap-5 md:grid-cols-3">{posts.map((post) => <Link key={post.id} href={`/blog/${post.slug}`} className="overflow-hidden rounded-card border border-border bg-white">{post.featured_image && <div className="relative aspect-[4/3]"><Image src={post.featured_image} alt={`Ilustrasi artikel ${post.title}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /></div>}<div className="p-5">{post.category && <p className="text-xs font-semibold uppercase text-dark-gold">{post.category}</p>}<h3 className="mt-2 text-lg font-bold text-text">{post.title}</h3>{post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted">{post.excerpt}</p>}</div></Link>)}</div></div></section>}

      {gallery.length > 0 && <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-6 sm:px-8"><h2 className="mb-10 text-center text-3xl font-bold text-text">Galeri Perawatan</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{gallery.map((item) => <figure key={item.id} className="overflow-hidden rounded-card border border-border bg-bg">{item.kind === 'BEFORE_AFTER' ? <div className="grid grid-cols-2">{[{ label: 'Sebelum', url: item.before_image_url }, { label: 'Sesudah', url: item.after_image_url }].map((image) => image.url && <div key={image.label} className="relative"><img src={image.url} alt={`${image.label} ${item.title}`} className="aspect-square w-full object-cover" /><span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">{image.label}</span></div>)}</div> : item.image_url ? <img src={item.image_url} alt={item.title} className="aspect-[4/3] w-full object-cover" /> : null}<figcaption className="p-4"><p className="font-bold text-text">{item.title}</p>{item.description && <p className="mt-1 text-sm text-muted">{item.description}</p>}</figcaption></figure>)}</div></div></section>}

      {team.length > 0 && <section className="bg-bg py-20"><div className="mx-auto max-w-5xl px-6 sm:px-8"><h2 className="mb-10 text-center text-3xl font-bold text-text">Tim Cikal Pet Care</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{team.map((member) => <article key={member.id} className="overflow-hidden rounded-card border border-border bg-white">{member.image_url && <img src={member.image_url} alt={member.name} className="aspect-[4/3] w-full object-cover" />}<div className="p-5"><h3 className="text-lg font-bold text-text">{member.name}</h3><p className="text-sm font-semibold text-dark-gold">{member.role}</p>{member.bio && <p className="mt-3 text-sm leading-relaxed text-muted">{member.bio}</p>}</div></article>)}</div></div></section>}

      {testimonials.length > 0 && <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-6 sm:px-8"><h2 className="mb-10 text-center text-3xl font-bold text-text">Cerita Pelanggan</h2><div className="grid gap-5 md:grid-cols-3">{testimonials.map((testimonial) => <blockquote key={testimonial.id} className="rounded-card border border-border bg-bg p-6"><div className="mb-4 flex gap-1 text-[#A16207]" aria-label={`${testimonial.rating} dari 5 bintang`}>{Array.from({ length: testimonial.rating }, (_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}</div><p className="leading-relaxed text-text">“{testimonial.message}”</p><footer className="mt-4 text-sm font-semibold text-muted">{testimonial.customer_name}</footer></blockquote>)}</div></div></section>}

      <section className="bg-[#2F2E25] py-20 text-white"><div className="mx-auto grid max-w-5xl gap-8 px-6 sm:px-8 md:grid-cols-2 md:items-center"><div><div className="mb-4 flex items-center gap-2 text-primary"><MapPin className="h-5 w-5" /><span className="font-semibold">Polewali Mandar</span></div><h2 className="text-3xl font-bold">Berikan Perawatan Terbaik untuk Sahabat Kesayangan Anda</h2><p className="mt-4 text-white/70">{settings.address}</p><p className="mt-2 text-white/70">{settings.openDays} · {settings.openHours}</p></div><div className="flex flex-col gap-3 sm:flex-row md:justify-end"><Link href="/booking" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button bg-primary px-6 font-semibold text-[#2A2A1A]"><CalendarCheck className="h-5 w-5" />Booking Sekarang</Link><a href={getWhatsAppUrl(settings.whatsapp, 'Halo Cikal Pet Care, saya ingin bertanya mengenai layanan untuk hewan kesayangan saya.')} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button border border-white/30 px-6 font-semibold text-white"><FaWhatsapp className="h-5 w-5" />Chat WhatsApp</a>{settings.googleMapsUrl && <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-button border border-white/30 px-6 font-semibold text-white">Petunjuk Arah</a>}</div></div></section>

    </div>
  )
}
