import type { Metadata } from 'next'
import { DealsBoard } from '@/components/deals-board'
import { dealsCheckedMinutesAgo } from '@/lib/deals'

export const metadata: Metadata = {
  title: 'Deals · College Cards',
  description:
    'Buy It Now listings priced 20% or more below the card’s 90-day median sale, plotted against recent comps.',
}

export default function DealsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <header className="mb-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Buy it now
        </span>
        <h1 className="mt-3 font-display text-4xl font-light tracking-tight text-foreground">Deals</h1>
        <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
          Listings at least 20% under the card&apos;s 90-day median. Each dot is a recent sale — the green
          marker is the asking price. Listing price only; shipping not included. Checked{' '}
          {dealsCheckedMinutesAgo} min ago.
        </p>
      </header>

      <DealsBoard />

      <p className="mt-6 text-xs text-muted-foreground">
        eBay Partner: we may earn from qualifying purchases.
      </p>
    </div>
  )
}
