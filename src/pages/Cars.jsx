import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Spinner, Button, Card } from '@heroui/react'
import { supabase } from '../lib/supabase'
import { CITIES, CATEGORIES, TRANSMISSIONS, FUELS, formatMoney } from '../lib/constants'
import { Select, Field, Input } from '../components/ui'
import CarCard from '../components/CarCard'
import { useCompare } from '../context/CompareContext'
import CompareBar from '../components/CompareBar'

export default function Cars() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const { items } = useCompare()

  const filters = {
    city: params.get('city') || '',
    category: params.get('category') || '',
    transmission: params.get('transmission') || '',
    fuel: params.get('fuel') || '',
    max: params.get('max') || '',
    sort: params.get('sort') || 'new',
  }

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  useEffect(() => {
    setLoading(true)
    supabase
      .from('cars')
      .select('*')
      .then(({ data }) => {
        setCars(data || [])
        setLoading(false)
      })
  }, [])

  const result = useMemo(() => {
    let list = cars.filter((c) => {
      if (filters.city && c.city !== filters.city) return false
      if (filters.category && c.category !== filters.category) return false
      if (filters.transmission && c.transmission !== filters.transmission) return false
      if (filters.fuel && c.fuel !== filters.fuel) return false
      if (filters.max && Number(c.price_per_day) > Number(filters.max)) return false
      return true
    })
    if (filters.sort === 'priceAsc') list = [...list].sort((a, b) => a.price_per_day - b.price_per_day)
    if (filters.sort === 'priceDesc') list = [...list].sort((a, b) => b.price_per_day - a.price_per_day)
    return list
  }, [cars, filters.city, filters.category, filters.transmission, filters.fuel, filters.max, filters.sort])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold text-ink-900">{t('cars.title')}</h1>
      <p className="mt-1 text-muted">{t('cars.subtitle')}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-20">
          <Card className="space-y-4 border border-border/70 p-5">
            <p className="font-bold text-ink-900">{t('cars.filters')}</p>
            <Field label={t('search.city')}>
              <Select value={filters.city} onChange={(e) => setFilter('city', e.target.value)}>
                <option value="">{t('search.anyCity')}</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label={t('search.category')}>
              <Select value={filters.category} onChange={(e) => setFilter('category', e.target.value)}>
                <option value="">{t('search.all')}</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{t(`category.${c}`)}</option>)}
              </Select>
            </Field>
            <Field label={t('cars.transmission')}>
              <Select value={filters.transmission} onChange={(e) => setFilter('transmission', e.target.value)}>
                <option value="">{t('search.all')}</option>
                {TRANSMISSIONS.map((c) => <option key={c} value={c}>{t(`transmission.${c}`)}</option>)}
              </Select>
            </Field>
            <Field label={t('cars.fuel')}>
              <Select value={filters.fuel} onChange={(e) => setFilter('fuel', e.target.value)}>
                <option value="">{t('search.all')}</option>
                {FUELS.map((c) => <option key={c} value={c}>{t(`fuel.${c}`)}</option>)}
              </Select>
            </Field>
            <Field label={`${t('cars.priceRange')} (${filters.max || '∞'} ${t('common.currency')})`}>
              <Input
                type="range" min="50" max="500" step="10"
                value={filters.max || 500}
                onChange={(e) => setFilter('max', e.target.value)}
              />
            </Field>
            <Button fullWidth variant="outline" size="sm" onPress={() => setParams({}, { replace: true })}>
              {t('dashboard.cancel')}
            </Button>
          </Card>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted">{result.length} {t('agencies.carsCount')}</p>
            <Select
              className="max-w-52"
              value={filters.sort}
              onChange={(e) => setFilter('sort', e.target.value)}
            >
              <option value="new">{t('cars.sortBy')}</option>
              <option value="priceAsc">{t('cars.sortPriceAsc')}</option>
              <option value="priceDesc">{t('cars.sortPriceDesc')}</option>
            </Select>
          </div>

          {loading ? (
            <div className="grid place-items-center py-24"><Spinner color="accent" size="lg" /></div>
          ) : result.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-border py-24 text-muted">
              {t('cars.noResults')}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {result.map((c) => <CarCard key={c.id} car={c} />)}
            </div>
          )}
        </div>
      </div>

      {items.length > 0 && <CompareBar />}
    </div>
  )
}
