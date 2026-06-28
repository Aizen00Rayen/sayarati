import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Card } from '@heroui/react'
import { useAuth } from '../context/AuthContext'
import { Field, Input } from '../components/ui'
import Logo from '../components/Logo'

export default function Register() {
  const { t } = useTranslation()
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '', role: 'customer',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signUp(form.email, form.password, {
      full_name: form.full_name,
      phone: form.phone,
      role: form.role,
    })
    setLoading(false)
    if (err) return setError(err.message)
    const dest = form.role === 'agency' ? '/agency' : '/account'
    navigate(dest, { replace: true })
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] place-items-center brand-gradient-soft px-4 py-12">
      <Card className="w-full max-w-md border border-border/70 p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size={44} />
          <h1 className="mt-4 text-2xl font-extrabold text-ink-900">{t('auth.registerTitle')}</h1>
          <p className="text-sm text-muted">{t('auth.registerSubtitle')}</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label={t('auth.accountType')} required>
            <div className="grid grid-cols-2 gap-2">
              {['customer', 'agency'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: r }))}
                  className={`rounded-xl border-2 p-3 text-sm font-semibold transition ${
                    form.role === r
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-border text-muted hover:border-brand-300'
                  }`}
                >
                  {r === 'customer' ? '👤 ' + t('auth.customer') : '🏢 ' + t('auth.agency')}
                </button>
              ))}
            </div>
          </Field>
          <Field label={t('auth.fullName')} required>
            <Input required value={form.full_name} onChange={set('full_name')} />
          </Field>
          <Field label={t('auth.email')} required>
            <Input type="email" required value={form.email} onChange={set('email')} />
          </Field>
          <Field label={t('auth.phone')}>
            <Input value={form.phone} onChange={set('phone')} placeholder="+216 ..." />
          </Field>
          <Field label={t('auth.password')} required hint="min. 6">
            <Input type="password" required minLength={6} value={form.password} onChange={set('password')} />
          </Field>
          {error && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger-soft-foreground">{error}</p>}
          <Button type="submit" fullWidth variant="primary" size="lg" isDisabled={loading}>
            {loading ? t('common.loading') : t('auth.registerBtn')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">{t('auth.signIn')}</Link>
        </p>
      </Card>
    </div>
  )
}
