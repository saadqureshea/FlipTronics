'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '@/components/Logo'

export type FeaturedItem = {
  id: string
  title: string
  price: number
  currency: string
  category: string
  brand: string | null
  condition: string
  status: string
  photo: string | null
}

const ROTATE_MS = 5500

const statusStyles: Record<string, string> = {
  available: 'text-[var(--signal)] border-[var(--signal)]/60',
  limited: 'text-[var(--warn)] border-[var(--warn)]/60',
  sold: 'text-white border-white/40',
}

const statusLabel: Record<string, string> = {
  available: 'In stock',
  limited: 'Limited stock',
  sold: 'Sold',
}

export default function FeaturedPanel({
  items,
  label = 'Featured',
}: {
  items: FeaturedItem[]
  /** "Featured" when items are genuinely flagged; "Latest drop" for the fallback. */
  label?: string
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (items.length < 2 || paused) return
    // Users who prefer reduced motion get a static panel rather than a carousel.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [items.length, paused])

  if (items.length === 0) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <Logo className="w-[46%] h-[46%] relative drop-shadow-[0_0_60px_rgba(240,20,176,0.35)]" />
      </div>
    )
  }

  const current = items[index]

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {items.map((item, i) =>
        item.photo ? (
          <Image
            key={item.id}
            src={item.photo}
            alt={item.title}
            fill
            priority={i === 0}
            aria-hidden={i !== index}
            className={`object-cover transition-opacity duration-700 ease-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null
      )}

      {!current.photo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Logo className="w-[46%] h-[46%] drop-shadow-[0_0_60px_rgba(240,20,176,0.35)]" />
        </div>
      )}

      {/* Scrim so the overlaid text stays readable over any photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />

      <span
        className={`absolute top-4 left-4 z-10 font-mono text-[10.5px] uppercase tracking-wide px-2.5 py-1 border backdrop-blur-sm bg-black/75 ${
          statusStyles[current.status] ?? statusStyles.available
        }`}
      >
        {statusLabel[current.status] ?? current.status}
      </span>

      {/* Brand stays present alongside the product rather than ahead of it */}
      <Logo className="absolute top-4 right-4 z-10 w-6 h-6 opacity-70" />

      <Link
        href={`/listing/${current.id}`}
        className="group absolute inset-0 z-10 flex flex-col justify-end p-6 focus-visible:outline-2 focus-visible:outline-[var(--magenta)] focus-visible:outline-offset-[-4px]"
      >
        <div key={current.id} className="enter" style={{ '--enter-delay': '0ms' } as React.CSSProperties}>
          <div className="font-mono text-[11px] text-[var(--ash)] uppercase mb-1.5">
            {label} · {current.category}
            {current.brand ? ` · ${current.brand}` : ''}
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight mb-2 text-white">
            {current.title}
          </h2>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-mono text-xs text-[var(--ash)]">{current.currency}</span>
            <span className="font-display text-2xl font-bold text-white tabular-nums">
              {current.price.toLocaleString()}
            </span>
            <span className="font-mono text-[11px] text-[var(--ash)] ml-1">{current.condition}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11.5px] text-white border border-[var(--magenta)] bg-[var(--magenta)]/15 px-3 py-1.5">
            View details
            <span className="transition-transform duration-200 motion-safe:group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>

      {items.length > 1 && (
        <div className="absolute bottom-4 right-4 z-20 flex gap-1.5">
          {items.map((item, i) => (
            <span
              key={item.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-4 bg-[var(--magenta)]' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
