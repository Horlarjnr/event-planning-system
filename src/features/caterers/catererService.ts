import { supabase } from '../../lib/supabaseClient'
import type { Caterer, CatererFilters, CateringPackage } from '../../types'

export async function getCaterers(filters: CatererFilters = {}): Promise<Caterer[]> {
  let query = supabase.from('caterers').select('*')

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,location.ilike.%${filters.search}%`)
  }
  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }
  if (filters.cuisineType) {
    query = query.ilike('cuisine_type', `%${filters.cuisineType}%`)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data as Caterer[]
}

export async function getCatererById(id: string): Promise<Caterer> {
  const { data, error } = await supabase
    .from('caterers')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Caterer
}

export async function getCateringPackages(catererId: string): Promise<CateringPackage[]> {
  const { data, error } = await supabase
    .from('catering_packages')
    .select('*')
    .eq('caterer_id', catererId)
    .order('price_per_person', { ascending: true })
  if (error) throw error
  return data as CateringPackage[]
}
