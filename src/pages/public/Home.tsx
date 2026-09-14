import { Link } from 'react-router-dom'
import { MapPin, Search, CalendarPlus, ClipboardCheck } from 'lucide-react'
import Button from '../../components/ui/Button'
import Logo from '../../components/layout/Logo'

// Permanent hero card — intentionally NOT pulled from the venues table, so it
// never changes no matter what real vendors create/delete. Edit these three
// values directly to change what's shown.
const HERO_CARD = {
  name: 'Grand Pavilion Events',
  location: 'Lekki, Lagos',
  imageUrl:
    'https://images.unsplash.com/photo-1746739802530-b490abdfc8e6?auto=format&fit=crop&w=1000&q=80',
}

const features = [
  { icon: Search, title: 'Search by location', description: 'Filter by price and capacity' },
  { icon: CalendarPlus, title: 'Create your event', description: 'One flow, start to finish' },
  { icon: ClipboardCheck, title: 'Track bookings', description: 'Status updates in real time' },
]

const steps = [
  { number: 1, label: 'Search vendors' },
  { number: 2, label: 'Create your event' },
  { number: 3, label: 'Submit booking' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-[#0C447C] px-6 pt-16 pb-24 relative">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-[1fr_auto] gap-10 items-start">
          <div>
            <p className="text-[#B5D4F4] text-sm font-medium mb-3">For every kind of event</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-5 max-w-xl leading-tight">
              Stop chasing vendors across calls, DMs and spreadsheets
            </h1>
            <p className="text-[#B5D4F4] max-w-lg mb-8">
              Find event centres and caterers, and book them both in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button variant="secondary" className="!px-6 !py-3 text-base">Join EventEase</Button>
              </Link>
              <Link to="/#how-it-works">
                <Button variant="outline" className="!px-6 !py-3 text-base !bg-transparent !text-white !border-white/60">
                  See how it works
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden sm:block bg-white rounded-2xl shadow-lg p-4 w-72 sm:translate-y-6">
            <div className="w-full h-32 rounded-lg bg-[#B5D4F4] mb-3 overflow-hidden">
              <img src={HERO_CARD.imageUrl} alt={HERO_CARD.name} className="w-full h-full object-cover" />
            </div>
            <p className="font-semibold text-gray-900">{HERO_CARD.name}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin size={13} /> {HERO_CARD.location}
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="how-it-works" className="bg-[#E6F1FB] px-6 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Everything you need to plan with ease</h2>
          <p className="text-gray-500 mb-10">One platform, from search to confirmed booking.</p>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {features.map((f) => (
              <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="w-11 h-11 rounded-lg bg-[#E6F1FB] flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-[#0C447C]" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">{f.title}</p>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-[#FBEBD3] px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-12">From search to confirmed booking</h2>
          <div className="flex items-start justify-between relative">
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-[#854F0B]/40 mx-12" />
            {steps.map((step) => (
              <div key={step.number} className="flex-1 flex flex-col items-center relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#854F0B] text-white flex items-center justify-center font-bold text-lg mb-3">
                  {step.number}
                </div>
                <p className="font-medium text-gray-800">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0C447C] text-white px-6 py-14">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Logo theme="dark" />
              <p className="font-bold text-lg">EventEase</p>
            </div>
            <p className="text-[#B5D4F4] text-sm max-w-xs">
              A centralized platform for finding and booking event centres and caterers.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-3">Product</p>
            <ul className="space-y-2 text-sm text-[#B5D4F4]">
              <li><Link to="/venues" className="hover:text-white">Browse venues</Link></li>
              <li><Link to="/caterers" className="hover:text-white">Browse caterers</Link></li>
              <li><Link to="/register" className="hover:text-white">Sign up</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-3">Company</p>
            <ul className="space-y-2 text-sm text-[#B5D4F4]">
              <li><Link to="/#how-it-works" className="hover:text-white">How it works</Link></li>
              <li><a href="mailto:hello@eventease.app" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/10 mt-10 pt-6 text-sm text-[#B5D4F4]">
          © {new Date().getFullYear()} EventEase.
        </div>
      </footer>
    </div>
  )
}
