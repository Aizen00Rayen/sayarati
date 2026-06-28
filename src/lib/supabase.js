import { createClient } from '@supabase/supabase-js'

// Falls back to the prototype project credentials when env vars are not set.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://gyfgdcebmaehonxcabmy.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_v-WTWCbkQHByquJaVS96lg_iVBtp3MD'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
