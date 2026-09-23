import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bell, Heart } from 'lucide-react'
import {
  players,
  positionLabels,
  formatMoney,
  formatCompact,
  type CardSale,
} from '@/lib/data'
import { PlayerAvatar } from '@/components/player-avatar'
import { PlayerRadar } from '@/components/player-radar'
import { PriceTrends } from '@/components/price-trends'
import { ChangePill } from '@/components/change-pill'
import { cn } from '@/lib/utils'

export function generateStaticParams() {
  return players.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const player = players.find((p) => p.id === id)
  if (!player) return { title: 'Player · College Cards' }
  return {
    title: `${player.name} · College Cards`,
    description: `${player.name} — ${positionLabels[player.position]}, ${player.school}. Card market data, prices, and scouting profile.`,
  }
}

function SectionHeading({ children, meta }: { children: React.ReactNode; meta?: string }) {
  return (
    <div className="mb-6 flex items-baseline justify-between">
      <h2 className="text-sm font-medium tracking-tight text-foreground">{children}</h2>
      {meta && <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{meta}</span>}
    </div>
  )
}

function Metric({ value, label, accent }: { value: string; label: string; accent?: 'gain' | 'primary' }) {
  return (
    <div>
      <p
        className={cn(
          'font-display text-2xl font-light tabular-nums tracking-tight text-foreground',
          accent === 'gain' && 'text-gain',
          accent === 'primary' && 'text-primary',
        )}
      >
        {value}
      </p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
    </div>
  )
}

const ghostBtn =
  'flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground'

