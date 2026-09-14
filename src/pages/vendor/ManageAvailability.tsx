import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getMyVendorProfile, getMyVenues, getVenueAvailability, setVenueAvailability, type AvailabilityEntry } from '../../features/vendors/vendorService'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import EmptyState from '../../components/ui/EmptyState'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { vendorNavItems } from '../../components/layout/navConfig'
import type { Venue, Vendor } from '../../types'

function initialsOf(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function ManageAvailability() {
  const { user } = useAuth()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [venues, setVenues] = useState<Venue[]>([])
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [entries, setEntries] = useState<AvailabilityEntry[]>([])
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    loadVenues()
  }, [user])

  async function loadVenues() {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const vendorProfile = await getMyVendorProfile(user.id)
      setVendor(vendorProfile)
      if (vendorProfile?.vendor_type === 'venue') {
        const v = await getMyVenues(vendorProfile.id)
        setVenues(v)
        if (v.length > 0) selectVenue(v[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load venues')
    } finally {
      setLoading(false)
    }
  }

  async function selectVenue(venue: Venue) {
    setSelectedVenue(venue)
    try {
      setEntries(await getVenueAvailability(venue.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load availability')
    }
  }

  async function markDate(isAvailable: boolean) {
    if (!selectedVenue || !date) return
    try {
      await setVenueAvailability(selectedVenue.id, date, isAvailable)
      setEntries(await getVenueAvailability(selectedVenue.id))
      setDate('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update availability')
    }
  }

  const navItems = vendorNavItems(true)
  const layoutProps = {
    navItems,
    footerInitials: vendor ? initialsOf(vendor.business_name) : '--',
    footerLabel: vendor?.business_name ?? 'Vendor',
    title: 'Manage availability',
  }

  if (loading) return <DashboardLayout {...layoutProps}><LoadingSpinner /></DashboardLayout>
  if (venues.length === 0) {
    return (
      <DashboardLayout {...layoutProps}>
        <EmptyState title="No venues to manage" description="Add a venue first under Manage Services." />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout {...layoutProps}>
    <div className="max-w-xl">
      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

      <div className="flex gap-2 mb-6 flex-wrap">
        {venues.map((v) => (
          <button
            key={v.id}
            onClick={() => selectVenue(v)}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              selectedVenue?.id === v.id ? 'bg-[#0C447C] text-white border-[#0C447C]' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
            }`}
          >
            {v.name}
          </button>
        ))}
      </div>

      <Card className="p-4 mb-6 flex items-end gap-3">
        <div className="flex-1">
          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <Button variant="primary" onClick={() => markDate(false)} disabled={!date}>Mark unavailable</Button>
        <Button variant="outline" onClick={() => markDate(true)} disabled={!date}>Mark available</Button>
      </Card>

      {entries.length === 0 ? (
        <EmptyState title="No dates set" description="All dates are open by default until marked otherwise." />
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <Card key={entry.id} className="p-3 flex items-center justify-between">
              <span className="text-sm">{entry.available_date}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${entry.is_available ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                {entry.is_available ? 'Available' : 'Unavailable'}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
    </DashboardLayout>
  )
}
