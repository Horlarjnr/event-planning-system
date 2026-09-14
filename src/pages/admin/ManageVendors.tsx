import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getAllVendors, updateVendorStatus } from '../../features/admin/adminService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNavItems } from '../../components/layout/navConfig'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import type { Vendor } from '../../types'

function initialsOf(name: string | null | undefined) {
  if (!name) return 'AD'
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function ManageVendors() {
  const { profile } = useAuth()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actioningId, setActioningId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  function load() {
    setLoading(true)
    getAllVendors()
      .then(setVendors)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load vendors'))
      .finally(() => setLoading(false))
  }

  async function handleStatus(id: string, status: 'approved' | 'suspended') {
    setActioningId(id)
    try {
      await updateVendorStatus(id, status)
      setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update vendor status')
    } finally {
      setActioningId(null)
    }
  }

  const filteredVendors = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return vendors
    return vendors.filter((v) =>
      v.business_name.toLowerCase().includes(q) ||
      (v.location ?? '').toLowerCase().includes(q) ||
      v.vendor_type.toLowerCase().includes(q) ||
      v.status.toLowerCase().includes(q)
    )
  }, [vendors, search])

  return (
    <DashboardLayout
      navItems={adminNavItems}
      footerInitials={initialsOf(profile?.full_name)}
      footerLabel={profile?.full_name ?? 'Admin'}
      title="Manage Vendors"
    >
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : vendors.length === 0 ? (
        <EmptyState title="No vendors yet" />
      ) : (
        <div className="max-w-3xl">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by business name, location, type, or status..."
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#85B7EB]"
            />
          </div>

          {filteredVendors.length === 0 ? (
            <EmptyState title="No matching vendors" description="Try a different name, location, type, or status." />
          ) : (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
              {filteredVendors.map((v) => (
                <div key={v.id} className="flex items-center justify-between gap-3 px-4 py-3 flex-wrap hover:bg-gray-50">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{v.business_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{v.vendor_type} · {v.location}</p>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                      v.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      v.status === 'suspended' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }`}>{v.status}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {v.status !== 'approved' && (
                      <Button variant="primary" onClick={() => handleStatus(v.id, 'approved')} disabled={actioningId === v.id}>Approve</Button>
                    )}
                    {v.status !== 'suspended' && (
                      <Button variant="outline" onClick={() => handleStatus(v.id, 'suspended')} disabled={actioningId === v.id}>Suspend</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
