import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@heroui/react'
import { useCompare } from '../context/CompareContext'
import { formatMoney } from '../lib/constants'

export default function CompareBar() {
  const { t } = useTranslation()
  const { items, remove, clear } = useCompare()
  const [open, setOpen] = useState(false)

  const rows = [
    ['form.pricePerDay', (c) => `${formatMoney(c.price_per_day)} ${t('common.currency')}`],
    ['carDetail.year', (c) => c.year],
    ['search.category', (c) => t(`category.${c.category}`)],
    ['cars.transmission', (c) => t(`transmission.${c.transmission}`)],
    ['cars.fuel', (c) => t(`fuel.${c.fuel}`)],
    ['form.seats', (c) => c.seats],
    ['search.city', (c) => c.city],
  ]

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 shadow-2xl backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex flex-1 items-center gap-2 overflow-x-auto">
            {items.map((c) => (
              <div key={c.id} className="flex shrink-0 items-center gap-2 rounded-lg bg-default-soft px-3 py-1.5 text-sm">
                <span className="font-semibold">{c.brand} {c.model}</span>
                <button onClick={() => remove(c.id)} className="text-danger">✕</button>
              </div>
            ))}
          </div>
          <Button size="sm" variant="primary" onPress={() => setOpen(true)} isDisabled={items.length < 2}>
            {t('nav.compare')} ({items.length})
          </Button>
          <Button size="sm" variant="ghost" onPress={clear}>✕</Button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-auto rounded-2xl bg-background p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-ink-900">{t('nav.compare')}</h3>
              <button onClick={() => setOpen(false)} className="text-2xl text-muted">✕</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="p-2"></th>
                    {items.map((c) => (
                      <th key={c.id} className="p-2 text-center">
                        <img src={c.image_url} alt="" className="mx-auto mb-2 h-20 w-32 rounded-lg object-cover" />
                        <span className="font-bold">{c.brand} {c.model}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([key, fn]) => (
                    <tr key={key} className="border-t border-border">
                      <td className="p-2 font-semibold text-muted">{t(key)}</td>
                      {items.map((c) => (
                        <td key={c.id} className="p-2 text-center">{fn(c)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
