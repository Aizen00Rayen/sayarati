export const CITIES = [
  'Alger',
  'Oran',
  'Constantine',
  'Annaba',
  'Blida',
  'Tlemcen',
  'Sétif',
  'Batna',
  'Béjaïa',
  'Tizi Ouzou',
  'Biskra',
  'Ouargla',
  'Mostaganem',
  'Médéa',
  'Chlef',
  'Skikda',
  'Djelfa',
  'Tamanrasset',
  'Jijel',
  'Ghardaïa',
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
  return new Intl.NumberFormat('fr-DZ').format(Math.round(n || 0))
}

export function daysBetween(start, end) {
  if (!start || !end) return 0
  const s = new Date(start)
  const e = new Date(end)
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}
