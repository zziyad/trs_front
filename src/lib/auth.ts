import { scaffold } from './transport'
import { config } from './config'

// Get the backend URL from centralized config
const BACKEND_URL = config.backend.getUrl()

export interface AuthResponse {
  type: 'callback'
  id: number
  result: {
    status: 'logged' | 'rejected' | 'fulfilled'
    response: any
  }
}

export interface User {
  id: number
  email: string
  username?: string
  isAdmin?: boolean
  sessionId?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
}

// export interface SessionAnalytics {
//   totalSessions: number
//   activeSessions: number
//   redisSessions: number
//   memorySessions: number
//   totalActive: number
//   uptime: number
//   lastUpdated: string
// }

class AuthService {
  private api: any = null
  private isInitialized = false

  private async initialize() {
    if (this.isInitialized) return this.api
    
    if (config.development.debug) {
      console.log('Initializing auth service with backend URL:', BACKEND_URL)
    }
    
    this.api = await scaffold(BACKEND_URL)({
      auth: {
        signin: ['email', 'password'],
        signout: [],
        restore: ['token'],
        register: ['username', 'email', 'password'],
        // analytics: [],
        // manage: ['action', 'userId'],
      },
    })
    
    if (config.development.debug) {
      console.log('Auth service initialized successfully')
    }
    this.isInitialized = true
    return this.api
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const api = await this.initialize()
      if (config.development.debug) {
        console.log('Attempting login with credentials:', { email: credentials.email })
      }
      const result = await api.auth.signin(credentials.email, credentials.password)
      if (config.development.debug) {
        console.log('Login result:', result)
      }
      return result
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const api = await this.initialize()
    const result = await api.auth.register(credentials.username, credentials.email, credentials.password)
    return result
  }

  async logout(): Promise<AuthResponse> {
    const api = await this.initialize()
    const result = await api.auth.signout()
    return result
  }

  async restoreSession(token: string): Promise<AuthResponse> {
    const api = await this.initialize()
    const result = await api.auth.restore(token)
    return result
  }

  // async getAnalytics(): Promise<AuthResponse> {
  //   const api = await this.initialize()
  //   const result = await api.auth.analytics()
  //   return result
  // }

  // async manageSessions(action: string, userId?: string): Promise<AuthResponse> {
  //   const api = await this.initialize()
  //   const result = await api.auth.manage(action, userId)
  //   return result
  // }
}

export const authService = new AuthService()

// Client-side utilities
export function getClientAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${config.auth.cookie.name}=`))
    ?.split('=')[1] || null
}

export function setClientAuthToken(token: string) {
  if (typeof window === 'undefined') return
  document.cookie = `${config.auth.cookie.name}=${token}; path=${config.auth.cookie.path}; max-age=${config.auth.cookie.maxAge}; SameSite=${config.auth.cookie.sameSite}`
}

export function removeClientAuthToken() {
  if (typeof window === 'undefined') return
  document.cookie = `${config.auth.cookie.name}=; path=${config.auth.cookie.path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
} 