import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, UtensilsCrossed } from 'lucide-react'
import { getCatererById, getCateringPackages } from '../../features/caterers/catererService'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import EmptyState from '../../components/ui/EmptyState'
import Card from '../../components/ui/Card'
import type { Caterer, CateringPackage } from '../../types'

export default function CatererDetails() {
  const { id } = useParams<{ id: string }>()
  const [caterer, setCaterer] = useState<Caterer | null>(null)
  const [packages, setPackages] = useState<CateringPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [catererData, packagesData] = await Promise.all([
          getCatererById(id!),
          getCateringPackages(id!),
        ])
        if (!cancelled) {
          setCaterer(catererData)
          setPackages(packagesData)
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load caterer')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) return <LoadingSpinner />
  if (error) return <div className="max-w-3xl mx-auto px-6 py-10"><ErrorMessage message={error} /></div>
  if (!caterer) return null

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div
        className="h-64 bg-gray-100 dark:bg-gray-700 rounded-xl bg-cover bg-center mb-6"
        style={{ backgroundImage: caterer.image_url ? `url(${caterer.image_url})` : undefined }}
      />

      <h1 className="text-2xl font-medium text-[#0C447C] dark:text-[#85B7EB] mb-2">{caterer.name}</h1>

      <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
        {caterer.location && <span className="flex items-center gap-1"><MapPin size={14} /> {caterer.location}</span>}
        {caterer.cuisine_type && <span className="flex items-center gap-1"><UtensilsCrossed size={14} /> {caterer.cuisine_type}</span>}
      </div>

      {caterer.description && <p className="text-gray-700 dark:text-gray-300 mb-6">{caterer.description}</p>}

      <p className="font-medium text-gray-900 dark:text-gray-100 mb-3">Catering packages</p>

      {packages.length === 0 ? (
        <EmptyState title="No packages listed yet" description="This caterer hasn't added any packages." />
      ) : (
        <div className="space-y-3">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{pkg.name}</p>
                {pkg.description && <p className="text-sm text-gray-500 dark:text-gray-400">{pkg.description}</p>}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Minimum {pkg.minimum_guests} guests</p>
              </div>
              <span className="font-medium text-[#185FA5] dark:text-[#B5D4F4]">₦{pkg.price_per_person.toLocaleString()}/person</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
