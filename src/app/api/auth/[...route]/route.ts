import { NextRequest, NextResponse } from 'next/server'
import { scaffold } from '@/lib/transport'

const BACKEND_URL = 'ws://localhost:8001'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  try {
    const resolvedParams = await params
    const route = resolvedParams.route.join('/')
    const body = await request.json()
    
    // Initialize the API with your backend structure
    const api = await scaffold(BACKEND_URL)({
      auth: {
        signin: ['email', 'password'],
        signout: [],
        restore: ['token'],
        register: ['username', 'email', 'password'],
        // analytics: [],
        // manage: ['action', 'userId'],
      },
    })

    let result: any

    // Call the appropriate method based on the route
    switch (route) {
      case 'signin':
        result = await api.auth.signin(body.email, body.password)
        break
      case 'register':
        result = await api.auth.register(body.username, body.email, body.password)
        break
      case 'signout':
        result = await api.auth.signout()
        break
      case 'restore':
        result = await api.auth.restore(body.token)
        break
      // case 'analytics':
      //   result = await api.auth.analytics()
      //   break
      // case 'manage':
      //   result = await api.auth.manage(body.action, body.userId)
      //   break
      default:
        return NextResponse.json(
          { status: 'rejected', response: 'Invalid route' },
          { status: 404 }
        )
    }

    // If login is successful, set the auth token cookie
    if (route === 'signin' && result.result && result.result.status === 'logged' && result.result.response.token) {
      const response = NextResponse.json(result)
      response.cookies.set('auth-token', result.result.response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
      return response
    }

    // If logout is successful, remove the auth token cookie
    if (route === 'signout' && result.result && result.result.status === 'fulfilled') {
      const response = NextResponse.json(result)
      response.cookies.delete('auth-token')
      return response
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { status: 'rejected', response: 'Internal server error' },
      { status: 500 }
    )
  }
} 