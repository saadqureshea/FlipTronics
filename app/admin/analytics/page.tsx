import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Listing } from '@/lib/types'
import Link from 'next/link'
import ViewsChart, { ViewPoint } from '@/components/ViewsChart'

type Lead = { listing_id: string | null; created_at: string }

const DAYS = 30

function buildDailySeries(leads: Lead[]): ViewPoint[] {
  const counts = new Map<string, number>()
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    counts.set(d.toISOString().slice(0, 10), 0)
  }
  for (const lead of leads) {
    const key = lead.created_at.slice(0, 10)
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return Array.from(counts, ([date, views]) => ({ date, views }))
}

export default async function AnalyticsPage() {
  const supabase = await createClient()

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <p className="text-[var(--ash-dim)] text-sm">Supabase isn&apos;t connected yet.</p>
      </div>
    )
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const since = new Date()
  since.setDate(since.getDate() - DAYS)

  const [{ data: leadRows }, { data: listingRows }] = await Promise.all([
    supabase
      .from('leads')
      .select('listing_id, created_at')
      .gte('created_at', since.toISOString()),
    supabase.from('listings').select('*'),
  ])

  const leads = (leadRows ?? []) as Lead[]
  const listings = (listingRows ?? []) as Listing[]

  const series = buildDailySeries(leads)
  const totalViews = leads.length

  const titleById = new Map(listings.map((l) => [l.id, l.title]))
  const perListing = new Map<string, number>()
  for (const lead of leads) {
    if (!lead.listing_id) continue
    perListing.set(lead.listing_id, (perListing.get(lead.listing_id) ?? 0) + 1)
  }
  const ranked = Array.from(perListing, ([id, views]) => ({
    id,
    title: titleById.get(id) ?? 'Deleted listing',
    views,
  })).sort((a, b) => b.views - a.views)

  const busiest = series.reduce((max, p) => (p.views > max.views ? p : max), series[0])

  return (
    <div className="min-h-screen px-4 sm:px-7 py-8 sm:py-10 max-w-[1100px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold">Analytics</h1>
          <p className="font-mono text-xs text-[var(--ash-dim)] mt-1">Last {DAYS} days</p>
        </div>
        <Link
          href="/admin"
          className="font-mono text-xs text-[var(--ash-dim)] hover:text-[var(--magenta)] transition-colors"
        >
          ← Back to listings
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="border border-[var(--line)] bg-[var(--panel)] p-4">
          <div className="font-mono text-[11px] text-[var(--ash-dim)] uppercase mb-1.5">Total views</div>
          <div className="font-display text-2xl font-bold">{totalViews}</div>
        </div>
        <div className="border border-[var(--line)] bg-[var(--panel)] p-4">
          <div className="font-mono text-[11px] text-[var(--ash-dim)] uppercase mb-1.5">Listings viewed</div>
          <div className="font-display text-2xl font-bold">{ranked.length}</div>
        </div>
        <div className="border border-[var(--line)] bg-[var(--panel)] p-4">
          <div className="font-mono text-[11px] text-[var(--ash-dim)] uppercase mb-1.5">Busiest day</div>
          <div className="font-display text-2xl font-bold">{busiest?.views ?? 0}</div>
          <div className="font-mono text-[10px] text-[var(--ash-dim)] mt-0.5">{busiest?.date ?? '—'}</div>
        </div>
      </div>

      <div className="border border-[var(--line)] bg-[var(--panel)] p-4 mb-8">
        <h2 className="font-mono text-[11px] text-[var(--ash-dim)] uppercase mb-4 tracking-wide">
          Views per day
        </h2>
        {totalViews === 0 ? (
          <p className="text-[var(--ash-dim)] text-sm py-10 text-center">
            No views logged yet — they&apos;ll appear here as people browse your listings.
          </p>
        ) : (
          <ViewsChart data={series} />
        )}
      </div>

      <div className="border border-[var(--line)] bg-[var(--panel)] p-4">
        <h2 className="font-mono text-[11px] text-[var(--ash-dim)] uppercase mb-4 tracking-wide">
          Most viewed listings
        </h2>
        {ranked.length === 0 ? (
          <p className="text-[var(--ash-dim)] text-sm py-6 text-center">Nothing to rank yet.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {ranked.map((row) => (
              <div key={row.id} className="flex items-center gap-3">
                <Link
                  href={`/listing/${row.id}`}
                  className="text-sm hover:text-[var(--magenta)] transition-colors shrink-0 w-40 sm:w-56 truncate"
                >
                  {row.title}
                </Link>
                <div className="flex-1 h-2 bg-[var(--panel-2)] overflow-hidden">
                  <div
                    className="h-full gradient-bg"
                    style={{ width: `${(row.views / ranked[0].views) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-[var(--ash)] w-8 text-right tabular-nums">
                  {row.views}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
