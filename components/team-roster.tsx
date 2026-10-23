import Link from 'next/link'
import { formatMoney } from '@/lib/data'
import type { GameTeam, TrackedPlayer } from '@/lib/games'
import { ChangePill } from '@/components/change-pill'

function PlayerName({ player }: { player: TrackedPlayer }) {
  const label = (
    <span className="block truncate text-sm text-foreground">{player.name}</span>
  )
  if (!player.playerId) return label
  return (
    <Link href={`/players/${player.playerId}`} className="block truncate hover:underline hover:underline-offset-4">
      {label}
    </Link>
  )
}

function RosterRow({ player }: { player: TrackedPlayer }) {
  return (
    <li className="flex flex-col gap-2 py-3">
      <div className="flex items-center gap-3">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-[10px] font-medium text-muted-foreground"
          aria-hidden
        >
          {player.initials}
        </span>
        <div className="min-w-0 flex-1">
          <PlayerName player={player} />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {player.position}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono text-sm tabular-nums text-foreground">{formatMoney(player.priceCents)}</span>
          <ChangePill value={player.changePct} showIcon={false} className="text-[11px]" />
        </div>
      </div>
      <dl className="ml-11 grid grid-cols-4 gap-2">
        {player.stats.map((s) => (
          <div key={s.label} className="flex flex-col">
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</dt>
            <dd className="font-mono text-xs tabular-nums text-foreground">{s.value}</dd>
          </div>
        ))}
      </dl>
    </li>
  )
}

export function TeamRoster({ team, side }: { team: GameTeam; side: 'Away' | 'Home' }) {
  return (
    <section aria-labelledby={`roster-${team.abbr}`} className="min-w-0">
      <div className="flex items-baseline justify-between border-b border-border pb-2">
        <h2 id={`roster-${team.abbr}`} className="text-sm font-medium text-foreground">
          {team.name}
          <span className="ml-2 font-mono text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
            {side}
          </span>
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {team.tracked.length} tracked
        </span>
      </div>
      {team.tracked.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">No tracked players.</p>
      ) : (
        <ul className="divide-y divide-border">
          {team.tracked.map((p) => (
            <RosterRow key={p.name} player={p} />
          ))}
        </ul>
      )}
    </section>
  )
}
