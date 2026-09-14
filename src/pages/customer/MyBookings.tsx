import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getMyBookings } from '../../features/bookings/bookingService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { customerNavItems } from '../../components/layout/navConfig'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import EmptyState from '../../components/ui/EmptyState'
import Card from '../../components/ui/Card'
import type { BookingWithDetails } from '../../types'

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

export default function MyBookings() {
  const { user, profile } = useAuth()
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    getMyBookings(user.id)
      .then(setBookings)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [user])

  return (
    <DashboardLayout
      navItems={customerNavItems}
      footerInitials={initialsOf(profile?.full_name)}
      footerLabel={profile?.full_name ?? 'My account'}
      title="My Bookings"
    >
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="Create an event to start booking venues and caterers." />
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{b.event.name}</p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[b.status]}`}>
                  {b.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {b.venue?.name} {b.caterer && `· ${b.caterer.name}`} · {b.event.event_date} · {b.event.guest_count} guests
              </p>
              <p className="text-sm font-medium text-[#185FA5] dark:text-[#B5D4F4] mt-1">₦{b.total_price?.toLocaleString()}</p>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
