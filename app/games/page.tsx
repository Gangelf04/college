import type { Metadata } from 'next'
import { GamesSlate } from '@/components/games-slate'
import { scheduleMeta } from '@/lib/games'

export const metadata: Metadata = {
  title: 'Games · College Cards',
  description: 'This week’s games featuring prospects we track, with card prices and season stats.',
}

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:py-10">
      <header className="mb-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          This week
        </span>
        <h1 className="mt-2 font-display text-2xl font-light tracking-tight text-foreground">Games</h1>
        <p className="mt-1 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
          Upcoming games with players we track. Open a game to compare both rosters&apos; card prices
          and season stats.
        </p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {scheduleMeta}
        </p>
      </header>

      <GamesSlate />
    </div>
  )
}
