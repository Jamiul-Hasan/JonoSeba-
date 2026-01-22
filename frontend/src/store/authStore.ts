import { create } from 'zustand'
import { initializeNotificationStore } from '@/store/notificationStore'

interface User {
  id: string
  name: string
  role: 'CITIZEN' | 'OFFICER' | 'ADMIN'
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  hydrateFromStorage: () => void
}

const STORAGE_KEY = 'jonosheba_auth'

// Safe localStorage helpers
const getStoredAuth = (): { token: string | null; user: User | null } => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return { token: null, user: null }
    
    const parsed = JSON.parse(stored)
    return {
      token: parsed.token || null,
      user: parsed.user || null,
    }
  } catch (error) {
    console.error('Failed to parse stored auth:', error)
    return { token: null, user: null }
  }
}

const setStoredAuth = (token: string | null, user: User | null) => {
  try {
    if (token && user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch (error) {
    console.error('Failed to store auth:', error)
  }
}

export const useAuthStore = create<AuthState>((set: any, get: any) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  login: (token: string, user: User) => {
    setStoredAuth(token, user)
    set({ token, user, isAuthenticated: true })

    // Initialize notifications after successful login
    initializeNotificationStore().catch((error: any) => {
      console.warn('Failed to initialize notifications:', error)
      // Continue with app even if notifications fail to load
    })
  },

  logout: () => {
    setStoredAuth(null, null)
    set({ token: null, user: null, isAuthenticated: false })
  },

  hydrateFromStorage: () => {
    const { token, user } = getStoredAuth()
    if (token && user) {
      set({ token, user, isAuthenticated: true })

      // Initialize notifications if already logged in
      initializeNotificationStore().catch((error: any) => {
        console.warn('Failed to initialize notifications:', error)
      })
    } else {
      set({ token: null, user: null, isAuthenticated: false })
    }
  },
}))

// Auto-hydrate on module load
if (typeof window !== 'undefined') {
  useAuthStore.getState().hydrateFromStorage()
}
