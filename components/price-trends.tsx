'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Player } from '@/lib/data'

// Build a plausible ~30-point daily price history from the player's spark and
// market anchors, with a couple of "big game" markers.
function buildSeries(player: Player) {
  const base = player.twmaCents / 100
  const target = player.marketCents / 100
  const spark = player.spark
  const start = new Date('2026-08-25T00:00:00')
  return spark.map((s, i) => {
    const t = i / (spark.length - 1)
    const drift = base + (target - base) * t
    const noise = ((s % 12) - 6) * (base * 0.02)
    const d = new Date(start)
    d.setDate(start.getDate() + Math.round(t * 28))
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.max(1, Math.round(drift + noise)),
    }
  })
}

function PriceTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="mb-0.5 font-medium">{label}</p>
      <p className="font-mono text-primary">${payload[0].value}</p>
    </div>
  )
}

export function PriceTrends({ player }: { player: Player }) {
  const data = buildSeries(player)
  // mark a game bump near 2/3 of the series
  const markerIndex = Math.round(data.length * 0.68)
  const marker = data[markerIndex]

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: -6 }}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} tickLine={false} axisLine={false} interval={4} minTickGap={16} />
          <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} width={52} />
          <Tooltip content={<PriceTooltip />} cursor={{ stroke: 'var(--border)' }} />
          <Area type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={2.25} fill="url(#priceFill)" dot={false} activeDot={{ r: 4, fill: 'var(--primary)', stroke: 'var(--background)', strokeWidth: 2 }} />
          {marker && (
            <ReferenceDot x={marker.date} y={marker.price} r={5} fill="var(--gain)" stroke="var(--background)" strokeWidth={2} isFront />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
