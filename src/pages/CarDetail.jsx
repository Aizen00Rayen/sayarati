import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Spinner, Button, Card, Chip } from '@heroui/react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { formatMoney, daysBetween } from '../lib/constants'
import { Field, Input, Stars } from '../components/ui'

const FALLBACK =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=75'

export default function CarDetail() {
  const { id } = useParams()
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [car, setCar] = useState(null)
  const [agency, setAgency] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data: c } = await supabase.from('cars').select('*').eq('id', id).maybeSingle()
      if (!active) return
      setCar(c)
      if (c) {
        const [{ data: a }, { data: r }] = await Promise.all([
          supabase.from('agencies').select('*').eq('id', c.agency_id).maybeSingle(),
          supabase
            .from('reviews')
            .select('*, profiles(full_name)')
            .eq('agency_id', c.agency_id)
            .order('created_at', { ascending: false }),
        ])
        setAgency(a)
        setReviews(r || [])
      }
      setLoading(false)
    })()
    return () => { active = false }
  }, [id])

  const days = daysBetween(start, end)
  const total = days * (car?.price_per_day || 0)
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0

  const book = async () => {
    setError('')
    if (!user) return navigate('/login', { state: { from: `/cars/${id}` } })
    if (days <= 0) return setError(t('carDetail.selectDates'))
    setSubmitting(true)
    const { error: err } = await supabase.from('bookings').insert({
      car_id: car.id,
      customer_id: user.id,
      agency_id: car.agency_id,
      start_date: start,
      end_date: end,
      total_price: total,
      status: 'pending',
    })
    setSubmitting(false)
    if (err) setError(err.message)
    else setDone(true)
  }

  if (loading) return <div className="grid min-h-[60vh] place-items-center"><Spinner color="accent" size="lg" /></div>
  if (!car) return <div className="grid min-h-[60vh] place-items-center text-muted">404</div>

  const specs = [
    ['carDetail.year', car.year],
    ['search.category', t(`category.${car.category}`)],
    ['cars.transmission', t(`transmission.${car.transmission}`)],
    ['cars.fuel', t(`fuel.${car.fuel}`)],
    ['form.seats', car.seats],
    ['search.city', car.city],
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to="/cars" className="text-sm font-semibold text-brand-600 hover:underline">← {t('common.back')}</Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-2xl">
            <img
              src={car.image_url || FALLBACK}
              onError={(e) => { e.currentTarget.src = FALLBACK }}
              alt={`${car.brand} ${car.model}`}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold text-ink-900">{car.brand} {car.model}</h1>
            <Chip color={car.available ? 'success' : 'danger'} variant="soft">
              <Chip.Label>{car.available ? t('cars.available') : t('cars.unavailable')}</Chip.Label>
            </Chip>
          </div>

          {car.description && <p className="mt-3 text-muted">{car.description}</p>}

          <Card className="mt-6 border border-border/70 p-5">
            <h2 className="mb-4 font-bold text-ink-900">{t('carDetail.specs')}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {specs.map(([k, v]) => (
                <div key={k} className="rounded-xl bg-default-soft p-3">
                  <p className="text-xs text-muted">{t(k)}</p>
                  <p className="font-semibold text-ink-900">{v}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Reviews */}
          <div className="mt-8">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-xl font-bold text-ink-900">{t('carDetail.reviews')}</h2>
              {reviews.length > 0 && (
                <span className="flex items-center gap-1 text-sm text-muted">
                  <Stars value={avgRating} /> {avgRating.toFixed(1)} ({reviews.length})
                </span>
              )}
            </div>
            {reviews.length === 0 ? (
              <p className="text-muted">{t('carDetail.noReviews')}</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <Card key={r.id} className="border border-border/70 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-ink-900">{r.profiles?.full_name || 'Client'}</p>
                      <Stars value={r.rating} />
                    </div>
                    {r.comment && <p className="mt-1.5 text-sm text-muted">{r.comment}</p>}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking box */}
        <div className="lg:sticky lg:top-20 lg:h-fit">
          <Card className="border border-border/70 p-6 shadow-lg">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-brand-600">{formatMoney(car.price_per_day)}</span>
              <span className="text-muted">{t('common.currency')} {t('cars.perDay')}</span>
            </div>

            {agency && (
              <Link to={`/agencies/${agency.id}`} className="mt-3 flex items-center gap-3 rounded-xl bg-default-soft p-3 hover:bg-default-soft-hover">
                <img src={agency.logo_url} alt="" className="h-10 w-10 rounded-lg object-cover" onError={(e)=>{e.currentTarget.style.visibility='hidden'}} />
                <div>
                  <p className="text-xs text-muted">{t('carDetail.agency')}</p>
                  <p className="font-semibold text-ink-900">{agency.name_fr || agency.name}</p>
                </div>
              </Link>
            )}

            {done ? (
              <div className="mt-5 rounded-xl bg-success-soft p-4 text-center text-success-soft-foreground">
                ✅ {t('carDetail.bookingSuccess')}
                <Button fullWidth variant="primary" className="mt-3" onPress={() => navigate('/account')}>
                  {t('nav.myBookings')}
                </Button>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <h3 className="font-bold text-ink-900">{t('carDetail.bookTitle')}</h3>
                <Field label={t('search.from')}>
                  <Input type="date" value={start} min={new Date().toISOString().split('T')[0]} onChange={(e) => setStart(e.target.value)} />
                </Field>
                <Field label={t('search.to')}>
                  <Input type="date" value={end} min={start || new Date().toISOString().split('T')[0]} onChange={(e) => setEnd(e.target.value)} />
                </Field>

                {days > 0 && (
                  <div className="flex items-center justify-between rounded-xl bg-brand-50 p-3 text-sm">
                    <span>{days} {t('carDetail.days')} × {formatMoney(car.price_per_day)}</span>
                    <span className="text-lg font-extrabold text-brand-700">{formatMoney(total)} {t('common.currency')}</span>
                  </div>
                )}

                {error && <p className="text-sm text-danger">{error}</p>}

                <Button
                  fullWidth variant="primary" size="lg"
                  onPress={book}
                  isDisabled={submitting || !car.available}
                >
                  {user ? t('carDetail.confirmBooking') : t('carDetail.loginToBook')}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
