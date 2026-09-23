'use client'

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import type { Player } from '@/lib/data'

export function PlayerRadar({ player }: { player: Player }) {
  const data = player.tools.map((t) => ({ label: t.label, grade: t.grade, full: 80 }))
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
          />
          <PolarRadiusAxis domain={[20, 80]} tick={false} axisLine={false} />
          <Radar
            dataKey="grade"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.28}
            strokeWidth={2}
            dot={{ r: 2.5, fill: 'var(--primary)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
