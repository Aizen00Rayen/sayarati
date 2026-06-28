import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Spinner, Card, Button } from '@heroui/react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { formatMoney } from '../../lib/constants'
import { DashHeader, StatCard, StatusChip, EmptyState } from '../../components/dash'

export default function UserDashboard() {
  const { t } = useTranslation()
  const { user, profile } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*, cars(brand, model, image_url), agencies(name, name_fr)')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
    setBookings(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const cancel = async (id) => {
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
    load()
  }

  const spent = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((s, b) => s + Number(b.total_price), 0)

  if (loading) return <div className="grid min-h-[60vh] place-items-center"><Spinner color="accent" size="lg" /></div>

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <DashHeader
        title={`${t('dashboard.welcome')}, ${profile?.full_name || ''} 👋`}
        subtitle={t('dashboard.myBookings')}
        action={<Link to="/cars"><Button variant="primary">{t('hero.searchCta')}</Button></Link>}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon="🧾" label={t('dashboard.totalBookings')} value={bookings.length} />
        <StatCard icon="⏳" label={t('dashboard.pending')} value={bookings.filter((b) => b.status === 'pending').length} />
        <StatCard icon="💰" label={t('dashboard.totalRevenue')} value={`${formatMoney(spent)} ${t('common.currency')}`} />
      </div>

      <h2 className="mb-4 text-lg font-bold text-ink-900">{t('dashboard.myBookings')}</h2>
      {bookings.length === 0 ? (
        <EmptyState>{t('dashboard.noBookings')}</EmptyState>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id} className="flex flex-col gap-4 border border-border/70 p-4 sm:flex-row sm:items-center">
              <img
                src={b.cars?.image_url}
                alt=""
                className="h-20 w-28 rounded-xl object-cover bg-default-soft"
                onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
              />
              <div className="flex-1">
                <p className="font-bold text-ink-900">{b.cars?.brand} {b.cars?.model}</p>
                <p className="text-sm text-muted">{b.agencies?.name_fr || b.agencies?.name}</p>
                <p className="text-sm text-muted">📅 {b.start_date} → {b.end_date}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-end">
                  <p className="font-extrabold text-brand-600">{formatMoney(b.total_price)} {t('common.currency')}</p>
                  <StatusChip status={b.status} />
                </div>
                {b.status === 'pending' && (
                  <Button size="sm" variant="danger-soft" onPress={() => cancel(b.id)}>
                    {t('status.cancelled')}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
