import type { Metadata } from 'next'
import { FavoritesList } from '@/components/favorites-list'

export const metadata: Metadata = {
  title: 'Favorites · College Cards',
  description: 'The prospects you follow and their card markets.',
}

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <header className="mb-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Watchlist</span>
        <h1 className="mt-3 font-display text-4xl font-light tracking-tight text-foreground">Favorites</h1>
        <p className="mt-2 text-sm text-muted-foreground">The prospects you follow, in one place.</p>
      </header>
      <FavoritesList />
    </div>
  )
}
