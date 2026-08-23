// Real auth service — talks to the /api/auth serverless functions backed by
// Postgres. Replaces the old localStorage-only demo implementation.
import { apiFetch, setToken, getToken } from './apiClient'

const USER_KEY = 'civicpulse_user'

function persistSession({ token, user }) {
  setToken(token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export async function signup({ fullName, email, phone, password }) {
  const data = await apiFetch('/api/auth/signup', { method: 'POST', body: { fullName, email, phone, password } })
  return persistSession(data)
}

export async function login({ email, password }) {
  const data = await apiFetch('/api/auth/login', { method: 'POST', body: { email, password } })
  return persistSession(data)
}

export async function requestPasswordReset(email) {
  // Not yet backed by a real email service — kept as a clearly-labeled demo
  // step in the UI (see ForgotPassword.jsx copy).
  await new Promise((r) => setTimeout(r, 500))
  return { requested: true, email }
}

export function getSession() {
  const token = getToken()
  if (!token) return null
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

// Re-validates the stored token against the server and refreshes the cached
// user profile. Call this on app load so a revoked/expired token is caught.
export async function refreshSession() {
  const token = getToken()
  if (!token) return null
  try {
    const data = await apiFetch('/api/auth/me')
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    return data.user
  } catch {
    logout()
    return null
  }
}

export function logout() {
  setToken(null)
  localStorage.removeItem(USER_KEY)
}
