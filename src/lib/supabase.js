import { createClient } from '@supabase/supabase-js'

// Publishable (anon) credentials are safe to expose in the client.
// The dossier_submissions table has insert-only RLS for the anon role —
// rows can be written but never read back from here.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = supabaseEnabled
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false }
    })
  : null
