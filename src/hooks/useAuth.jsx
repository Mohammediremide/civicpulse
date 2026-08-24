import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authService.getSession())
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    // Validate any cached token against the server on first load, in case it
    // was revoked or the account no longer exists.
    authService.refreshSession().then((user) => {
      setSession(user)
      setInitializing(false)
    })
  }, [])

  const login = useCallback(async (payload) => {
    setLoading(true)
    try {
      const user = await authService.login(payload)
      setSession(user)
      return user
    } finally {
      setLoading(false)
    }
  }, [])

  const signup = useCallback(async (payload) => {
    setLoading(true)
    try {
      const user = await authService.signup(payload)
      setSession(user)
      return user
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setSession(null)
  }, [])

  const updateProfile = useCallback(async (patch) => {
    const user = await authService.updateProfile(patch)
    setSession(user)
    return user
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading, initializing, login, signup, logout, updateProfile, isAdmin: session?.role === 'administrator' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
