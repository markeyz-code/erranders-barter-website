import { useState, useRuntimeConfig } from '#app'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { useLoader } from './useLoader'

export function useAuth() {
  const user = useState('auth-user', () => null)
  const token = useState('auth-token', () => null)
  const isLoggedIn = useState('auth-is-logged-in', () => false)
  const isGlobalAuthModalOpen = useState('auth-modal-open', () => false)
  const { showLoader, hideLoader } = useLoader()

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

  const firebaseLogin = async (isSignUp = false) => {
    if (!process.client) return
    try {
      const config = useRuntimeConfig()
      const firebaseConfig = {
        apiKey: config.public.firebaseApiKey,
        authDomain: config.public.firebaseAuthDomain,
        projectId: config.public.firebaseProjectId,
        messagingSenderId: config.public.firebaseMessagingSenderId,
        appId: config.public.firebaseAppId,
      }

      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
      const auth = getAuth(app)
      const provider = new GoogleAuthProvider()

      showLoader('Connecting to Google...')

      let result
      try {
        result = await signInWithPopup(auth, provider)
      } catch (err) {
        if (err.code === 'auth/popup-blocked') {
          console.warn('Popup blocked, falling back to redirect...')
          await signInWithRedirect(auth, provider)
          return new Promise(() => {}) // never resolves until redirect
        }
        hideLoader()
        throw err
      }
      
      showLoader('Authenticating with Barter...')
      const idToken = await result.user.getIdToken()
      
      const res = await fetch(`${config.public.apiBaseUrl}/auth/firebase-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, isSignUp })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Firebase login failed')
      
      // Handle nestjs payload where access_token is at root
      if (data.access_token) {
        saveSession(data)
      }
      
      return data
    } catch (e) {
      console.error('Firebase login failed:', e)
      throw e
    } finally {
      hideLoader()
    }
  }

  // Load session only if it hasn't been loaded in this client
  if (process.client && !token.value) {
    loadSession()
  }

  return { 
    user, 
    token, 
    isLoggedIn, 
    isGlobalAuthModalOpen,
    saveSession, 
    logout, 
    loadSession, 
    firebaseLogin 
  }
}
