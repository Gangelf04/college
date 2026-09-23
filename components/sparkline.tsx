type SparklineProps = {
  data: number[]
  positive?: boolean
  width?: number
  height?: number
  className?: string
  strokeWidth?: number
}

export function Sparkline({
  data,
  positive = true,
  width = 88,
  height = 28,
  className,
  strokeWidth = 1.6,
}: SparklineProps) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)
  const points = data.map((v, i) => {
    const x = i * stepX
    const y = height - ((v - min) / range) * (height - strokeWidth * 2) - strokeWidth
    return [x, y] as const
  })
  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const color = positive ? 'var(--gain)' : 'var(--loss)'
  const gradId = `spark-${positive ? 'up' : 'down'}`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${line} L${width} ${height} L0 ${height} Z`}
        fill={`url(#${gradId})`}
        stroke="none"
      />
      <path d={line} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
