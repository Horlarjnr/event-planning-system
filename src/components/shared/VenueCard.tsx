import { Link } from 'react-router-dom'
import { MapPin, Users } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import type { Venue } from '../../types'

export default function VenueCard({ venue }: { venue: Venue }) {
  return (
    <Card>
      <div
        className="h-40 bg-gray-100 dark:bg-gray-700 bg-cover bg-center"
        style={{ backgroundImage: venue.image_url ? `url(${venue.image_url})` : undefined }}
      />
      <div className="p-4">
        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">{venue.name}</p>

        {venue.location && (
          <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <MapPin size={14} /> {venue.location}
          </p>
        )}

        {venue.capacity && (
          <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <Users size={14} /> Up to {venue.capacity} guests
          </p>
        )}

        <div className="flex items-center justify-between">
          {venue.price ? (
            <span className="font-medium text-[#185FA5] dark:text-[#B5D4F4]">₦{venue.price.toLocaleString()}</span>
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-500">Price on request</span>
          )}
          <Link to={`/venues/${venue.id}`}>
            <Button variant="primary">View details</Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
