import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { signOut } from '../../features/auth/authService'
import Logo from './Logo'
import ProfileMenu from './ProfileMenu'
import { dashboardPathFor, profilePathFor } from './navConfig'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Event Centres', to: '/venues' },
  { label: 'Caterers', to: '/caterers' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const { user, profile, role } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await signOut()
    setMenuOpen(false)
    navigate('/')
  }

  const dashboardPath = dashboardPathFor(role)
  const profilePath = profilePathFor(role)

  function isActive(to: string) {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to.split('#')[0]) && to !== '/#how-it-works'
  }

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 relative">
      <div className="flex items-center justify-between px-6 py-3.5 max-w-6xl mx-auto gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMenuOpen(false)}>
          <Logo />
          <span className="text-lg font-bold">
            <span className="text-[#0C447C] dark:text-white">Event</span>
            <span className="text-[#854F0B] dark:text-[#D9A441]">Ease</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`text-sm pb-1 border-b-2 transition-colors ${
                isActive(link.to)
                  ? 'text-[#854F0B] dark:text-[#D9A441] border-[#854F0B] dark:border-[#D9A441] font-medium'
                  : 'text-gray-600 dark:text-gray-300 border-transparent hover:text-[#0C447C] dark:hover:text-[#85B7EB]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-4 ml-auto">
          <Link
            to="/venues"
            aria-label="Search"
            className="text-gray-500 dark:text-gray-400 hover:text-[#0C447C] dark:hover:text-[#85B7EB]"
          >
            <Search size={18} />
          </Link>
          {user ? (
            <>
              <Link to={dashboardPath} className="text-sm font-semibold text-[#0C447C] dark:text-[#85B7EB]">Dashboard</Link>
              <ProfileMenu profile={profile} dashboardPath={dashboardPath} profilePath={profilePath} onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="bg-white dark:bg-gray-800 text-[#0C447C] dark:text-[#85B7EB] border border-[#0C447C] dark:border-[#85B7EB] rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#E6F1FB] dark:hover:bg-gray-700">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-[#854F0B] hover:bg-[#6E4109] text-white rounded-lg px-4 py-2 text-sm font-medium">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="lg:hidden text-[#0C447C] dark:text-[#85B7EB]" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="lg:hidden flex flex-col gap-1 px-6 pb-4 border-t border-gray-100 dark:border-gray-800">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`py-2 text-sm ${isActive(link.to) ? 'text-[#854F0B] dark:text-[#D9A441] font-medium' : 'text-gray-600 dark:text-gray-300'}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
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
              <Link to="/login" className="py-2 text-sm text-gray-600 dark:text-gray-300" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <button className="bg-[#854F0B] hover:bg-[#6E4109] text-white rounded-lg px-4 py-2 text-sm font-medium mt-2 w-full">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
