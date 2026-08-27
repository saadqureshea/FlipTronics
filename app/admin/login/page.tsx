'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    if (!supabase) {
      setError('Supabase is not connected yet. Add your environment variables first.')
      setLoading(false)
      return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-[var(--panel)] border border-[var(--line)] p-8 facet-card">
        <div className="flex items-center gap-2.5 mb-8">
          <div
            className="w-[30px] h-[30px] gradient-bg"
            style={{ clipPath: 'polygon(0 0, 60% 0, 100% 30%, 100% 100%, 40% 100%, 0 70%)' }}
          />
          <span className="font-display font-bold text-[17px]">
            FLIP<span className="text-[var(--magenta)]">TRONICS</span> <span className="text-[var(--ash-dim)] font-normal text-sm">admin</span>
          </span>
        </div>

        <label className="block font-mono text-xs text-[var(--ash-dim)] mb-2 uppercase">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-[var(--void)] border border-[var(--line)] px-4 py-3 mb-5 text-sm focus:outline-none focus:border-[var(--magenta)]"
        />

        <label className="block font-mono text-xs text-[var(--ash-dim)] mb-2 uppercase">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-[var(--void)] border border-[var(--line)] px-4 py-3 mb-6 text-sm focus:outline-none focus:border-[var(--magenta)]"
        />

        {error && <p className="text-[var(--warn)] text-xs mb-4 font-mono">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full gradient-bg text-white font-display font-semibold text-sm py-3.5 facet-btn disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