const sectionClass = 'mt-14 border-t border-border pt-10'

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const player = players.find((p) => p.id === id)
  if (!player) notFound()

  const currentSeason = player.seasons[player.seasons.length - 1]
  const totalLive = player.cards.reduce((s, c) => s + c.live, 0)
  const totalSold = player.cards.reduce((s, c) => s + c.sold, 0)
  const flagship = player.cards[0]
  const pickDelta =
    player.projectedPick && player.projectedPickPrev ? player.projectedPickPrev - player.projectedPick : 0

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/players" className={cn(ghostBtn, '-ml-2')} aria-label="Back to prospects">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-4xl font-light tracking-tight text-foreground">{player.name}</h1>
              <span className="font-mono text-xs text-muted-foreground">#{player.rank}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{player.firstCard}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" className={ghostBtn} aria-label="Favorite">
            <Heart className="size-4" />
          </button>
          <button type="button" className={ghostBtn} aria-label="Set alert">
            <Bell className="size-4" />
          </button>
        </div>
      </div>

      {/* Profile + radar */}
      <section className="mt-10 grid gap-12 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="flex flex-col gap-5 sm:flex-row">
            <PlayerAvatar player={player} size={88} className="rounded-lg" />
            <div className="flex-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                {positionLabels[player.position]} · {player.school} · {player.classYear}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Age {player.age} · Class of{' '}
                {2026 + (player.classYear === 'SR' ? 0 : player.classYear === 'JR' ? 1 : player.classYear === 'SO' ? 2 : 3)}
              </p>
              <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-foreground/90">{player.bio}</p>
              {player.projectedPick && (
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Mock draft</span>
                  <span className="font-mono text-foreground">Pick {player.projectedPick}</span>
                  {pickDelta !== 0 && (
                    <span className={cn('font-mono text-xs', pickDelta > 0 ? 'text-gain' : 'text-loss')}>
                      {pickDelta > 0 ? '↑' : '↓'}
                      {Math.abs(pickDelta)}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* current season stats */}
          <div className="mt-8 border-t border-border pt-6">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {currentSeason.season} stats · {currentSeason.games} games
            </p>
            <div className="grid grid-cols-3 gap-6 sm:grid-cols-5">
              {currentSeason.line.map((s) => (
                <Metric key={s.label} value={String(s.value)} label={s.label} />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:border-l lg:border-border lg:pl-12">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Scouting grades
          </p>
          <PlayerRadar player={player} />
          <p className="mt-1 text-center text-xs text-muted-foreground">20–80 scouting scale</p>
        </div>
      </section>

      {/* Market data */}
      <section className={sectionClass}>
        <SectionHeading meta={`${player.cards.length} products`}>Market data</SectionHeading>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          <Metric value={String(totalLive)} label="Live listings" accent="primary" />
          <Metric value={String(totalSold)} label="Sold · 30d" />
          <Metric value={formatMoney(player.marketCents, 0)} label="Current market" accent="gain" />
          <Metric value={formatMoney(flagship.highCents, 0)} label="30d high" />
          <Metric value={`$${formatCompact(player.volumeCents / 100)}`} label="30d volume" />
        </div>
      </section>

      {/* Price trends */}
      <section className={sectionClass}>
        <SectionHeading meta="Flagship 1st Bowman Auto">Price trends</SectionHeading>
        <PriceTrends player={player} />
        <p className="mt-3 text-xs text-muted-foreground">eBay Partner: we may earn from qualifying purchases.</p>
      </section>

      {/* Cards / products */}
      <section className={sectionClass}>
        <SectionHeading>Cards</SectionHeading>
        <ul>
          {player.cards.map((c) => (
            <li
              key={c.id}
              className="grid grid-cols-1 gap-2 border-b border-border py-4 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {c.year} {c.product}
                </p>
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  #{c.cardNumber} · {c.subset}
                  {c.isAuto && ' · Auto'} · {c.live} live · {c.sold} sold · high {formatMoney(c.highCents, 0)}
                </p>
                <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                  {c.parallels.map((par) => `${par.name}${par.run ? ` /${par.run}` : ''}`).join('  ·  ')}
                </p>
              </div>
              <div className="flex items-center gap-6 sm:flex-col sm:items-end sm:gap-0.5">
                <span className="font-mono text-sm tabular-nums text-foreground">{formatMoney(c.marketCents, 0)}</span>
                <ChangePill value={c.changePct} showIcon={false} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Stats + game log */}
      <section className={cn(sectionClass, 'grid gap-12 lg:grid-cols-2')}>
        <div>
          <SectionHeading>Career stats</SectionHeading>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="pb-2 pr-3 font-normal">Year</th>
                <th className="pb-2 pr-3 font-normal">G</th>
                {currentSeason.line.map((s) => (
                  <th key={s.label} className="pb-2 pr-3 text-right font-normal">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {player.seasons.map((s) => (
                <tr key={s.season} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-3 font-medium text-foreground">{s.season}</td>
                  <td className="py-2.5 pr-3 font-mono tabular-nums text-muted-foreground">{s.games}</td>
                  {s.line.map((l) => (
                    <td key={l.label} className="py-2.5 pr-3 text-right font-mono tabular-nums text-foreground">
                      {l.value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <SectionHeading>Recent games</SectionHeading>
          <ul>
            {player.gameLog.map((g, i) => (
              <li key={i} className="flex items-center justify-between gap-3 border-b border-border py-2.5 last:border-0">
                <div>
                  <p className="text-sm text-foreground">
                    {g.homeAway === 'A' ? 'at ' : 'vs '}
                    {g.opponent.replace(/^at /, '')}
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground">{g.date}</p>
                </div>
                <p className="hidden flex-1 text-center text-xs text-muted-foreground sm:block">{g.line}</p>
                <span
                  className={cn(
                    'font-mono text-xs tabular-nums',
                    g.result.startsWith('W') ? 'text-gain' : 'text-loss',
                  )}
                >
                  {g.result}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sales */}
      <section className={sectionClass}>
        <SectionHeading meta={`${player.sales.length} shown`}>Recent sales</SectionHeading>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="py-2 pr-3 font-normal">Title</th>
                <th className="py-2 pr-3 font-normal">Variant</th>
                <th className="py-2 pr-3 font-normal">Format</th>
                <th className="py-2 pr-3 text-right font-normal">Price</th>
                <th className="py-2 text-right font-normal">Date</th>
              </tr>
            </thead>
            <tbody>
              {player.sales.map((s: CardSale) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="max-w-[360px] py-3 pr-3">
                    <p className="truncate text-foreground">{s.title}</p>
                    {s.grade && <span className="font-mono text-[11px] text-muted-foreground">{s.grade}</span>}
                  </td>
                  <td className="py-3 pr-3 text-xs text-muted-foreground">{s.parallel}</td>
                  <td className="py-3 pr-3 text-xs text-muted-foreground">
                    {s.format}
                    {s.bidCount ? ` · ${s.bidCount} bids` : ''}
                  </td>
                  <td className="py-3 pr-3 text-right">
                    <span className="font-mono tabular-nums text-foreground">{formatMoney(s.priceCents, 2)}</span>
                    {s.baseCents && (
                      <span className="ml-1 block font-mono text-[11px] text-muted-foreground">
                        {(s.priceCents / s.baseCents).toFixed(1)}x base
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right font-mono text-[11px] text-muted-foreground">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
