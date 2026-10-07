'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Heart } from 'lucide-react'
import { players, formatMoney, type Player } from '@/lib/data'
import { deals, median, dealDiscount, formatListedAgo, dealsCheckedMinutesAgo, type Deal } from '@/lib/deals'
import { useFavorites } from '@/lib/favorites'
import { PlayerAvatar } from '@/components/player-avatar'
import { FavoriteButton } from '@/components/favorite-button'
import { cn } from '@/lib/utils'

type SortKey = 'discount' | 'newest' | 'price'

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'discount', label: 'Biggest discount' },
  { key: 'newest', label: 'Newest' },
  { key: 'price', label: 'Lowest price' },
]

type DealWithPlayer = { deal: Deal; player: Player; median: number; discount: number }

const enriched: DealWithPlayer[] = deals.flatMap((deal) => {
  const player = players.find((p) => p.id === deal.playerId)
  return player
    ? [{ deal, player, median: median(deal.compsCents), discount: dealDiscount(deal) }]
    : []
})

function sortDeals(list: DealWithPlayer[], key: SortKey) {
  const copy = [...list]
  if (key === 'discount') return copy.sort((a, b) => b.discount - a.discount)
  if (key === 'newest') return copy.sort((a, b) => a.deal.listedHoursAgo - b.deal.listedHoursAgo)
  return copy.sort((a, b) => a.deal.askCents - b.deal.askCents)
}

const money = (cents: number) => formatMoney(cents, cents % 100 ? 2 : 0)

function cardLabel(deal: Deal) {
  const parallel = deal.parallel === 'Base' ? 'Base' : `${deal.parallel}${deal.run ? ` /${deal.run}` : ''}`
  return `${deal.subset} · ${parallel}`
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{children}</h3>
  )
}

function DealCard({ item }: { item: DealWithPlayer }) {
  const { deal, player: p, median: med, discount } = item
  const saving = med - deal.askCents
  const comps = [...deal.compsCents].reverse().slice(0, 2)
  const headingId = `deal-${deal.id}`

  return (
    <article
      aria-labelledby={headingId}
      className="flex flex-col rounded-lg border border-border bg-card transition-colors hover:border-muted-foreground/30"
    >
      <header className="flex items-center gap-3 p-4 pb-3">
        <Link href={`/players/${p.id}`} className="group flex min-w-0 flex-1 items-center gap-3">
          <PlayerAvatar player={p} size={32} />
          <span className="min-w-0">
            <span
              id={headingId}
              className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary"
            >
              {p.name}
            </span>
            <span className="block truncate font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {p.position} · {p.school}
            </span>
          </span>
        </Link>
        <FavoriteButton playerId={p.id} playerName={p.name} />
      </header>

      <div className="px-4">
        <p className="truncate text-sm text-foreground">{cardLabel(deal)}</p>
        <p className="truncate text-xs text-muted-foreground">{deal.product}</p>
      </div>

      <div className="flex items-end justify-between gap-3 px-4 pb-4 pt-3">
        <div className="flex flex-col">
          <span className="font-display text-2xl font-light tabular-nums text-foreground">
            {money(deal.askCents)}
          </span>
          <span className="font-mono text-xs tabular-nums text-gain">
            −{Math.round(discount * 100)}% vs median
          </span>
        </div>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {formatListedAgo(deal.listedHoursAgo)}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-3 border-t border-border px-4 py-3">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Median</dt>
          <dd className="mt-0.5 font-mono text-sm tabular-nums text-foreground">{formatMoney(med, 0)}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">You save</dt>
          <dd className="mt-0.5 font-mono text-sm tabular-nums text-gain">{formatMoney(saving, 0)}</dd>
        </div>
      </dl>

      <div className="border-t border-border p-4">
        <div className="flex items-baseline justify-between">
          <SectionLabel>Recent sales</SectionLabel>
          <span className="font-mono text-[10px] text-muted-foreground">{deal.compsCents.length} · 90d</span>
        </div>
        <ul className="mt-2 flex flex-col gap-1.5">
          {comps.map((c, i) => (
            <li key={i} className="flex items-baseline justify-between gap-3">
              <span className="text-xs text-muted-foreground">{i === 0 ? 'Latest' : 'Previous'}</span>
              <span className="font-mono text-sm tabular-nums text-foreground">{formatMoney(c, 0)}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href="https://www.ebay.com"
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="mt-auto flex items-center justify-center gap-1 border-t border-border py-2.5 text-xs text-primary transition-colors hover:bg-secondary/40"
      >
        View on eBay
        <ArrowUpRight className="size-3" aria-hidden />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </article>
  )
}

export function DealsBoard() {
  const [sort, setSort] = useState<SortKey>('discount')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const { ids } = useFavorites()

  const visible = sortDeals(
    favoritesOnly ? enriched.filter((d) => ids.includes(d.player.id)) : enriched,
    sort,
  )

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="radiogroup" aria-label="Sort deals" className="flex flex-wrap items-center gap-1">
          {sortOptions.map((o) => (
            <button
              key={o.key}
              type="button"
              role="radio"
              aria-checked={sort === o.key}
              onClick={() => setSort(o.key)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs transition-colors',
                sort === o.key ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {o.label}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={favoritesOnly}
            onClick={() => setFavoritesOnly((v) => !v)}
            className={cn(
              'ml-1 inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs transition-colors',
              favoritesOnly ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Heart className={cn('size-3.5', favoritesOnly && 'fill-primary text-primary')} aria-hidden />
            Favorites only
          </button>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Checked {dealsCheckedMinutesAgo} min ago · {visible.length} deals
        </span>
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-lg border border-border py-16 text-center">
          <p className="text-sm text-foreground">No deals on your favorites right now</p>
          <p className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
            {"We'll surface them here the moment one of your players lists 20% under median."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <DealCard key={item.deal.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
