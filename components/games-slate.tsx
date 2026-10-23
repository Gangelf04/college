'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { formatMoney } from '@/lib/data'
import { useFavorites } from '@/lib/favorites'
import { cn } from '@/lib/utils'
import { ChangePill } from '@/components/change-pill'
import { games, gamesByDay, topTracked, trackedIn, type Game, type GameTeam } from '@/lib/games'

type Filter = 'all' | 'ranked' | 'favorites'

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All games' },
  { key: 'ranked', label: 'Ranked' },
  { key: 'favorites', label: 'My favorites' },
]

function TeamRow({ team, side }: { team: GameTeam; side: 'away' | 'home' }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-8 w-11 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-[10px] font-medium tracking-wider text-foreground"
        aria-hidden
      >
        {team.abbr}
      </span>
      <div className="min-w-0 flex-1">
        <span className="flex items-baseline gap-1.5 truncate text-sm text-foreground">
          {team.rank && (
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">#{team.rank}</span>
          )}
          <span className="truncate">{team.name}</span>
        </span>
        <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {side === 'home' ? 'Home' : 'Away'} · {team.tracked.length} tracked
        </span>
      </div>
      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
        {team.record}
        {team.confRecord !== '—' && ` (${team.confRecord})`}
      </span>
    </div>
  )
}

function GameCard({ game, favoriteIds }: { game: Game; favoriteIds: string[] }) {
  const top = topTracked(game)
  const tracked = trackedIn(game)
  const hasFavorite = tracked.some((p) => p.playerId && favoriteIds.includes(p.playerId))
  const totalValue = tracked.reduce((sum, p) => sum + p.priceCents, 0)

  return (
    <Link
      href={`/games/${game.id}`}
      aria-label={`${game.away.name} at ${game.home.name}, ${game.day} ${game.time}`}
      className="group flex flex-col rounded-lg border border-border bg-card transition-colors hover:border-muted-foreground/30"
    >
      <div className="flex items-center justify-between gap-3 px-4 pt-4">
        <span className="font-mono text-[11px] tabular-nums text-foreground">
          {game.time} <span className="text-muted-foreground">ET</span>
        </span>
        <span className="flex items-center gap-2">
          {hasFavorite && (
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-primary">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              Favorite
            </span>
          )}
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {game.network}
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-3 px-4 py-4">
        <TeamRow team={game.away} side="away" />
        <TeamRow team={game.home} side="home" />
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-border px-4 py-3">
        {top ? (
          <div className="min-w-0">
            <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Top card
            </span>
            <span className="flex items-baseline gap-2">
              <span className="truncate text-sm text-foreground">{top.name}</span>
              <span className="font-mono text-sm tabular-nums text-foreground">{formatMoney(top.priceCents)}</span>
              <ChangePill value={top.changePct} showIcon={false} className="text-[11px]" />
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">No tracked players</span>
        )}
        <span className="flex shrink-0 items-center gap-1 font-mono text-[11px] tabular-nums text-muted-foreground transition-colors group-hover:text-foreground">
          {formatMoney(totalValue, 0)}
          <ArrowUpRight className="size-3.5" aria-hidden />
        </span>
      </div>
    </Link>
  )
}

export function GamesSlate() {
  const [filter, setFilter] = useState<Filter>('all')
  const { ids } = useFavorites()

  const visible = games.filter((g) => {
    if (filter === 'ranked') return g.away.rank || g.home.rank
    if (filter === 'favorites') return trackedIn(g).some((p) => p.playerId && ids.includes(p.playerId))
    return true
  })
  const groups = gamesByDay(visible)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filter games">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs transition-colors',
              filter === f.key ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {groups.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">
          {filter === 'favorites'
            ? 'None of your favorite players are playing this week.'
            : 'No games match this filter.'}
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-10">
          {groups.map((group) => (
            <section key={group.label} aria-labelledby={`day-${group.label}`}>
              <div className="mb-4 flex items-baseline justify-between">
                <h2 id={`day-${group.label}`} className="text-sm font-medium text-foreground">
                  {group.label}
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {group.games.length} {group.games.length === 1 ? 'game' : 'games'}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.games.map((g) => (
                  <GameCard key={g.id} game={g} favoriteIds={ids} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
