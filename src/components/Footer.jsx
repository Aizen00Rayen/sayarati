import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from './Logo'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="mt-20 brand-gradient text-white/90">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            {t('footer.about')}
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-brand-200">
            {t('footer.quickLinks')}
          </h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link to="/cars" className="hover:text-white">{t('nav.cars')}</Link></li>
            <li><Link to="/agencies" className="hover:text-white">{t('nav.agencies')}</Link></li>
            <li><Link to="/register" className="hover:text-white">{t('nav.register')}</Link></li>
            <li><Link to="/login" className="hover:text-white">{t('nav.login')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-brand-200">
            {t('footer.contact')}
          </h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li>contact@sayarati.dz</li>
            <li>+213 43 000 000</li>
            <li>Tlemcen, Algérie</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/60 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} SAYARATI — {t('footer.rights')}</span>
          <span>{t('footer.madeWith')} 🇹🇳</span>
        </div>
      </div>
    </footer>
  )
}
