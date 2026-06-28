import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, Chip, Button } from '@heroui/react'
import { useCompare } from '../context/CompareContext'
import { formatMoney } from '../lib/constants'

const FALLBACK =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=70'

export default function CarCard({ car }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toggle, has } = useCompare()
  const inCompare = has(car.id)

  return (
    <Card className="group overflow-hidden border border-border/70 bg-background transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-default-soft">
        <img
          src={car.image_url || FALLBACK}
          alt={`${car.brand} ${car.model}`}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = FALLBACK }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute start-3 top-3 flex gap-2">
          <Chip size="sm" color="accent" variant="solid">
            <Chip.Label>{t(`category.${car.category}`)}</Chip.Label>
          </Chip>
          {!car.available && (
            <Chip size="sm" color="danger" variant="solid">
              <Chip.Label>{t('cars.unavailable')}</Chip.Label>
            </Chip>
          )}
        </div>
        <button
          onClick={() => toggle(car)}
          className={`absolute end-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition ${
            inCompare ? 'bg-gold-500 text-white' : 'bg-white/85 text-ink-900 hover:bg-white'
          }`}
          title={inCompare ? t('cars.removeCompare') : t('cars.addCompare')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h13M3 12h9M3 18h13" strokeLinecap="round" />
            <path d="M18 9l3-3-3-3M21 6h-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <Card.Content className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link to={`/cars/${car.id}`} className="font-bold text-ink-900 hover:text-brand-600">
              {car.brand} {car.model}
            </Link>
            <p className="text-xs text-muted">{car.year} · {car.city}</p>
          </div>
          <div className="text-end">
            <p className="text-lg font-extrabold text-brand-600">
              {formatMoney(car.price_per_day)}
            </p>
            <p className="text-[11px] text-muted">{t('common.currency')} {t('cars.perDay')}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 text-[11px] text-muted">
          <span className="rounded-md bg-default-soft px-2 py-1">{car.seats} {t('cars.seats')}</span>
          <span className="rounded-md bg-default-soft px-2 py-1">{t(`transmission.${car.transmission}`)}</span>
          <span className="rounded-md bg-default-soft px-2 py-1">{t(`fuel.${car.fuel}`)}</span>
        </div>

        <div className="flex gap-2 pt-1">
          <Button fullWidth variant="primary" size="sm" onPress={() => navigate(`/cars/${car.id}`)}>
            {t('cars.book')}
          </Button>
          <Button variant="outline" size="sm" onPress={() => navigate(`/cars/${car.id}`)}>
            {t('cars.details')}
          </Button>
        </div>
      </Card.Content>
    </Card>
  )
}
