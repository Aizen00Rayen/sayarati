import { useTranslation } from 'react-i18next'
import { Card, Chip } from '@heroui/react'
import { STATUS_COLORS } from '../lib/constants'

export function StatCard({ icon, label, value }) {
  return (
    <Card className="border border-border/70 p-5">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-xl">{icon}</div>
        <div>
          <p className="text-2xl font-extrabold text-ink-900">{value}</p>
          <p className="text-sm text-muted">{label}</p>
        </div>
      </div>
    </Card>
  )
}

export function StatusChip({ status }) {
  const { t } = useTranslation()
  return (
    <Chip size="sm" color={STATUS_COLORS[status] || 'default'} variant="soft">
      <Chip.Label>{t(`status.${status}`)}</Chip.Label>
    </Chip>
  )
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl bg-default-soft p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            active === tab.key ? 'bg-background text-brand-700 shadow' : 'text-muted hover:text-foreground'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function DashHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function EmptyState({ children }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border py-16 text-center text-muted">
      {children}
    </div>
  )
}
