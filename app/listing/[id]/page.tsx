import { createClient } from '@/lib/supabase/server'
import { Listing } from '@/lib/types'
import { mockListings } from '@/lib/mock-listings'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ListingGallery from '@/components/ListingGallery'
import { listingWhatsappLink } from '@/lib/whatsapp'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  let item: Listing | undefined

  if (supabase) {
    const { data } = await supabase.from('listings').select('*').eq('id', id).single()
    if (!data) notFound()
    item = data as Listing
    // fire-and-forget lead log — doesn't block the page
    supabase.from('leads').insert({ listing_id: item.id, source: 'page_view' }).then(() => {})
  } else {
    item = mockListings.find((l) => l.id === id)
    if (!item) notFound()
  }

  return (
    <>
      <Header />
      <section className="max-w-[1100px] mx-auto px-7 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--ash-dim)] hover:text-[var(--magenta)] transition-colors"
        >
          ← Back to listings
        </Link>
      </section>
      <section className="max-w-[1100px] mx-auto px-7 pt-6 pb-14 grid md:grid-cols-2 gap-12">
        <div>
          <ListingGallery photos={item.photos ?? []} title={item.title} />
        </div>

        <div>
          <div className="font-mono text-xs text-[var(--ash-dim)] uppercase mb-2">
            {item.category} {item.brand ? `· ${item.brand}` : ''}
          </div>
          <h1 className="font-display text-3xl font-bold mb-4">{item.title}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[11px] uppercase px-2.5 py-1 border border-[var(--signal)]/35 bg-[var(--signal)]/10 text-[var(--signal)]">
              {item.condition}
            </span>
            {item.location && (
              <span className="font-mono text-[11px] text-[var(--ash-dim)]">📍 {item.location}</span>
            )}
          </div>

          <div className="font-display text-3xl font-bold mb-6">
            <span className="font-mono text-sm text-[var(--ash-dim)] mr-1.5">{item.currency}</span>
            {item.price.toLocaleString()}
            {item.price_firm && <span className="font-mono text-xs text-[var(--warn)] ml-2 align-middle">FIRM</span>}
          </div>

          <div className="border-t border-[var(--line)] pt-6 mb-6">
            <h3 className="font-mono text-[11px] text-[var(--ash-dim)] uppercase mb-3 tracking-wide">Specs</h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 font-mono text-sm text-[var(--ash)]">
              {item.specs.map((spec, i) => (
                <div key={i}>{spec}</div>
              ))}
            </div>
          </div>

          {item.description && (
            <div className="border-t border-[var(--line)] pt-6 mb-8">
              <h3 className="font-mono text-[11px] text-[var(--ash-dim)] uppercase mb-3 tracking-wide">Details</h3>
              <p className="text-[var(--ash)] text-sm leading-relaxed whitespace-pre-line">{item.description}</p>
            </div>
          )}

          <a
            href={listingWhatsappLink(item)}
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-bg text-white font-display font-semibold text-[15px] px-7 py-4 facet-btn inline-block"
          >
            Message on WhatsApp →
          </a>
        </div>
      </section>
      <Footer />
    </>
  )
}
