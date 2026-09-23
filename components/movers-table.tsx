'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Flame, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { players as allPlayers, formatMoney, formatCompact, type Player } from '@/lib/data'
import { Sparkline } from '@/components/sparkline'
import { ChangePill } from '@/components/change-pill'
import { PlayerAvatar } from '@/components/player-avatar'

const tabs = [
  { key: 'all', label: 'All Players' },
  { key: 'risers', label: 'Top Risers' },
  { key: 'fallers', label: 'Top Fallers' },
] as const

function liqColor(liq: number) {
  if (liq >= 8) return 'bg-gain/12 text-gain'
  if (liq >= 6.5) return 'bg-primary/12 text-primary'
  return 'bg-muted text-muted-foreground'
}

export function MoversTable() {
  const [tab, setTab] = useState<(typeof tabs)[number]['key']>('all')

  let rows: Player[] = [...allPlayers]
  if (tab === 'risers') rows = rows.filter((p) => p.changePct > 0).sort((a, b) => b.changePct - a.changePct)
  else if (tab === 'fallers') rows = rows.filter((p) => p.changePct < 0).sort((a, b) => a.changePct - b.changePct)
  else rows = rows.sort((a, b) => a.rank - b.rank)

  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 md:px-6">
        <div>
          <h2 className="font-serif text-xl font-semibold tracking-tight">Risers &amp; Fallers</h2>
          <p className="text-sm text-muted-foreground">
            {allPlayers.length.toLocaleString()} tracked active prospects · last 30 days
          </p>
        </div>
        <div className="flex rounded-lg border border-border bg-secondary/40 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                tab === t.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-sm">
          <thead>
            <tr className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 md:px-6">Rank</th>
              <th className="py-3 pr-4">Player</th>
              <th className="px-3 py-3 text-center">Class</th>
              <th className="px-3 py-3 text-right">Market</th>
              <th className="px-3 py-3 text-right">Volume</th>
              <th className="px-3 py-3 text-right">TWMA</th>
              <th className="px-3 py-3 text-center">Trend 30d</th>
              <th className="px-3 py-3 text-right">Chg%</th>
              <th className="px-3 py-3 text-center">LIQ</th>
              <th className="px-3 py-3 md:px-6" />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr
                key={p.id}
                className="group border-t border-border/70 transition-colors hover:bg-secondary/40"
              >
                <td className="px-4 py-3 md:px-6">
                  <span className="inline-flex min-w-8 items-center justify-center rounded-md bg-secondary px-2 py-1 font-mono text-xs font-medium text-muted-foreground">
                    {p.rank}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <Link href={`/players/${p.id}`} className="flex items-center gap-3">
                    <PlayerAvatar player={p} size={38} />
                    <span className="flex flex-col">
                      <span className="flex items-center gap-1.5 font-medium leading-tight group-hover:text-primary">
                        {p.name}
                        {p.hot && <Flame className="size-3.5 text-primary" fill="var(--primary)" />}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {p.position} · {p.school}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="inline-flex items-center justify-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {p.classYear}
                  </span>
                </td>
                <td className="px-3 py-3 text-right font-mono tabular-nums">{formatMoney(p.marketCents, 0)}</td>
                <td className="px-3 py-3 text-right">
                  <span className="font-mono tabular-nums">{p.volume}</span>
                  <span className="ml-1 font-mono text-xs text-muted-foreground">
                    (${formatCompact(p.volumeCents / 100)})
                  </span>
                </td>
                <td className="px-3 py-3 text-right font-mono tabular-nums text-muted-foreground">
                  {formatMoney(p.twmaCents, 0)}
                </td>
                <td className="px-3 py-3">
                  <div className="flex justify-center">
                    <Sparkline data={p.spark} positive={p.changePct >= 0} />
                  </div>
                </td>
                <td className="px-3 py-3 text-right">
                  <ChangePill value={p.changePct} />
                </td>
                <td className="px-3 py-3 text-center">
                  <span className={cn('inline-flex items-center justify-center rounded-md px-2 py-0.5 font-mono text-xs font-medium', liqColor(p.liquidity))}>
                    {p.liquidity.toFixed(1)}
                  </span>
                </td>
                <td className="px-3 py-3 md:px-6">
                  <div className="flex items-center justify-end gap-1 text-muted-foreground">
                    <button type="button" className="rounded-md p-1.5 transition-colors hover:bg-secondary hover:text-primary" aria-label={`Favorite ${p.name}`}>
                      <Heart className="size-4" />
                    </button>
                    <button type="button" className="rounded-md p-1.5 transition-colors hover:bg-secondary hover:text-primary" aria-label={`Set alert for ${p.name}`}>
                      <Bell className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
