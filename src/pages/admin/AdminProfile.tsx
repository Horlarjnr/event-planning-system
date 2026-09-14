import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNavItems } from '../../components/layout/navConfig'
import AccountProfileCard from '../../components/profile/AccountProfileCard'
import AppearanceCard from '../../components/profile/AppearanceCard'
import DangerZone from '../../components/profile/DangerZone'

function initialsOf(name: string | null | undefined) {
  if (!name) return 'AD'
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function AdminProfile() {
  const { profile } = useAuth()

  return (
    <DashboardLayout
      navItems={adminNavItems}
      footerInitials={initialsOf(profile?.full_name)}
      footerLabel={profile?.full_name ?? 'Admin'}
      title="Profile"
    >
      <AccountProfileCard />
      <div className="mt-10"><AppearanceCard /></div>
      <DangerZone />
    </DashboardLayout>
  )
}
