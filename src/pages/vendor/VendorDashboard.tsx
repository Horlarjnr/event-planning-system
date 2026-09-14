import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getMyVendorProfile } from '../../features/vendors/vendorService'
import { getVendorBookings, updateBookingStatus } from '../../features/bookings/vendorBookingService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { vendorNavItems } from '../../components/layout/navConfig'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import EmptyState from '../../components/ui/EmptyState'
import StatCard from '../../components/ui/StatCard'
import DonutChart from '../../components/ui/DonutChart'
import BarChart from '../../components/ui/BarChart'
import Button from '../../components/ui/Button'
import VendorProfileSetup from './VendorProfileSetup'
import type { Vendor, VendorBookingView } from '../../types'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function initialsOf(name: string) {
  if (!name) return ''
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function bookingsThisWeek(bookings: VendorBookingView[]) {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const counts = [0, 0, 0, 0, 0, 0, 0]
  bookings.forEach((b) => {
    const created = new Date(b.created_at)
    if (created >= startOfWeek) {
      counts[created.getDay()] += 1
    }
  })
  // Reorder Mon..Sun to match the mockup
  const monToSun = [1, 2, 3, 4, 5, 6, 0]
  return monToSun.map((dayIndex) => ({ label: WEEKDAY_LABELS[dayIndex], value: counts[dayIndex] }))
}

export default function VendorDashboard() {
  const { user } = useAuth()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [bookings, setBookings] = useState<VendorBookingView[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actioningId, setActioningId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    load()
  }, [user])

  async function load() {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const vendorProfile = await getMyVendorProfile(user.id)
      setVendor(vendorProfile)
      if (vendorProfile) {
        const bookingsData = await getVendorBookings(vendorProfile.id, vendorProfile.vendor_type)
        setBookings(bookingsData)
      }
    } catch (err) {
      console.error('Dashboard load error:', err)
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: unknown }).message)
        : 'Failed to load dashboard'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(bookingId: string, status: 'confirmed' | 'rejected') {
    setActioningId(bookingId)
    try {
      await updateBookingStatus(bookingId, status)
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking')
    } finally {
      setActioningId(null)
    }
  }

  // No vendor profile yet — real setup form, not a placeholder. No sidebar until onboarded.
  if (!loading && !vendor && !error) return <VendorProfileSetup />

  const navItems = vendorNavItems(vendor?.vendor_type === 'venue')

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} footerInitials="--" footerLabel="Loading..." title="Dashboard">
        <LoadingSpinner />
      </DashboardLayout>
    )
  }
  if (error) {
    return (
      <DashboardLayout navItems={navItems} footerInitials="--" footerLabel="Vendor" title="Dashboard">
        <ErrorMessage message={error} />
      </DashboardLayout>
    )
  }
  if (!vendor) return null

  const pending = bookings.filter((b) => b.status === 'pending')
  const confirmed = bookings.filter((b) => b.status === 'confirmed')
  const rejected = bookings.filter((b) => b.status === 'rejected')
  const weeklyData = bookingsThisWeek(bookings)

  return (
    <DashboardLayout
      navItems={navItems}
      footerInitials={initialsOf(vendor.business_name)}
      footerLabel={vendor.business_name}
      title="Dashboard"
      notifications={pending.slice(0, 8).map((b) => ({
        id: b.id,
        // Added safe optional chaining for b.event?.name
        text: `New booking request from ${b.customer?.full_name ?? 'a customer'} for "${b.event?.name ?? 'Unnamed Event'}"`,
        meta: b.event?.event_date ?? 'TBD',
      }))}
    >
      <p className="text-sm text-gray-500 dark:text-gray-400 -mt-4 mb-6">
        Status: <span className={vendor.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}>{vendor.status}</span>
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total bookings" value={bookings.length} accent="#0C447C" />
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
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Bookings this week</p>
          <BarChart data={weeklyData} />
        </div>
      </div>

      <p className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Recent booking requests</p>

      {bookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="Booking requests from customers will show up here." />
      ) : (
        <div className="space-y-3">
          {bookings.slice(0, 8).map((b) => (
            <div key={b.id} className="border border-gray-200 dark:border-gray-700 rounded-xl px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                {/* Added safe optional chaining for b.event properties */}
                <p className="font-medium text-gray-900 dark:text-gray-100">{b.event?.name ?? 'Unnamed Event'} · {b.event?.guest_count ?? 0} guests</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {b.customer?.full_name ?? 'Customer'} · {b.event?.event_date ?? 'TBD'} · ₦{b.total_price?.toLocaleString() ?? 0}
                </p>
              </div>
              {b.status === 'pending' ? (
                <div className="flex items-center gap-2">
                  <Button variant="primary" onClick={() => handleAction(b.id, 'confirmed')} disabled={actioningId === b.id}>
                    Accept
                  </Button>
                  <Button variant="outline" onClick={() => handleAction(b.id, 'rejected')} disabled={actioningId === b.id}>
                    Decline
                  </Button>
                </div>
              ) : (
                <span
                  className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${
                    b.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}
                >
                  {b.status}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}