import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ListingForm from '@/components/ListingForm'

export default async function NewListingPage() {
  const supabase = await createClient()
  if (!supabase) redirect('/admin')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="min-h-screen px-7 py-10 max-w-[1100px] mx-auto">
      <h1 className="font-display text-2xl font-bold mb-8">Add listing</h1>
      <ListingForm />
    </div>
  )
}
