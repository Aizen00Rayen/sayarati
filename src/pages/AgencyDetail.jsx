import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Spinner, Card } from '@heroui/react'
import { supabase } from '../lib/supabase'
import { Stars } from '../components/ui'
import CarCard from '../components/CarCard'

export default function AgencyDetail() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const [agency, setAgency] = useState(null)
  const [cars, setCars] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const [{ data: a }, { data: c }, { data: r }] = await Promise.all([
        supabase.from('agencies').select('*').eq('id', id).maybeSingle(),
        supabase.from('cars').select('*').eq('agency_id', id),
        supabase.from('reviews').select('*, profiles(full_name)').eq('agency_id', id).order('created_at', { ascending: false }),
      ])
      setAgency(a)
      setCars(c || [])
      setReviews(r || [])
      setLoading(false)
    })()
  }, [id])

  if (loading) return <div className="grid min-h-[60vh] place-items-center"><Spinner color="accent" size="lg" /></div>
  if (!agency) return <div className="grid min-h-[60vh] place-items-center text-muted">404</div>

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  return (
    <div>
      <div className="brand-gradient">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-12 sm:flex-row sm:items-center sm:px-6">
          <img
            src={agency.logo_url}
            alt={agency.name}
            className="h-24 w-24 rounded-2xl border-4 border-white/20 object-cover bg-white/10"
            onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
          />
          <div className="text-white">
            <h1 className="text-3xl font-extrabold">{i18n.language === 'ar' ? agency.name : agency.name_fr || agency.name}</h1>
            <p className="mt-1 text-white/80">📍 {agency.city} · ☎ {agency.phone}</p>
            <div className="mt-2 flex items-center gap-2">
              <Stars value={avg} />
              <span className="text-white/80">{avg.toFixed(1)} ({reviews.length})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <p className="max-w-3xl text-muted">
          {i18n.language === 'ar' ? agency.description : agency.description_fr || agency.description}
        </p>

        <h2 className="mt-10 text-2xl font-extrabold text-ink-900">{t('agencies.viewCars')}</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((c) => <CarCard key={c.id} car={c} />)}
        </div>

        {reviews.length > 0 && (
          <>
            <h2 className="mt-12 text-2xl font-extrabold text-ink-900">{t('carDetail.reviews')}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
          </>
        )}
      </div>
    </div>
  )
}
