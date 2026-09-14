import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { Camera, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { updateMyProfile } from '../../features/profile/profileService'
import { uploadImage } from '../../features/storage/storageService'
import Avatar from '../ui/Avatar'
import Input from '../ui/Input'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import SuccessMessage from '../ui/SuccessMessage'

const MAX_AVATAR_BYTES = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

interface AccountProfileCardProps {
  /** Extra fields to render below phone (e.g. vendor business fields) can be passed as children. */
  children?: ReactNode
}

export default function AccountProfileCard({ children }: AccountProfileCardProps) {
  const { user, profile, refreshProfile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setFullName(profile?.full_name ?? '')
    setPhone(profile?.phone ?? '')
    setAvatarUrl(profile?.avatar_url ?? null)
  }, [profile])

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file || !user) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please choose a JPG, PNG, WEBP or GIF image.')
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setError('Image must be smaller than 5MB.')
      return
    }

    setUploading(true)
    setError(null)
    setSaved(false)
    try {
      const url = await uploadImage(file, 'avatars', user.id)
      await updateMyProfile(user.id, { avatarUrl: url })
      setAvatarUrl(url)
      await refreshProfile()
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  async function handleRemovePhoto() {
    if (!user) return
    setUploading(true)
    setError(null)
    try {
      await updateMyProfile(user.id, { avatarUrl: null })
      setAvatarUrl(null)
      await refreshProfile()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove photo')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!user) return
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      await updateMyProfile(user.id, { fullName, phone })
      await refreshProfile()
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg">
      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
      {saved && !error && <div className="mb-4"><SuccessMessage message="Profile updated." /></div>}

      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <Avatar url={avatarUrl} name={fullName || profile?.email} size="xl" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0C447C] text-white flex items-center justify-center border-2 border-white dark:border-gray-900 disabled:opacity-50"
            aria-label="Change profile picture"
          >
            <Camera size={13} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{uploading ? 'Uploading...' : 'Profile photo'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">JPG, PNG, WEBP or GIF. Max 5MB.</p>
          {avatarUrl && !uploading && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
            >
              <Trash2 size={12} /> Remove photo
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input label="Email" type="email" value={profile?.email ?? ''} disabled className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400" />
        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        {children}
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </div>
  )
}
