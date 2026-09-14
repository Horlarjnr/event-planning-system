import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
}

export default function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-[#0C447C] text-white hover:bg-[#0A3A69]',
    secondary: 'bg-[#854F0B] text-white hover:bg-[#6E4109]',
    outline: 'bg-white dark:bg-gray-800 text-[#0C447C] dark:text-[#85B7EB] border border-[#0C447C] dark:border-[#85B7EB] hover:bg-[#E6F1FB] dark:hover:bg-gray-700',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
