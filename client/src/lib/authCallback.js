// Run once before HashRouter mounts: Supabase and the router must not compete
// for the fragment. PKCE uses a query code; legacy links can contain tokens.
export async function completeAuthCallback(client, href) {
  const url = new URL(href)
  const fragment = new URLSearchParams(url.hash.slice(1))
  const isCallback = url.searchParams.has('auth') || url.searchParams.has('code') ||
    fragment.has('access_token') || fragment.has('error') || url.searchParams.has('error')
  if (!isCallback) return null

  let route = '/login'
  let error = ''
  try {
    if (!client) throw new Error('Account access is temporarily unavailable. Please try again later.')
    if (url.searchParams.has('error') || fragment.has('error')) throw new Error('Invalid link')
    let result
    if (url.searchParams.has('code')) {
      result = await client.auth.exchangeCodeForSession(url.searchParams.get('code'))
    } else if (fragment.has('access_token') && fragment.has('refresh_token')) {
      result = await client.auth.setSession({
        access_token: fragment.get('access_token'), refresh_token: fragment.get('refresh_token'),
      })
    } else {
      throw new Error('Missing verification code')
    }
    if (result.error || !result.data.session) throw new Error('Invalid session')
    const verified = await client.auth.getUser()
    if (verified.error || !verified.data.user) throw new Error('Invalid user')
    route = url.searchParams.get('auth') === 'recovery' || fragment.get('type') === 'recovery' ||
      result.data.redirectType === 'recovery' ? '/update-password' : '/dashboard'
  } catch {
    error = client
      ? 'This sign-in or recovery link is invalid or expired. Request a new link and open it in the same browser where you started.'
      : 'Account access is temporarily unavailable. Please try again later.'
  }
  // No tokens, codes, provider error text or callback parameters in history.
  return { url: `${url.origin}/#${route}`, error }
}
