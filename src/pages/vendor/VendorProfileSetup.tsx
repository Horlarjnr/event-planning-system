import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createVendorProfile } from '../../features/vendors/vendorService'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Logo from '../../components/layout/Logo'
import type { VendorType } from '../../types'

export default function VendorProfileSetup() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [vendorType, setVendorType] = useState<VendorType>('venue')
  const [businessName, setBusinessName] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    setError(null)
    try {
      await createVendorProfile({
        userId: user.id,
        vendorType,
        businessName,
        description,
        phone,
        email,
        location,
      })
      // Reload so the dashboard re-fetches the newly created vendor profile
      navigate(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create vendor profile')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900">
      <div className="flex items-center gap-2 px-6 py-5">
        <Logo />
        <span className="text-lg font-bold text-[#0C447C] dark:text-[#85B7EB]">EventEase</span>
      </div>
    <div className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-2xl font-medium text-[#0C447C] dark:text-[#85B7EB] mb-2">Set up your vendor profile</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        This is a one-time setup. Your profile will be reviewed before it appears publicly.
      </p>

      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setVendorType('venue')}
            className={`flex-1 rounded-lg py-2 text-sm font-medium border ${
              vendorType === 'venue' ? 'bg-[#0C447C] text-white border-[#0C447C]' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600'
            }`}
          >
            I run a venue
          </button>
          <button
            type="button"
            onClick={() => setVendorType('caterer')}
            className={`flex-1 rounded-lg py-2 text-sm font-medium border ${
              vendorType === 'caterer' ? 'bg-[#0C447C] text-white border-[#0C447C]' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600'
            }`}
          >
            I'm a caterer
          </button>
        </div>

        <Input label="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <Input label="Business email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Location" placeholder="e.g. Lekki, Lagos" value={location} onChange={(e) => setLocation(e.target.value)} required />

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Creating profile...' : 'Create vendor profile'}
        </Button>
      </form>
    </div>
    </div>
  )
}
