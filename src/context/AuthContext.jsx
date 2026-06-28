import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null)
      return
    }
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    setProfile(data || null)
  }, [])

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return
      setSession(data.session)
      await loadProfile(data.session?.user?.id)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      await loadProfile(newSession?.user?.id)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [loadProfile])

  const signIn = async (email, password) => {
    return supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email, password, meta) => {
    return supabase.auth.signUp({
      email,
      password,
      options: { data: meta },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  const refreshProfile = () => loadProfile(session?.user?.id)

  const value = {
    session,
    user: session?.user || null,
    profile,
    role: profile?.role || null,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
