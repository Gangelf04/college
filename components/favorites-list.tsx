'use client'

import Link from 'next/link'
import { players, formatMoney } from '@/lib/data'
import { useFavorites } from '@/lib/favorites'
import { Sparkline } from '@/components/sparkline'
import { ChangePill } from '@/components/change-pill'
import { PlayerAvatar } from '@/components/player-avatar'
import { FavoriteButton } from '@/components/favorite-button'

export function FavoritesList() {
  const { ids } = useFavorites()
  const favorites = players.filter((p) => ids.includes(p.id)).sort((a, b) => a.rank - b.rank)

  if (favorites.length === 0) {
    return (
      <div className="border-t border-border pt-16 text-center">
        <p className="text-sm text-foreground">No favorites yet</p>
        <p className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
          Tap the heart on any prospect to follow their card market here.
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
      </dl>

      <ol className="mt-10">
        {favorites.map((p) => (
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
                  <span className="font-mono text-sm tabular-nums text-foreground">{formatMoney(p.marketCents, 0)}</span>
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
