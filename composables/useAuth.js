import { useState } from '#app'

export function useAuth() {
  const user = useState('auth-user', () => null)
  const token = useState('auth-token', () => null)
  const isLoggedIn = useState('auth-is-logged-in', () => false)

  const loadSession = () => {
    if (!process.client) return
    const t = localStorage.getItem('barter_token')
    const u = localStorage.getItem('barter_user')
    if (t) {
      token.value = t
      isLoggedIn.value = true
    }
    if (u) {
      try { user.value = JSON.parse(u) } catch {}
    }
  }

  const saveSession = (data) => {
    if (!process.client) return
    if (data.access_token) {
      localStorage.setItem('barter_token', data.access_token)
      token.value = data.access_token
      isLoggedIn.value = true
    }
    if (data.user) {
      localStorage.setItem('barter_user', JSON.stringify(data.user))
      user.value = data.user
    }
  }

  const logout = () => {
    if (!process.client) return
    localStorage.removeItem('barter_token')
    localStorage.removeItem('barter_user')
    user.value = null
    token.value = null
    isLoggedIn.value = false
  }

  // Load session only if it hasn't been loaded in this client
  if (process.client && !token.value) {
    loadSession()
  }

  return { user, token, isLoggedIn, saveSession, logout, loadSession }
}
