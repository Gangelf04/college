'use client'

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MarketPoint } from '@/lib/data'

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const avg = payload.find((p: any) => p.dataKey === 'avgPrice')?.value
  const vol = payload.find((p: any) => p.dataKey === 'avgPrice')?.payload?.volume
  return (
    <div className="rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="mb-1 text-muted-foreground">{label}</p>
      <p className="font-mono text-sm text-foreground">${avg}</p>
      {typeof vol === 'number' && (
        <p className="font-mono text-[11px] text-muted-foreground">
          {vol.toLocaleString()} sold
        </p>
      )}
    </div>
  )
}

export function MarketChart({ data }: { data: MarketPoint[] }) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id="market-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={48}
          />
          <YAxis
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}`}
            width={48}
            tickCount={4}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="avgPrice"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#market-fill)"
            dot={false}
            activeDot={{ r: 3.5, fill: 'var(--primary)', stroke: 'var(--background)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
