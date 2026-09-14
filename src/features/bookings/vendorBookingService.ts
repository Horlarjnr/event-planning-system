import { supabase } from '../../lib/supabaseClient'
import type { BookingStatus, VendorBookingView } from '../../types'

export async function getVendorBookings(vendorId: string, vendorType: 'venue' | 'caterer'): Promise<VendorBookingView[]> {
  const column = vendorType === 'venue' ? 'venue_id' : 'caterer_id'
  const table = vendorType === 'venue' ? 'venues' : 'caterers'

  const { data: listings, error: listingsError } = await supabase
    .from(table)
    .select('id')
    .eq('vendor_id', vendorId)
  if (listingsError) throw listingsError

  const listingIds = (listings ?? []).map((l) => l.id)
  if (listingIds.length === 0) return []

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      event:events(name, event_date, guest_count),
      customer:profiles(full_name, phone)
    `)
    .in(column, listingIds)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as VendorBookingView[]
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
  if (error) throw error
}
