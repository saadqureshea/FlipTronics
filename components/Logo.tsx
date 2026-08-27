export default function Logo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--violet)" />
          <stop offset="100%" stopColor="var(--magenta)" />
        </linearGradient>
      </defs>
      <polygon
        fill="url(#logoGrad)"
        points="18,14 72,14 84,26 84,30 34,30 34,44 58,44 66,52 66,58 34,58 34,86 18,86"
      />
    </svg>
  )
}
