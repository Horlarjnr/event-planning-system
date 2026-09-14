import { supabase } from '../../lib/supabaseClient'
import type { Vendor, Venue, Caterer, CateringPackage } from '../../types'

export async function getMyVendorProfile(userId: string): Promise<Vendor | null> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
  if (error) throw error
  return (data?.[0] as Vendor) ?? null
}

interface CreateVendorProfileParams {
  userId: string
  vendorType: 'venue' | 'caterer'
  businessName: string
  description: string
  phone: string
  email: string
  location: string
}

export async function createVendorProfile(params: CreateVendorProfileParams): Promise<Vendor> {
  const { data, error } = await supabase
    .from('vendors')
    .insert({
      user_id: params.userId,
      vendor_type: params.vendorType,
      business_name: params.businessName,
      description: params.description,
      phone: params.phone,
      email: params.email,
      location: params.location,
      status: 'pending',
    })
    .select()
    .single()
  if (error) throw error
  return data as Vendor
}

export async function updateVendorProfile(vendorId: string, updates: Partial<CreateVendorProfileParams>): Promise<Vendor> {
  const { data, error } = await supabase
    .from('vendors')
    .update({
      business_name: updates.businessName,
      description: updates.description,
      phone: updates.phone,
      email: updates.email,
      location: updates.location,
    })
    .eq('id', vendorId)
    .select()
    .single()
  if (error) throw error
  return data as Vendor
}

// ----- Venue services (for a venue-type vendor) -----

export async function getMyVenues(vendorId: string): Promise<Venue[]> {
  const { data, error } = await supabase.from('venues').select('*').eq('vendor_id', vendorId)
  if (error) throw error
  return data as Venue[]
}

interface VenueInput {
  name: string
  description: string
  location: string
  capacity: number
  price: number
  facilities: string[]
  imageUrl?: string | null
}

export async function createVenueListing(vendorId: string, input: VenueInput): Promise<Venue> {
  const { data, error } = await supabase
    .from('venues')
    .insert({
      vendor_id: vendorId,
      name: input.name,
      description: input.description,
      location: input.location,
      capacity: input.capacity,
      price: input.price,
      facilities: input.facilities,
      image_url: input.imageUrl ?? null,
    })
    .select()
    .single()
  if (error) throw error
  return data as Venue
}

export async function updateVenueListing(venueId: string, input: Partial<VenueInput>): Promise<Venue> {
  const { data, error } = await supabase
    .from('venues')
    .update({
      name: input.name,
      description: input.description,
      location: input.location,
      capacity: input.capacity,
      price: input.price,
      facilities: input.facilities,
      image_url: input.imageUrl,
    })
    .eq('id', venueId)
    .select()
    .single()
  if (error) throw error
  return data as Venue
}

export async function deleteVenueListing(venueId: string): Promise<void> {
  const { error } = await supabase.from('venues').delete().eq('id', venueId)
  if (error) throw error
}

// ----- Caterer + package services (for a caterer-type vendor) -----

export async function getMyCaterer(vendorId: string): Promise<Caterer | null> {
  const { data, error } = await supabase.from('caterers').select('*').eq('vendor_id', vendorId).maybeSingle()
  if (error) throw error
  return data as Caterer | null
}

interface CatererInput {
  name: string
  description: string
  location: string
  cuisineType: string
  imageUrl?: string | null
}

export async function createCatererListing(vendorId: string, input: CatererInput): Promise<Caterer> {
  const { data, error } = await supabase
    .from('caterers')
    .insert({
      vendor_id: vendorId,
      name: input.name,
      description: input.description,
      location: input.location,
      cuisine_type: input.cuisineType,
      image_url: input.imageUrl ?? null,
    })
    .select()
    .single()
  if (error) throw error
  return data as Caterer
}

export async function updateCatererListing(catererId: string, input: Partial<CatererInput>): Promise<Caterer> {
  const { data, error } = await supabase
    .from('caterers')
    .update({
      name: input.name,
      description: input.description,
      location: input.location,
      cuisine_type: input.cuisineType,
      image_url: input.imageUrl,
    })
    .eq('id', catererId)
    .select()
    .single()
  if (error) throw error
  return data as Caterer
}

export async function getMyCateringPackages(catererId: string): Promise<CateringPackage[]> {
  const { data, error } = await supabase.from('catering_packages').select('*').eq('caterer_id', catererId)
  if (error) throw error
  return data as CateringPackage[]
}

interface PackageInput {
  name: string
  description: string
  pricePerPerson: number
  minimumGuests: number
}

export async function createCateringPackage(catererId: string, input: PackageInput): Promise<CateringPackage> {
  const { data, error } = await supabase
    .from('catering_packages')
    .insert({
      caterer_id: catererId,
      name: input.name,
      description: input.description,
      price_per_person: input.pricePerPerson,
      minimum_guests: input.minimumGuests,
    })
    .select()
    .single()
  if (error) throw error
  return data as CateringPackage
}

export async function updateCateringPackage(packageId: string, input: Partial<PackageInput>): Promise<CateringPackage> {
  const { data, error } = await supabase
    .from('catering_packages')
    .update({
      name: input.name,
      description: input.description,
      price_per_person: input.pricePerPerson,
      minimum_guests: input.minimumGuests,
    })
    .eq('id', packageId)
    .select()
    .single()
  if (error) throw error
  return data as CateringPackage
}

export async function deleteCateringPackage(packageId: string): Promise<void> {
  const { error } = await supabase.from('catering_packages').delete().eq('id', packageId)
  if (error) throw error
}

// ----- Availability (venues only) -----

export interface AvailabilityEntry {
  id: string
  venue_id: string
  available_date: string
  is_available: boolean
}

export async function getVenueAvailability(venueId: string): Promise<AvailabilityEntry[]> {
  const { data, error } = await supabase
    .from('venue_availability')
    .select('*')
    .eq('venue_id', venueId)
    .order('available_date', { ascending: true })
  if (error) throw error
  return data as AvailabilityEntry[]
}

export async function setVenueAvailability(venueId: string, date: string, isAvailable: boolean): Promise<void> {
  const { error } = await supabase
    .from('venue_availability')
    .upsert({ venue_id: venueId, available_date: date, is_available: isAvailable }, { onConflict: 'venue_id,available_date' })
  if (error) throw error
}
