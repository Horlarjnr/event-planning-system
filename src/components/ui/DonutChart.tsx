interface DonutSegment {
  label: string
  value: number
  color: string
}

export default function DonutChart({ segments }: { segments: DonutSegment[] }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  const radius = 60
  const strokeWidth = 26
  const circumference = 2 * Math.PI * radius

  let offsetSoFar = 0

  return (
    <div className="flex items-center gap-8 flex-wrap">
      <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90 shrink-0">
        {total === 0 ? (
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth} />
        ) : (
          segments.map((s) => {
            const fraction = s.value / total
            const dash = fraction * circumference
            const el = (
              <circle
                key={s.label}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offsetSoFar}
              />
            )
            offsetSoFar += dash
            return el
          })
        )}
      </svg>
      <ul className="space-y-2">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
            {s.label} {s.value}
          </li>
        ))}
      </ul>
    </div>
  )
}
