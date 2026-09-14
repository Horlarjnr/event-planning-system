import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
}

export default function EmptyState({ icon: Icon = Inbox, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon size={40} className="text-gray-300 dark:text-gray-600 mb-3" />
      <p className="text-gray-700 dark:text-gray-300 font-medium">{title}</p>
      {description && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{description}</p>}
    </div>
  )
}
