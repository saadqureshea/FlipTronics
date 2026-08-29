import { createClient } from '@/lib/supabase/server'
import { Listing } from '@/lib/types'
import { mockListings } from '@/lib/mock-listings'
import ListingCard from './ListingCard'

type SortValue = 'price_asc' | 'price_desc' | ''

function sortItems(items: Listing[], sort: SortValue) {
  const sorted = [...items]
  if (sort === 'price_asc') sorted.sort((a, b) => a.price - b.price)
  else if (sort === 'price_desc') sorted.sort((a, b) => b.price - a.price)
  else sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  return sorted
}

function matchesQuery(item: Listing, q: string) {
  const needle = q.toLowerCase()
  return (
    item.title.toLowerCase().includes(needle) ||
    (item.brand?.toLowerCase().includes(needle) ?? false) ||
    item.specs.some((s) => s.toLowerCase().includes(needle))
  )
}

export default async function ListingsGrid({
  category,
  sort,
  q,
}: {
  category?: string
  sort?: string
  q?: string
}) {
  const supabase = await createClient()

  let active: Listing[]
  let sold: Listing[] = []

  if (supabase) {
    let query = supabase.from('listings').select('*').neq('status', 'sold')
    if (category) query = query.eq('category', category)
    const { data } = await query
    active = (data ?? []) as Listing[]

    const { data: soldData } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'sold')
      .order('updated_at', { ascending: false })
      .limit(6)
    sold = (soldData ?? []) as Listing[]
  } else {
    // Supabase not connected yet — show real listing data baked into the site so it's never blank
    active = category ? mockListings.filter((l) => l.category === category) : mockListings
  }

  if (q) active = active.filter((item) => matchesQuery(item, q))
  active = sortItems(active, (sort as SortValue) ?? '')

  return (
    <>
      <div className="font-mono text-xs text-[var(--ash-dim)] mb-6 -mt-3">
        {'// '}
        {active.length} piece{active.length === 1 ? '' : 's'} listed
      </div>

      {active.length === 0 ? (
        <div className="border border-dashed border-[var(--line)] py-20 text-center mb-16">
          <p className="font-display text-lg mb-2">{q ? 'No matches.' : 'No listings here yet.'}</p>
          <p className="text-[var(--ash-dim)] text-sm">
            {q ? 'Try a different search term.' : 'Add your first one from the admin panel.'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {active.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {sold.length > 0 && (
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="font-display text-lg font-semibold text-[var(--ash)]">Recently sold</h3>
            <div className="h-px flex-1 bg-[var(--line)]" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-55">
            {sold.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
