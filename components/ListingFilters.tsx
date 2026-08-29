'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const sortOptions = [
  { value: '', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
]

export default function ListingFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') ?? '')

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(params.size ? `${pathname}?${params.toString()}` : pathname, { scroll: false })
  }

  // Debounce the search box so we're not navigating on every keystroke.
  useEffect(() => {
    const currentQ = searchParams.get('q') ?? ''
    if (q === currentQ) return
    const handle = setTimeout(() => updateParam('q', q), 350)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search title, brand, specs…"
        className="w-full sm:w-72 bg-[var(--panel)] border border-[var(--line)] px-4 py-2.5 text-sm font-mono placeholder:text-[var(--ash-dim)] focus:outline-none focus:border-[var(--magenta)] transition-colors"
      />
      <select
        value={searchParams.get('sort') ?? ''}
        onChange={(e) => updateParam('sort', e.target.value)}
        aria-label="Sort listings"
        className="bg-[var(--panel)] border border-[var(--line)] px-3 py-2.5 text-xs font-mono uppercase text-[var(--ash)] focus:outline-none focus:border-[var(--magenta)] transition-colors"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
