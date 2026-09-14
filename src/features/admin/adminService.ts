import { supabase } from '../../lib/supabaseClient'
import type { Profile, Vendor, Venue, Caterer, Booking, VendorStatus } from '../../types'

export async function getAllUsers(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as Profile[]
}

export async function getAllVendors(): Promise<Vendor[]> {
  const { data, error } = await supabase.from('vendors').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as Vendor[]
}

export async function updateVendorStatus(vendorId: string, status: VendorStatus): Promise<void> {
  const { error } = await supabase.from('vendors').update({ status }).eq('id', vendorId)
  if (error) throw error
}

export async function getAllVenuesAdmin(): Promise<Venue[]> {
  const { data, error } = await supabase.from('venues').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as Venue[]
}

export async function deleteVenueAdmin(id: string): Promise<void> {
  const { error } = await supabase.from('venues').delete().eq('id', id)
  if (error) throw error
}

export async function getAllCaterersAdmin(): Promise<Caterer[]> {
  const { data, error } = await supabase.from('caterers').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as Caterer[]
}

export async function deleteCatererAdmin(id: string): Promise<void> {
  const { error } = await supabase.from('caterers').delete().eq('id', id)
  if (error) throw error
}

export async function getAllBookingsAdmin(): Promise<Booking[]> {
  const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as Booking[]
}
