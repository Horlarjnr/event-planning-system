import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestAccountDeletion } from '../../features/profile/profileService'
import { signOut } from '../../features/auth/authService'
import Button from '../ui/Button'
import ConfirmDialog from '../ui/ConfirmDialog'

export default function DangerZone() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setLoading(true)
    setError(null)
    try {
      await requestAccountDeletion()
      await signOut()
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mt-10 border border-red-200 dark:border-red-900 rounded-xl p-5 bg-red-50/60 dark:bg-red-900/10">
      <p className="font-semibold text-red-700 dark:text-red-400 mb-1">Danger zone</p>
      <p className="text-sm text-red-700/80 dark:text-red-400/80 mb-4">
        Deleting your account deactivates it immediately and signs you out everywhere. This can't be undone from
        the app.
      </p>
      <Button
        variant="outline"
        className="!border-red-600 !text-red-600 dark:!text-red-400 hover:!bg-red-100 dark:hover:!bg-red-900/30"
        onClick={() => setOpen(true)}
      >
        Delete account
      </Button>

      <ConfirmDialog
        open={open}
        title="Delete your account?"
        description="This will permanently deactivate your EventEase account and sign you out. This action cannot be undone."
        confirmLabel="Delete account"
        danger
        loading={loading}
        error={error}
        onConfirm={handleConfirm}
        onCancel={() => {
          setOpen(false)
          setError(null)
        }}
      />
    </div>
  )
}
