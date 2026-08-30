import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Listing } from '@/lib/types'
import { mockListings } from '@/lib/mock-listings'
import FeaturedPanel, { FeaturedItem } from '@/components/FeaturedPanel'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ListingFilters from '@/components/ListingFilters'
import ListingsGrid from '@/components/ListingsGrid'
import ListingsSkeleton from '@/components/ListingsSkeleton'
import { whatsappLink } from '@/lib/whatsapp'
import Link from 'next/link'

const categories = [
  { label: 'All', value: '' },
  { label: 'Laptops', value: 'laptop' },
  { label: 'Consoles', value: 'console' },
  { label: 'RAM', value: 'ram' },
  { label: 'SSD', value: 'ssd' },
]

async function getLiveCount() {
  const supabase = await createClient()
  if (!supabase) return mockListings.length
  const { count } = await supabase
    .from('listings')
    .select('id', { count: 'exact', head: true })
    .neq('status', 'sold')
  return count ?? 0
}

function toFeatured(l: Listing): FeaturedItem {
  return {
    id: l.id,
    title: l.title,
    price: l.price,
    currency: l.currency,
    category: l.category,
    brand: l.brand,
    condition: l.condition,
    status: l.status,
    photo: l.photos?.[0] ?? null,
  }
}

/**
 * Hero panel content: whatever is flagged `featured`, falling back to the
 * newest live listing so the panel always shows real stock. Returns an empty
 * array only when there's nothing listed at all, which drops back to the logo.
 */
async function getFeatured(): Promise<{ items: FeaturedItem[]; label: string }> {
  const supabase = await createClient()

  if (!supabase) {
    const flagged = mockListings.filter((l) => l.featured)
    return flagged.length
      ? { items: flagged.map(toFeatured), label: 'Featured' }
      : { items: mockListings.slice(0, 1).map(toFeatured), label: 'Latest drop' }
  }

  const { data: flagged } = await supabase
    .from('listings')
    .select('*')
    .eq('featured', true)
    .neq('status', 'sold')
    .order('created_at', { ascending: false })

  if (flagged?.length) {
    return { items: (flagged as Listing[]).map(toFeatured), label: 'Featured' }
  }

  const { data: newest } = await supabase
    .from('listings')
    .select('*')
    .neq('status', 'sold')
    .order('created_at', { ascending: false })
    .limit(1)

  return { items: ((newest ?? []) as Listing[]).map(toFeatured), label: 'Latest drop' }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>
}) {
  const { category, sort, q } = await searchParams
  const [liveCount, featured] = await Promise.all([getLiveCount(), getFeatured()])

  return (
    <>
      <Header />

      <section className="max-w-[1200px] mx-auto px-7 pt-16 pb-14 grid md:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
        <div>
          <div
            className="enter inline-flex items-center gap-2 font-mono text-xs tracking-wider text-[var(--magenta)] uppercase border border-[var(--line)] px-3 py-1.5 mb-6"
            style={{ '--enter-delay': '60ms' } as React.CSSProperties}
          >
            <span className="signal-dot w-1.5 h-1.5 rounded-full bg-[var(--signal)] shadow-[0_0_8px_var(--signal)]" />
            Live drop · Limited pieces
          </div>
          <h1
            className="enter font-display font-bold text-4xl md:text-[52px] leading-[1.05] tracking-tight mb-6"
            style={{ '--enter-delay': '140ms' } as React.CSSProperties}
          >
            Flipped gear for<br /><span className="gradient-text">gamers &amp; builders.</span>
          </h1>
          <p
            className="enter text-[var(--ash)] text-[16.5px] leading-relaxed max-w-[460px] mb-8"
            style={{ '--enter-delay': '220ms' } as React.CSSProperties}
          >
            Clean-condition laptops, consoles, RAM and SSDs, sold direct. First come, first served — serious buyers only.
          </p>
          <div
            className="enter flex gap-3.5 items-center"
            style={{ '--enter-delay': '300ms' } as React.CSSProperties}
          >
            <a href="#listings" className="gradient-bg text-white font-display font-semibold text-[14.5px] px-6 py-4 facet-btn">
              Browse the drop
            </a>
            <a
              href={whatsappLink("Hi FlipTronics, I'd like to know more about your current listings")}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[var(--line)] font-display font-semibold text-[14.5px] px-6 py-3.5"
            >
              Chat on WhatsApp
            </a>
          </div>
          <div
            className="enter flex gap-7 mt-10"
            style={{ '--enter-delay': '380ms' } as React.CSSProperties}
          >
            <div>
              <div className="font-mono text-xl font-semibold">{liveCount.toString().padStart(2, '0')}</div>
              <div className="text-xs text-[var(--ash-dim)] mt-1">Live listings</div>
            </div>
            <div>
              <div className="font-mono text-xl font-semibold">100%</div>
              <div className="text-xs text-[var(--ash-dim)] mt-1">Inspected stock</div>
            </div>
            <div>
              <div className="font-mono text-xl font-semibold">ISB</div>
              <div className="text-xs text-[var(--ash-dim)] mt-1">Islamabad / Rwp</div>
            </div>
          </div>
        </div>

        <div
          className="enter-panel relative aspect-[1/1.05] bg-[var(--panel)] border border-[var(--line)] facet-hero flex items-center justify-center overflow-hidden"
          style={{ '--enter-delay': '180ms' } as React.CSSProperties}
        >
          <div
            className="hero-glow absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 30% 20%, rgba(109,31,201,0.35), transparent 55%), radial-gradient(circle at 75% 80%, rgba(240,20,176,0.3), transparent 55%)',
            }}
          />
          <FeaturedPanel items={featured.items} label={featured.label} />
        </div>
      </section>

      <section id="listings" className="max-w-[1200px] mx-auto px-7">
        <div
          className="enter flex justify-between items-end mb-6"
          style={{ '--enter-delay': '460ms' } as React.CSSProperties}
        >
          <h2 className="font-display text-2xl font-semibold">Current drop</h2>
        </div>

        <div
          className="enter flex gap-2.5 flex-wrap mb-6"
          style={{ '--enter-delay': '520ms' } as React.CSSProperties}
        >
          {categories.map((c) => (
            <Link
              key={c.value}
              href={c.value ? `/?category=${c.value}` : '/'}
              className={`font-mono text-[12.5px] border px-4 py-2 transition-all duration-200 ${
                (category ?? '') === c.value
                  ? 'text-white border-[var(--magenta)] bg-[var(--magenta)]/10'
                  : 'text-[var(--ash)] border-[var(--line)] hover:text-white hover:border-[var(--magenta)]'
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>

        <Suspense fallback={null}>
          <ListingFilters />
        </Suspense>

        <Suspense key={`${category ?? ''}-${sort ?? ''}-${q ?? ''}`} fallback={<ListingsSkeleton />}>
          <ListingsGrid category={category} sort={sort} q={q} />
        </Suspense>
      </section>

      <Footer />
    </>
  )
}
