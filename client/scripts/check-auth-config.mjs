import { validateSupabaseConfig } from '../src/lib/supabaseConfig.js'

const error = validateSupabaseConfig(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
if (error) {
  console.error(`Authentication deployment blocked: ${error}`)
  process.exit(1)
}
console.log('Browser-safe Supabase configuration is present.')
