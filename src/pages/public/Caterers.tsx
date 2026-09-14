import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { getCaterers } from '../../features/caterers/catererService'
import CatererCard from '../../components/shared/CatererCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import EmptyState from '../../components/ui/EmptyState'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import type { Caterer, CatererFilters } from '../../types'

export default function Caterers() {
  const [caterers, setCaterers] = useState<Caterer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [draftFilters, setDraftFilters] = useState<CatererFilters>({})
  const [appliedFilters, setAppliedFilters] = useState<CatererFilters>({})

  useEffect(() => {
    let cancelled = false

    async function loadCaterers() {
      setLoading(true)
      setError(null)
      try {
        const data = await getCaterers(appliedFilters)
        if (!cancelled) setCaterers(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load caterers')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadCaterers()
    return () => { cancelled = true }
  }, [appliedFilters])

  function handleSearch() {
    setAppliedFilters(draftFilters)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-medium text-[#0C447C] dark:text-[#85B7EB] mb-6">Caterers</h1>

      <div className="flex flex-wrap gap-3 mb-8 items-end">
        <div className="flex-1 min-w-[200px]">
          <Input
            label="Search"
            placeholder="Name or location..."
            value={draftFilters.search ?? ''}
            onChange={(e) => setDraftFilters({ ...draftFilters, search: e.target.value })}
          />
        </div>
        <div className="w-48">
          <Input
            label="Cuisine type"
            placeholder="e.g. Continental"
            value={draftFilters.cuisineType ?? ''}
            onChange={(e) => setDraftFilters({ ...draftFilters, cuisineType: e.target.value })}
          />
        </div>
        <Button onClick={handleSearch} className="flex items-center gap-1.5">
          <Search size={16} /> Search
        </Button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && caterers.length === 0 && (
        <EmptyState
          title="No caterers found"
          description="Try adjusting your search or filters."
        />
      )}
      {!loading && !error && caterers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {caterers.map((caterer) => (
            <CatererCard key={caterer.id} caterer={caterer} />
          ))}
        </div>
      )}
    </div>
  )
}
