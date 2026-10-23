import Link from 'next/link'
import { formatMoney } from '@/lib/data'
import type { GameTeam, TrackedPlayer } from '@/lib/games'
import { ChangePill } from '@/components/change-pill'

function PlayerCard({ player }: { player: TrackedPlayer }) {
  const body = (
    <>
      <div className="flex items-center gap-3 p-4 pb-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-[11px] font-medium text-muted-foreground"
          aria-hidden
        >
          {player.initials}
        </span>
        <div className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            {player.name}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {player.position}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-display text-xl font-light tabular-nums text-foreground">
            {formatMoney(player.priceCents, 0)}
          </span>
          <ChangePill value={player.changePct} showIcon={false} className="text-[11px]" />
        </div>
      </div>
      <dl className="grid grid-cols-4 gap-2 border-t border-border px-4 py-3">
        {player.stats.map((s) => (
          <div key={s.label} className="flex flex-col">
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</dt>
            <dd className="font-mono text-sm tabular-nums text-foreground">{s.value}</dd>
          </div>
        ))}
      </dl>
    </>
  )

  const cardClass =
    'group flex flex-col rounded-lg border border-border bg-card transition-colors hover:border-muted-foreground/30'

  return (
    <li>
      {player.playerId ? (
        <Link href={`/players/${player.playerId}`} className={cardClass}>
          {body}
        </Link>
      ) : (
        <div className={cardClass}>{body}</div>
      )}
    </li>
  )
}

export function TeamRoster({ team, side }: { team: GameTeam; side: 'Away' | 'Home' }) {
  const value = team.tracked.reduce((sum, p) => sum + p.priceCents, 0)

  return (
    <section aria-labelledby={`roster-${team.abbr}`} className="min-w-0">
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex h-8 w-11 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-[10px] font-medium tracking-wider text-foreground"
          aria-hidden
        >
          {team.abbr}
        </span>
        <h2 id={`roster-${team.abbr}`} className="flex-1 text-sm font-medium text-foreground">
          {team.name}
          <span className="ml-2 font-mono text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
            {side}
          </span>
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {team.tracked.length} tracked · {formatMoney(value, 0)}
        </span>
      </div>
      {team.tracked.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          No tracked players.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {team.tracked.map((p) => (
            <PlayerCard key={p.name} player={p} />
          ))}
        </ul>
      )}
    </section>
  )
}
