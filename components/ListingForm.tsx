'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Listing, ListingCategory, ListingStatus } from '@/lib/types'

export default function ListingForm({ existing }: { existing?: Listing }) {
  const router = useRouter()
  const [title, setTitle] = useState(existing?.title ?? '')
  const [category, setCategory] = useState<ListingCategory>(existing?.category ?? 'laptop')
  const [brand, setBrand] = useState(existing?.brand ?? '')
  const [price, setPrice] = useState(existing?.price?.toString() ?? '')
  const [currency, setCurrency] = useState(existing?.currency ?? 'PKR')
  const [priceFirm, setPriceFirm] = useState(existing?.price_firm ?? false)
  const [featured, setFeatured] = useState(existing?.featured ?? false)
  const [condition, setCondition] = useState(existing?.condition ?? 'Excellent')
  const [location, setLocation] = useState(existing?.location ?? 'Islamabad/Rawalpindi')
  const [status, setStatus] = useState<ListingStatus>(existing?.status ?? 'available')
  const [specsText, setSpecsText] = useState(existing?.specs?.join(', ') ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [photos, setPhotos] = useState<string[]>(existing?.photos ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function compressImage(file: File): Promise<File> {
    // Skip compression for already-small files or non-standard image types
    if (file.size < 300_000 || !/^image\/(jpeg|png|webp)$/.test(file.type)) return file

    const bitmap = await createImageBitmap(file)
    const maxDim = 1600
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.8)
    )
    if (!blob) return file

    const newName = file.name.replace(/\.\w+$/, '') + '.jpg'
    return new File([blob], newName, { type: 'image/jpeg' })
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')
    const supabase = createClient()
    if (!supabase) {
      setError('Supabase is not connected yet.')
      setUploading(false)
      return
    }

    const uploaded: string[] = []
    const failures: string[] = []
    for (const rawFile of Array.from(files)) {
      const file = await compressImage(rawFile)
      const path = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const { error: uploadError } = await supabase.storage.from('listing-photos').upload(path, file)
      if (uploadError) {
        failures.push(uploadError.message)
        continue
      }
      const { data } = supabase.storage.from('listing-photos').getPublicUrl(path)
      uploaded.push(data.publicUrl)
    }
    setPhotos((prev) => [...prev, ...uploaded])
    if (failures.length > 0) {
      setError(
        `${failures.length} photo(s) failed to upload: ${failures[0]}. ` +
        `If this mentions a policy or permission, the listing-photos storage bucket needs an upload policy for authenticated users — see README.`
      )
    }
    setUploading(false)
  }

  function removePhoto(url: string) {
    setPhotos((prev) => prev.filter((p) => p !== url))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const supabase = createClient()
    if (!supabase) {
      setError('Supabase is not connected yet.')
      setSaving(false)
      return
    }
    const payload = {
      title,
      category,
      brand: brand || null,
      price: parseFloat(price),
      currency,
      price_firm: priceFirm,
      featured,
      condition,
      location,
      status,
      specs: specsText.split(',').map((s) => s.trim()).filter(Boolean),
      description: description || null,
      photos,
    }

    const result = existing
      ? await supabase.from('listings').update(payload).eq('id', existing.id)
      : await supabase.from('listings').insert(payload)

    setSaving(false)
    if (result.error) {
      setError(result.error.message)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="mb-5">
        <label className="block font-mono text-xs text-[var(--ash-dim)] mb-2 uppercase">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required
          className="w-full bg-[var(--panel)] border border-[var(--line)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--magenta)]" />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block font-mono text-xs text-[var(--ash-dim)] mb-2 uppercase">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as ListingCategory)}
            className="w-full bg-[var(--panel)] border border-[var(--line)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--magenta)]">
            <option value="laptop">Laptop</option>
            <option value="console">Console</option>
            <option value="ram">RAM</option>
            <option value="ssd">SSD</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block font-mono text-xs text-[var(--ash-dim)] mb-2 uppercase">Brand</label>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Asus, HP, Acer..."
            className="w-full bg-[var(--panel)] border border-[var(--line)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--magenta)]" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5">
        <div>
          <label className="block font-mono text-xs text-[var(--ash-dim)] mb-2 uppercase">Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required
            className="w-full bg-[var(--panel)] border border-[var(--line)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--magenta)]" />
        </div>
        <div>
          <label className="block font-mono text-xs text-[var(--ash-dim)] mb-2 uppercase">Currency</label>
          <input value={currency} onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-[var(--panel)] border border-[var(--line)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--magenta)]" />
        </div>
        <div className="flex items-end pb-3.5 gap-5">
          <label className="flex items-center gap-2 text-sm font-mono">
            <input type="checkbox" checked={priceFirm} onChange={(e) => setPriceFirm(e.target.checked)} />
            Firm price
          </label>
          <label className="flex items-center gap-2 text-sm font-mono" title="Show this listing in the homepage hero panel">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block font-mono text-xs text-[var(--ash-dim)] mb-2 uppercase">Condition</label>
          <input value={condition} onChange={(e) => setCondition(e.target.value)}
            className="w-full bg-[var(--panel)] border border-[var(--line)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--magenta)]" />
        </div>
        <div>
          <label className="block font-mono text-xs text-[var(--ash-dim)] mb-2 uppercase">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as ListingStatus)}
            className="w-full bg-[var(--panel)] border border-[var(--line)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--magenta)]">
            <option value="available">Available</option>
            <option value="limited">Limited stock</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      <div className="mb-5">
        <label className="block font-mono text-xs text-[var(--ash-dim)] mb-2 uppercase">Location</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-[var(--panel)] border border-[var(--line)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--magenta)]" />
      </div>

      <div className="mb-5">
        <label className="block font-mono text-xs text-[var(--ash-dim)] mb-2 uppercase">Specs (comma-separated)</label>
        <input value={specsText} onChange={(e) => setSpecsText(e.target.value)} placeholder="Ryzen 9 5900HS, RTX 3070 8GB, 16GB DDR4, 1TB NVMe"
          className="w-full bg-[var(--panel)] border border-[var(--line)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--magenta)]" />
      </div>

      <div className="mb-5">
        <label className="block font-mono text-xs text-[var(--ash-dim)] mb-2 uppercase">Description (optional)</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
          className="w-full bg-[var(--panel)] border border-[var(--line)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--magenta)]" />
      </div>

      <div className="mb-7">
        <label className="block font-mono text-xs text-[var(--ash-dim)] mb-2 uppercase">Photos</label>
        <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="text-sm mb-3" />
        {uploading && <p className="font-mono text-xs text-[var(--ash-dim)] mb-3">Uploading…</p>}
        {photos.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {photos.map((url) => (
              <div key={url} className="relative aspect-square bg-[var(--panel)] border border-[var(--line)] group">
                <Image src={url} alt="" fill className="object-cover" sizes="(max-width: 640px) 25vw, 150px" />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  aria-label="Remove photo"
                  className="absolute top-1 right-1 bg-black/70 text-white text-xs w-6 h-6 flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-[var(--warn)] text-xs mb-4 font-mono">{error}</p>}

      <button type="submit" disabled={saving}
        className="gradient-bg text-white font-display font-semibold text-sm px-6 py-3.5 facet-btn disabled:opacity-60">
        {saving ? 'Saving…' : existing ? 'Save changes' : 'Create listing'}
      </button>
    </form>
  )
}
