import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Listing } from '@/lib/types'
import Link from 'next/link'
import DeleteListingButton from './DeleteListingButton'
import SignOutButton from './SignOutButton'

export default async function AdminDashboard() {
  const supabase = await createClient()

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-display text-xl font-bold mb-3">Supabase isn&apos;t connected yet</h1>
          <p className="text-[var(--ash-dim)] text-sm max-w-md">
            Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables
            in Vercel (or .env.local) to enable the admin panel and real listings.
          </p>
        </div>
      </div>
    )
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })

  const items = (listings ?? []) as Listing[]

  return (
    <div className="min-h-screen px-4 sm:px-7 py-8 sm:py-10 max-w-[1100px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-10">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold">Listings</h1>
          <p className="font-mono text-xs text-[var(--ash-dim)] mt-1">{items.length} total</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/analytics"
            className="border border-[var(--line)] font-display font-semibold text-sm px-5 py-3 text-center flex-1 sm:flex-none hover:border-[var(--magenta)] transition-colors"
          >
            Analytics
          </Link>
          <Link
            href="/admin/listings/new"
            className="gradient-bg text-white font-display font-semibold text-sm px-5 py-3 facet-btn text-center flex-1 sm:flex-none"
          >
            + Add listing
          </Link>
          <SignOutButton />
        </div>
      </div>

      {items.length === 0 && (
        <div className="border border-[var(--line)] px-5 py-10 text-center text-[var(--ash-dim)] text-sm">
          No listings yet — add your first one.
        </div>
      )}

      {items.length > 0 && (
        <>
          {/* Mobile: stacked cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {items.map((item) => (
              <div key={item.id} className="border border-[var(--line)] p-4">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <span className="font-medium text-sm leading-snug">{item.title}</span>
                  <span className="font-mono text-xs text-[var(--ash-dim)] capitalize shrink-0">{item.status}</span>
                </div>
                <div className="flex justify-between items-center font-mono text-xs text-[var(--ash-dim)] mb-4">
                  <span className="capitalize">{item.category}</span>
                  <span>{item.currency} {item.price.toLocaleString()}</span>
                </div>
                <div className="flex gap-4 pt-3 border-t border-[var(--line)]">
                  <Link href={`/admin/listings/${item.id}`} className="font-mono text-xs text-[var(--magenta)]">
                    Edit
                  </Link>
                  <DeleteListingButton id={item.id} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block border border-[var(--line)]">
            <div className="grid grid-cols-[1fr_120px_100px_100px_140px] gap-4 px-5 py-3 border-b border-[var(--line)] font-mono text-[11px] text-[var(--ash-dim)] uppercase">
              <span>Title</span>
              <span>Price</span>
              <span>Status</span>
              <span>Category</span>
              <span></span>
            </div>
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_120px_100px_100px_140px] gap-4 px-5 py-4 border-b border-[var(--line)] items-center text-sm">
                <span className="font-medium">{item.title}</span>
                <span className="font-mono text-xs">{item.currency} {item.price.toLocaleString()}</span>
                <span className="font-mono text-xs capitalize">{item.status}</span>
                <span className="font-mono text-xs capitalize">{item.category}</span>
                <div className="flex gap-3 justify-end">
                  <Link href={`/admin/listings/${item.id}`} className="font-mono text-xs text-[var(--magenta)] hover:underline">
                    Edit
                  </Link>
                  <DeleteListingButton id={item.id} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
