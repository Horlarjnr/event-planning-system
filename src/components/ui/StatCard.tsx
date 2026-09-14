interface StatCardProps {
  label: string
  value: number | string
  accent: string
}

export default function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="bg-[#F8FAFC] dark:bg-gray-800 rounded-xl pl-5 pr-6 py-5 border-l-4" style={{ borderLeftColor: accent }}>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  )
}
