import type { Metadata } from 'next'
import { auctions, players } from '@/lib/data'
import { AuctionRow } from '@/components/auction-card'
import { MoversStrip } from '@/components/movers-strip'

export const metadata: Metadata = {
  title: 'Auctions · College Cards',
  description: 'Live college football prospect card auctions scored against market comps.',
}

export default function AuctionsPage() {
  const live = auctions
    .map((a) => ({ auction: a, player: players.find((p) => p.id === a.playerId) }))
    .filter((x): x is { auction: (typeof auctions)[number]; player: (typeof players)[number] } => Boolean(x.player))
    .sort((a, b) => a.auction.endsInMin - b.auction.endsInMin)

  const deals = live.filter((x) => x.auction.dealScore < 0).length

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <header className="mb-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Live now
        </span>
        <h1 className="mt-3 font-display text-4xl font-light tracking-tight text-foreground">
          Auctions
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {live.length} ending soon · {deals} priced under market
        </p>
      </header>

      <MoversStrip />

      <div className="mt-10">
        <div className="hidden grid-cols-[minmax(0,2.4fr)_1fr_1.1fr_1fr_auto] gap-4 border-b border-border pb-3 md:grid">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Prospect</span>
          <span className="text-right font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Bid</span>
          <span className="text-right font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Ends · Signal</span>
          <span className="text-right font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Market</span>
          <span className="sr-only">Link</span>
        </div>
        <div className="divide-y divide-border border-b border-border">
          {live.map(({ auction, player }) => (
            <AuctionRow key={auction.id} auction={auction} player={player} />
          ))}
        </div>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        eBay Partner: we may earn from qualifying purchases.
      </p>
    </div>
  )
}
