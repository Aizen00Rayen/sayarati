import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Spinner, Card, Button, Chip } from '@heroui/react'
import { supabase } from '../../lib/supabase'
import { formatMoney } from '../../lib/constants'
import { Select } from '../../components/ui'
import { DashHeader, StatCard, StatusChip, Tabs, EmptyState } from '../../components/dash'

export default function AdminDashboard() {
  const { t, i18n } = useTranslation()
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ profiles: [], agencies: [], cars: [], bookings: [] })

  const load = async () => {
    setLoading(true)
    const [p, a, c, b] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('agencies').select('*, profiles(full_name)').order('created_at', { ascending: false }),
      supabase.from('cars').select('*, agencies(name)').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*, cars(brand, model), profiles(full_name)').order('created_at', { ascending: false }),
    ])
    setData({ profiles: p.data || [], agencies: a.data || [], cars: c.data || [], bookings: b.data || [] })
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const setAgencyStatus = async (id, status) => {
    await supabase.from('agencies').update({ status }).eq('id', id)
    load()
  }
  const setRole = async (id, role) => {
    await supabase.from('profiles').update({ role }).eq('id', id)
    load()
  }
  const deleteCar = async (id) => { await supabase.from('cars').delete().eq('id', id); load() }
  const deleteBooking = async (id) => { await supabase.from('bookings').delete().eq('id', id); load() }

  if (loading) return <div className="grid min-h-[60vh] place-items-center"><Spinner color="accent" size="lg" /></div>

  const revenue = data.bookings.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + Number(b.total_price), 0)
  const tabs = [
    { key: 'overview', label: t('dashboard.overview') },
    { key: 'agencies', label: t('dashboard.agencies') },
    { key: 'users', label: t('dashboard.users') },
    { key: 'cars', label: t('dashboard.allCars') },
    { key: 'bookings', label: t('dashboard.allBookings') },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <DashHeader title={`${t('nav.dashboard')} · Admin`} subtitle="SAYARATI" />
      <div className="mb-6"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      {tab === 'overview' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard icon="👥" label={t('dashboard.totalUsers')} value={data.profiles.length} />
          <StatCard icon="🏢" label={t('dashboard.agencies')} value={data.agencies.length} />
          <StatCard icon="🚗" label={t('dashboard.totalCars')} value={data.cars.length} />
          <StatCard icon="🧾" label={t('dashboard.totalBookings')} value={data.bookings.length} />
          <StatCard icon="💰" label={t('dashboard.totalRevenue')} value={`${formatMoney(revenue)} ${t('common.currency')}`} />
        </div>
      )}

      {tab === 'agencies' && (
        data.agencies.length === 0 ? <EmptyState>—</EmptyState> : (
          <div className="space-y-3">
            {data.agencies.map((a) => (
              <Card key={a.id} className="flex flex-col gap-3 border border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <img src={a.logo_url} alt="" className="h-12 w-12 rounded-xl object-cover bg-default-soft" onError={(e)=>{e.currentTarget.style.visibility='hidden'}} />
                  <div>
                    <p className="font-bold text-ink-900">{i18n.language === 'ar' ? a.name : a.name_fr || a.name}</p>
                    <p className="text-sm text-muted">📍 {a.city} · {a.profiles?.full_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusChip status={a.status} />
                  {a.status !== 'approved' && <Button size="sm" variant="primary" onPress={() => setAgencyStatus(a.id, 'approved')}>{t('dashboard.approve')}</Button>}
                  {a.status !== 'suspended' && <Button size="sm" variant="danger-soft" onPress={() => setAgencyStatus(a.id, 'suspended')}>{t('dashboard.suspend')}</Button>}
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {tab === 'users' && (
        <Card className="overflow-x-auto border border-border/70">
          <table className="w-full text-start text-sm">
            <thead className="bg-default-soft text-muted">
              <tr>
                <th className="p-3 text-start">{t('dashboard.name')}</th>
                <th className="p-3 text-start">{t('auth.phone')}</th>
                <th className="p-3 text-start">{t('dashboard.role')}</th>
              </tr>
            </thead>
            <tbody>
              {data.profiles.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3 font-semibold text-ink-900">{p.full_name}</td>
                  <td className="p-3 text-muted">{p.phone || '—'}</td>
                  <td className="p-3">
                    <Select className="max-w-40" value={p.role} onChange={(e) => setRole(p.id, e.target.value)}>
                      <option value="customer">customer</option>
                      <option value="agency">agency</option>
                      <option value="admin">admin</option>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'cars' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.cars.map((c) => (
            <Card key={c.id} className="overflow-hidden border border-border/70">
              <img src={c.image_url} alt="" className="aspect-video w-full object-cover bg-default-soft" onError={(e)=>{e.currentTarget.style.visibility='hidden'}} />
              <Card.Content className="p-4">
                <p className="font-bold text-ink-900">{c.brand} {c.model}</p>
                <p className="text-sm text-muted">{c.agencies?.name} · {formatMoney(c.price_per_day)} {t('common.currency')}</p>
                <Button size="sm" variant="danger-soft" className="mt-3" onPress={() => deleteCar(c.id)}>{t('dashboard.deleteCar')}</Button>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      {tab === 'bookings' && (
        data.bookings.length === 0 ? <EmptyState>—</EmptyState> : (
          <div className="space-y-3">
            {data.bookings.map((b) => (
              <Card key={b.id} className="flex flex-col gap-3 border border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-ink-900">{b.cars?.brand} {b.cars?.model}</p>
                  <p className="text-sm text-muted">👤 {b.profiles?.full_name} · 📅 {b.start_date} → {b.end_date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-brand-600">{formatMoney(b.total_price)} {t('common.currency')}</span>
                  <StatusChip status={b.status} />
                  <Button size="sm" variant="danger-soft" onPress={() => deleteBooking(b.id)}>✕</Button>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  )
}
