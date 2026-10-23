'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { formatMoney } from '@/lib/data'
import { useFavorites } from '@/lib/favorites'
import { cn } from '@/lib/utils'
import { ChangePill } from '@/components/change-pill'
import { games, gamesByDay, trackedIn, type Game, type GameTeam } from '@/lib/games'

type Filter = 'all' | 'ranked' | 'favorites'

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All games' },
  { key: 'ranked', label: 'Ranked' },
  { key: 'favorites', label: 'My favorites' },
]

function TeamSide({ team, align }: { team: GameTeam; align: 'start' | 'end' }) {
  return (
    <div className={cn('flex min-w-0 flex-1 flex-col', align === 'end' ? 'items-end text-right' : 'items-start')}>
      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
        {team.rank ? `#${team.rank}` : 'Unranked'}
      </span>
      <span className="mt-0.5 w-full truncate font-display text-xl font-light tracking-tight text-foreground">
        {team.name}
      </span>
      <span className="mt-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">
        {team.record}
        {team.confRecord !== '—' && ` (${team.confRecord})`}
      </span>
    </div>
  )
}

function GameCard({ game, favoriteIds }: { game: Game; favoriteIds: string[] }) {
  const tracked = trackedIn(game)
  const watch = [...tracked].sort((a, b) => b.priceCents - a.priceCents).slice(0, 3)
  const isFavorite = (id?: string) => Boolean(id && favoriteIds.includes(id))
  const hasFavorite = tracked.some((p) => isFavorite(p.playerId))
  const totalValue = tracked.reduce((sum, p) => sum + p.priceCents, 0)

  return (
    <Link
      href={`/games/${game.id}`}
      aria-label={`${game.away.name} at ${game.home.name}, ${game.day} ${game.time}`}
      className="group flex flex-col rounded-lg border border-border bg-card transition-colors hover:border-muted-foreground/30"
    >
      <div className="flex items-center justify-between gap-3 px-5 pt-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {game.time} ET · {game.network}
        </span>
        {hasFavorite && (
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-primary">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
            Favorite playing
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 px-5 pb-5 pt-3">
        <TeamSide team={game.away} align="start" />
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">at</span>
        <TeamSide team={game.home} align="end" />
      </div>

      <div className="flex flex-1 flex-col border-t border-border px-5 py-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Players to watch
        </span>
        {watch.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2.5">
            {watch.map((p) => (
              <li key={p.name} className="flex items-center gap-3">
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-[10px] text-muted-foreground"
                  aria-hidden
                >
                  {p.initials}
                </span>
                <span className="flex min-w-0 flex-1 items-baseline gap-2">
                  <span className={cn('truncate text-sm', isFavorite(p.playerId) ? 'text-primary' : 'text-foreground')}>
                    {p.name}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">{p.position}</span>
                </span>
                <span className="shrink-0 font-mono text-sm tabular-nums text-foreground">
                  {formatMoney(p.priceCents)}
                </span>
                <ChangePill value={p.changePct} showIcon={false} className="w-14 shrink-0 text-right text-[11px]" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">No tracked players in this game.</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {tracked.length} tracked · {formatMoney(totalValue, 0)}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
          View game
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
              <div className="grid gap-4 md:grid-cols-2">
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
