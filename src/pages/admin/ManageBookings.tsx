import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAllBookingsAdmin } from '../../features/admin/adminService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNavItems } from '../../components/layout/navConfig'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import EmptyState from '../../components/ui/EmptyState'
import type { Booking, BookingStatus } from '../../types'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  cancelled: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
}

const STATUS_OPTIONS: Array<BookingStatus | 'all'> = ['all', 'pending', 'confirmed', 'rejected', 'cancelled', 'completed']

function initialsOf(name: string | null | undefined) {
  if (!name) return 'AD'
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function ManageBookings() {
  const { profile } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')

  useEffect(() => {
    getAllBookingsAdmin()
      .then(setBookings)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [])

  const filteredBookings = useMemo(() => {
    if (statusFilter === 'all') return bookings
    return bookings.filter((b) => b.status === statusFilter)
  }, [bookings, statusFilter])

  return (
    <DashboardLayout
      navItems={adminNavItems}
      footerInitials={initialsOf(profile?.full_name)}
      footerLabel={profile?.full_name ?? 'Admin'}
      title="Manage Bookings"
    >
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings yet" />
      ) : (
        <div className="max-w-3xl">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'all')}
            className="mb-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-[#85B7EB]"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">{s === 'all' ? 'All statuses' : s}</option>
            ))}
          </select>

          {filteredBookings.length === 0 ? (
            <EmptyState title="No matching bookings" description="Try a different status filter." />
          ) : (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
              {filteredBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50">
                  <span className="text-sm text-gray-600 dark:text-gray-300">₦{b.total_price?.toLocaleString()}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[b.status]}`}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
