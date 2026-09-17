import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Search,
  Calendar,
  Landmark,
  ChefHat,
  PartyPopper,
  Scale,
  CalendarCheck,
  Clock,
  ShieldCheck,
  Tag,
  Lock,
  Heart,
  ArrowRight,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Logo from '../../components/layout/Logo'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { getVenues } from '../../features/venues/venueService'
import type { Venue } from '../../types'
import heroImg from '../../assets/images/event-hall-chandelier.png'
import aisleImg from '../../assets/images/event-aisle-walk.png'
import stringLightsImg from '../../assets/images/event-string-lights.png'
import tealNavyImg from '../../assets/images/event-teal-navy-tables.png'
import floralGoldImg from '../../assets/images/event-floral-gold.png'
import instagramIcon from '../../assets/images/instagram.svg'
import facebookIcon from '../../assets/images/facebook.svg'
import xIcon from '../../assets/images/x.svg'
import linkedinIcon from '../../assets/images/linkedin.svg'

const categories = [
  { label: 'Weddings', image: aisleImg },
  { label: 'Birthdays', image: stringLightsImg },
  { label: 'Conferences', image: heroImg },
  { label: 'Naming Ceremonies', image: tealNavyImg },
  { label: 'Graduations', image: aisleImg },
  { label: 'Corporate Events', image: tealNavyImg },
  { label: 'Parties', image: stringLightsImg },
  { label: 'Religious Events', image: floralGoldImg },
]

const steps = [
  {
    number: 1,
    icon: Search,
    label: 'Search',
    description: 'Find event centres and caterers that match your needs.',
  },
  {
    number: 2,
    icon: Scale,
    label: 'Compare',
    description: 'View prices, menus, facilities, reviews and availability.',
  },
  {
    number: 3,
    icon: CalendarCheck,
    label: 'Book',
    description: 'Book the services you need in one place.',
  },
]

const whyChoose = [
  { icon: Clock, label: 'Save Time', description: 'All in one place' },
  { icon: ShieldCheck, label: 'Verified Vendors', description: 'Trusted and reliable' },
  { icon: Tag, label: 'Transparent Pricing', description: 'No hidden costs' },
  { icon: Lock, label: 'Secure Booking', description: 'Safe and easy' },
]

const socialLinks = [
  { icon: instagramIcon, label: 'Instagram' },
  { icon: facebookIcon, label: 'Facebook' },
  { icon: xIcon, label: 'X' },
  { icon: linkedinIcon, label: 'LinkedIn' },
]

function formatPrice(price: number | null) {
  if (!price) return null
  return `\u20a6${price.toLocaleString()}/day`
}

