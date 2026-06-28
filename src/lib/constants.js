export const CITIES = [
  'Tunis',
  'Sfax',
  'Sousse',
  'Nabeul',
  'Bizerte',
  'Gabès',
  'Monastir',
  'Djerba',
  'Tozeur',
  'Kairouan',
]

export const CATEGORIES = ['economy', 'compact', 'sedan', 'suv', 'luxury', 'van']
export const TRANSMISSIONS = ['manual', 'automatic']
export const FUELS = ['gasoline', 'diesel', 'electric', 'hybrid']

export const STATUS_COLORS = {
  pending: 'warning',
  confirmed: 'accent',
  active: 'success',
  completed: 'default',
  cancelled: 'danger',
  approved: 'success',
  suspended: 'danger',
}

export function formatMoney(n) {
  return new Intl.NumberFormat('fr-TN').format(Math.round(n || 0))
}

export function daysBetween(start, end) {
  if (!start || !end) return 0
  const s = new Date(start)
  const e = new Date(end)
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}
