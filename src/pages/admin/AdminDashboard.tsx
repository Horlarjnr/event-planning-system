import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAllUsers, getAllVendors, getAllVenuesAdmin, getAllCaterersAdmin, getAllBookingsAdmin } from '../../features/admin/adminService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNavItems } from '../../components/layout/navConfig'
import StatCard from '../../components/ui/StatCard'
import DonutChart from '../../components/ui/DonutChart'
import BarChart from '../../components/ui/BarChart'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import type { Vendor, Booking } from '../../types'

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function initialsOf(name: string | null | undefined) {
  if (!name) return 'AD'
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function bookingsThisWeek(bookings: Booking[]) {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const counts = [0, 0, 0, 0, 0, 0, 0]
  bookings.forEach((b) => {
    const created = new Date(b.created_at)
    if (created >= startOfWeek) counts[created.getDay()] += 1
  })
  const monToSun = [1, 2, 3, 4, 5, 6, 0]
  return monToSun.map((dayIndex, i) => ({ label: WEEKDAY_LABELS[i], value: counts[dayIndex] }))
}

export default function AdminDashboard() {
  const { profile } = useAuth()
  const [counts, setCounts] = useState({ users: 0, vendors: 0, venues: 0, caterers: 0 })
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getAllUsers(), getAllVendors(), getAllVenuesAdmin(), getAllCaterersAdmin(), getAllBookingsAdmin()])
      .then(([users, vendorsData, venues, caterers, bookingsData]) => {
        setCounts({ users: users.length, vendors: vendorsData.length, venues: venues.length, caterers: caterers.length })
        setVendors(vendorsData)
        setBookings(bookingsData)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load admin dashboard'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout
      navItems={adminNavItems}
      footerInitials={initialsOf(profile?.full_name)}
      footerLabel={profile?.full_name ?? 'Admin'}
      title="Dashboard"
      notifications={vendors
        .filter((v) => v.status === 'pending')
        .slice(0, 8)
        .map((v) => ({ id: v.id, text: `${v.business_name} is awaiting approval`, meta: v.vendor_type }))}
    >
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
            <StatCard label="Users" value={counts.users} accent="#0C447C" />
            <StatCard label="Vendors" value={counts.vendors} accent="#854F0B" />
            <StatCard label="Venues" value={counts.venues} accent="#15803D" />
            <StatCard label="Caterers" value={counts.caterers} accent="#7C3AED" />
            <StatCard label="Bookings" value={bookings.length} accent="#B91C1C" />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#F8FAFC] dark:bg-gray-800 rounded-xl p-6">
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Vendor status</p>
              <DonutChart
                segments={[
                  { label: 'Approved', value: vendors.filter((v) => v.status === 'approved').length, color: '#15803D' },
                  { label: 'Pending', value: vendors.filter((v) => v.status === 'pending').length, color: '#854F0B' },
                  { label: 'Suspended', value: vendors.filter((v) => v.status === 'suspended').length, color: '#B91C1C' },
                ]}
              />
            </div>
            <div className="bg-[#F8FAFC] dark:bg-gray-800 rounded-xl p-6">
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Bookings this week</p>
              <BarChart data={bookingsThisWeek(bookings)} />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
