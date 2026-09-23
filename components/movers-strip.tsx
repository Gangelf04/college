import Link from 'next/link'
import { risers, fallers, formatMoney, type Player } from '@/lib/data'
import { ChangePill } from '@/components/change-pill'

function Column({ title, items }: { title: string; items: Player[] }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
      <ul className="mt-3">
        {items.map((p) => (
          <li key={p.id}>
            <Link
              href={`/players/${p.id}`}
              className="group flex items-center justify-between gap-3 border-b border-border py-2.5 last:border-0"
            >
              <span className="truncate text-sm text-foreground transition-colors group-hover:text-primary">
                {p.name}
              </span>
              <span className="flex items-center gap-4">
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {formatMoney(p.marketCents, 0)}
                </span>
                <ChangePill value={p.changePct} showIcon={false} className="w-16 justify-end" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function MoversStrip() {
  return (
    <div className="grid gap-10 border-y border-border py-8 sm:grid-cols-2">
      <Column title="Top risers · 7d" items={risers} />
      <Column title="Top fallers · 7d" items={fallers} />
    </div>
  )
}
