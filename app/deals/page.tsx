import type { Metadata } from 'next'
import { DealsBoard } from '@/components/deals-board'

export const metadata: Metadata = {
  title: 'Deals · College Cards',
  description:
    'Buy It Now listings priced 20% or more below the card’s 90-day median sale, plotted against recent comps.',
}

export default function DealsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:py-10">
      <header className="mb-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Buy it now
        </span>
        <h1 className="mt-2 font-display text-2xl font-light tracking-tight text-foreground">Deals</h1>
        <p className="mt-1 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
          New eBay Buy It Now listings priced 20% or more below the card&apos;s 90-day median sale. Prices
          are the listing price only — shipping is never included.
        </p>
      </header>

      <DealsBoard />

      <p className="mt-6 text-xs text-muted-foreground">
        eBay Partner: we may earn from qualifying purchases.
      </p>
    </div>
  )
}
