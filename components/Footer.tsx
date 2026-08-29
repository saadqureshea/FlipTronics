import Link from 'next/link'
import { whatsappLink } from '@/lib/whatsapp'

export default function Footer() {
  return (
    <footer className="px-7 pt-16 pb-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10 pb-9 border-b border-[var(--line)] mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div
                className="w-[34px] h-[34px] gradient-bg"
                style={{ clipPath: 'polygon(0 0, 60% 0, 100% 30%, 100% 100%, 40% 100%, 0 70%)' }}
              />
              <span className="font-display font-bold text-[19px] tracking-wide">
                FLIP<span className="text-[var(--magenta)]">TRONICS</span>
              </span>
            </div>
            <p className="text-[var(--ash-dim)] text-[13px] mt-4 max-w-[280px] leading-relaxed">
              Fresh drops for gamers &amp; power users. Limited pieces, first come first served.
            </p>
          </div>
          <div className="flex gap-10">
            <div>
              <h5 className="font-mono text-[11px] text-[var(--ash-dim)] uppercase tracking-wide mb-3.5">Shop</h5>
              <Link href="/?category=laptop" className="block text-[13.5px] text-[var(--ash)] hover:text-white mb-2.5">Laptops</Link>
              <Link href="/?category=console" className="block text-[13.5px] text-[var(--ash)] hover:text-white mb-2.5">Consoles</Link>
              <Link href="/?category=ram" className="block text-[13.5px] text-[var(--ash)] hover:text-white mb-2.5">RAM &amp; SSD</Link>
            </div>
            <div>
              <h5 className="font-mono text-[11px] text-[var(--ash-dim)] uppercase tracking-wide mb-3.5">Contact</h5>
              <a
                href={whatsappLink("Hi FlipTronics, I'd like to know more about your current listings")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[13.5px] text-[var(--ash)] hover:text-white mb-2.5"
              >
                <span className="text-[var(--signal)]">●</span> +92 327 9754940
              </a>
              <span className="block text-[13.5px] text-[var(--ash-dim)]">WhatsApp only · Islamabad/Rwp</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between text-[var(--ash-dim)] font-mono text-[11.5px]">
          <span>© {new Date().getFullYear()} FlipTronics</span>
          <span>SERIOUS BUYERS ONLY</span>
        </div>
      </div>
    </footer>
  )
}
