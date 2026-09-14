import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getAllUsers } from '../../features/admin/adminService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNavItems } from '../../components/layout/navConfig'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import EmptyState from '../../components/ui/EmptyState'
import Avatar from '../../components/ui/Avatar'
import type { Profile } from '../../types'

function initialsOf(name: string | null | undefined) {
  if (!name) return 'AD'
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function ManageUsers() {
  const { profile } = useAuth()
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) =>
      (u.full_name ?? '').toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    )
  }, [users, search])

  return (
    <DashboardLayout
      navItems={adminNavItems}
      footerInitials={initialsOf(profile?.full_name)}
      footerLabel={profile?.full_name ?? 'Admin'}
      title="Manage Users"
    >
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : users.length === 0 ? (
        <EmptyState title="No users yet" />
      ) : (
        <div className="max-w-3xl">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#85B7EB]"
            />
          </div>

          {filteredUsers.length === 0 ? (
            <EmptyState title="No matching users" description="Try a different name, email, or role." />
          ) : (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
              {filteredUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar url={u.avatar_url} name={u.full_name ?? u.email} size="sm" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{u.full_name ?? 'Unnamed'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-[#E6F1FB] dark:bg-[#0C447C]/30 text-[#0C447C] dark:text-[#85B7EB] font-medium capitalize">{u.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
