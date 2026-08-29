import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { mockListings } from '@/lib/mock-listings'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ListingFilters from '@/components/ListingFilters'
import ListingsGrid from '@/components/ListingsGrid'
import ListingsSkeleton from '@/components/ListingsSkeleton'
import { whatsappLink } from '@/lib/whatsapp'
import Link from 'next/link'
import Logo from '@/components/Logo'

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

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>
}) {
  const { category, sort, q } = await searchParams
  const liveCount = await getLiveCount()

  return (
    <>
      <Header />

      <section className="max-w-[1200px] mx-auto px-7 pt-16 pb-14 grid md:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-[var(--magenta)] uppercase border border-[var(--line)] px-3 py-1.5 mb-6">
            <span className="signal-dot w-1.5 h-1.5 rounded-full bg-[var(--signal)] shadow-[0_0_8px_var(--signal)]" />
            Live drop · Limited pieces
          </div>
          <h1 className="font-display font-bold text-4xl md:text-[52px] leading-[1.05] tracking-tight mb-6">
            Flipped gear for<br /><span className="gradient-text">gamers &amp; builders.</span>
          </h1>
          <p className="text-[var(--ash)] text-[16.5px] leading-relaxed max-w-[460px] mb-8">
            Clean-condition laptops, consoles, RAM and SSDs, sold direct. First come, first served — serious buyers only.
          </p>
          <div className="flex gap-3.5 items-center">
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
          <div className="flex gap-7 mt-10">
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

        <div className="relative aspect-[1/1.05] bg-[var(--panel)] border border-[var(--line)] facet-hero flex items-center justify-center overflow-hidden">
          <div
            className="hero-glow absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 30% 20%, rgba(109,31,201,0.35), transparent 55%), radial-gradient(circle at 75% 80%, rgba(240,20,176,0.3), transparent 55%)',
            }}
          />
          <Logo className="w-[46%] h-[46%] relative drop-shadow-[0_0_60px_rgba(240,20,176,0.35)]" />
        </div>
      </section>

      <section id="listings" className="max-w-[1200px] mx-auto px-7">
        <div className="flex justify-between items-end mb-6">
          <h2 className="font-display text-2xl font-semibold">Current drop</h2>
        </div>

        <div className="flex gap-2.5 flex-wrap mb-6">
          {categories.map((c) => (
            <Link
              key={c.value}
              href={c.value ? `/?category=${c.value}` : '/'}
              className={`font-mono text-[12.5px] border px-4 py-2 transition-colors ${
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
