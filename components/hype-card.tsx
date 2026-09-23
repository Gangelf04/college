import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { HypeItem, Player } from '@/lib/data'

const componentLabels: { key: keyof HypeItem['components']; label: string }[] = [
  { key: 'market', label: 'Market' },
  { key: 'performance', label: 'On-field' },
  { key: 'media', label: 'Media' },
  { key: 'draft', label: 'Draft' },
]

export function HypeCard({ item, player, rank }: { item: HypeItem; player: Player; rank: number }) {
  const delta = item.score - item.scorePrev
  const rising = delta >= 0
  const scoreColor =
    item.score >= 80 ? 'text-gain' : item.score >= 55 ? 'text-foreground' : 'text-loss'

  return (
    <div className="flex flex-col gap-6 border-b border-border py-8 last:border-0 md:flex-row md:gap-12">
      {/* left: identity + score */}
      <div className="flex items-center gap-4 md:w-64 md:shrink-0">
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {rank.toString().padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <Link
            href={`/players/${player.id}`}
            className="block truncate text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            {player.name}
          </Link>
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {player.position} · {player.school}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={cn('font-display text-3xl font-light tabular-nums', scoreColor)}>
              {item.score}
            </span>
            <span className={cn('font-mono text-xs tabular-nums', rising ? 'text-gain' : 'text-loss')}>
              {rising ? '+' : ''}
              {delta}
            </span>
          </div>
        </div>
      </div>

      {/* right: reason + components + sources */}
      <div className="flex flex-1 flex-col gap-5">
        <p className="text-pretty text-sm leading-relaxed text-foreground/90">{item.reason}</p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
          {componentLabels.map(({ key, label }) => {
            const val = item.components[key]
            return (
              <div key={key}>
                <div className="mb-1.5 flex items-center justify-between text-[11px]">
                  <span className="font-mono uppercase tracking-[0.1em] text-muted-foreground">{label}</span>
                  <span className="font-mono tabular-nums text-foreground">{val}</span>
                </div>
                <div className="h-px bg-border">
                  <div
                    className={cn('h-px', val >= 80 ? 'bg-gain' : val >= 55 ? 'bg-primary' : 'bg-loss')}
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
          {item.sources.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <span className="font-medium text-foreground/80">{s.outlet}</span>
              <span className="hidden truncate sm:inline">— {s.title}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
