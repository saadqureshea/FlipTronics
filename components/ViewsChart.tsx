'use client'

import { AreaChart } from '@/components/charts/area-chart'
import { Area } from '@/components/charts/area'

export type ViewPoint = { date: string; views: number }

export default function ViewsChart({ data }: { data: ViewPoint[] }) {
  return (
    <AreaChart
      data={data}
      xDataKey="date"
      aspectRatio="3 / 1"
      margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
    >
      <Area
        dataKey="views"
        fill="var(--magenta)"
        stroke="var(--magenta)"
        fillOpacity={0.25}
        strokeWidth={2}
      />
    </AreaChart>
  )
}
