interface BarDatum {
  label: string
  value: number
}

export default function BarChart({ data, color = '#0C447C' }: { data: BarDatum[]; color?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value))

  return (
    <div className="flex items-end justify-between gap-3 h-40">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <div
            className="w-full max-w-[32px] rounded-t-sm transition-all"
            style={{ height: `${(d.value / max) * 100}%`, backgroundColor: color, minHeight: d.value > 0 ? 4 : 0 }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
