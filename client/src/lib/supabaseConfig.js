export function validateSupabaseConfig(url, key) {
  if (!url || !key) return 'Supabase URL and publishable key are required.'
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash) {
      return 'Use the HTTPS project URL from Supabase.'
    }
  } catch {
    return 'The Supabase project URL is invalid.'
  }
  if (/your[-_]|placeholder/i.test(url + key)) return 'Replace the example Supabase configuration.'
  if (/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) return ''
  try {
    const parts = key.split('.')
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
      if (payload.role === 'anon') return ''
    }
  } catch { /* Reject malformed keys without printing them. */ }
  return 'Only a publishable key or legacy anon key may be used in the frontend.'
}
