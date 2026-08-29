'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ListingGallery({ photos, title }: { photos: string[]; title: string }) {
  const [index, setIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const hasPhotos = photos.length > 0

  function goTo(i: number) {
    if (!hasPhotos) return
    setIndex((i + photos.length) % photos.length)
  }

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX)
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX
    const threshold = 40
    if (deltaX > threshold) goTo(index - 1)
    else if (deltaX < -threshold) goTo(index + 1)
    setTouchStartX(null)
  }

  return (
    <div>
      <div
        className="relative aspect-[4/3] bg-[var(--panel)] border border-[var(--line)] facet-card overflow-hidden mb-4 select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {hasPhotos ? (
          photos.map((photo, i) => (
            <Image
              key={photo}
              src={photo}
              alt={title}
              fill
              aria-hidden={i !== index}
              className={`object-cover transition-opacity duration-300 ease-out ${
                i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              priority={i === 0}
            />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display text-[var(--ash-dim)]">
            No photo yet
          </div>
        )}

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/55 text-white text-lg hover:bg-black/75 transition-colors"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/55 text-white text-lg hover:bg-black/75 transition-colors"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === index ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {photos.map((photo, i) => (
            <button
              type="button"
              key={i}
              onClick={() => goTo(i)}
              aria-label={`View photo ${i + 1}`}
              className={`relative aspect-square bg-[var(--panel)] border overflow-hidden transition-colors ${
                i === index ? 'border-[var(--magenta)]' : 'border-[var(--line)] hover:border-[var(--ash-dim)]'
              }`}
            >
              <Image src={photo} alt={`${title} photo ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