export default function Home() {
  const navigate = useNavigate()
  const [venues, setVenues] = useState<Venue[]>([])
  const [loadingVenues, setLoadingVenues] = useState(true)
  const [favorited, setFavorited] = useState<Record<string, boolean>>({})

  const [location, setLocation] = useState('')
  const [eventType, setEventType] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    let cancelled = false
    getVenues()
      .then((data) => {
        if (!cancelled) setVenues(data)
      })
      .catch(() => {
        if (!cancelled) setVenues([])
      })
      .finally(() => {
        if (!cancelled) setLoadingVenues(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  function handleSearch() {
    const params = new URLSearchParams()
    if (location.trim()) params.set('location', location.trim())
    if (eventType) params.set('eventType', eventType)
    if (date) params.set('date', date)
    navigate(`/venues${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const featuredVenues = venues.slice(0, 4)

  return (
    <div>
      {/* Hero */}
      <div
        className="relative bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(6,37,68,0.93) 0%, rgba(12,68,124,0.88) 30%, rgba(12,68,124,0.55) 55%, rgba(12,68,124,0.2) 75%, rgba(12,68,124,0) 95%)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20">
          <p className="text-[#B5D4F4] text-xs sm:text-sm font-semibold tracking-wide mb-3 uppercase">
            For every kind of event
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-5 max-w-2xl leading-tight">
            Stop chasing vendors across{' '}
            <span className="text-[#D9A441]">calls, DMs and spreadsheets</span>
          </h1>
          <p className="text-[#B5D4F4] max-w-lg mb-8">
            Find event centres and caterers, and book them both in one place.
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl shadow-lg p-3 flex flex-col sm:flex-row gap-2 max-w-3xl">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200">
              <MapPin size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Location (e.g. Lagos)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm text-gray-700 focus:outline-none"
              />
            </div>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200">
              <PartyPopper size={16} className="text-gray-400 shrink-0" />
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full text-sm text-gray-700 bg-transparent focus:outline-none"
              >
                <option value="">Event type</option>
                {categories.map((c) => (
                  <option key={c.label} value={c.label}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200">
              <Calendar size={16} className="text-gray-400 shrink-0" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm text-gray-700 focus:outline-none"
              />
            </div>
            <Button variant="secondary" onClick={handleSearch} className="!px-6 flex items-center justify-center gap-1.5 whitespace-nowrap">
              <Search size={16} /> Search
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                <Landmark size={18} className="text-[#D9A441]" />
              </div>
              <div>
                <p className="text-white font-bold leading-tight">500+</p>
                <p className="text-[#B5D4F4] text-xs">Event Centres</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                <ChefHat size={18} className="text-[#D9A441]" />
              </div>
              <div>
                <p className="text-white font-bold leading-tight">300+</p>
                <p className="text-[#B5D4F4] text-xs">Caterers</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                <PartyPopper size={18} className="text-[#D9A441]" />
              </div>
              <div>
                <p className="text-white font-bold leading-tight">10+</p>
                <p className="text-[#B5D4F4] text-xs">Event Types</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Event Types */}
      <div className="bg-[#E6F1FB] dark:bg-gray-900 px-6 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0C447C] dark:text-white mb-2">Popular Event Types</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10">
            Find the perfect venue and catering for your special occasion.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link
                key={category.label}
                to="/venues"
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden text-left"
              >
                <div
                  className="h-20 bg-cover bg-center group-hover:opacity-90 transition-opacity"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 px-2 py-2">{category.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Event Centres */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0C447C] dark:text-white mb-2">Featured Event Centres</h2>
              <p className="text-gray-500 dark:text-gray-400">Discover top-rated event centres for your next event.</p>
            </div>
            <Link to="/venues" className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#0C447C] dark:text-[#85B7EB] shrink-0">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loadingVenues && <LoadingSpinner />}

          {!loadingVenues && featuredVenues.length === 0 && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              No event centres yet — check back soon.
            </div>
          )}

          {!loadingVenues && featuredVenues.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredVenues.map((venue) => (
                <Link
                  key={venue.id}
                  to={`/venues/${venue.id}`}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                >
                  <div className="h-36 bg-[#E6F1FB] dark:bg-gray-700 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: venue.image_url ? `url(${venue.image_url})` : undefined }}>
                    {!venue.image_url && <Landmark size={28} className="text-[#0C447C]/40 dark:text-[#85B7EB]/40" />}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{venue.name}</p>
                    <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <MapPin size={13} /> {venue.location ?? 'Nigeria'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#185FA5] dark:text-[#B5D4F4] text-sm">
                        {formatPrice(venue.price) ?? 'Price on request'}
                      </span>
                      <button
                        type="button"
                        aria-label="Save to favorites"
                        onClick={(e) => {
                          e.preventDefault()
                          setFavorited((prev) => ({ ...prev, [venue.id]: !prev[venue.id] }))
                        }}
                        className="text-gray-400 hover:text-[#854F0B]"
                      >
                        <Heart size={16} fill={favorited[venue.id] ? '#854F0B' : 'none'} className={favorited[venue.id] ? 'text-[#854F0B]' : ''} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link to="/venues" className="sm:hidden flex items-center justify-center gap-1 text-sm font-medium text-[#0C447C] dark:text-[#85B7EB] mt-6">
            View All <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* How Event Ease Works */}
      <div id="how-it-works" className="bg-[#FBEBD3] dark:bg-gray-900 px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0C447C] dark:text-white mb-2">How Event Ease Works</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12">
            Book your event centre and caterer in 3 simple steps.
          </p>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-10 sm:gap-4">
            {steps.map((step, i) => (
              <div key={step.number} className="flex-1 flex items-start justify-center gap-2 w-full">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-14 h-14 rounded-full bg-[#0C447C] text-white flex items-center justify-center mb-3">
                    <step.icon size={22} />
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {step.number}. {step.label}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px]">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight size={20} className="hidden sm:block text-[#854F0B]/60 mt-5 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose + CTA */}
      <div className="bg-[#0C447C] px-6 py-14">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Why Choose Event Ease?</h3>
            <div className="grid grid-cols-2 gap-5">
              {whyChoose.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <item.icon size={17} className="text-[#D9A441]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium leading-tight">{item.label}</p>
                    <p className="text-[#B5D4F4] text-xs">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative rounded-2xl overflow-hidden p-6 sm:p-8 flex flex-col justify-center min-h-[220px] bg-cover bg-center"
            style={{ backgroundImage: `url(${floralGoldImg})` }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(6,37,68,0.93) 0%, rgba(12,68,124,0.85) 35%, rgba(12,68,124,0.5) 60%, rgba(12,68,124,0.15) 85%, rgba(12,68,124,0) 100%)',
              }}
            />
            <div className="relative">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Ready to Plan Your Next Event?</h3>
              <p className="text-[#B5D4F4] text-sm mb-5 max-w-sm">
                Join hundreds of people who plan stress-free events with Event Ease.
              </p>
              <Link to="/register">
                <Button variant="secondary" className="!px-6 !py-3 inline-flex items-center gap-1.5">
                  Get Started Today <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0C2E52] text-white px-6 py-14">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Logo theme="dark" />
              <p className="font-bold text-lg">Event Ease</p>
            </div>
            <p className="text-[#B5D4F4] text-sm max-w-xs">For every kind of event</p>
          </div>
          <div>
            <p className="font-semibold mb-3">Quick Links</p>
            <ul className="space-y-2 text-sm text-[#B5D4F4]">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/venues" className="hover:text-white">Event Centres</Link></li>
              <li><Link to="/caterers" className="hover:text-white">Caterers</Link></li>
              <li><Link to="/about" className="hover:text-white">About</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-3">Support</p>
            <ul className="space-y-2 text-sm text-[#B5D4F4]">
              <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-3">Follow Us</p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <button
                  key={social.label}
                  type="button"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                >
                  <img src={social.icon} alt="" className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/10 mt-10 pt-6 text-sm text-[#B5D4F4]">
          © {new Date().getFullYear()} Event Ease. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
