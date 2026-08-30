'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Drop-in replacement for @visx/responsive's ParentSize.
 *
 * The version bklit pins (@visx/responsive@4.0.1-alpha.0) reports 0x0 under
 * React 19 / Next 16, which makes every chart render nothing (the chart shell
 * bails out when width or height is under 10px). This measures the container
 * directly with a ResizeObserver instead.
 */
export function ParentSize({
  children,
  className,
}: {
  children: (size: { width: number; height: number }) => ReactNode
  /** Accepted for API compatibility with @visx/responsive; unused. */
  debounceTime?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      const rect = el.getBoundingClientRect()
      setSize((prev) =>
        prev.width === rect.width && prev.height === rect.height
          ? prev
          : { width: rect.width, height: rect.height }
      )
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className} style={{ width: '100%', height: '100%' }}>
      {size.width > 0 && size.height > 0 ? children(size) : null}
    </div>
  )
}
