import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { formatMoney } from '@/lib/data'
import { games, getGame, scheduleMeta, trackedIn, type GameTeam } from '@/lib/games'
import { TeamRoster } from '@/components/team-roster'

export function generateStaticParams() {
  return games.map((g) => ({ id: g.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const game = getGame(id)
  if (!game) return { title: 'Game not found · College Cards' }
  return {
    title: `${game.away.name} at ${game.home.name} · College Cards`,
    description: `Tracked prospects, card prices, and season stats for ${game.away.name} at ${game.home.name}.`,
  }
}

function ScoreSide({ team, align }: { team: GameTeam; align: 'left' | 'right' }) {
  const value = team.tracked.reduce((sum, p) => sum + p.priceCents, 0)
  return (
    <div className={align === 'right' ? 'flex flex-col items-end text-right' : 'flex flex-col'}>
      <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
        {team.rank ? `#${team.rank}` : 'Unranked'}
      </span>
      <span className="font-display text-xl font-light tracking-tight text-foreground md:text-2xl">
        {team.name}
      </span>
      <span className="font-mono text-xs tabular-nums text-muted-foreground">
        {team.record}
        {team.confRecord !== '—' ? ` (${team.confRecord})` : ''} · {team.conference}
      </span>
      <span className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {team.tracked.length} tracked · {formatMoney(value)} total
      </span>
    </div>
  )
}

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const game = getGame(id)
  if (!game) notFound()

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:py-10">
      <Link
        href="/games"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        All games
      </Link>

      <header className="mt-6 rounded-lg border border-border bg-card p-5 md:p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {game.day}, {game.date} · {game.time} ET · {game.network} · Week {game.week}
        </p>
        <h1 className="sr-only">
          {game.away.name} at {game.home.name}
        </h1>
        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <ScoreSide team={game.away} align="left" />
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">at</span>
          <ScoreSide team={game.home} align="right" />
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
        <TeamRoster team={game.away} side="Away" />
        <TeamRoster team={game.home} side="Home" />
      </div>

      <p className="mt-8 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {trackedIn(game).length} players · 2026 season stats · {scheduleMeta}
      </p>
    </div>
  )
}
