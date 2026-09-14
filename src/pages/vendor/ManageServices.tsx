import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  getMyVendorProfile,
  getMyVenues,
  createVenueListing,
  updateVenueListing,
  deleteVenueListing,
  getMyCaterer,
  createCatererListing,
  updateCatererListing,
  getMyCateringPackages,
  createCateringPackage,
  updateCateringPackage,
  deleteCateringPackage,
} from '../../features/vendors/vendorService'
import ImageUpload from '../../components/ui/ImageUpload'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import EmptyState from '../../components/ui/EmptyState'
import { Trash2 } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { vendorNavItems } from '../../components/layout/navConfig'
import type { Vendor, Venue, Caterer, CateringPackage } from '../../types'

function initialsOf(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function ManageServices() {
  const { user } = useAuth()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [venues, setVenues] = useState<Venue[]>([])
  const [caterer, setCaterer] = useState<Caterer | null>(null)
  const [packages, setPackages] = useState<CateringPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    load()
  }, [user])

  async function load() {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const v = await getMyVendorProfile(user.id)
      setVendor(v)
      if (v?.vendor_type === 'venue') {
        setVenues(await getMyVenues(v.id))
      }
      if (v?.vendor_type === 'caterer') {
        const c = await getMyCaterer(v.id)
        setCaterer(c)
        if (c) setPackages(await getMyCateringPackages(c.id))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const navItems = vendorNavItems(vendor?.vendor_type === 'venue')
  const layoutProps = {
    navItems,
    footerInitials: vendor ? initialsOf(vendor.business_name) : '--',
    footerLabel: vendor?.business_name ?? 'Vendor',
  }

  if (loading) return <DashboardLayout {...layoutProps} title="Services"><LoadingSpinner /></DashboardLayout>
  if (error) return <DashboardLayout {...layoutProps} title="Services"><ErrorMessage message={error} /></DashboardLayout>
  if (!vendor) {
    return (
      <DashboardLayout {...layoutProps} title="Services">
        <EmptyState title="No vendor profile" description="Set up your vendor profile first." />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout {...layoutProps} title={vendor.vendor_type === 'venue' ? 'Manage venues' : 'Manage caterer & packages'}>
      {vendor.vendor_type === 'venue' ? (
        <VenueManager vendor={vendor} venues={venues} onChange={load} />
      ) : (
        <CatererManager vendor={vendor} caterer={caterer} packages={packages} onChange={load} />
      )}
    </DashboardLayout>
  )
}

// ---------- Venue manager ----------

function VenueManager({ vendor, venues, onChange }: { vendor: Vendor; venues: Venue[]; onChange: () => void }) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [capacity, setCapacity] = useState('')
  const [price, setPrice] = useState('')
  const [facilities, setFacilities] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd() {
    setSubmitting(true)
    setError(null)
    try {
      await createVenueListing(vendor.id, {
        name,
        description,
        location,
        capacity: Number(capacity),
        price: Number(price),
        facilities: facilities.split(',').map((f) => f.trim()).filter(Boolean),
        imageUrl,
      })
      setAdding(false)
      setName(''); setDescription(''); setLocation(''); setCapacity(''); setPrice(''); setFacilities(''); setImageUrl(null)
      onChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add venue')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteVenueListing(id)
      onChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete venue')
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-end mb-6">
        <Button onClick={() => setAdding(!adding)}>{adding ? 'Cancel' : 'Add venue'}</Button>
      </div>

      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

      {adding && (
        <Card className="p-4 mb-6 space-y-3">
          <ImageUpload folder="venues" ownerId={vendor.id} currentUrl={imageUrl} onUploaded={setImageUrl} />
          <Input label="Venue name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <Input label="Capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          <Input label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          <Input label="Facilities (comma separated)" value={facilities} onChange={(e) => setFacilities(e.target.value)} />
          <Button onClick={handleAdd} disabled={submitting}>{submitting ? 'Saving...' : 'Save venue'}</Button>
        </Card>
      )}

      {venues.length === 0 ? (
        <EmptyState title="No venues yet" description="Add your first venue listing above." />
      ) : (
        <div className="space-y-3">
          {venues.map((v) => (
            <Card key={v.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{v.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{v.location} · ₦{v.price?.toLocaleString()} · Up to {v.capacity} guests</p>
              </div>
              <button onClick={() => handleDelete(v.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------- Caterer manager ----------

function CatererManager({
  vendor, caterer, packages, onChange,
}: { vendor: Vendor; caterer: Caterer | null; packages: CateringPackage[]; onChange: () => void }) {
  const [name, setName] = useState(caterer?.name ?? '')
  const [description, setDescription] = useState(caterer?.description ?? '')
  const [location, setLocation] = useState(caterer?.location ?? '')
  const [cuisineType, setCuisineType] = useState(caterer?.cuisine_type ?? '')
  const [imageUrl, setImageUrl] = useState<string | null>(caterer?.image_url ?? null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [addingPackage, setAddingPackage] = useState(false)
  const [pkgName, setPkgName] = useState('')
  const [pkgDescription, setPkgDescription] = useState('')
  const [pkgPrice, setPkgPrice] = useState('')
  const [pkgMinGuests, setPkgMinGuests] = useState('')

  async function handleSaveCaterer() {
    setSubmitting(true)
    setError(null)
    try {
      if (caterer) {
        await updateCatererListing(caterer.id, { name, description, location, cuisineType, imageUrl })
      } else {
        await createCatererListing(vendor.id, { name, description, location, cuisineType, imageUrl })
      }
      onChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save caterer profile')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAddPackage() {
    if (!caterer) return
    setSubmitting(true)
    setError(null)
    try {
      await createCateringPackage(caterer.id, {
        name: pkgName,
        description: pkgDescription,
        pricePerPerson: Number(pkgPrice),
        minimumGuests: Number(pkgMinGuests),
      })
      setAddingPackage(false)
      setPkgName(''); setPkgDescription(''); setPkgPrice(''); setPkgMinGuests('')
      onChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add package')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeletePackage(id: string) {
    try {
      await deleteCateringPackage(id)
      onChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete package')
    }
  }

  return (
    <div className="max-w-2xl">
      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

      <Card className="p-4 mb-6 space-y-3">
        <ImageUpload folder="caterers" ownerId={vendor.id} currentUrl={imageUrl} onUploaded={setImageUrl} />
        <Input label="Business name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <Input label="Cuisine type" value={cuisineType} onChange={(e) => setCuisineType(e.target.value)} />
        <Button onClick={handleSaveCaterer} disabled={submitting}>
          {submitting ? 'Saving...' : caterer ? 'Update profile' : 'Create catering profile'}
        </Button>
      </Card>

      {caterer && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="font-medium text-gray-900 dark:text-gray-100">Catering packages</p>
            <Button onClick={() => setAddingPackage(!addingPackage)}>{addingPackage ? 'Cancel' : 'Add package'}</Button>
          </div>

          {addingPackage && (
            <Card className="p-4 mb-4 space-y-3">
              <Input label="Package name" value={pkgName} onChange={(e) => setPkgName(e.target.value)} />
              <Input label="Description" value={pkgDescription} onChange={(e) => setPkgDescription(e.target.value)} />
              <Input label="Price per person" type="number" value={pkgPrice} onChange={(e) => setPkgPrice(e.target.value)} />
              <Input label="Minimum guests" type="number" value={pkgMinGuests} onChange={(e) => setPkgMinGuests(e.target.value)} />
              <Button onClick={handleAddPackage} disabled={submitting}>{submitting ? 'Saving...' : 'Save package'}</Button>
            </Card>
          )}

          {packages.length === 0 ? (
            <EmptyState title="No packages yet" description="Add your first catering package above." />
          ) : (
            <div className="space-y-3">
              {packages.map((p) => (
                <Card key={p.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">₦{p.price_per_person.toLocaleString()}/person · Min {p.minimum_guests} guests</p>
                  </div>
                  <button onClick={() => handleDeletePackage(p.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
