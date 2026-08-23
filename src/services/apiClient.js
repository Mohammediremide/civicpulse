// Defaults to same-origin '' so it works out of the box once deployed on
// Vercel (frontend + /api live in the same project). Only set
// VITE_API_BASE_URL if the API is hosted elsewhere.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const TOKEN_KEY = 'civicpulse_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function apiFetch(path, { method = 'GET', body, params } = {}) {
  let url = `${BASE_URL}${path}`
  if (params) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''))
    ).toString()
    if (qs) url += `?${qs}`
  }

  const token = getToken()
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}
