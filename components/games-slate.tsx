'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { formatMoney } from '@/lib/data'
import { useFavorites } from '@/lib/favorites'
import { cn } from '@/lib/utils'
import { games, gamesByDay, topTracked, trackedIn, type Game, type GameTeam } from '@/lib/games'

type Filter = 'all' | 'ranked' | 'favorites'

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All games' },
  { key: 'ranked', label: 'Ranked' },
  { key: 'favorites', label: 'My favorites' },
]

function TeamLine({ team, side }: { team: GameTeam; side: 'away' | 'home' }) {
  return (
    <div className="flex min-w-0 items-baseline gap-2">
      <span className="w-5 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
        {team.rank ?? ''}
      </span>
      <span className="truncate text-sm text-foreground">
        {side === 'home' && <span className="text-muted-foreground">@ </span>}
        {team.name}
      </span>
      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
        {team.record}
        {team.confRecord !== '—' && <span className="hidden sm:inline"> ({team.confRecord})</span>}
      </span>
    </div>
  )
}

function GameRow({ game, favoriteIds }: { game: Game; favoriteIds: string[] }) {
  const top = topTracked(game)
  const tracked = trackedIn(game).length
  const hasFavorite = trackedIn(game).some((p) => p.playerId && favoriteIds.includes(p.playerId))

  return (
    <li>
      <Link
        href={`/games/${game.id}`}
        className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-3.5 transition-colors hover:bg-secondary/40 md:grid-cols-[5.5rem_1fr_13rem_auto] md:px-2"
      >
        <div className="flex flex-col">
          <span className="font-mono text-xs tabular-nums text-foreground">{game.time}</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {game.network}
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <TeamLine team={game.away} side="away" />
          <TeamLine team={game.home} side="home" />
        </div>

        {top && (
          <div className="hidden min-w-0 flex-col items-end md:flex">
            <span className="flex max-w-full items-center gap-1.5 truncate text-sm text-foreground">
              {hasFavorite && <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-label="Has a favorite" />}
              <span className="truncate">{top.name}</span>
              <span className="font-mono text-sm tabular-nums">{formatMoney(top.priceCents)}</span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Top card · {tracked} tracked
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tabular-nums text-muted-foreground md:hidden">{tracked}</span>
          <ChevronRight
            className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
            aria-hidden
          />
        </div>
      </Link>
    </li>
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
              filter === f.key
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground',
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
        <div className="mt-6 flex flex-col gap-8">
          {groups.map((group) => (
            <section key={group.label} aria-labelledby={`day-${group.label}`}>
              <div className="flex items-baseline justify-between border-b border-border pb-2">
                <h2 id={`day-${group.label}`} className="text-sm font-medium text-foreground">
                  {group.label}
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {group.games.length} {group.games.length === 1 ? 'game' : 'games'}
                </span>
              </div>
              <ul className="divide-y divide-border">
                {group.games.map((g) => (
                  <GameRow key={g.id} game={g} favoriteIds={ids} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
