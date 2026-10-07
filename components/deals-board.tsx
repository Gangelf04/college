'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Heart } from 'lucide-react'
import { players, formatMoney, type Player } from '@/lib/data'
import { deals, median, dealDiscount, formatListedAgo, type Deal } from '@/lib/deals'
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

function PriceStrip({ deal, medianCents }: { deal: Deal; medianCents: number }) {
  const lo = Math.min(deal.askCents, ...deal.compsCents)
  const hi = Math.max(...deal.compsCents)
  const pad = (hi - lo) * 0.08
  const min = lo - pad
  const span = hi + pad - min
  const pos = (v: number) => `${((v - min) / span) * 100}%`

  return (
    <figure className="mt-5">
      <div
        className="relative h-6"
        role="img"
        aria-label={`Asking ${formatMoney(deal.askCents, 0)} against ${deal.compsCents.length} recent sales from ${formatMoney(Math.min(...deal.compsCents), 0)} to ${formatMoney(hi, 0)}, median ${formatMoney(medianCents, 0)}`}
      >
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
        <span
          className="absolute top-1/2 h-px -translate-y-1/2 bg-gain/60"
          style={{ left: pos(deal.askCents), width: `calc(${pos(medianCents)} - ${pos(deal.askCents)})` }}
        />
        {deal.compsCents.map((c, i) => (
          <span
            key={i}
            className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/50"
            style={{ left: pos(c) }}
          />
        ))}
        <span
          className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-foreground/70"
          style={{ left: pos(medianCents) }}
        />
        <span
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gain ring-4 ring-gain/15"
          style={{ left: pos(deal.askCents) }}
        />
      </div>
      <figcaption className="mt-1.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        <span className="text-gain">Ask</span>
        <span>
          Median {formatMoney(medianCents, 0)} · {deal.compsCents.length} sales
        </span>
      </figcaption>
    </figure>
  )
}

function DealCard({ item }: { item: DealWithPlayer }) {
  const { deal, player: p, median: med, discount } = item
  const saving = med - deal.askCents
  const parallel = deal.parallel === 'Base' ? 'Base' : `${deal.parallel}${deal.run ? ` /${deal.run}` : ''}`

  return (
    <article
      aria-labelledby={`deal-${deal.id}`}
      className="flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-muted-foreground/30"
    >
      <header className="flex items-center gap-3">
        <Link href={`/players/${p.id}`} className="group flex min-w-0 flex-1 items-center gap-3">
          <PlayerAvatar player={p} size={32} />
          <span className="min-w-0">
            <span
              id={`deal-${deal.id}`}
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

      <p className="mt-4 text-pretty text-sm leading-relaxed text-foreground">
        {deal.subset}
        <span className="text-muted-foreground"> · {parallel}</span>
      </p>
      <p className="truncate text-xs text-muted-foreground" title={deal.title}>
        {deal.product}
      </p>

      <div className="mt-4 flex items-end justify-between gap-3">
        <span className="font-display text-3xl font-light tabular-nums text-foreground">
          {formatMoney(deal.askCents, deal.askCents % 100 ? 2 : 0)}
        </span>
        <span className="text-right">
          <span className="block font-mono text-sm tabular-nums text-gain">
            −{Math.round(discount * 100)}%
          </span>
          <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Save {formatMoney(saving, 0)}
          </span>
        </span>
      </div>

      <PriceStrip deal={deal} medianCents={med} />

      <footer className="mt-5 flex items-center justify-between border-t border-border pt-3">
        <span className="font-mono text-[11px] text-muted-foreground">
          Listed {formatListedAgo(deal.listedHoursAgo)}
        </span>
        <a
          href="https://www.ebay.com"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
        >
          View on eBay
          <ArrowUpRight className="size-3.5" aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </footer>
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

  const best = enriched.reduce((a, b) => (b.discount > a.discount ? b : a), enriched[0])
  const avgDiscount = enriched.reduce((s, d) => s + d.discount, 0) / enriched.length
  const totalSavings = enriched.reduce((s, d) => s + (d.median - d.deal.askCents), 0)

  return (
    <div>
      <dl className="flex flex-wrap gap-x-12 gap-y-4 border-t border-border pt-6">
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Open deals</dt>
          <dd className="mt-1 font-display text-xl font-light tabular-nums text-foreground">{enriched.length}</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Avg under median</dt>
          <dd className="mt-1 font-display text-xl font-light tabular-nums text-gain">
            −{Math.round(avgDiscount * 100)}%
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Best right now</dt>
          <dd className="mt-1 font-display text-xl font-light text-foreground">
            {best.player.name}{' '}
            <span className="tabular-nums text-gain">−{Math.round(best.discount * 100)}%</span>
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Total savings</dt>
          <dd className="mt-1 font-display text-xl font-light tabular-nums text-foreground">
            {formatMoney(totalSavings, 0)}
          </dd>
        </div>
      </dl>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div role="radiogroup" aria-label="Sort deals" className="flex flex-wrap items-center gap-1">
          {sortOptions.map((o) => (
            <button
              key={o.key}
              type="button"
              role="radio"
              aria-checked={sort === o.key}
              onClick={() => setSort(o.key)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm transition-colors',
                sort === o.key
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-pressed={favoritesOnly}
          onClick={() => setFavoritesOnly((v) => !v)}
          className={cn(
            'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
            favoritesOnly ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Heart className={cn('size-3.5', favoritesOnly && 'fill-primary text-primary')} aria-hidden />
          Favorites only
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 border-t border-border pt-16 text-center">
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
