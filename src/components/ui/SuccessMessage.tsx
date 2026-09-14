import { CheckCircle2 } from 'lucide-react'

export default function SuccessMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg px-4 py-3 text-sm">
      <CheckCircle2 size={18} />
      <span>{message}</span>
    </div>
  )
}
