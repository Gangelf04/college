import type { Metadata } from 'next'
import { PlayerDirectory } from '@/components/player-directory'

export const metadata: Metadata = {
  title: 'Prospects · College Cards',
  description: 'Browse tracked college football prospects and their card markets.',
}

export default function PlayersPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <header className="mb-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Directory
        </span>
        <h1 className="mt-3 font-display text-4xl font-light tracking-tight text-foreground">
          Prospects
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every prospect we track, ranked by hobby demand.
        </p>
      </header>
      <PlayerDirectory />
    </div>
  )
}
