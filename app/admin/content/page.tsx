'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Images, Loader2, Star, Trash2, Users } from 'lucide-react'
import { toast } from 'react-toastify'
import FileUpload from '@/components/FileUpload'

interface GalleryItem { id: string; title: string; kind: 'GALLERY' | 'BEFORE_AFTER'; image_url: string | null; before_image_url: string | null; after_image_url: string | null; description: string | null; is_published: boolean; sort_order: number }
interface TeamMember { id: string; name: string; role: string; bio: string | null; image_url: string | null; is_published: boolean; sort_order: number }
interface Testimonial { id: string; customer_name: string; rating: number; message: string; service_type: string | null; is_approved: boolean; is_featured: boolean }

export default function TrustContentPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [galleryKind, setGalleryKind] = useState<'GALLERY' | 'BEFORE_AFTER'>('GALLERY')
  const [galleryImage, setGalleryImage] = useState('')
  const [beforeImage, setBeforeImage] = useState('')
  const [afterImage, setAfterImage] = useState('')
  const [teamImage, setTeamImage] = useState('')

  const loadContent = async () => {
    const response = await fetch('/api/trust-content')
    const result = await response.json()
    if (response.ok && result.success) {
      setGallery(result.data.gallery)
      setTeam(result.data.team)
      setTestimonials(result.data.testimonials)
    } else toast.error(result.error || 'Konten gagal dimuat')
    setLoading(false)
  }

  useEffect(() => { void loadContent() }, [])

  const createContent = async (resource: string, data: Record<string, unknown>) => {
    setSaving(true)
    const response = await fetch('/api/trust-content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resource, data }) })
    const result = await response.json()
    if (response.ok && result.success) {
      toast.success('Konten ditambahkan')
      await loadContent()
    } else toast.error(result.error || 'Konten gagal ditambahkan')
    setSaving(false)
  }

  const updateContent = async (resource: string, id: string, data: Record<string, unknown>) => {
    const response = await fetch('/api/trust-content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resource, id, data }) })
    const result = await response.json()
    if (response.ok && result.success) await loadContent()
    else toast.error(result.error || 'Konten gagal diperbarui')
  }

  const deleteContent = async (resource: string, id: string) => {
    if (!confirm('Hapus konten ini?')) return
    const response = await fetch(`/api/trust-content?resource=${resource}&id=${id}`, { method: 'DELETE' })
    const result = await response.json()
    if (response.ok && result.success) await loadContent()
    else toast.error(result.error || 'Konten gagal dihapus')
  }

  const submitGallery = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const fields = Object.fromEntries(new FormData(event.currentTarget).entries())
    void createContent('gallery', { ...fields, kind: galleryKind, image_url: galleryImage, before_image_url: beforeImage, after_image_url: afterImage, is_published: fields.is_published === 'on' })
  }

  const submitTeam = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const fields = Object.fromEntries(new FormData(event.currentTarget).entries())
    void createContent('team', { ...fields, image_url: teamImage, is_published: fields.is_published === 'on' })
  }

  const submitTestimonial = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const fields = Object.fromEntries(new FormData(event.currentTarget).entries())
    void createContent('testimonial', { ...fields, is_approved: fields.is_approved === 'on', is_featured: fields.is_featured === 'on' })
  }

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-dark-gold" /></div>

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold text-text">Konten Kepercayaan</h1><p className="text-sm text-muted">Kelola bukti visual, tim, dan testimonial yang tampil di homepage.</p></div>

      <section className="space-y-4"><div className="flex items-center gap-2"><Images className="h-5 w-5 text-dark-gold" /><h2 className="text-xl font-bold text-text">Galeri dan Before/After</h2></div>
        <form onSubmit={submitGallery} className="grid gap-4 rounded-card border border-border bg-white p-5 lg:grid-cols-2">
          <div className="space-y-3"><input name="title" required minLength={2} maxLength={120} placeholder="Judul" className="input-premium" /><textarea name="description" maxLength={500} placeholder="Deskripsi singkat" className="input-premium min-h-24" /><div className="grid grid-cols-2 gap-3"><select value={galleryKind} onChange={(event) => setGalleryKind(event.target.value as typeof galleryKind)} className="input-premium"><option value="GALLERY">Galeri</option><option value="BEFORE_AFTER">Before / After</option></select><input name="sort_order" type="number" min={0} defaultValue={0} className="input-premium" aria-label="Urutan" /></div><label className="flex items-center gap-2 text-sm font-semibold"><input name="is_published" type="checkbox" /> Tampilkan di homepage</label></div>
          <div>{galleryKind === 'GALLERY' ? <FileUpload currentImageUrl={galleryImage} onUploadSuccess={setGalleryImage} onRemove={() => setGalleryImage('')} label="Gambar Galeri" /> : <div className="grid gap-3 sm:grid-cols-2"><FileUpload currentImageUrl={beforeImage} onUploadSuccess={setBeforeImage} onRemove={() => setBeforeImage('')} label="Sebelum" /><FileUpload currentImageUrl={afterImage} onUploadSuccess={setAfterImage} onRemove={() => setAfterImage('')} label="Sesudah" /></div>}</div>
          <button disabled={saving} className="min-h-11 rounded-button bg-primary px-5 font-semibold text-[#2a2a1a] disabled:opacity-50 lg:col-span-2">Tambah Konten Visual</button>
        </form>
        <div className="grid gap-3 md:grid-cols-2">{gallery.map((item) => <article key={item.id} className="flex items-center justify-between gap-4 rounded-card border border-border bg-white p-4"><div><p className="font-bold text-text">{item.title}</p><p className="text-xs text-muted">{item.kind.replace('_', ' ')} · Urutan {item.sort_order}</p></div><div className="flex gap-2"><button onClick={() => updateContent('gallery', item.id, { ...item, is_published: !item.is_published })} className="min-h-10 rounded-button border border-border px-3 text-sm font-semibold">{item.is_published ? 'Unpublish' : 'Publish'}</button><button onClick={() => deleteContent('gallery', item.id)} className="flex h-10 w-10 items-center justify-center rounded-button text-red-600 hover:bg-red-50" aria-label={`Hapus ${item.title}`}><Trash2 className="h-4 w-4" /></button></div></article>)}</div>
      </section>

      <section className="space-y-4"><div className="flex items-center gap-2"><Users className="h-5 w-5 text-dark-gold" /><h2 className="text-xl font-bold text-text">Tim</h2></div>
        <form onSubmit={submitTeam} className="grid gap-4 rounded-card border border-border bg-white p-5 lg:grid-cols-2"><div className="space-y-3"><input name="name" required minLength={2} maxLength={100} placeholder="Nama anggota tim" className="input-premium" /><input name="role" required minLength={2} maxLength={100} placeholder="Peran" className="input-premium" /><textarea name="bio" maxLength={500} placeholder="Bio singkat" className="input-premium min-h-24" /><input name="sort_order" type="number" min={0} defaultValue={0} className="input-premium" aria-label="Urutan" /><label className="flex items-center gap-2 text-sm font-semibold"><input name="is_published" type="checkbox" /> Tampilkan di homepage</label></div><FileUpload currentImageUrl={teamImage} onUploadSuccess={setTeamImage} onRemove={() => setTeamImage('')} label="Foto Tim (opsional)" /><button disabled={saving} className="min-h-11 rounded-button bg-primary px-5 font-semibold text-[#2a2a1a] disabled:opacity-50 lg:col-span-2">Tambah Anggota Tim</button></form>
        <div className="grid gap-3 md:grid-cols-2">{team.map((item) => <article key={item.id} className="flex items-center justify-between gap-4 rounded-card border border-border bg-white p-4"><div><p className="font-bold text-text">{item.name}</p><p className="text-xs text-muted">{item.role} · Urutan {item.sort_order}</p></div><div className="flex gap-2"><button onClick={() => updateContent('team', item.id, { ...item, is_published: !item.is_published })} className="min-h-10 rounded-button border border-border px-3 text-sm font-semibold">{item.is_published ? 'Unpublish' : 'Publish'}</button><button onClick={() => deleteContent('team', item.id)} className="flex h-10 w-10 items-center justify-center rounded-button text-red-600 hover:bg-red-50" aria-label={`Hapus ${item.name}`}><Trash2 className="h-4 w-4" /></button></div></article>)}</div>
      </section>

      <section className="space-y-4"><div className="flex items-center gap-2"><Star className="h-5 w-5 text-dark-gold" /><h2 className="text-xl font-bold text-text">Testimonial</h2></div>
        <form onSubmit={submitTestimonial} className="grid gap-3 rounded-card border border-border bg-white p-5 sm:grid-cols-2"><input name="customer_name" required minLength={2} maxLength={100} placeholder="Nama pelanggan" className="input-premium" /><input name="service_type" maxLength={100} placeholder="Jenis layanan (opsional)" className="input-premium" /><select name="rating" defaultValue="5" className="input-premium"><option value="5">5 bintang</option><option value="4">4 bintang</option><option value="3">3 bintang</option><option value="2">2 bintang</option><option value="1">1 bintang</option></select><div className="flex items-center gap-4"><label className="flex items-center gap-2 text-sm"><input name="is_approved" type="checkbox" /> Approved</label><label className="flex items-center gap-2 text-sm"><input name="is_featured" type="checkbox" /> Featured</label></div><textarea name="message" required minLength={5} maxLength={1000} placeholder="Testimonial pelanggan" className="input-premium min-h-24 sm:col-span-2" /><button disabled={saving} className="min-h-11 rounded-button bg-primary px-5 font-semibold text-[#2a2a1a] disabled:opacity-50 sm:col-span-2">Tambah Testimonial</button></form>
        <div className="grid gap-3 md:grid-cols-2">{testimonials.map((item) => <article key={item.id} className="rounded-card border border-border bg-white p-4"><div className="flex justify-between gap-4"><div><p className="font-bold text-text">{item.customer_name} · {item.rating}/5</p><p className="mt-1 line-clamp-2 text-sm text-muted">{item.message}</p></div><button onClick={() => deleteContent('testimonial', item.id)} className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-button text-red-600 hover:bg-red-50" aria-label={`Hapus testimonial ${item.customer_name}`}><Trash2 className="h-4 w-4" /></button></div><div className="mt-3 flex gap-2"><button onClick={() => updateContent('testimonial', item.id, { ...item, is_approved: !item.is_approved })} className="min-h-10 rounded-button border border-border px-3 text-sm font-semibold">{item.is_approved ? 'Unapprove' : 'Approve'}</button><button onClick={() => updateContent('testimonial', item.id, { ...item, is_featured: !item.is_featured })} className="min-h-10 rounded-button border border-border px-3 text-sm font-semibold">{item.is_featured ? 'Unfeature' : 'Feature'}</button></div></article>)}</div>
      </section>
    </div>
  )
}