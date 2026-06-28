import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Avatar } from '@heroui/react'
import { useAuth } from '../context/AuthContext'
import { useCompare } from '../context/CompareContext'
import Logo from './Logo'

function LangToggle() {
  const { i18n } = useTranslation()
  const next = i18n.language === 'ar' ? 'fr' : 'ar'
  return (
    <button
      onClick={() => i18n.changeLanguage(next)}
      className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-foreground transition hover:bg-default-soft"
    >
      {i18n.language === 'ar' ? 'FR' : 'ع'}
    </button>
  )
}

export default function Navbar() {
  const { t } = useTranslation()
  const { user, profile, role, signOut } = useAuth()
  const { items } = useCompare()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/cars', label: t('nav.cars') },
    { to: '/agencies', label: t('nav.agencies') },
  ]

  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-semibold transition rounded-lg ${
      isActive ? 'text-brand-700 bg-brand-50' : 'text-foreground hover:text-brand-600'
    }`

  const dashPath =
    role === 'admin' ? '/admin' : role === 'agency' ? '/agency' : '/account'

  const handleLogout = async () => {
    await signOut()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <Link
              to="/cars"
              className="hidden rounded-lg bg-gold-500/15 px-3 py-1.5 text-sm font-semibold text-gold-500 sm:inline-block"
            >
              {t('nav.compare')} ({items.length})
            </Link>
          )}
          <LangToggle />

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-border py-1 pe-3 ps-1 transition hover:bg-default-soft"
              >
                <Avatar size="sm">
                  <Avatar.Fallback color="accent">
                    {(profile?.full_name || user.email || '?').charAt(0).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar>
                <span className="hidden max-w-28 truncate text-sm font-semibold sm:inline">
                  {profile?.full_name || user.email}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute end-0 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
                  <div className="border-b border-border px-4 py-3">
                    <p className="truncate text-sm font-bold">{profile?.full_name}</p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-700">
                      {role}
                    </span>
                  </div>
                  <Link
                    to={dashPath}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium hover:bg-default-soft"
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2.5 text-start text-sm font-medium text-danger hover:bg-danger-soft"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" size="sm" onPress={() => navigate('/login')}>
                {t('nav.login')}
              </Button>
              <Button variant="primary" size="sm" onPress={() => navigate('/register')}>
                {t('nav.register')}
              </Button>
            </div>
          )}

          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border md:hidden"
            aria-label="menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {l.label}
              </NavLink>
            ))}
            {!user && (
              <div className="mt-2 flex gap-2">
                <Button fullWidth variant="outline" size="sm" onPress={() => { setOpen(false); navigate('/login') }}>
                  {t('nav.login')}
                </Button>
                <Button fullWidth variant="primary" size="sm" onPress={() => { setOpen(false); navigate('/register') }}>
                  {t('nav.register')}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
