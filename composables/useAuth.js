import { ref } from 'vue'

export function useAuth() {
  const user = ref(null)
  const token = ref(null)
  const isLoggedIn = ref(false)

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

  loadSession()

  return { user, token, isLoggedIn, saveSession, logout, loadSession }
}
