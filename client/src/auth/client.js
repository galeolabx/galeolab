import { emailRedirect, restoreAuth, validateAuthConfig } from './auth-flow'

const projectUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const publishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim()

export const authConfigured = validateAuthConfig(projectUrl, publishableKey)
export const authRedirect = intent => emailRedirect(window.location.origin, intent)

const SDK_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.102.0/+esm'

let initialization

export function initializeAuth() {
  // One initialization/code exchange, including under React StrictMode.
  if (!initialization) {
    initialization = (async () => {
      if (!authConfigured) return { client: null, session: null, callbackError: false }

      // Version-pinned browser distribution; no passwords are handled by
      // GaleoLab's static hosting. The SDK owns tokens and session refresh.
      const { createClient } = await import(
        /* @vite-ignore */
        SDK_URL
      )
      const client = createClient(projectUrl, publishableKey, {
        auth: {
          flowType: 'pkce',
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      })
      const restored = await restoreAuth(
        client.auth,
        window.location.href,
        next => window.history.replaceState(null, '', next),
      )
      return { client, ...restored }
    })()
  }
  return initialization
}

export function authErrorMessage(error, fallback) {
  const messages = {
    invalid_credentials: 'The email or password is incorrect.',
    email_not_confirmed: 'Please confirm your email address before signing in.',
    weak_password: 'Choose a stronger password with at least 12 characters.',
    same_password: 'Choose a password different from your current password.',
    over_email_send_rate_limit: 'Please wait a minute before requesting another email.',
    over_request_rate_limit: 'Too many attempts. Please wait and try again.',
    signup_disabled: 'New registrations are currently unavailable.',
    session_not_found: 'Your session has expired. Please sign in again.',
    reauthentication_needed: 'Please sign in again before changing your password.',
  }
  return messages[error?.code] || fallback
}
