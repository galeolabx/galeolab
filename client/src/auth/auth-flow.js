// Pure callback handling shared by the browser and the auth-flow tests.
export function validateAuthConfig(projectUrl, publishableKey) {
  try {
    const url = new URL(projectUrl)
    return url.protocol === 'https:' &&
      !url.username && !url.password &&
      (url.pathname === '/' || url.pathname === '') &&
      !url.search && !url.hash &&
      /^sb_publishable_[A-Za-z0-9_-]+$/.test(publishableKey || '')
  } catch {
    return false
  }
}

export function emailRedirect(origin, intent) {
  if (!['confirm', 'recovery'].includes(intent)) throw new Error('Invalid auth intent')
  const url = new URL('/', origin)
  url.searchParams.set('auth', intent)
  return url.href
}

export async function restoreAuth(auth, href, replaceUrl) {
  const url = new URL(href)
  const code = url.searchParams.get('code')
  const intent = url.searchParams.get('auth')
  const fragment = new URLSearchParams(url.hash.slice(1))
  const callbackError = url.searchParams.has('error') || fragment.has('error')
  const isCallback = Boolean(code) || (['confirm', 'recovery'].includes(intent))

  if (!isCallback) {
    const { data, error } = await auth.getSession()
    return { session: error ? null : data.session, callbackError: false }
  }

  // Only fixed, local destinations are allowed. Callback data is removed
  // from the address bar before the HashRouter mounts.
  let session = null
  if (code && !callbackError) {
    try {
      const result = await auth.exchangeCodeForSession(code)
      if (!result.error) session = result.data.session
    } catch {
      session = null
    }
  }

  const failed = !session
  const route = failed
    ? '/login?callback=failed'
    : intent === 'recovery' ? '/reset-password' : '/account'
  replaceUrl(url.pathname + '#' + route)
  return { session, callbackError: failed }
}
