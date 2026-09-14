import { MapPin } from 'lucide-react'

interface LogoProps {
  /** 'mark' = small circle used in navbars/sidebars. 'avatar' = large circle used on auth screens. */
  variant?: 'mark' | 'avatar'
  /** 'light' = navy circle for use on white backgrounds. 'dark' = pale circle for use on navy backgrounds. */
  theme?: 'light' | 'dark'
}

// Icon-based mark (navy circle + location pin) matching the EventEase brand
// mark, kept as a component rather than a raster file so it stays crisp at
// every size and inherits brand colors automatically. Swap this file's
// contents for an <img> once an official logo asset is supplied — every
// call site (Navbar, DashboardLayout, auth pages) already renders <Logo />
// so nothing else needs to change.
export default function Logo({ variant = 'mark', theme = 'light' }: LogoProps) {
  const isAvatar = variant === 'avatar'
  const circleClasses = theme === 'dark' ? 'bg-white' : 'bg-[#0C447C]'
  const iconClasses = theme === 'dark' ? 'text-[#0C447C]' : 'text-white'
  const sizeClasses = isAvatar ? 'w-20 h-20' : 'w-8 h-8'
  const iconSize = isAvatar ? 36 : 18

  return (
    <div className={`rounded-full flex items-center justify-center shrink-0 ${sizeClasses} ${circleClasses}`}>
      <MapPin size={iconSize} className={iconClasses} strokeWidth={2.25} fill="currentColor" fillOpacity={0.15} />
    </div>
  )
}
