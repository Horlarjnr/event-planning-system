import type { LucideIcon } from 'lucide-react'
import { Construction } from 'lucide-react'

interface ComingSoonProps {
  icon?: LucideIcon
  title?: string
  description?: string
}

export default function ComingSoon({
  icon: Icon = Construction,
  title = 'Coming soon',
  description = "We're still building this part of EventEase — check back shortly.",
}: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
      <div className="w-16 h-16 rounded-full bg-[#E6F1FB] dark:bg-[#0C447C]/20 flex items-center justify-center mb-4">
        <Icon size={28} className="text-[#0C447C] dark:text-[#85B7EB]" />
      </div>
      <p className="text-lg font-medium text-[#0C447C] dark:text-[#85B7EB]">{title}</p>
      {description && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-sm">{description}</p>}
    </div>
  )
}
