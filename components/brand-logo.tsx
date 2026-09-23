import { cn } from '@/lib/utils'

export function BrandLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative flex size-9 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground',
        className,
      )}
      aria-hidden="true"
    >
      {/* Chalkboard football glyph — flat team-crest tile */}
      <svg viewBox="0 0 24 24" className="size-5" fill="none">
        <path
          d="M4 12c0-3.4 3.2-6.6 8-6.6s8 3.2 8 6.6-3.2 6.6-8 6.6S4 15.4 4 12Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M9.6 12h4.8M12 9.4v5.2M10.4 10.5v3M13.6 10.5v3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}
