'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Flame, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { risers, fallers, formatMoney } from '@/lib/data'
import { ChangePill } from '@/components/change-pill'
import { PlayerAvatar } from '@/components/player-avatar'

export function MoversRail() {
  const [tab, setTab] = useState<'risers' | 'fallers'>('risers')
  const rows = tab === 'risers' ? risers : fallers

  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="h-4 w-1 rounded-full bg-primary" />
          <h2 className="font-serif text-base font-bold uppercase tracking-wide">Movers</h2>
        </div>
        <div className="flex rounded-md border border-border bg-secondary/40 p-0.5">
          <button
            type="button"
            onClick={() => setTab('risers')}
            className={cn(
              'flex items-center gap-1 rounded px-2.5 py-1 font-serif text-xs font-semibold uppercase tracking-wide transition-colors',
              tab === 'risers' ? 'bg-gain/15 text-gain' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <TrendingUp className="size-3.5" /> Up
          </button>
          <button
            type="button"
            onClick={() => setTab('fallers')}
            className={cn(
              'flex items-center gap-1 rounded px-2.5 py-1 font-serif text-xs font-semibold uppercase tracking-wide transition-colors',
              tab === 'fallers' ? 'bg-loss/15 text-loss' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <TrendingDown className="size-3.5" /> Down
          </button>
        </div>
      </div>

      <ol className="flex flex-1 flex-col divide-y divide-border/70">
        {rows.map((p, i) => (
          <li key={p.id}>
            <Link
              href={`/players/${p.id}`}
              className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/40"
            >
              <span className="w-4 shrink-0 font-mono text-xs text-muted-foreground">{i + 1}</span>
              <PlayerAvatar player={p} size={34} />
              <div className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="flex items-center gap-1.5 truncate text-sm font-medium group-hover:text-primary">
                  {p.name}
                  {p.hot && <Flame className="size-3 shrink-0 text-primary" fill="var(--primary)" />}
                </span>
                <span className="truncate font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  {p.position} · {p.school}
                </span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="font-mono text-sm tabular-nums">{formatMoney(p.marketCents, 0)}</span>
                <ChangePill value={p.changePct} />
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
