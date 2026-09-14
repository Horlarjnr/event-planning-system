import { supabase } from '../../lib/supabaseClient'
import type { Venue, VenueFilters } from '../../types'

export async function getVenues(filters: VenueFilters = {}): Promise<Venue[]> {
  let query = supabase.from('venues').select('*')

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,location.ilike.%${filters.search}%`)
  }
  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }
  if (filters.minCapacity) {
    query = query.gte('capacity', filters.minCapacity)
  }
  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data as Venue[]
}

export async function getVenueById(id: string): Promise<Venue> {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Venue
}
