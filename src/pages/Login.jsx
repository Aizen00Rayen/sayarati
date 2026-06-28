import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Card } from '@heroui/react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Field, Input } from '../components/ui'
import Logo from '../components/Logo'

const DEMOS = [
  ['Admin', 'admin@sayarati.tn', 'Admin@123'],
  ['Agency', 'agency@sayarati.tn', 'Agency@123'],
  ['Client', 'client@sayarati.tn', 'Client@123'],
]

export default function Login() {
  const { t } = useTranslation()
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectByRole = async () => {
    const { data } = await supabase.auth.getUser()
    const { data: prof } = await supabase
      .from('profiles').select('role').eq('id', data.user.id).maybeSingle()
    const role = prof?.role
    const dest = location.state?.from
      || (role === 'admin' ? '/admin' : role === 'agency' ? '/agency' : '/account')
    navigate(dest, { replace: true })
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signIn(email, password)
    setLoading(false)
    if (err) setError(err.message)
    else await redirectByRole()
  }

  const fillDemo = (em, pw) => { setEmail(em); setPassword(pw) }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] place-items-center brand-gradient-soft px-4 py-12">
      <Card className="w-full max-w-md border border-border/70 p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size={44} />
          <h1 className="mt-4 text-2xl font-extrabold text-ink-900">{t('auth.loginTitle')}</h1>
          <p className="text-sm text-muted">{t('auth.loginSubtitle')}</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label={t('auth.email')} required>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          </Field>
          <Field label={t('auth.password')} required>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </Field>
          {error && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger-soft-foreground">{error}</p>}
          <Button type="submit" fullWidth variant="primary" size="lg" isDisabled={loading}>
            {loading ? t('common.loading') : t('auth.loginBtn')}
          </Button>
        </form>

        <div className="mt-6 rounded-xl border border-dashed border-border p-3">
          <p className="mb-2 text-center text-xs font-semibold text-muted">{t('common.tryDemo')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {DEMOS.map(([label, em, pw]) => (
              <button
                key={em}
                type="button"
                onClick={() => fillDemo(em, pw)}
                className="rounded-lg bg-default-soft px-3 py-1.5 text-xs font-semibold hover:bg-brand-100"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">{t('auth.signUp')}</Link>
        </p>
      </Card>
    </div>
  )
}
