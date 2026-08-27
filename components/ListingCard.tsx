import Link from 'next/link'
import Image from 'next/image'
import { Listing } from '@/lib/types'
import { listingWhatsappLink } from '@/lib/whatsapp'

const statusStyles: Record<string, string> = {
  available: 'text-[var(--signal)] border-[var(--signal)]/35 bg-[var(--signal)]/10',
  limited: 'text-[var(--warn)] border-[var(--warn)]/40 bg-[var(--warn)]/15',
  sold: 'text-[var(--ash-dim)] border-[var(--ash-dim)]/30 bg-white/5',
}

const statusLabel: Record<string, string> = {
  available: 'In stock',
  limited: 'Limited',
  sold: 'Sold',
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const photo = listing.photos?.[0]

  return (
    <div className="facet-card bg-[var(--panel)] border border-[var(--line)] overflow-hidden transition-transform hover:-translate-y-1 hover:border-[var(--magenta)]">
      <Link href={`/listing/${listing.id}`}>
        <div className="relative aspect-[4/3] bg-[var(--panel-2)] flex items-center justify-center">
          {photo ? (
            <Image src={photo} alt={listing.title} fill className="object-cover" />
          ) : (
            <span className="font-display text-[var(--ash-dim)] text-sm">No photo yet</span>
          )}
          <span
            className={`absolute top-3 left-3 font-mono text-[10.5px] uppercase tracking-wide px-2.5 py-1 border ${statusStyles[listing.status]}`}
          >
            {listing.status === 'limited' ? 'Limited stock' : statusLabel[listing.status]}
          </span>
          {listing.location && (
            <span className="absolute bottom-3 left-3 font-mono text-[10.5px] text-white bg-black/55 px-2.5 py-1">
              📍 {listing.location}
            </span>
          )}
        </div>
      </Link>

      <div className="p-5">
        <div className="font-mono text-[11px] text-[var(--ash-dim)] mb-1.5 uppercase">
          {listing.category} {listing.brand ? `· ${listing.brand}` : ''}
        </div>
        <Link href={`/listing/${listing.id}`}>
          <h3 className="font-display text-[17px] font-semibold mb-2.5 leading-snug hover:text-[var(--magenta)] transition-colors">
            {listing.title}
          </h3>
        </Link>
        <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 font-mono text-xs text-[var(--ash)] mb-4">
          {listing.specs.map((spec, i) => (
            <span key={i} className={i < listing.specs.length - 1 ? "after:content-['·'] after:ml-2.5 after:text-[var(--ash-dim)]" : ''}>
              {spec}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div className="font-display text-[19px] font-bold">
            <span className="font-mono text-xs text-[var(--ash-dim)] mr-1">{listing.currency}</span>
            {listing.price.toLocaleString()}
            {listing.price_firm && (
              <span className="font-mono text-[10px] text-[var(--warn)] ml-1.5 align-middle">FIRM</span>
            )}
          </div>
          <a
            href={listingWhatsappLink(listing.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 border border-[var(--magenta)] font-mono text-[11.5px] px-3 py-2 hover:bg-[var(--magenta)]/10 transition-colors"
          >
            WhatsApp →
          </a>
        </div>
      </div>
    </div>
  )
}
