import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = false,
}: {
  icon: LucideIcon
  label: string
  value: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'flex size-8 items-center justify-center rounded-lg',
            accent ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground',
          )}
        >
          <Icon className="size-4" />
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      </div>
      <p className="mt-3 font-mono text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}
