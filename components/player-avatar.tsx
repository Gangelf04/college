import { cn } from '@/lib/utils'
import type { Player } from '@/lib/data'

export function PlayerAvatar({
  player,
  size = 40,
  className,
}: {
  player: Pick<Player, 'initials' | 'schoolColor' | 'schoolAbbr'>
  size?: number
  className?: string
}) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-md bg-secondary font-mono font-medium text-muted-foreground',
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.32,
      }}
      aria-hidden="true"
    >
      {player.initials}
    </span>
  )
}
