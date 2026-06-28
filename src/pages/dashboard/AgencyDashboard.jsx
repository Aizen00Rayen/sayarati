import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Spinner, Card, Button, Chip } from '@heroui/react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { CITIES, CATEGORIES, TRANSMISSIONS, FUELS, formatMoney } from '../../lib/constants'
import { Field, Input, Textarea, Select } from '../../components/ui'
import { DashHeader, StatCard, StatusChip, Tabs, EmptyState } from '../../components/dash'

const EMPTY_CAR = {
  brand: '', model: '', year: 2023, category: 'economy', transmission: 'manual',
  fuel: 'gasoline', seats: 5, price_per_day: 100, city: 'Tunis', image_url: '',
  description: '', available: true,
}

function CarForm({ initial, onClose, onSaved, agencyId }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [k]: v }))
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = {
      ...form,
      agency_id: agencyId,
      year: Number(form.year),
      seats: Number(form.seats),
      price_per_day: Number(form.price_per_day),
    }
    let res
    if (form.id) res = await supabase.from('cars').update(payload).eq('id', form.id)
    else res = await supabase.from('cars').insert(payload)
    setSaving(false)
    if (res.error) setError(res.error.message)
    else { onSaved(); onClose() }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-auto" onClick={onClose}>
      <Card className="w-full max-w-2xl border border-border/70 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-ink-900">{form.id ? t('dashboard.editCar') : t('dashboard.addCar')}</h3>
          <button onClick={onClose} className="text-2xl text-muted">✕</button>
        </div>
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <Field label={t('form.brand')} required><Input required value={form.brand} onChange={set('brand')} /></Field>
          <Field label={t('form.model')} required><Input required value={form.model} onChange={set('model')} /></Field>
          <Field label={t('form.year')}><Input type="number" value={form.year} onChange={set('year')} /></Field>
          <Field label={t('form.pricePerDay')} required><Input type="number" required value={form.price_per_day} onChange={set('price_per_day')} /></Field>
          <Field label={t('form.category')}>
            <Select value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{t(`category.${c}`)}</option>)}
            </Select>
          </Field>
          <Field label={t('form.city')}>
            <Select value={form.city} onChange={set('city')}>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label={t('form.transmission')}>
            <Select value={form.transmission} onChange={set('transmission')}>
              {TRANSMISSIONS.map((c) => <option key={c} value={c}>{t(`transmission.${c}`)}</option>)}
            </Select>
          </Field>
          <Field label={t('form.fuel')}>
            <Select value={form.fuel} onChange={set('fuel')}>
              {FUELS.map((c) => <option key={c} value={c}>{t(`fuel.${c}`)}</option>)}
            </Select>
          </Field>
          <Field label={t('form.seats')}><Input type="number" value={form.seats} onChange={set('seats')} /></Field>
          <Field label={t('form.imageUrl')}><Input value={form.image_url} onChange={set('image_url')} placeholder="https://..." /></Field>
          <Field label={t('form.description')} className="sm:col-span-2">
            <Textarea value={form.description} onChange={set('description')} />
          </Field>
          <label className="flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" checked={form.available} onChange={set('available')} className="h-4 w-4 accent-[#0d9472]" />
            <span className="text-sm font-medium">{t('form.available')}</span>
          </label>
          {error && <p className="text-sm text-danger sm:col-span-2">{error}</p>}
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button variant="outline" onPress={onClose}>{t('dashboard.cancel')}</Button>
            <Button type="submit" variant="primary" isDisabled={saving}>{t('dashboard.save')}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

