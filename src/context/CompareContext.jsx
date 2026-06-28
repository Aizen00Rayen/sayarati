import { createContext, useContext, useState, useCallback } from 'react'

const CompareContext = createContext(null)

export function CompareProvider({ children }) {
  const [items, setItems] = useState([])

  const toggle = useCallback((car) => {
    setItems((prev) => {
      const exists = prev.find((c) => c.id === car.id)
      if (exists) return prev.filter((c) => c.id !== car.id)
      if (prev.length >= 3) return prev
      return [...prev, car]
    })
  }, [])

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const has = useCallback((id) => items.some((c) => c.id === id), [items])

  return (
    <CompareContext.Provider value={{ items, toggle, remove, clear, has }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
