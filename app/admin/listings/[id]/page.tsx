import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ListingForm from '@/components/ListingForm'
import { Listing } from '@/lib/types'

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  if (!supabase) redirect('/admin')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: listing } = await supabase.from('listings').select('*').eq('id', id).single()
  if (!listing) notFound()

  return (
    <div className="min-h-screen px-7 py-10 max-w-[1100px] mx-auto">
      <h1 className="font-display text-2xl font-bold mb-8">Edit listing</h1>
      <ListingForm existing={listing as Listing} />
    </div>
  )
}
