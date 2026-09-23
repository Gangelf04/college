import { cn } from '@/lib/utils'

export function ChangePill({
  value,
  className,
  showIcon = true,
}: {
  value: number
  className?: string
  showIcon?: boolean
}) {
  const positive = value >= 0
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-mono text-xs tabular-nums',
        positive ? 'text-gain' : 'text-loss',
        className,
      )}
    >
      {showIcon && (
        <span aria-hidden className="text-[10px] leading-none">
          {positive ? '▲' : '▼'}
        </span>
      )}
      {positive ? '+' : ''}
      {value.toFixed(1)}%
    </span>
  )
}
