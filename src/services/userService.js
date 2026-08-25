import { apiFetch } from './apiClient'

export async function listUsers(filters = {}) {
  const data = await apiFetch('/api/users', { params: filters })
  return data.users
}

export async function createUser(payload) {
  const data = await apiFetch('/api/users', { method: 'POST', body: payload })
  return data.user
}

export async function updateUser(id, patch) {
  const data = await apiFetch('/api/users', { method: 'PATCH', params: { id }, body: patch })
  return data.user
}

export async function suspendUser(id) {
  return updateUser(id, { suspended: true })
}

export async function reactivateUser(id) {
  return updateUser(id, { suspended: false })
}

export async function changeUserRole(id, role) {
  return updateUser(id, { role })
}
