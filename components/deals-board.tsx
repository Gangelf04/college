'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Clock, Heart, Tag } from 'lucide-react'
import { players, formatMoney, type Player } from '@/lib/data'
import { deals, median, dealDiscount, formatListedAgo, dealsCheckedMinutesAgo, type Deal } from '@/lib/deals'
import { useFavorites } from '@/lib/favorites'
import { PlayerAvatar } from '@/components/player-avatar'
import { FavoriteButton } from '@/components/favorite-button'
import { Sparkline } from '@/components/sparkline'
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

function DealRow({
  item,
  selected,
  onSelect,
}: {
  item: DealWithPlayer
  selected: boolean
  onSelect: () => void
}) {
  const { deal, player: p, discount } = item

  return (
    <div
      className={cn(
        'relative flex items-center gap-4 border-b border-border px-4 py-4 transition-colors last:border-b-0',
        selected ? 'bg-secondary/60' : 'hover:bg-secondary/30',
      )}
    >
      {selected && <span className="absolute inset-y-0 left-0 w-px bg-primary" aria-hidden />}
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`${p.name}, ${money(deal.askCents)}, ${Math.round(discount * 100)}% under median`}
        className="flex min-w-0 flex-1 items-center gap-4 text-left focus-visible:outline-none"
      >
        <PlayerAvatar player={p} size={36} />
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span className="truncate text-sm font-medium text-foreground">{p.name}</span>
            <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
              {p.position} · {p.school}
            </span>
          </span>
          <span className="mt-0.5 block truncate font-mono text-[11px] text-muted-foreground">
            {deal.product} · {cardLabel(deal)}
          </span>
        </span>
        <Sparkline
          data={deal.compsCents}
          positive
          width={72}
          height={22}
          strokeWidth={1.2}
          className="hidden shrink-0 opacity-60 md:block"
        />
        <span className="shrink-0 text-right">
          <span className="block font-mono text-sm tabular-nums text-foreground">{money(deal.askCents)}</span>
          <span className="block font-mono text-[11px] tabular-nums text-gain">
            −{Math.round(discount * 100)}%
          </span>
        </span>
        <span className="hidden w-10 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground sm:block">
          {formatListedAgo(deal.listedHoursAgo).replace(' ago', '')}
        </span>
      </button>
      <FavoriteButton playerId={p.id} playerName={p.name} />
    </div>
  )
}

function DealDetail({ item }: { item: DealWithPlayer }) {
  const { deal, player: p, median: med, discount } = item
  const saving = med - deal.askCents
  const comps = [...deal.compsCents].reverse()

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gain/30 px-2.5 py-1 font-mono text-[11px] text-gain">
          <Tag className="size-3" aria-hidden />
          {Math.round(discount * 100)}% under median
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
      </div>

      <Link href={`/players/${p.id}`} className="group mt-6 flex items-center gap-3">
        <PlayerAvatar player={p} size={40} />
        <span className="min-w-0">
          <span className="block truncate text-base font-medium text-foreground transition-colors group-hover:text-primary">
            {p.name}
          </span>
          <span className="block text-xs text-muted-foreground">
            {p.position} · {p.school}
          </span>
        </span>
      </Link>

      <p className="mt-4 text-pretty font-mono text-[11px] uppercase leading-relaxed tracking-[0.08em] text-muted-foreground">
        {deal.title}
      </p>

      <div className="mt-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Buy it now</span>
        <p className="mt-1 font-display text-5xl font-light tabular-nums tracking-tight text-foreground">
          {money(deal.askCents)}
        </p>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-border py-4">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Median</dt>
          <dd className="mt-1 font-mono text-sm tabular-nums text-foreground">{formatMoney(med, 0)}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">You save</dt>
          <dd className="mt-1 font-mono text-sm tabular-nums text-gain">{formatMoney(saving, 0)}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Listed</dt>
          <dd className="mt-1 inline-flex items-center gap-1 font-mono text-sm tabular-nums text-foreground">
            <Clock className="size-3 text-muted-foreground" aria-hidden />
            {formatListedAgo(deal.listedHoursAgo)}
          </dd>
        </div>
      </dl>

      <div className="mt-8">
        <div className="flex items-baseline justify-between">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Recent sales</h3>
          <span className="font-mono text-[11px] text-muted-foreground">{deal.compsCents.length} · 90d</span>
        </div>
        <ul className="mt-3">
          {comps.map((c, i) => {
            const over = (c - deal.askCents) / deal.askCents
            return (
              <li
                key={i}
                className="flex items-center justify-between border-b border-border py-2.5 last:border-b-0"
              >
                <span className="text-sm text-muted-foreground">{i === 0 ? 'Latest' : `Sale ${i + 1}`}</span>
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                    +{Math.round(over * 100)}% vs ask
                  </span>
                  <span className="w-16 text-right font-mono text-sm tabular-nums text-foreground">
                    {formatMoney(c, 0)}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export function DealsBoard() {
  const [sort, setSort] = useState<SortKey>('discount')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { ids } = useFavorites()

  const visible = sortDeals(
    favoritesOnly ? enriched.filter((d) => ids.includes(d.player.id)) : enriched,
    sort,
  )
  const selected = visible.find((d) => d.deal.id === selectedId) ?? visible[0]

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
                'rounded-md px-3 py-1.5 text-sm transition-colors',
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
              'ml-2 inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm transition-colors',
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

      {visible.length === 0 || !selected ? (
        <div className="mt-6 rounded-lg border border-border py-16 text-center">
          <p className="text-sm text-foreground">No deals on your favorites right now</p>
          <p className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
            {"We'll surface them here the moment one of your players lists 20% under median."}
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-border lg:grid lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            {visible.map((item) => {
              const isSelected = item.deal.id === selected.deal.id
              return (
                <div key={item.deal.id}>
                  <DealRow item={item} selected={isSelected} onSelect={() => setSelectedId(item.deal.id)} />
                  {isSelected && (
                    <div className="border-b border-border bg-card lg:hidden">
                      <DealDetail item={item} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <aside aria-label="Deal details" className="hidden border-l border-border bg-card lg:block">
            <div className="sticky top-16">
              <DealDetail item={selected} />
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
