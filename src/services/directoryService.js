import { apiFetch } from './apiClient'

export async function listDepartments() {
  const data = await apiFetch('/api/departments')
  return data.departments
}

export async function createDepartment(payload) {
  const data = await apiFetch('/api/departments', { method: 'POST', body: payload })
  return data.department
}

export async function updateDepartment(id, patch) {
  const data = await apiFetch('/api/departments', { method: 'PATCH', params: { id }, body: patch })
  return data.department
}

export async function deleteDepartment(id) {
  return apiFetch('/api/departments', { method: 'DELETE', params: { id } })
}

export async function listOrganizations() {
  const data = await apiFetch('/api/organizations')
  return data.organizations
}

export async function createOrganization(payload) {
  const data = await apiFetch('/api/organizations', { method: 'POST', body: payload })
  return data.organization
}

export async function updateOrganization(id, patch) {
  const data = await apiFetch('/api/organizations', { method: 'PATCH', params: { id }, body: patch })
  return data.organization
}

export async function deleteOrganization(id) {
  return apiFetch('/api/organizations', { method: 'DELETE', params: { id } })
}
