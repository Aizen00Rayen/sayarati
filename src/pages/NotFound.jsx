import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@heroui/react'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <p className="text-7xl font-extrabold text-brand-500">404</p>
        <p className="mt-3 text-muted">{t('common.error')}</p>
        <Link to="/" className="mt-6 inline-block">
          <Button variant="primary">{t('nav.home')}</Button>
        </Link>
      </div>
    </div>
  )
}
