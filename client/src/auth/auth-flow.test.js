import test from 'node:test'
import assert from 'node:assert/strict'
import { emailRedirect, restoreAuth, validateAuthConfig } from './auth-flow.js'

test('configuration requires HTTPS and a browser publishable key', () => {
  assert.equal(validateAuthConfig('https://example.supabase.co', 'sb_publishable_example'), true)
  for (const key of ['', 'sb_secret_example', 'service_role', 'eyJhbGciOiJIUzI1NiJ9']) {
    assert.equal(validateAuthConfig('https://example.supabase.co', key), false)
  }
  for (const url of ['invalid', 'http://example.supabase.co', 'https://user:pass@example.com', 'https://example.com/?key=value']) {
    assert.equal(validateAuthConfig(url, 'sb_publishable_example'), false)
  }
})

test('email redirects use an explicit purpose without conflicting with HashRouter', () => {
  assert.equal(emailRedirect('https://galeolab.com', 'confirm'), 'https://galeolab.com/?auth=confirm')
  assert.equal(emailRedirect('http://localhost:5173', 'recovery'), 'http://localhost:5173/?auth=recovery')
  assert.throws(() => emailRedirect('https://galeolab.com', 'https://attacker.example'))
})

test('ordinary page visits restore the session without rewriting the route', async () => {
  const session = { user: { id: 'test-user' } }
  const result = await restoreAuth(
    { getSession: async () => ({ data: { session }, error: null }) },
    'https://galeolab.com/#/account',
    () => assert.fail('Ordinary navigation must not be replaced'),
  )
  assert.equal(result.session, session)
})

test('a successful recovery exchanges the code and removes callback data', async () => {
  let destination
  const session = { user: { id: 'test-user' } }
  const result = await restoreAuth({
    exchangeCodeForSession: async code => {
      assert.equal(code, 'one-time-code')
      return { data: { session }, error: null }
    },
  }, 'https://galeolab.com/?auth=recovery&code=one-time-code&next=https://attacker.example',
  url => { destination = url })
  assert.equal(destination, '/#/reset-password')
  assert.equal(result.session, session)
})

test('confirmation goes to the account page, not a supplied return URL', async () => {
  let destination
  await restoreAuth({
    exchangeCodeForSession: async () => ({ data: { session: { user: { id: 'test-user' } } }, error: null }),
  }, 'https://galeolab.com/?code=one-time&auth=confirm&next=//attacker.example',
  url => { destination = url })
  assert.equal(destination, '/#/account')
})

test('expired, reused, missing, or rejected codes never unlock recovery', async () => {
  for (const href of [
    'https://galeolab.com/?auth=recovery&code=expired',
    'https://galeolab.com/?auth=recovery',
    'https://galeolab.com/?auth=recovery#error=access_denied',
  ]) {
    let destination
    const result = await restoreAuth({
      exchangeCodeForSession: async () => ({ data: { session: null }, error: new Error('Expired') }),
    }, href, url => { destination = url })
    assert.equal(result.session, null)
    assert.equal(result.callbackError, true)
    assert.equal(destination, '/#/login?callback=failed')
  }
})

test('a callback network failure produces a recoverable error route', async () => {
  let destination
  const result = await restoreAuth({
    exchangeCodeForSession: async () => { throw new Error('Offline') },
  }, 'https://galeolab.com/?auth=recovery&code=one-time',
  url => { destination = url })
  assert.equal(result.session, null)
  assert.equal(destination, '/#/login?callback=failed')
})
