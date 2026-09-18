'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Clock3, Plus, Trash2 } from 'lucide-react'
import AppIcon from '@/components/AppIcon'

interface GroomingSlot {
  id: string
  time: string
  max_bookings: number
  is_active: boolean
}

export default function GroomingSlotsAdminPage() {
  const [slots, setSlots] = useState<GroomingSlot[]>([])
  const [error, setError] = useState('')

  const loadSlots = async () => {
    const response = await fetch('/api/grooming-slots?includeInactive=true')
    const data = await response.json()
    if (response.ok && data.success) setSlots(data.data)
    else setError(data.error || 'Gagal mengambil slot grooming')
  }

  useEffect(() => { void loadSlots() }, [])

  const createSlot = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    const response = await fetch('/api/grooming-slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time: values.time, max_bookings: Number(values.max_bookings), is_active: true }),
    })
    const data = await response.json()
    if (!response.ok) return setError(data.error || 'Gagal menambah slot')
    form.reset()
    await loadSlots()
  }

  const updateSlot = async (id: string, input: Partial<GroomingSlot>) => {
    const response = await fetch(`/api/grooming-slots/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const data = await response.json()
    if (!response.ok) return setError(data.error || 'Gagal memperbarui slot')
    await loadSlots()
  }

  const deleteSlot = async (id: string) => {
    if (!window.confirm('Hapus slot grooming ini?')) return
    const response = await fetch(`/api/grooming-slots/${id}`, { method: 'DELETE' })
    const data = await response.json()
    if (!response.ok) return setError(data.error || 'Gagal menghapus slot')
    await loadSlots()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Slot Grooming</h1>
        <p className="mt-1 text-sm text-muted">Atur jam dan kapasitas booking grooming.</p>
      </div>

      <form onSubmit={createSlot} className="flex flex-col gap-3 rounded-card border border-border bg-white p-5 sm:flex-row sm:items-end">
        <label className="text-sm font-medium text-text">Jam (WITA)<input name="time" type="time" required className="mt-1 block min-h-11 rounded-button border border-border px-3" /></label>
        <label className="text-sm font-medium text-text">Kapasitas<input name="max_bookings" type="number" required min={1} max={20} defaultValue={1} className="mt-1 block min-h-11 rounded-button border border-border px-3" /></label>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button bg-primary px-5 font-semibold text-[#2A2A1A]" type="submit"><AppIcon icon={Plus} size="sm" />Tambah</button>
      </form>

      {error && <p role="alert" className="rounded-button bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="overflow-x-auto rounded-card border border-border bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-surface2 text-text"><tr><th className="p-4">Jam</th><th className="p-4">Kapasitas</th><th className="p-4">Status</th><th className="p-4 text-right">Aksi</th></tr></thead>
          <tbody>{slots.map((slot) => <tr key={slot.id} className="border-t border-border"><td className="p-4 font-semibold"><span className="inline-flex items-center gap-2"><AppIcon icon={Clock3} size="sm" />{slot.time}</span></td><td className="p-4"><input aria-label={`Kapasitas slot ${slot.time}`} type="number" min={1} max={20} value={slot.max_bookings} onChange={(event) => setSlots((current) => current.map((item) => item.id === slot.id ? { ...item, max_bookings: Number(event.target.value) } : item))} onBlur={(event) => updateSlot(slot.id, { max_bookings: Number(event.target.value) })} className="w-20 rounded-button border border-border px-2 py-1.5" /></td><td className="p-4"><label className="inline-flex items-center gap-2"><input type="checkbox" checked={slot.is_active} onChange={(event) => updateSlot(slot.id, { is_active: event.target.checked })} />{slot.is_active ? 'Aktif' : 'Nonaktif'}</label></td><td className="p-4 text-right"><button type="button" onClick={() => deleteSlot(slot.id)} aria-label={`Hapus slot ${slot.time}`} className="inline-flex h-10 w-10 items-center justify-center rounded-button text-red-600 hover:bg-red-50"><AppIcon icon={Trash2} size="sm" /></button></td></tr>)}</tbody>
        </table>
        {slots.length === 0 && <p className="p-8 text-center text-muted">Belum ada slot grooming.</p>}
      </div>
    </div>
  )
}