import { supabase } from '../../lib/supabaseClient'
import type { Event } from '../../types'

interface CreateEventParams {
  customerId: string
  name: string
  eventType: string
  eventDate: string
  guestCount: number
}

export async function createEvent(params: CreateEventParams): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .insert({
      customer_id: params.customerId,
      name: params.name,
      event_type: params.eventType,
      event_date: params.eventDate,
      guest_count: params.guestCount,
    })
    .select()
    .single()
  if (error) throw error
  return data as Event
}

export async function getEventById(id: string): Promise<Event> {
  const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
  if (error) throw error
  return data as Event
}

export async function getMyEvents(customerId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('customer_id', customerId)
    .order('event_date', { ascending: true })
  if (error) throw error
  return data as Event[]
}
