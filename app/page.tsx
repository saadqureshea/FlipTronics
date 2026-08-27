import { createClient } from '@/lib/supabase/server'
import { Listing } from '@/lib/types'
import { mockListings } from '@/lib/mock-listings'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ListingCard from '@/components/ListingCard'
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

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()

  let items: Listing[]

  if (supabase) {
    let query = supabase.from('listings').select('*').neq('status', 'sold').order('created_at', { ascending: false })
    if (category) query = query.eq('category', category)
    const { data } = await query
    items = (data ?? []) as Listing[]
  } else {
    // Supabase not connected yet — show real listing data baked into the site so it's never blank
    items = category ? mockListings.filter((l) => l.category === category) : mockListings
  }

  return (
    <>
      <Header />

      <section className="max-w-[1200px] mx-auto px-7 pt-16 pb-14 grid md:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-[var(--magenta)] uppercase border border-[var(--line)] px-3 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] shadow-[0_0_8px_var(--signal)]" />
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
              <div className="font-mono text-xl font-semibold">{items.length.toString().padStart(2, '0')}</div>
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
            className="absolute inset-0"
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
          <div>
            <h2 className="font-display text-2xl font-semibold">Current drop</h2>
            <div className="font-mono text-xs text-[var(--ash-dim)] mt-1.5">{'// '}{items.length} pieces listed</div>
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap mb-9">
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

        {items.length === 0 ? (
          <div className="border border-dashed border-[var(--line)] py-20 text-center mb-20">
            <p className="font-display text-lg mb-2">No listings here yet.</p>
            <p className="text-[var(--ash-dim)] text-sm">Add your first one from the admin panel.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
            {items.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  )
}
