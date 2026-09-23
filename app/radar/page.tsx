import type { Metadata } from 'next'
import { hypeItems, players } from '@/lib/data'
import { HypeCard } from '@/components/hype-card'

export const metadata: Metadata = {
  title: 'Hype Radar · College Cards',
  description: 'A composite demand score blending card market, on-field production, media buzz, and draft stock.',
}

export default function HypePage() {
  const ranked = hypeItems
    .map((item) => ({ item, player: players.find((p) => p.id === item.playerId) }))
    .filter((x): x is { item: (typeof hypeItems)[number]; player: (typeof players)[number] } => Boolean(x.player))
    .sort((a, b) => b.item.score - a.item.score)

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
      <header className="mb-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Demand index
        </span>
        <h1 className="mt-3 font-display text-4xl font-light tracking-tight text-foreground">
          Hype Radar
        </h1>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          A 0–100 demand score blending market, on-field, media, and draft signals.
        </p>
      </header>

      <div>
        {ranked.map(({ item, player }, i) => (
          <HypeCard key={item.playerId} item={item} player={player} rank={i + 1} />
        ))}
      </div>
    </div>
  )
}
