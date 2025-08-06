'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService, getClientAuthToken, setClientAuthToken, removeClientAuthToken } from '@/lib/auth'
import { toast } from 'sonner'

interface User {
  id: number
  email: string
  username: string
  isAdmin: boolean
  sessionId: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  username: string
  email: string
  password: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isSessionExpired: boolean
  showSessionExpiredModal: boolean
  setShowSessionExpiredModal: (show: boolean) => void
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSessionExpired, setIsSessionExpired] = useState(false)
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      console.log('Checking authentication...')
      const token = getClientAuthToken()
      console.log('Token found:', !!token)

      if (!token) {
        console.log('No token found, user not authenticated')
        setUser(null)
        setIsLoading(false)
        return
      }

      console.log('Attempting to restore session...')
      const response = await authService.restoreSession(token)
      console.log('Restore response:', response)

      if (response.result && response.result.status === 'logged') {
        console.log('Session restored successfully')
        setUser(response.result.response)
        setIsSessionExpired(false)
      } else {
        console.log('Session restore failed, removing token')
        removeClientAuthToken()
        setUser(null)
        setIsSessionExpired(true)
        setShowSessionExpiredModal(true)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      removeClientAuthToken()
      setUser(null)
      setIsSessionExpired(true)
      setShowSessionExpiredModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials)
      console.log('Login response:', response)

      if (response.result && response.result.status === 'logged') {
        const { token, ...userData } = response.result.response
        setClientAuthToken(token)
        setUser(userData)
        setIsSessionExpired(false)
        toast.success('Login successful!')
        router.push('/dashboard')
      } else {
        const errorMessage = response.result?.response || 'Login failed'
        toast.error(errorMessage)
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error instanceof Error ? error.message : 'Login failed')
      throw error
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await authService.register(credentials)
      console.log('Register response:', response)

      if (response.result && response.result.status === 'fulfilled') {
        toast.success('Registration successful! Please log in.')
        router.push('/login')
      } else {
        const errorMessage = response.result?.response || 'Registration failed'
        toast.error(errorMessage)
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error instanceof Error ? error.message : 'Registration failed')
      throw error
    }
  }

  const logout = async () => {
    try {
      console.log('AuthContext: Starting logout process...')
      await authService.logout()
      console.log('AuthContext: Backend logout successful')
      removeClientAuthToken()
      console.log('AuthContext: Token removed from client')
      setUser(null)
      console.log('AuthContext: User state cleared')
      setIsSessionExpired(false)
      console.log('AuthContext: Session expired state cleared')
      toast.success('Logged out successfully')
      console.log('AuthContext: Logout completed successfully')
    } catch (error) {
      console.error('AuthContext: Logout error:', error)
      // Still remove token and user even if logout fails
      removeClientAuthToken()
      setUser(null)
      console.log('AuthContext: Fallback cleanup completed')
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // Check for session expiration periodically
  useEffect(() => {
    if (!user) return

    const checkSessionExpiration = async () => {
      try {
        const token = getClientAuthToken()
        if (!token) {
          setIsSessionExpired(true)
          setShowSessionExpiredModal(true)
          return
        }

        const response = await authService.restoreSession(token)
        if (response.result && response.result.status !== 'logged') {
          setIsSessionExpired(true)
          setShowSessionExpiredModal(true)
        }
      } catch (error) {
        console.error('Session expiration check failed:', error)
        setIsSessionExpired(true)
        setShowSessionExpiredModal(true)
      }
    }

    // Check every 5 minutes for 6-hour TTL
    const interval = setInterval(checkSessionExpiration, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [user])

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isSessionExpired,
      showSessionExpiredModal,
      setShowSessionExpiredModal,
      login,
      register,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 