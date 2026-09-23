'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatMoney, type Auction, type Player } from '@/lib/data'

function useCountdown(totalMinutes: number) {
  const [secs, setSecs] = useState(totalMinutes * 60)
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  const urgent = secs < 15 * 60
  const label = h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s.toString().padStart(2, '0')}s` : `${s}s`
  return { label, urgent }
}

export function AuctionRow({ auction, player }: { auction: Auction; player: Player }) {
  const { label, urgent } = useCountdown(auction.endsInMin)
  const isDeal = auction.dealScore < 0

  return (
    <div className="grid grid-cols-2 items-center gap-x-4 gap-y-2 py-5 md:grid-cols-[minmax(0,2.4fr)_1fr_1.1fr_1fr_auto]">
      {/* prospect */}
      <div className="col-span-2 min-w-0 md:col-span-1">
        <Link href={`/players/${player.id}`} className="group inline-flex max-w-full flex-col">
          <span className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            {player.name}
          </span>
          <span className="mt-0.5 truncate font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
            {auction.product} · {auction.parallel}
            {auction.serial ? ` ${auction.serial}` : ''}
          </span>
        </Link>
      </div>

      {/* bid */}
      <div className="md:text-right">
        <span className="font-mono text-base tabular-nums text-foreground">
          {formatMoney(auction.currentBidCents, 0)}
        </span>
        <span className="ml-2 font-mono text-xs text-muted-foreground">{auction.bids} bids</span>
      </div>

      {/* ends + signal */}
      <div className="md:text-right">
        <span className={cn('font-mono text-sm tabular-nums', urgent ? 'text-loss' : 'text-muted-foreground')}>
          {label}
        </span>
        <span
          className={cn(
            'ml-2 font-mono text-[11px] tabular-nums',
            isDeal ? 'text-gain' : 'text-loss',
          )}
        >
          {isDeal ? 'DEAL' : 'OVER'} {auction.dealScore > 0 ? '+' : ''}
          {auction.dealScore.toFixed(0)}%
        </span>
      </div>

      {/* market */}
      <div className="md:text-right">
        <span className="font-mono text-sm tabular-nums text-muted-foreground">
          {formatMoney(auction.marketCents, 0)}
        </span>
      </div>

      {/* link */}
      <a
        href="https://www.ebay.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${player.name} auction on eBay`}
        className="col-span-2 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary md:col-span-1 md:justify-self-end"
      >
        <span className="md:hidden">View on eBay</span>
        <ArrowUpRight className="size-4" />
      </a>
    </div>
  )
}