function CreateAgency({ onCreated }) {
  const { t } = useTranslation()
  const { user, refreshProfile } = useAuth()
  const [form, setForm] = useState({ name: '', name_fr: '', city: 'Tunis', phone: '', logo_url: '', description: '', description_fr: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    const { error: err } = await supabase.from('agencies').insert({ ...form, owner_id: user.id })
    setSaving(false)
    if (err) setError(err.message)
    else { await refreshProfile(); onCreated() }
  }

  return (
    <Card className="mx-auto max-w-2xl border border-border/70 p-8">
      <h2 className="text-xl font-extrabold text-ink-900">{t('dashboard.createAgencyTitle')}</h2>
      <p className="mb-6 text-muted">{t('dashboard.createAgencyDesc')}</p>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label={`${t('auth.agencyName')} (ع)`} required><Input required value={form.name} onChange={set('name')} /></Field>
        <Field label={`${t('auth.agencyName')} (FR)`}><Input value={form.name_fr} onChange={set('name_fr')} /></Field>
        <Field label={t('form.city')}>
          <Select value={form.city} onChange={set('city')}>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
        <Field label={t('auth.phone')}><Input value={form.phone} onChange={set('phone')} /></Field>
        <Field label={t('form.logoUrl')} className="sm:col-span-2"><Input value={form.logo_url} onChange={set('logo_url')} placeholder="https://..." /></Field>
        <Field label={`${t('form.description')} (ع)`} className="sm:col-span-2"><Textarea value={form.description} onChange={set('description')} /></Field>
        <Field label={`${t('form.description')} (FR)`} className="sm:col-span-2"><Textarea value={form.description_fr} onChange={set('description_fr')} /></Field>
        {error && <p className="text-sm text-danger sm:col-span-2">{error}</p>}
        <Button type="submit" variant="primary" size="lg" className="sm:col-span-2" isDisabled={saving}>{t('dashboard.save')}</Button>
      </form>
    </Card>
  )
}

export default function AgencyDashboard() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const [agency, setAgency] = useState(null)
  const [cars, setCars] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')
  const [editing, setEditing] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data: ag } = await supabase.from('agencies').select('*').eq('owner_id', user.id).maybeSingle()
    setAgency(ag)
    if (ag) {
      const [{ data: c }, { data: b }] = await Promise.all([
        supabase.from('cars').select('*').eq('agency_id', ag.id).order('created_at', { ascending: false }),
        supabase.from('bookings').select('*, cars(brand, model), profiles(full_name, phone)').eq('agency_id', ag.id).order('created_at', { ascending: false }),
      ])
      setCars(c || [])
      setBookings(b || [])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const deleteCar = async (id) => {
    await supabase.from('cars').delete().eq('id', id)
    load()
  }
  const setBookingStatus = async (id, status) => {
    await supabase.from('bookings').update({ status }).eq('id', id)
    load()
  }

  if (loading) return <div className="grid min-h-[60vh] place-items-center"><Spinner color="accent" size="lg" /></div>
  if (!agency) return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6"><CreateAgency onCreated={load} /></div>

  const revenue = bookings.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + Number(b.total_price), 0)
  const tabs = [
    { key: 'overview', label: t('dashboard.overview') },
    { key: 'cars', label: t('dashboard.manageCars') },
    { key: 'bookings', label: t('dashboard.manageBookings') },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <DashHeader
        title={i18n.language === 'ar' ? agency.name : agency.name_fr || agency.name}
        subtitle={t('dashboard.myAgency')}
        action={<StatusChip status={agency.status} />}
      />

      {agency.status === 'pending' && (
        <div className="mb-6 rounded-xl bg-warning-soft px-4 py-3 text-sm text-warning-soft-foreground">
          ⏳ {t('dashboard.agencyPending')}
        </div>
      )}

      <div className="mb-6"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      {tab === 'overview' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon="🚗" label={t('dashboard.totalCars')} value={cars.length} />
          <StatCard icon="🧾" label={t('dashboard.totalBookings')} value={bookings.length} />
          <StatCard icon="⏳" label={t('dashboard.pending')} value={bookings.filter((b) => b.status === 'pending').length} />
          <StatCard icon="💰" label={t('dashboard.totalRevenue')} value={`${formatMoney(revenue)} ${t('common.currency')}`} />
        </div>
      )}

      {tab === 'cars' && (
        <div>
          <div className="mb-4 flex justify-end">
            <Button variant="primary" onPress={() => setEditing(EMPTY_CAR)}>+ {t('dashboard.addCar')}</Button>
          </div>
          {cars.length === 0 ? (
            <EmptyState>{t('dashboard.noCars')}</EmptyState>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cars.map((c) => (
                <Card key={c.id} className="overflow-hidden border border-border/70">
                  <img src={c.image_url} alt="" className="aspect-video w-full object-cover bg-default-soft" onError={(e)=>{e.currentTarget.style.visibility='hidden'}} />
                  <Card.Content className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-ink-900">{c.brand} {c.model}</p>
                        <p className="text-sm text-muted">{formatMoney(c.price_per_day)} {t('common.currency')} {t('cars.perDay')}</p>
                      </div>
                      <Chip size="sm" color={c.available ? 'success' : 'danger'} variant="soft">
                        <Chip.Label>{c.available ? t('cars.available') : t('cars.unavailable')}</Chip.Label>
                      </Chip>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button fullWidth size="sm" variant="outline" onPress={() => setEditing(c)}>{t('dashboard.editCar')}</Button>
                      <Button size="sm" variant="danger-soft" onPress={() => deleteCar(c.id)}>{t('dashboard.deleteCar')}</Button>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'bookings' && (
        bookings.length === 0 ? (
          <EmptyState>{t('dashboard.noBookings')}</EmptyState>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <Card key={b.id} className="flex flex-col gap-3 border border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-ink-900">{b.cars?.brand} {b.cars?.model}</p>
                  <p className="text-sm text-muted">👤 {b.profiles?.full_name} · {b.profiles?.phone}</p>
                  <p className="text-sm text-muted">📅 {b.start_date} → {b.end_date} · {formatMoney(b.total_price)} {t('common.currency')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusChip status={b.status} />
                  {b.status === 'pending' && (
                    <>
                      <Button size="sm" variant="primary" onPress={() => setBookingStatus(b.id, 'confirmed')}>{t('dashboard.approve')}</Button>
                      <Button size="sm" variant="danger-soft" onPress={() => setBookingStatus(b.id, 'cancelled')}>✕</Button>
                    </>
                  )}
                  {b.status === 'confirmed' && (
                    <Button size="sm" variant="outline" onPress={() => setBookingStatus(b.id, 'completed')}>{t('status.completed')}</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {editing && (
        <CarForm
          initial={editing}
          agencyId={agency.id}
          onClose={() => setEditing(null)}
          onSaved={load}
        />
      )}
    </div>
  )
}
