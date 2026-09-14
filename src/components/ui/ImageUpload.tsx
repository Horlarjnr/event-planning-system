import { useState, type ChangeEvent } from 'react'
import { Upload, Image as ImageIcon } from 'lucide-react'
import { uploadImage } from '../../features/storage/storageService'

interface ImageUploadProps {
  currentUrl?: string | null
  folder: 'venues' | 'caterers' | 'avatars'
  ownerId: string
  onUploaded: (url: string) => void
}

export default function ImageUpload({ currentUrl, folder, ownerId, onUploaded }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadImage(file, folder, ownerId)
      onUploaded(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div
        className="h-40 w-full bg-gray-100 dark:bg-gray-700 rounded-lg bg-cover bg-center flex items-center justify-center border border-gray-200 dark:border-gray-600"
        style={{ backgroundImage: currentUrl ? `url(${currentUrl})` : undefined }}
      >
        {!currentUrl && <ImageIcon className="text-gray-300 dark:text-gray-500" size={32} />}
      </div>
      <label className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#0C447C] dark:text-[#85B7EB] cursor-pointer">
        <Upload size={14} />
        {uploading ? 'Uploading...' : 'Upload image'}
        <input type="file" accept="image/*" className="hidden" onChange={handleChange} disabled={uploading} />
      </label>
      {error && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}
