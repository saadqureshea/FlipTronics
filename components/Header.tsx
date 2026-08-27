import Link from 'next/link'
import { whatsappLink } from '@/lib/whatsapp'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--void)]/85 backdrop-blur-md border-b border-[var(--line)]">
      <div className="max-w-[1200px] mx-auto px-7 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-[34px] h-[34px] gradient-bg"
            style={{ clipPath: 'polygon(0 0, 60% 0, 100% 30%, 100% 100%, 40% 100%, 0 70%)' }}
          />
          <span className="font-display font-bold text-[19px] tracking-wide">
            FLIP<span className="text-[var(--magenta)]">TRONICS</span>
          </span>
        </Link>

        <nav className="hidden md:flex gap-9">
          <Link href="/" className="text-sm text-[var(--ash)] hover:text-white transition-colors">Drops</Link>
          <Link href="/?category=laptop" className="text-sm text-[var(--ash)] hover:text-white transition-colors">Laptops</Link>
          <Link href="/?category=console" className="text-sm text-[var(--ash)] hover:text-white transition-colors">Consoles</Link>
          <Link href="/?category=ram" className="text-sm text-[var(--ash)] hover:text-white transition-colors">RAM &amp; SSD</Link>
        </nav>

        <a
          href={whatsappLink("Hi FlipTronics, I'd like to know more about your current listings")}
          target="_blank"
          rel="noopener noreferrer"
          className="gradient-bg text-white font-display font-semibold text-[13.5px] px-5 py-2.5 facet-btn"
        >
          Chat on WhatsApp
        </a>
      </div>
    </header>
  )
}
