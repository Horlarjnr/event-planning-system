import { supabase } from '../../lib/supabaseClient'

// Single shared bucket "listing-images" holds venue/caterer/avatar photos,
// namespaced by folder so policies can scope access per-owner if needed later.
const BUCKET = 'listing-images'

export async function uploadImage(file: File, folder: 'venues' | 'caterers' | 'avatars', ownerId: string): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${folder}/${ownerId}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true, // Changed from false to true to resolve the upload error
  })
  
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}