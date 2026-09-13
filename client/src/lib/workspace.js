export async function loadWorkspace(client, userId) {
  if (!client || !userId) throw new Error('Sign in to load your workspace.')
  const results = await Promise.all([
    client.from('profiles').select('id, full_name, company').eq('id', userId).maybeSingle(),
    client.from('projects').select('id, name, status, due_date, created_at', { count: 'exact' })
      .eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
    client.from('projects').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'active'),
    client.from('projects').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'completed'),
    client.from('project_activities').select('id, description, created_at').eq('user_id', userId)
      .order('created_at', { ascending: false }).limit(10),
  ])
  const failure = results.find(result => result.error)
  if (failure) throw failure.error
  return {
    profile: results[0].data,
    projects: results[1].data,
    counts: { total: results[1].count, active: results[2].count, completed: results[3].count },
    activities: results[4].data,
  }
}

export async function createProject(client, userId, name) {
  const trimmedName = name.trim()
  if (!client || !userId) throw new Error('Sign in to create a project.')
  if (!trimmedName || trimmedName.length > 120) throw new Error('Use a project name between 1 and 120 characters.')
  const { error } = await client.from('projects').insert({ user_id: userId, name: trimmedName })
  if (error) throw error
}
