import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createEvent } from '../../features/events/eventService'
import { createBooking } from '../../features/bookings/bookingService'
import { getVenues } from '../../features/venues/venueService'
import { getCaterers, getCateringPackages } from '../../features/caterers/catererService'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { customerNavItems } from '../../components/layout/navConfig'
import type { Venue, Caterer, CateringPackage } from '../../types'

type Step = 'details' | 'venue' | 'caterer' | 'package' | 'review'

function initialsOf(name: string | null | undefined) {
  if (!name) return 'ME'
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function CreateEvent() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [step, setStep] = useState<Step>('details')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [eventType, setEventType] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [guestCount, setGuestCount] = useState('')

  const [venues, setVenues] = useState<Venue[]>([])
  const [caterers, setCaterers] = useState<Caterer[]>([])
  const [packages, setPackages] = useState<CateringPackage[]>([])
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [selectedCaterer, setSelectedCaterer] = useState<Caterer | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<CateringPackage | null>(null)
  const [loadingOptions, setLoadingOptions] = useState(false)

  const preselectedVenueId = searchParams.get('venueId')

  useEffect(() => {
    if (step === 'venue') {
      setLoadingOptions(true)
      getVenues()
        .then((data) => {
          setVenues(data)
          if (preselectedVenueId) {
            const match = data.find((v) => v.id === preselectedVenueId)
            if (match) setSelectedVenue(match)
          }
        })
        .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load venues'))
        .finally(() => setLoadingOptions(false))
    }
    if (step === 'caterer') {
      setLoadingOptions(true)
      getCaterers()
        .then(setCaterers)
        .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load caterers'))
        .finally(() => setLoadingOptions(false))
    }
    if (step === 'package' && selectedCaterer) {
      setLoadingOptions(true)
      getCateringPackages(selectedCaterer.id)
        .then(setPackages)
        .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load packages'))
        .finally(() => setLoadingOptions(false))
    }
  }, [step])

  function goNext(next: Step) {
    setError(null)
    setStep(next)
  }

  async function handleSubmitBooking() {
    if (!user || !selectedVenue) return
    setSubmitting(true)
    setError(null)
    try {
      const event = await createEvent({
        customerId: user.id,
        name,
        eventType,
        eventDate,
        guestCount: Number(guestCount),
      })

      const cateringPrice = selectedPackage
        ? selectedPackage.price_per_person * Number(guestCount)
        : 0

      await createBooking({
        eventId: event.id,
        customerId: user.id,
        venueId: selectedVenue.id,
        catererId: selectedCaterer?.id ?? null,
        cateringPackageId: selectedPackage?.id ?? null,
        venuePrice: selectedVenue.price ?? 0,
        cateringPrice,
      })

      navigate('/customer/bookings')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit booking')
    } finally {
      setSubmitting(false)
    }
  }

  const totalPrice =
    (selectedVenue?.price ?? 0) +
    (selectedPackage ? selectedPackage.price_per_person * Number(guestCount || 0) : 0)

  return (
    <DashboardLayout
      navItems={customerNavItems}
      footerInitials={initialsOf(profile?.full_name)}
      footerLabel={profile?.full_name ?? 'My account'}
      title="Create event"
    >
    <div className="max-w-2xl">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Step {['details', 'venue', 'caterer', 'package', 'review'].indexOf(step) + 1} of 5
      </p>

      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

      {step === 'details' && (
        <div className="space-y-4">
          <Input label="Event name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Event type" placeholder="Wedding, Birthday, Conference..." value={eventType} onChange={(e) => setEventType(e.target.value)} required />
          <Input label="Event date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
          <Input label="Number of guests" type="number" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} required />
          <Button
            disabled={!name || !eventType || !eventDate || !guestCount}
            onClick={() => goNext('venue')}
          >
            Next: Choose a venue
          </Button>
        </div>
      )}

      {step === 'venue' && (
        <div>
          {loadingOptions ? <LoadingSpinner /> : (
            <div className="space-y-3 mb-6">
              {venues.map((v) => (
                <Card
                  key={v.id}
                  onClick={() => setSelectedVenue(v)}
                  className={`p-4 cursor-pointer ${selectedVenue?.id === v.id ? 'ring-2 ring-[#0C447C]' : ''}`}
                >
                  <p className="font-medium">{v.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{v.location} · Up to {v.capacity} guests · ₦{v.price?.toLocaleString()}</p>
                </Card>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => goNext('details')}>Back</Button>
            <Button disabled={!selectedVenue} onClick={() => goNext('caterer')}>Next: Choose a caterer</Button>
          </div>
        </div>
      )}

      {step === 'caterer' && (
        <div>
          {loadingOptions ? <LoadingSpinner /> : (
            <div className="space-y-3 mb-6">
              {caterers.map((c) => (
                <Card
                  key={c.id}
                  onClick={() => setSelectedCaterer(c)}
                  className={`p-4 cursor-pointer ${selectedCaterer?.id === c.id ? 'ring-2 ring-[#0C447C]' : ''}`}
                >
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{c.location} · {c.cuisine_type}</p>
                </Card>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => goNext('venue')}>Back</Button>
            <Button disabled={!selectedCaterer} onClick={() => goNext('package')}>Next: Choose a package</Button>
          </div>
        </div>
      )}

      {step === 'package' && (
        <div>
          {loadingOptions ? <LoadingSpinner /> : (
            <div className="space-y-3 mb-6">
              {packages.map((p) => (
                <Card
                  key={p.id}
                  onClick={() => setSelectedPackage(p)}
                  className={`p-4 cursor-pointer ${selectedPackage?.id === p.id ? 'ring-2 ring-[#0C447C]' : ''}`}
                >
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">₦{p.price_per_person.toLocaleString()}/person · Min {p.minimum_guests} guests</p>
                </Card>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => goNext('caterer')}>Back</Button>
            <Button disabled={!selectedPackage} onClick={() => goNext('review')}>Next: Review</Button>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div>
          <Card className="p-5 mb-6 space-y-2">
            <p><span className="text-gray-500 dark:text-gray-400">Event:</span> {name} ({eventType})</p>
            <p><span className="text-gray-500 dark:text-gray-400">Date:</span> {eventDate}</p>
            <p><span className="text-gray-500 dark:text-gray-400">Guests:</span> {guestCount}</p>
            <p><span className="text-gray-500 dark:text-gray-400">Venue:</span> {selectedVenue?.name} — ₦{selectedVenue?.price?.toLocaleString()}</p>
            <p><span className="text-gray-500 dark:text-gray-400">Caterer:</span> {selectedCaterer?.name}</p>
            <p><span className="text-gray-500 dark:text-gray-400">Package:</span> {selectedPackage?.name} — ₦{selectedPackage?.price_per_person.toLocaleString()}/person</p>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <p className="font-medium text-lg text-[#185FA5] dark:text-[#B5D4F4]">Total: ₦{totalPrice.toLocaleString()}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">This is a booking request, not a payment. No charge is made now.</p>
            </div>
          </Card>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => goNext('package')}>Back</Button>
            <Button onClick={handleSubmitBooking} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit booking request'}
            </Button>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  )
}
