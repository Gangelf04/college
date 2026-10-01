'use client'

import Link from 'next/link'
import { players, formatMoney, type Player } from '@/lib/data'
import { useFavorites } from '@/lib/favorites'
import { Sparkline } from '@/components/sparkline'
import { ChangePill } from '@/components/change-pill'
import { PlayerAvatar } from '@/components/player-avatar'
import { FavoriteButton } from '@/components/favorite-button'

const RECENT_COUNT = 3

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{children}</h3>
  )
}

function RecentGames({ player }: { player: Player }) {
  const games = player.gameLog.slice(0, RECENT_COUNT)

  return (
    <div>
      <ColumnLabel>Recent games</ColumnLabel>
      {games.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No games logged yet.</p>
      ) : (
        <ul className="mt-3">
          {games.map((g) => {
            const won = g.result.startsWith('W')
            return (
              <li
                key={`${g.date}-${g.opponent}`}
                className="grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-3 border-t border-border py-2.5"
              >
                <span className="font-mono text-xs tabular-nums text-muted-foreground">{g.date}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm text-foreground">
                    {g.homeAway === 'A' || g.opponent.startsWith('at ') ? '' : 'vs '}
                    {g.opponent}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">{g.line}</span>
                </span>
                <span className={`font-mono text-xs tabular-nums ${won ? 'text-gain' : 'text-loss'}`}>
                  {g.result}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function RecentSales({ player }: { player: Player }) {
  const sales = player.sales.slice(0, RECENT_COUNT)

  return (
    <div>
      <ColumnLabel>Recent sales</ColumnLabel>
      {sales.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No recent sales.</p>
      ) : (
        <ul className="mt-3">
          {sales.map((s) => (
            <li key={s.id} className="grid grid-cols-[1fr_auto] items-baseline gap-3 border-t border-border py-2.5">
              <span className="min-w-0">
                <span className="block truncate text-sm text-foreground">
                  {s.product} · {s.variant}
                  {s.parallel && s.parallel !== 'Base' ? ` · ${s.parallel}` : ''}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {s.date.replace(/, \d{4}$/, '')} · {s.grade ?? 'Raw'} · {s.format}
                  {s.bidCount ? ` · ${s.bidCount} bids` : ''}
                </span>
              </span>
              <span className="font-mono text-sm tabular-nums text-foreground">{formatMoney(s.priceCents, 0)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FavoriteBlock({ player: p }: { player: Player }) {
  return (
    <article className="border-t border-border py-10" aria-labelledby={`fav-${p.id}`}>
      <header className="flex items-center gap-4">
        <Link href={`/players/${p.id}`} className="group flex min-w-0 flex-1 items-center gap-4">
          <PlayerAvatar player={p} size={40} />
          <span className="min-w-0">
            <span
              id={`fav-${p.id}`}
              className="block truncate font-display text-xl font-light text-foreground transition-colors group-hover:text-primary"
            >
              {p.name}
            </span>
            <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              #{p.rank} · {p.position} · {p.school} · {p.classYear}
            </span>
          </span>
        </Link>
        <span className="hidden opacity-70 md:block">
          <Sparkline data={p.spark} positive={p.changePct >= 0} width={96} height={28} />
        </span>
        <span className="flex w-24 flex-col items-end gap-0.5">
          <span className="font-mono text-base tabular-nums text-foreground">{formatMoney(p.marketCents, 0)}</span>
          <ChangePill value={p.changePct} showIcon={false} />
        </span>
        <FavoriteButton playerId={p.id} playerName={p.name} />
      </header>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
        <RecentGames player={p} />
        <RecentSales player={p} />
      </div>
    </article>
  )
}

export function FavoritesList() {
  const { ids } = useFavorites()
  const favorites = players.filter((p) => ids.includes(p.id)).sort((a, b) => a.rank - b.rank)

  if (favorites.length === 0) {
    return (
      <div className="border-t border-border pt-16 text-center">
        <p className="text-sm text-foreground">No favorites yet</p>
        <p className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
          Tap the heart on any prospect to follow their games and card sales here.
        </p>
        <Link
          href="/players"
          className="mt-6 inline-block text-sm text-primary transition-colors hover:text-primary/80"
        >
          Browse prospects →
        </Link>
      </div>
    )
  }

  const totalValue = favorites.reduce((s, p) => s + p.marketCents, 0)
  const avgChange = favorites.reduce((s, p) => s + p.changePct, 0) / favorites.length
  const salesThisWeek = favorites.reduce((s, p) => s + p.sales.length, 0)

  return (
    <div>
      <dl className="flex flex-wrap gap-x-14 gap-y-6 border-t border-border pt-8">
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Following</dt>
          <dd className="mt-1 font-display text-2xl font-light tabular-nums text-foreground">{favorites.length}</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Combined market</dt>
          <dd className="mt-1 font-display text-2xl font-light tabular-nums text-foreground">
            {formatMoney(totalValue, 0)}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Avg change</dt>
          <dd className="mt-1">
            <ChangePill value={avgChange} showIcon={false} className="font-display text-2xl font-light" />
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Recent sales</dt>
          <dd className="mt-1 font-display text-2xl font-light tabular-nums text-foreground">{salesThisWeek}</dd>
        </div>
      </dl>

      <div className="mt-6">
        {favorites.map((p) => (
          <FavoriteBlock key={p.id} player={p} />
        ))}
      </div>
    </div>
  )
}
