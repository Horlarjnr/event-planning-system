import { supabase } from '../../lib/supabaseClient'
import type { Booking, BookingWithDetails } from '../../types'

interface CreateBookingParams {
  eventId: string
  customerId: string
  venueId: string | null
  catererId: string | null
  cateringPackageId: string | null
  venuePrice: number
  cateringPrice: number
}

export async function createBooking(params: CreateBookingParams): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      event_id: params.eventId,
      customer_id: params.customerId,
      venue_id: params.venueId,
      caterer_id: params.catererId,
      catering_package_id: params.cateringPackageId,
      venue_price: params.venuePrice,
      catering_price: params.cateringPrice,
      total_price: params.venuePrice + params.cateringPrice,
      status: 'pending',
    })
    .select()
    .single()
  if (error) throw error
  return data as Booking
}

export async function getMyBookings(customerId: string): Promise<BookingWithDetails[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      event:events(name, event_date, guest_count),
      venue:venues(name),
      caterer:caterers(name),
      catering_package:catering_packages(name)
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as BookingWithDetails[]
}

export async function getBookingById(id: string): Promise<BookingWithDetails> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      event:events(name, event_date, guest_count),
      venue:venues(name),
      caterer:caterers(name),
      catering_package:catering_packages(name)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data as unknown as BookingWithDetails
}
