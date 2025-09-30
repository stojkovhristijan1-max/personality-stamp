import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Create client with placeholder values if env vars are not set
// The app will work without Supabase using localStorage fallback
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== '' &&
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== ''
}
