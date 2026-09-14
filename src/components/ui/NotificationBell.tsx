import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'

export interface NotificationItem {
  id: string
  text: string
  meta?: string
}

interface NotificationBellProps {
  items: NotificationItem[]
  dark?: boolean
}

export default function NotificationBell({ items, dark = false }: NotificationBellProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${items.length ? `, ${items.length} unread` : ''}`}
        className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
          dark ? 'text-white hover:bg-white/10' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <Bell size={18} />
        {items.length > 0 && (
          <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-40 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</p>
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">No new notifications</p>
          ) : (
            <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
              {items.map((item) => (
                <li key={item.id} className="px-4 py-3">
                  <p className="text-sm text-gray-800 dark:text-gray-200">{item.text}</p>
                  {item.meta && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.meta}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
