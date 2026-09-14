import { useState } from 'react'

interface AvatarProps {
  url?: string | null
  name?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const SIZES: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
}

function initialsOf(name: string | null | undefined) {
  if (!name || !name.trim()) return '?'
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Avatar({ url, name, size = 'md', className = '' }: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = url && !imageFailed

  return (
    <div
      className={`rounded-full shrink-0 flex items-center justify-center overflow-hidden bg-[#854F0B] ${SIZES[size]} ${className}`}
      aria-hidden={showImage ? undefined : true}
    >
      {showImage ? (
        <img
          src={url}
          alt={name ? `${name}'s profile picture` : 'Profile picture'}
          className="w-full h-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="font-semibold text-white leading-none">{initialsOf(name)}</span>
      )}
    </div>
  )
}
