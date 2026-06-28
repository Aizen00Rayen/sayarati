import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Card, Spinner } from '@heroui/react'
import { supabase } from '../lib/supabase'
import { CITIES, CATEGORIES } from '../lib/constants'
import { Select, SectionTitle } from '../components/ui'
import CarCard from '../components/CarCard'

function Hero() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')

  const go = (e) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (city) p.set('city', city)
    if (category) p.set('category', category)
    navigate(`/cars?${p.toString()}`)
  }

  return (
    <section className="relative overflow-hidden brand-gradient">
      <div className="hero-grid absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-16 sm:px-6 sm:pt-24">
        <div className="max-w-2xl fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-brand-100 ring-1 ring-white/20">
            ✨ {t('hero.badge')}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">{t('hero.subtitle')}</p>
        </div>

        <form
          onSubmit={go}
          className="mt-10 grid max-w-3xl gap-3 rounded-2xl bg-white p-4 shadow-2xl shadow-black/20 sm:grid-cols-[1fr_1fr_auto] fade-up"
        >
          <Select value={city} onChange={(e) => setCity(e.target.value)} aria-label={t('search.city')}>
            <option value="">{t('search.anyCity')}</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} aria-label={t('search.category')}>
            <option value="">{t('search.all')}</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{t(`category.${c}`)}</option>)}
          </Select>
          <Button type="submit" variant="primary" size="lg">
            🔍 {t('search.search')}
          </Button>
        </form>

        <div className="mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            ['120+', t('stats.cars')],
            ['35+', t('stats.agencies')],
            ['5K+', t('stats.clients')],
            ['10', t('stats.cities')],
          ].map(([n, l]) => (
            <div key={l} className="text-white">
              <p className="text-3xl font-extrabold">{n}</p>
              <p className="text-sm text-white/70">{l}</p>
            </div>
          ))}
        </div>
      </div>
      <svg className="absolute bottom-0 w-full text-[#f6f8fb]" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path fill="currentColor" d="M0 80V40c240 30 480 40 720 20S1200 20 1440 40v40z" />
      </svg>
    </section>
  )
}

function Feature({ icon, title, desc }) {
  return (
    <Card className="border border-border/70 bg-background p-6 transition hover:shadow-lg">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-2xl">{icon}</div>
      <h3 className="font-bold text-ink-900">{title}</h3>
      <p className="mt-1.5 text-sm text-muted">{desc}</p>
    </Card>
  )
}

export default function Home() {
  const { t } = useTranslation()
  const [cars, setCars] = useState([])
  const [agencies, setAgencies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('cars').select('*').eq('available', true).limit(8).order('created_at', { ascending: false }),
      supabase.from('agencies').select('*').eq('status', 'approved').limit(3),
    ]).then(([c, a]) => {
      setCars(c.data || [])
      setAgencies(a.data || [])
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <Hero />

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionTitle center eyebrow={t('brand')} title={t('features.title')} subtitle={t('features.subtitle')} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Feature icon="🔎" title={t('features.f1Title')} desc={t('features.f1Desc')} />
          <Feature icon="⚡" title={t('features.f2Title')} desc={t('features.f2Desc')} />
          <Feature icon="⭐" title={t('features.f3Title')} desc={t('features.f3Desc')} />
          <Feature icon="🛠️" title={t('features.f4Title')} desc={t('features.f4Desc')} />
        </div>
      </section>

      {/* Featured cars */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <SectionTitle eyebrow="🚗" title={t('featuredCars')} />
            <Link to="/cars" className="mb-8 text-sm font-semibold text-brand-600 hover:underline">
              {t('viewAll')} →
            </Link>
          </div>
          {loading ? (
            <div className="grid place-items-center py-16"><Spinner color="accent" size="lg" /></div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {cars.map((c) => <CarCard key={c.id} car={c} />)}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionTitle center title={t('howItWorks.title')} />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className="relative rounded-2xl border border-border/70 bg-background p-6 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full brand-gradient text-xl font-extrabold text-white">
                {s}
              </div>
              <h3 className="font-bold text-ink-900">{t(`howItWorks.s${s}`)}</h3>
              <p className="mt-1.5 text-sm text-muted">{t(`howItWorks.s${s}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured agencies */}
      {agencies.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-end justify-between">
              <SectionTitle eyebrow="🏢" title={t('featuredAgencies')} />
              <Link to="/agencies" className="mb-8 text-sm font-semibold text-brand-600 hover:underline">
                {t('viewAll')} →
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {agencies.map((a) => (
                <Link key={a.id} to={`/agencies/${a.id}`}>
                  <Card className="flex items-center gap-4 border border-border/70 p-5 transition hover:shadow-lg">
                    <img
                      src={a.logo_url}
                      alt={a.name}
                      className="h-16 w-16 rounded-xl object-cover"
                      onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
                    />
                    <div>
                      <p className="font-bold text-ink-900">{a.name_fr || a.name}</p>
                      <p className="text-sm text-muted">📍 {a.city}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="overflow-hidden rounded-3xl brand-gradient px-8 py-14 text-center text-white">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{t('hero.title')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">{t('hero.subtitle')}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/cars"><Button variant="secondary" size="lg">{t('hero.searchCta')}</Button></Link>
            <Link to="/register"><Button variant="outline" size="lg" className="!text-white !border-white/40">{t('nav.register')}</Button></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
