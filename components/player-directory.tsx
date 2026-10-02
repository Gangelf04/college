'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { players as allPlayers, formatMoney, type Position } from '@/lib/data'
import { Sparkline } from '@/components/sparkline'
import { ChangePill } from '@/components/change-pill'
import { PlayerAvatar } from '@/components/player-avatar'
import { FavoriteButton } from '@/components/favorite-button'

const positionFilters: ('ALL' | Position)[] = ['ALL', 'QB', 'RB', 'WR', 'TE', 'EDGE', 'DL', 'LB', 'CB', 'S', 'OT']

export function PlayerDirectory() {
  const [query, setQuery] = useState('')
  const [pos, setPos] = useState<'ALL' | Position>('ALL')

  const rows = useMemo(() => {
    return allPlayers
      .filter((p) => (pos === 'ALL' ? true : p.position === pos))
      .filter((p) =>
        query.trim() === ''
          ? true
          : `${p.name} ${p.school}`.toLowerCase().includes(query.trim().toLowerCase()),
      )
      .sort((a, b) => a.rank - b.rank)
  }, [query, pos])

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="relative flex w-full items-center md:max-w-xs">
          <Search className="pointer-events-none absolute left-0 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search player or school…"
            className="h-9 w-full border-b border-border bg-transparent pl-6 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground"
          />
        </label>
        <div className="flex flex-wrap gap-1">
          {positionFilters.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPos(p)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                pos === p
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {p === 'ALL' ? 'All' : p}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {rows.length} prospects
      </p>

      {/* List */}
      <ol className="mt-2">
        {rows.map((p) => (
          <li key={p.id} className="flex items-center gap-2 border-b border-border">
            <Link
              href={`/players/${p.id}`}
              className="group grid flex-1 grid-cols-[1.75rem_1fr_auto] items-center gap-4 py-3.5"
            >
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {String(p.rank).padStart(2, '0')}
              </span>

              <span className="flex min-w-0 items-center gap-3">
                <PlayerAvatar player={p} size={32} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    {p.name}
                  </span>
                  <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {p.position} · {p.school} · {p.classYear}
                  </span>
                </span>
              </span>

              <span className="flex items-center gap-6">
                <span className="hidden opacity-70 sm:block">
                  <Sparkline data={p.spark} positive={p.changePct >= 0} width={72} height={24} />
                </span>
                <span className="flex w-24 flex-col items-end gap-0.5">
                  <span className="font-mono text-sm tabular-nums text-foreground">
                    {formatMoney(p.marketCents, 0)}
                  </span>
                  <ChangePill value={p.changePct} showIcon={false} />
                </span>
              </span>
            </Link>
            <FavoriteButton playerId={p.id} playerName={p.name} />
          </li>
        ))}
      </ol>
    </div>
  )
}
