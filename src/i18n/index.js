import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './ar.json'
import fr from './fr.json'

const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null
const initialLang = saved || 'ar'

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    fr: { translation: fr },
  },
  lng: initialLang,
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
})

function applyDir(lng) {
  const dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', lng)
}

applyDir(initialLang)

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng)
  applyDir(lng)
})

export default i18n
