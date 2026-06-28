import { cn } from '@heroui/react'

// Reusable form field atoms styled with HeroUI design tokens.
// Using native elements keeps controlled forms predictable.

const baseField =
  'w-full rounded-xl border bg-field text-field-foreground border-field-border ' +
  'px-3.5 py-2.5 text-sm outline-none transition ' +
  'placeholder:text-field-placeholder ' +
  'hover:border-field-border-hover focus:border-field-border-focus ' +
  'focus:ring-4 focus:ring-brand-500/15 disabled:opacity-60'

export function Field({ label, hint, error, className, children, required }) {
  return (
    <label className={cn('block space-y-1.5', className)}>
      {label && (
        <span className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-danger"> *</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="block text-xs text-muted">{hint}</span>}
      {error && <span className="block text-xs text-danger">{error}</span>}
    </label>
  )
}

export function Input({ className, ...props }) {
  return <input className={cn(baseField, className)} {...props} />
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn(baseField, 'min-h-24 resize-y', className)} {...props} />
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cn(baseField, 'appearance-none cursor-pointer pe-9', className)} {...props}>
      {children}
    </select>
  )
}

export function SectionTitle({ eyebrow, title, subtitle, center }) {
  return (
    <div className={cn('mb-8', center && 'text-center')}>
      {eyebrow && (
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
    </div>
  )
}

export function Stars({ value = 0, size = 16 }) {
  const full = Math.round(value)
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={i <= full ? 'text-gold-500' : 'text-default-300'}
          fill="currentColor"
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </span>
  )
}
