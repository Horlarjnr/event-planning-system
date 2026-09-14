import type { UserRole } from '../../types'
import type { DashboardNavItem } from './DashboardLayout'

export const customerNavItems: DashboardNavItem[] = [
  { label: 'Dashboard', path: '/customer/dashboard' },
  { label: 'Create event', path: '/events/create' },
  { label: 'My bookings', path: '/customer/bookings' },
  { label: 'Profile', path: '/customer/profile' },
]

export const adminNavItems: DashboardNavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Vendors', path: '/admin/vendors' },
  { label: 'Venues', path: '/admin/venues' },
  { label: 'Caterers', path: '/admin/caterers' },
  { label: 'Bookings', path: '/admin/bookings' },
  { label: 'Profile', path: '/admin/profile' },
]

/** Where a role's dashboard/profile routes live — used by ProfileMenu, DashboardLayout, etc. */
export function dashboardPathFor(role: UserRole | null | undefined): string {
  if (role === 'vendor') return '/vendor/dashboard'
  if (role === 'admin') return '/admin/dashboard'
  return '/customer/dashboard'
}

export function profilePathFor(role: UserRole | null | undefined): string {
  if (role === 'vendor') return '/vendor/profile'
  if (role === 'admin') return '/admin/profile'
  return '/customer/profile'
}

export function vendorNavItems(showAvailability: boolean): DashboardNavItem[] {
  const items: DashboardNavItem[] = [
    { label: 'Dashboard', path: '/vendor/dashboard' },
    { label: 'Services', path: '/vendor/services' },
  ]
  if (showAvailability) items.push({ label: 'Availability', path: '/vendor/availability' })
  items.push({ label: 'Profile', path: '/vendor/profile' })
  return items
}
