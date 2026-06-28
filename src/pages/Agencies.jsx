import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Spinner, Card, Button } from '@heroui/react'
import { supabase } from '../lib/supabase'
import { Stars } from '../components/ui'

export default function Agencies() {
  const { t, i18n } = useTranslation()
  const [agencies, setAgencies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.from('agencies').select('*').eq('status', 'approved')
      const enriched = await Promise.all(
        (data || []).map(async (a) => {
          const [{ count: cars }, { data: revs }] = await Promise.all([
            supabase.from('cars').select('id', { count: 'exact', head: true }).eq('agency_id', a.id),
            supabase.from('reviews').select('rating').eq('agency_id', a.id),
          ])
          const rating = revs?.length ? revs.reduce((s, r) => s + r.rating, 0) / revs.length : 0
          return { ...a, carsCount: cars || 0, rating, reviewsCount: revs?.length || 0 }
        })
      )
      setAgencies(enriched)
      setLoading(false)
    })()
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold text-ink-900">{t('agencies.title')}</h1>
      <p className="mt-1 text-muted">{t('agencies.subtitle')}</p>

      {loading ? (
        <div className="grid place-items-center py-24"><Spinner color="accent" size="lg" /></div>
      ) : agencies.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-border py-24 text-muted">
          {t('agencies.noAgencies')}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agencies.map((a) => (
            <Card key={a.id} className="overflow-hidden border border-border/70 transition hover:shadow-xl">
              <div className="h-24 brand-gradient" />
              <Card.Content className="p-5">
                <div className="-mt-12 flex items-end gap-3">
                  <img
                    src={a.logo_url}
                    alt={a.name}
                    className="h-16 w-16 rounded-2xl border-4 border-background object-cover bg-default-soft"
                    onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
                  />
                </div>
                <h3 className="mt-3 font-bold text-ink-900">{i18n.language === 'ar' ? a.name : a.name_fr || a.name}</h3>
                <p className="text-sm text-muted">📍 {a.city}</p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Stars value={a.rating} />
                  <span className="text-muted">{a.rating.toFixed(1)} ({a.reviewsCount})</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {i18n.language === 'ar' ? a.description : a.description_fr || a.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-sm font-semibold text-brand-700">
                    {a.carsCount} {t('agencies.carsCount')}
                  </span>
                  <Link to={`/agencies/${a.id}`}>
                    <Button size="sm" variant="primary">{t('agencies.viewCars')}</Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
