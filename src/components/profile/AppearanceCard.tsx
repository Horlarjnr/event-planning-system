import { Sun, Moon } from 'lucide-react'
import { useTheme, type Theme } from '../../context/ThemeContext'

const OPTIONS: Array<{ value: Theme; label: string; description: string; icon: typeof Sun }> = [
  { value: 'light', label: 'Light', description: 'Use the light theme.', icon: Sun },
  { value: 'dark', label: 'Dark', description: 'Use the dark theme.', icon: Moon },
]

export default function AppearanceCard() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="max-w-lg">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Appearance</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Theme</p>
      <div className="space-y-2">
        {OPTIONS.map(({ value, label, description, icon: Icon }) => {
          const active = theme === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              aria-pressed={active}
              className={`w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                active
                  ? 'border-[#0C447C] bg-[#E6F1FB] dark:border-[#85B7EB] dark:bg-[#0C447C]/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  active ? 'bg-[#0C447C] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
                }`}
              >
                <Icon size={16} />
              </span>
              <span>
                <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">{description}</span>
              </span>
              <span
                className={`ml-auto w-4 h-4 rounded-full border-2 shrink-0 ${
                  active ? 'border-[#0C447C] bg-[#0C447C] dark:border-[#85B7EB] dark:bg-[#85B7EB]' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
