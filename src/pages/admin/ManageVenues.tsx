import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAllVenuesAdmin, deleteVenueAdmin } from '../../features/admin/adminService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNavItems } from '../../components/layout/navConfig'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import EmptyState from '../../components/ui/EmptyState'
import { Search, Trash2 } from 'lucide-react'
import type { Venue } from '../../types'

function initialsOf(name: string | null | undefined) {
  if (!name) return 'AD'
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function ManageVenues() {
  const { profile } = useAuth()
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  function load() {
    setLoading(true)
    getAllVenuesAdmin()
      .then(setVenues)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load venues'))
      .finally(() => setLoading(false))
  }

  async function handleDelete(id: string) {
    try {
      await deleteVenueAdmin(id)
      setVenues((prev) => prev.filter((v) => v.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete venue')
    }
  }

  const filteredVenues = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return venues
    return venues.filter((v) =>
      v.name.toLowerCase().includes(q) ||
      (v.location ?? '').toLowerCase().includes(q)
    )
  }, [venues, search])

  return (
    <DashboardLayout
      navItems={adminNavItems}
      footerInitials={initialsOf(profile?.full_name)}
      footerLabel={profile?.full_name ?? 'Admin'}
      title="Manage Venues"
    >
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : venues.length === 0 ? (
        <EmptyState title="No venues yet" />
      ) : (
        <div className="max-w-3xl">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or location..."
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#85B7EB]"
            />
          </div>

          {filteredVenues.length === 0 ? (
            <EmptyState title="No matching venues" description="Try a different name or location." />
          ) : (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
              {filteredVenues.map((v) => (
                <div key={v.id} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{v.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{v.location} · ₦{v.price?.toLocaleString()}</p>
                  </div>
                  <button onClick={() => handleDelete(v.id)} className="shrink-0 text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
