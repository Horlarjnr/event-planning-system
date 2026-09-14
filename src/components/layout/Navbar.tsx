import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { signOut } from '../../features/auth/authService'
import Logo from './Logo'
import ProfileMenu from './ProfileMenu'
import { dashboardPathFor, profilePathFor } from './navConfig'

export default function Navbar() {
  const { user, profile, role } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await signOut()
    setMenuOpen(false)
    navigate('/')
  }

  const dashboardPath = dashboardPathFor(role)
  const profilePath = profilePathFor(role)

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 relative">
      <div className="flex items-center justify-between px-6 py-3.5 max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <Logo />
          <span className="text-lg font-bold text-[#0C447C]">EventEase</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          <Link to="/venues" className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#0C447C] dark:hover:text-[#85B7EB]">Venues</Link>
          <Link to="/caterers" className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#0C447C] dark:hover:text-[#85B7EB]">Caterers</Link>
          <Link to="/#how-it-works" className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#0C447C] dark:hover:text-[#85B7EB]">How it works</Link>
          {user ? (
            <>
              <Link to={dashboardPath} className="text-sm font-semibold text-[#0C447C]">Dashboard</Link>
              <ProfileMenu profile={profile} dashboardPath={dashboardPath} profilePath={profilePath} onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-[#0C447C]">Log in</Link>
              <Link to="/register">
                <button className="bg-[#0C447C] text-white rounded-lg px-4 py-2 text-sm font-medium">Sign up</button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="sm:hidden text-[#0C447C]" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-1 px-6 pb-4 border-t border-gray-100 dark:border-gray-800">
          <Link to="/venues" className="py-2 text-sm text-gray-600 dark:text-gray-300" onClick={() => setMenuOpen(false)}>Venues</Link>
          <Link to="/caterers" className="py-2 text-sm text-gray-600 dark:text-gray-300" onClick={() => setMenuOpen(false)}>Caterers</Link>
          <Link to="/#how-it-works" className="py-2 text-sm text-gray-600 dark:text-gray-300" onClick={() => setMenuOpen(false)}>How it works</Link>
          {user ? (
            <>
              <Link to={dashboardPath} className="py-2 text-sm text-gray-600 dark:text-gray-300" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to={profilePath} className="py-2 text-sm text-gray-600 dark:text-gray-300" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="bg-[#0C447C] text-white rounded-lg px-4 py-2 text-sm font-medium mt-2">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="py-2 text-sm text-gray-600 dark:text-gray-300" onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <button className="bg-[#0C447C] text-white rounded-lg px-4 py-2 text-sm font-medium mt-2 w-full">Sign up</button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
