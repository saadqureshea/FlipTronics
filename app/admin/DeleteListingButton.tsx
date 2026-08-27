'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DeleteListingButton({ id }: { id: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Delete this listing? This cannot be undone.')) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('listings').delete().eq('id', id)
    router.refresh()
  }

  return (
    <button onClick={handleDelete} className="font-mono text-xs text-[var(--ash-dim)] hover:text-[var(--warn)]">
      Delete
    </button>
  )
}
