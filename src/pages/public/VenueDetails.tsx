import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Users } from 'lucide-react'
import { getVenueById } from '../../features/venues/venueService'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Button from '../../components/ui/Button'
import type { Venue } from '../../types'

export default function VenueDetails() {
  const { id } = useParams<{ id: string }>()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getVenueById(id!)
        if (!cancelled) setVenue(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load venue')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) return <LoadingSpinner />
  if (error) return <div className="max-w-3xl mx-auto px-6 py-10"><ErrorMessage message={error} /></div>
  if (!venue) return null

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div
        className="h-64 bg-gray-100 dark:bg-gray-700 rounded-xl bg-cover bg-center mb-6"
        style={{ backgroundImage: venue.image_url ? `url(${venue.image_url})` : undefined }}
      />

      <h1 className="text-2xl font-medium text-[#0C447C] dark:text-[#85B7EB] mb-2">{venue.name}</h1>

      <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
        {venue.location && <span className="flex items-center gap-1"><MapPin size={14} /> {venue.location}</span>}
        {venue.capacity && <span className="flex items-center gap-1"><Users size={14} /> Up to {venue.capacity} guests</span>}
      </div>

      {venue.description && <p className="text-gray-700 dark:text-gray-300 mb-4">{venue.description}</p>}

      {venue.facilities && venue.facilities.length > 0 && (
        <div className="mb-6">
          <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">Facilities</p>
          <div className="flex flex-wrap gap-2">
            {venue.facilities.map((facility) => (
              <span key={facility} className="bg-[#E6F1FB] dark:bg-[#0C447C]/30 text-[#0C447C] dark:text-[#85B7EB] text-xs px-3 py-1 rounded-full">
                {facility}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
        {venue.price ? (
          <span className="text-xl font-medium text-[#185FA5] dark:text-[#B5D4F4]">₦{venue.price.toLocaleString()}</span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">Price on request</span>
        )}
        <Link to={`/events/create?venueId=${venue.id}`}>
          <Button variant="primary">Book this venue</Button>
        </Link>
      </div>
    </div>
  )
}
