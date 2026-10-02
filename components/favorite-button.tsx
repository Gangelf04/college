'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '@/lib/favorites'
import { cn } from '@/lib/utils'

export function FavoriteButton({
  playerId,
  playerName,
  className,
}: {
  playerId: string
  playerName: string
  className?: string
}) {
  const { isFavorite, toggle } = useFavorites()
  const active = isFavorite(playerId)

  return (
    <button
      type="button"
      onClick={() => toggle(playerId)}
      aria-pressed={active}
      aria-label={active ? `Remove ${playerName} from favorites` : `Add ${playerName} to favorites`}
      className={cn(
        'flex size-8 items-center justify-center rounded-md transition-colors',
        active ? 'text-primary hover:text-primary/80' : 'text-muted-foreground hover:text-foreground',
        className,
      )}
    >
      <Heart className={cn('size-4', active && 'fill-current')} />
    </button>
  )
}
