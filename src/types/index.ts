export type UserRole = 'customer' | 'vendor' | 'admin'
export type VendorType = 'venue' | 'caterer'
export type VendorStatus = 'pending' | 'approved' | 'suspended'
export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed'

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  deleted_at: string | null
}

export interface Venue {
  id: string
  vendor_id: string
  name: string
  description: string | null
  location: string | null
  capacity: number | null
  price: number | null
  facilities: string[] | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Caterer {
  id: string
  vendor_id: string
  name: string
  description: string | null
  location: string | null
  cuisine_type: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface CateringPackage {
  id: string
  caterer_id: string
  name: string
  description: string | null
  price_per_person: number
  minimum_guests: number
  created_at: string
  updated_at: string
}

export interface VenueFilters {
  search?: string
  location?: string
  minCapacity?: number
  maxPrice?: number
}

export interface CatererFilters {
  search?: string
  location?: string
  cuisineType?: string
}

export interface Event {
  id: string
  customer_id: string
  name: string
  event_type: string | null
  event_date: string
  guest_count: number
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  event_id: string
  customer_id: string
  venue_id: string | null
  caterer_id: string | null
  catering_package_id: string | null
  venue_price: number | null
  catering_price: number | null
  total_price: number | null
  status: BookingStatus
  created_at: string
  updated_at: string
}

export interface BookingWithDetails extends Booking {
  event: Pick<Event, 'name' | 'event_date' | 'guest_count'>
  venue: Pick<Venue, 'name'> | null
  caterer: Pick<Caterer, 'name'> | null
  catering_package: Pick<CateringPackage, 'name'> | null
}

export interface Vendor {
  id: string
  user_id: string
  vendor_type: VendorType
  business_name: string
  description: string | null
  phone: string | null
  email: string | null
  location: string | null
  status: VendorStatus
  created_at: string
  updated_at: string
}

export interface VendorBookingView extends Booking {
  event: Pick<Event, 'name' | 'event_date' | 'guest_count'>
  customer: { full_name: string | null; phone: string | null } | null
}

export interface VenueAvailability {
  id: string
  venue_id: string
  available_date: string
  is_available: boolean
}
