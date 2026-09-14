import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMyEvents } from '../../features/events/eventService'
import { getMyBookings } from '../../features/bookings/bookingService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { customerNavItems } from '../../components/layout/navConfig'
import StatCard from '../../components/ui/StatCard'
import DonutChart from '../../components/ui/DonutChart'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import EmptyState from '../../components/ui/EmptyState'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import type { Event, BookingWithDetails } from '../../types'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  cancelled: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
}

function initialsOf(name: string | null | undefined) {
  if (!name) return 'ME'
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function CustomerDashboard() {
  const { user, profile } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    Promise.all([getMyEvents(user.id), getMyBookings(user.id)])
      .then(([eventsData, bookingsData]) => {
        setEvents(eventsData)
        setBookings(bookingsData)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [user])

  const layout = (content: ReactNode) => (
    <DashboardLayout
      navItems={customerNavItems}
      footerInitials={initialsOf(profile?.full_name)}
      footerLabel={profile?.full_name ?? 'My account'}
      title="Dashboard"
      notifications={bookings
        .filter((b) => b.status === 'pending')
        .slice(0, 8)
        .map((b) => ({
          id: b.id,
          text: `Booking for "${b.event.name}" is pending vendor confirmation`,
          meta: b.event.event_date,
        }))}
    >
      {content}
    </DashboardLayout>
  )

  if (loading) return layout(<LoadingSpinner />)
  if (error) return layout(<ErrorMessage message={error} />)

  const pending = bookings.filter((b) => b.status === 'pending')
  const confirmed = bookings.filter((b) => b.status === 'confirmed')
  const rejected = bookings.filter((b) => b.status === 'rejected')
  const upcomingEvents = [...events]
    .filter((e) => new Date(e.event_date).getTime() >= new Date().setHours(0, 0, 0, 0))
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
  const recentBookings = bookings.slice(0, 5)

  return layout(
    <>
      <div className="flex justify-end mb-6">
        <Link to="/events/create"><Button variant="primary">Plan a new event</Button></Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total events" value={events.length} accent="#0C447C" />
        <StatCard label="Pending" value={pending.length} accent="#854F0B" />
        <StatCard label="Confirmed" value={confirmed.length} accent="#15803D" />
        <StatCard label="Rejected" value={rejected.length} accent="#B91C1C" />
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#F8FAFC] dark:bg-gray-800 rounded-xl p-6">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Booking status</p>
          <DonutChart
            segments={[
              { label: 'Confirmed', value: confirmed.length, color: '#15803D' },
              { label: 'Pending', value: pending.length, color: '#854F0B' },
              { label: 'Rejected', value: rejected.length, color: '#B91C1C' },
            ]}
          />
        </div>
        <div className="bg-[#F8FAFC] dark:bg-gray-800 rounded-xl p-6">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Upcoming events</p>
          {upcomingEvents.length === 0 ? (
            <EmptyState title="No upcoming events" description="Plan a new event to get started." />
          ) : (
            <div className="space-y-3">
              {upcomingEvents.slice(0, 4).map((e) => (
                <div key={e.id} className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{e.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{e.event_type ?? 'Event'} · {e.guest_count} guests</p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{e.event_date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Recent bookings</p>
      {recentBookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="Create an event to start booking venues and caterers." />
      ) : (
        <div className="space-y-3">
          {recentBookings.map((b) => (
            <Card key={b.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{b.event.name}</p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[b.status]}`}>
                  {b.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {b.venue?.name} {b.caterer && `· ${b.caterer.name}`} · {b.event.guest_count} guests
              </p>
              <p className="text-sm font-medium text-[#185FA5] dark:text-[#B5D4F4] mt-1">₦{b.total_price?.toLocaleString()}</p>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
