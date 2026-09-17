import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { getVenues } from '../../features/venues/venueService'
import VenueCard from '../../components/shared/VenueCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import EmptyState from '../../components/ui/EmptyState'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import type { Venue as VenueType, VenueFilters } from '../../types'

export default function Venue() {
  const [searchParams] = useSearchParams()
  const initialLocation = searchParams.get('location') ?? undefined
  const initialFilters: VenueFilters = initialLocation ? { location: initialLocation } : {}

  const [venues, setVenues] = useState<VenueType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [draftFilters, setDraftFilters] = useState<VenueFilters>(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState<VenueFilters>(initialFilters)

  useEffect(() => {
    let cancelled = false

    async function loadVenues() {
      setLoading(true)
      setError(null)
      try {
        const data = await getVenues(appliedFilters)
        if (!cancelled) setVenues(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load venues')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadVenues()
    return () => { cancelled = true }
  }, [appliedFilters])

  function handleSearch() {
    setAppliedFilters(draftFilters)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-medium text-[#0C447C] dark:text-[#85B7EB] mb-6">Event Centres</h1>

      <div className="flex flex-wrap gap-3 mb-8 items-end">
        <div className="flex-1 min-w-[200px]">
          <Input
            label="Search"
            placeholder="Name or location..."
            value={draftFilters.search ?? ''}
            onChange={(e) => setDraftFilters({ ...draftFilters, search: e.target.value })}
          />
        </div>
        <div className="w-40">
          <Input
            label="Min. capacity"
            type="number"
            placeholder="e.g. 100"
            value={draftFilters.minCapacity ?? ''}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, minCapacity: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </div>
        <div className="w-40">
          <Input
            label="Max. price"
            type="number"
            placeholder="e.g. 500000"
            value={draftFilters.maxPrice ?? ''}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, maxPrice: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </div>
        <Button onClick={handleSearch} className="flex items-center gap-1.5">
          <Search size={16} /> Search
        </Button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && venues.length === 0 && (
        <EmptyState
          title="No event centres found"
          description="Try adjusting your search or filters."
        />
      )}
      {!loading && !error && venues.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  )
}
