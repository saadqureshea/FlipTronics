'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="border border-[var(--line)] font-display text-sm px-5 py-3 hover:border-[var(--magenta)] transition-colors"
    >
      Sign out
    </button>
  )
}
