import Link from 'next/link'
import {
  players,
  marketStats,
  marketSeries,
  formatMoney,
  formatCompact,
  type Player,
} from '@/lib/data'
import { MarketChart } from '@/components/market-chart'
import { ChangePill } from '@/components/change-pill'
import { Sparkline } from '@/components/sparkline'

const ranked = [...players].sort((a, b) => a.rank - b.rank)
const board = ranked.slice(0, 8)
const risers = [...players]
  .filter((p) => p.changePct > 0)
  .sort((a, b) => b.changePct - a.changePct)
  .slice(0, 4)
const fallers = [...players]
  .filter((p) => p.changePct < 0)
  .sort((a, b) => a.changePct - b.changePct)
  .slice(0, 4)

const firstAvg = marketSeries[0]?.avgPrice ?? 0
const lastAvg = marketSeries[marketSeries.length - 1]?.avgPrice ?? 0
const indexChange = firstAvg ? ((lastAvg - firstAvg) / firstAvg) * 100 : 0

const metrics = [
  { value: marketStats.activePlayers.toLocaleString(), label: 'Prospects tracked' },
  { value: marketStats.totalSales.toLocaleString(), label: 'Sold comps · 30d' },
  { value: formatMoney(marketStats.avgPriceCents, 0), label: 'Average sale' },
  { value: `$${formatCompact(marketStats.totalValueCents / 100)}`, label: 'Volume · 30d' },
]

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </span>
  )
}

export default function MarketPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      {/* ============================= OVERVIEW ============================= */}
      <section>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>CFB Prospect Index</Eyebrow>
            <div className="mt-4 flex items-baseline gap-4">
              <h1 className="font-display text-6xl font-light tabular-nums tracking-tight text-foreground md:text-7xl">
                ${Math.round(lastAvg)}
              </h1>
              <ChangePill value={indexChange} className="text-sm" />
            </div>
            <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
              Composite average sale price across every tracked college football prospect
              card, over the trailing thirty days.
            </p>
          </div>
        </div>

        {/* Ribbon chart — no box, sits on the page */}
        <div className="mt-8 border-t border-border pt-4">
          <MarketChart data={marketSeries} />
        </div>
      </section>

      {/* ============================== METRICS ============================= */}
      <section>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-border py-8 md:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label}>
              <dd className="font-display text-3xl font-light tabular-nums tracking-tight text-foreground">
                {m.value}
              </dd>
              <dt className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {m.label}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ===================== TOP PROSPECTS + MOVERS ====================== */}
      <section className="mt-14 grid grid-cols-1 gap-x-14 gap-y-14 lg:grid-cols-3">
        {/* Top prospects */}
        <div className="lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium tracking-tight text-foreground">Top prospects</h2>
            <Link
              href="/players"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              View all
            </Link>
          </div>

          <ol className="mt-4">
            {board.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/players/${p.id}`}
                  className="group grid grid-cols-[1.5rem_1fr_auto] items-center gap-4 border-b border-border py-3.5 transition-colors last:border-0"
                >
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {String(p.rank).padStart(2, '0')}
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                      {p.name}
                    </span>
                    <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      {p.position} · {p.school}
                    </span>
                  </span>

                  <span className="flex items-center gap-6">
                    <span className="hidden opacity-70 sm:block">
                      <Sparkline data={p.spark} positive={p.changePct >= 0} width={72} height={24} />
                    </span>
                    <span className="flex w-24 flex-col items-end gap-0.5">
                      <span className="font-mono text-sm tabular-nums text-foreground">
                        {formatMoney(p.marketCents, 0)}
                      </span>
                      <ChangePill value={p.changePct} showIcon={false} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        {/* Movers */}
        <div className="lg:col-span-1">
          <h2 className="text-sm font-medium tracking-tight text-foreground">Biggest moves</h2>
          <MoveGroup label="Rising" items={risers} className="mt-4" />
          <MoveGroup label="Falling" items={fallers} className="mt-8" />
        </div>
      </section>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

function MoveGroup({
  label,
  items,
  className,
}: {
  label: string
  items: Player[]
  className?: string
}) {
  return (
    <div className={className}>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <ul className="mt-2">
        {items.map((p) => (
          <li key={p.id}>
            <Link
              href={`/players/${p.id}`}
              className="group flex items-center justify-between gap-3 border-b border-border py-2.5 last:border-0"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm text-foreground transition-colors group-hover:text-primary">
                  {p.name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {p.position} · {p.school}
                </span>
              </span>
              <span className="flex flex-col items-end gap-0.5">
                <span className="font-mono text-sm tabular-nums text-foreground">
                  {formatMoney(p.marketCents, 0)}
                </span>
                <ChangePill value={p.changePct} showIcon={false} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
