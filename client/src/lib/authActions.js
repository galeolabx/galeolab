export function sessionUser(session) {
  if (!session?.access_token || !session?.user?.id) return null
  return {
    id: session.user.id,
    fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
    email: session.user.email,
  }
}

export function createAuthActions(client, origin) {
  function auth() {
    if (!client) throw new Error('Account access is temporarily unavailable. Please try again later.')
    return client.auth
  }
  return {
    async signup({ fullName, email, password }) {
      const { data, error } = await auth().signUp({
        email: email.trim().toLowerCase(), password,
        options: {
          data: { full_name: fullName.trim() },
          emailRedirectTo: `${origin}/?auth=callback`,
        },
      })
      if (error) throw error
      return { user: sessionUser(data.session), confirmationRequired: !data.session }
    },
    async login({ email, password }) {
      const { data, error } = await auth().signInWithPassword({ email: email.trim().toLowerCase(), password })
      if (error) throw error
      const user = sessionUser(data.session)
      if (!user) throw new Error('Sign in did not create a session. Please try again.')
      return user
    },
    async socialLogin(provider) {
      if (!['google', 'github'].includes(provider)) throw new Error('Unsupported sign-in provider.')
      const { error } = await auth().signInWithOAuth({ provider, options: { redirectTo: `${origin}/?auth=callback` } })
      if (error) throw error
    },
    async resetPassword({ email }) {
      const { error } = await auth().resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${origin}/?auth=recovery`,
      })
      if (error) throw error
    },
    async updatePassword(password) {
      // Verify against Auth, not a user object restored from browser storage.
      const { data, error } = await auth().getUser()
      if (error || !data.user) throw new Error('This recovery session has expired. Request a new reset link.')
      const result = await auth().updateUser({ password })
      if (result.error) throw result.error
    },
    async logout() {
      const { error } = await auth().signOut({ scope: 'local' })
      if (error) throw error
    },
  }
}
