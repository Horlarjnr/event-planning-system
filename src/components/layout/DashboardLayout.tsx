import { useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import Logo from './Logo'
import Avatar from '../ui/Avatar'
import NotificationBell, { type NotificationItem } from '../ui/NotificationBell'
import { signOut } from '../../features/auth/authService'
import { useAuth } from '../../context/AuthContext'
import { profilePathFor } from './navConfig'

export interface DashboardNavItem {
  label: string
  path: string
}

interface DashboardLayoutProps {
  navItems: DashboardNavItem[]
  footerInitials: string
  footerLabel: string
  title?: string
  /** Optional — pass pending items (bookings, requests) relevant to this role's dashboard. */
  notifications?: NotificationItem[]
  children: ReactNode
}

export default function DashboardLayout({
  navItems,
  footerLabel,
  title,
  notifications = [],
  children,
}: DashboardLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, role } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const profilePath = profilePathFor(role)

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      {/* Mobile top bar */}
      <div className="sm:hidden fixed top-0 inset-x-0 h-14 bg-[#0C447C] flex items-center justify-between px-4 z-30">
        <Link to="/" className="flex items-center gap-2">
          <Logo theme="dark" />
          <span className="text-white font-medium">EventEase</span>
        </Link>
        <div className="flex items-center gap-1">
          <NotificationBell items={notifications} dark />
          <Link to={profilePath} aria-label="My profile">
            <Avatar url={profile?.avatar_url} name={footerLabel} size="sm" />
          </Link>
          <button className="text-white ml-1" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-[#0C447C] w-64 shrink-0 flex-col fixed sm:static inset-y-0 left-0 z-20 pt-14 sm:pt-0 transition-transform
        ${menuOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 flex`}
      >
        <Link to="/" className="hidden sm:flex items-center gap-2.5 px-6 pt-7 pb-8">
          <Logo theme="dark" />
          <span className="text-white text-lg font-semibold">EventEase</span>
        </Link>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  active ? 'bg-[#185FA5] text-white' : 'text-[#B5D4F4] hover:bg-[#0A3A69] hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-4 pb-6 pt-4 border-t border-white/10 mx-4">
          <Link to={profilePath} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 group">
            <Avatar url={profile?.avatar_url} name={footerLabel} size="sm" />
            <span className="text-sm text-white truncate group-hover:underline">{footerLabel}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-2 text-sm text-[#B5D4F4] hover:text-white"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div className="sm:hidden fixed inset-0 bg-black/30 z-10" onClick={() => setMenuOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 pt-14 sm:pt-0">
        <div className="px-6 sm:px-10 py-8 sm:py-10 max-w-6xl mx-auto">
          {title && (
            <div className="flex items-center justify-between mb-8 gap-4">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
              <div className="hidden sm:flex items-center gap-2">
                <NotificationBell items={notifications} />
              </div>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}
