'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Market' },
  { href: '/players', label: 'Prospects' },
  { href: '/auctions', label: 'Auctions' },
  { href: '/radar', label: 'Radar' },
  { href: '/favorites', label: 'Favorites' },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export function SiteNav() {
  const pathname = usePathname() || '/'

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="size-2.5 rotate-45 rounded-[2px] bg-primary" aria-hidden />
          <span className="text-sm font-medium tracking-tight text-foreground">
            College Cards
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = isActive(pathname, l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'relative rounded-md px-3 py-1.5 text-sm transition-colors',
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[21px] h-px bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Utilities */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-input hover:text-foreground sm:flex"
            aria-label="Search prospects"
          >
            Search
            <kbd className="rounded border border-border bg-muted px-1 font-mono text-[10px] text-muted-foreground">
              /
            </kbd>
          </button>
          <span
            className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-medium text-muted-foreground"
            aria-hidden
          >
            A
          </span>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 border-t border-border px-4 py-1.5 md:hidden">
        {links.map((l) => {
          const active = isActive(pathname, l.href)
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm transition-colors',
                active ? 'bg-secondary text-foreground' : 'text-muted-foreground',
              )}
            >
              {l.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
