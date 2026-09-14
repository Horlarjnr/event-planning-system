import { Link } from 'react-router-dom'
import { MapPin, UtensilsCrossed } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import type { Caterer } from '../../types'

export default function CatererCard({ caterer }: { caterer: Caterer }) {
  return (
    <Card>
      <div
        className="h-40 bg-gray-100 dark:bg-gray-700 bg-cover bg-center"
        style={{ backgroundImage: caterer.image_url ? `url(${caterer.image_url})` : undefined }}
      />
      <div className="p-4">
        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">{caterer.name}</p>

        {caterer.location && (
          <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <MapPin size={14} /> {caterer.location}
          </p>
        )}

        {caterer.cuisine_type && (
          <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <UtensilsCrossed size={14} /> {caterer.cuisine_type}
          </p>
        )}

        <div className="flex justify-end">
          <Link to={`/caterers/${caterer.id}`}>
            <Button variant="primary">View packages</Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
