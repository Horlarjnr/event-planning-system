import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { customerNavItems } from '../../components/layout/navConfig'
import AccountProfileCard from '../../components/profile/AccountProfileCard'
import AppearanceCard from '../../components/profile/AppearanceCard'
import DangerZone from '../../components/profile/DangerZone'

function initialsOf(name: string | null | undefined) {
  if (!name) return 'ME'
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function CustomerProfile() {
  const { profile } = useAuth()

  return (
    <DashboardLayout
      navItems={customerNavItems}
      footerInitials={initialsOf(profile?.full_name)}
      footerLabel={profile?.full_name ?? 'My account'}
      title="Profile"
    >
      <AccountProfileCard />
      <div className="mt-10"><AppearanceCard /></div>
      <DangerZone />
    </DashboardLayout>
  )
}
