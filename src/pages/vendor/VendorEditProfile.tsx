import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getMyVendorProfile, updateVendorProfile } from '../../features/vendors/vendorService'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import SuccessMessage from '../../components/ui/SuccessMessage'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { vendorNavItems } from '../../components/layout/navConfig'
import AccountProfileCard from '../../components/profile/AccountProfileCard'
import AppearanceCard from '../../components/profile/AppearanceCard'
import DangerZone from '../../components/profile/DangerZone'
import type { Vendor } from '../../types'

function initialsOf(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function VendorEditProfile() {
  const { user } = useAuth()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    getMyVendorProfile(user.id)
      .then((v) => {
        if (v) {
          setVendor(v)
          setBusinessName(v.business_name)
          setDescription(v.description ?? '')
          setPhone(v.phone ?? '')
          setEmail(v.email ?? '')
          setLocation(v.location ?? '')
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setLoading(false))
  }, [user])

  async function handleSave() {
    if (!vendor) return
    setSubmitting(true)
    setError(null)
    setSaved(false)
    try {
      await updateVendorProfile(vendor.id, { businessName, description, phone, email, location })
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setSubmitting(false)
    }
  }

  const navItems = vendorNavItems(vendor?.vendor_type === 'venue')

  return (
    <DashboardLayout
      navItems={navItems}
      footerInitials={vendor ? initialsOf(vendor.business_name) : '--'}
      footerLabel={vendor?.business_name ?? 'Vendor'}
      title="Profile"
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Account</h2>
          <AccountProfileCard />

          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 mt-10">Business profile</h2>
          <div className="max-w-lg">
            {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
            {saved && !error && <div className="mb-4"><SuccessMessage message="Business profile updated." /></div>}
            <div className="space-y-4">
              <Input label="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input label="Business email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
              <Button onClick={handleSave} disabled={submitting} className="w-full">
                {submitting ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </div>

          <div className="mt-10"><AppearanceCard /></div>

          <DangerZone />
        </>
      )}
    </DashboardLayout>
  )
}
