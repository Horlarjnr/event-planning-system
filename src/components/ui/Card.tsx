import type { ReactNode, MouseEventHandler } from 'react'

export default function Card({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
}) {
  return (
    <div onClick={onClick} className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden ${className}`}>
      {children}
    </div>
  )
}
