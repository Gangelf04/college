'use client'

import Link from 'next/link'
import { players, formatMoney, type Player } from '@/lib/data'
import { useFavorites } from '@/lib/favorites'
import { Sparkline } from '@/components/sparkline'
import { ChangePill } from '@/components/change-pill'
import { PlayerAvatar } from '@/components/player-avatar'
import { FavoriteButton } from '@/components/favorite-button'

const RECENT_COUNT = 2

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{children}</h3>
  )
}

function RecentGames({ player }: { player: Player }) {
  const games = player.gameLog.slice(0, RECENT_COUNT)

  return (
    <div>
      <SectionLabel>Recent games</SectionLabel>
      {games.length === 0 ? (
        <p className="mt-2 text-xs text-muted-foreground">No games logged yet.</p>
      ) : (
        <ul className="mt-2 flex flex-col gap-2">
          {games.map((g) => {
            const won = g.result.startsWith('W')
            return (
              <li key={`${g.date}-${g.opponent}`} className="flex items-baseline justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-sm text-foreground">
                    {g.homeAway === 'A' || g.opponent.startsWith('at ') ? '' : 'vs '}
                    {g.opponent}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{g.line}</span>
                </span>
                <span className={`shrink-0 font-mono text-xs tabular-nums ${won ? 'text-gain' : 'text-loss'}`}>
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
      <SectionLabel>Recent sales</SectionLabel>
      {sales.length === 0 ? (
        <p className="mt-2 text-xs text-muted-foreground">No recent sales.</p>
      ) : (
        <ul className="mt-2 flex flex-col gap-2">
          {sales.map((s) => (
            <li key={s.id} className="flex items-baseline justify-between gap-3">
              <span className="min-w-0">
                <span className="block truncate text-sm text-foreground">
                  {s.variant}
                  {s.parallel && s.parallel !== 'Base' ? ` · ${s.parallel}` : ''}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {s.date.replace(/, \d{4}$/, '')} · {s.grade ?? 'Raw'}
                </span>
              </span>
              <span className="shrink-0 font-mono text-sm tabular-nums text-foreground">
                {formatMoney(s.priceCents, 0)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FavoriteCard({ player: p }: { player: Player }) {
  return (
    <article
      aria-labelledby={`fav-${p.id}`}
      className="flex flex-col rounded-lg border border-border bg-card transition-colors hover:border-muted-foreground/30"
    >
      <header className="flex items-center gap-3 p-4 pb-3">
        <Link href={`/players/${p.id}`} className="group flex min-w-0 flex-1 items-center gap-3">
          <PlayerAvatar player={p} size={32} />
          <span className="min-w-0">
            <span
              id={`fav-${p.id}`}
              className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary"
            >
              {p.name}
            </span>
            <span className="block truncate font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              #{p.rank} · {p.position} · {p.school}
            </span>
          </span>
        </Link>
        <FavoriteButton playerId={p.id} playerName={p.name} />
      </header>

      <div className="flex items-end justify-between gap-3 px-4 pb-4">
        <div className="flex flex-col">
          <span className="font-display text-2xl font-light tabular-nums text-foreground">
            {formatMoney(p.marketCents, 0)}
          </span>
          <ChangePill value={p.changePct} showIcon={false} className="text-xs" />
        </div>
        <span className="opacity-70">
          <Sparkline data={p.spark} positive={p.changePct >= 0} width={88} height={28} />
        </span>
      </div>

      <div className="flex flex-col gap-4 border-t border-border p-4">
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

  return (
    <div>
      <dl className="flex flex-wrap gap-x-12 gap-y-4 border-t border-border pt-6">
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Following</dt>
          <dd className="mt-1 font-display text-xl font-light tabular-nums text-foreground">{favorites.length}</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Combined market</dt>
          <dd className="mt-1 font-display text-xl font-light tabular-nums text-foreground">
            {formatMoney(totalValue, 0)}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Avg change</dt>
          <dd className="mt-1">
            <ChangePill value={avgChange} showIcon={false} className="font-display text-xl font-light" />
          </dd>
        </div>
      </dl>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((p) => (
          <FavoriteCard key={p.id} player={p} />
        ))}
      </div>
    </div>
  )
}
