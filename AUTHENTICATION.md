# Authentication System

This document describes the session-based authentication system implemented in the TRS frontend using WebSocket transport.

## Overview

The authentication system uses session-based authentication with HTTP-only cookies for security. The system communicates with the backend using a custom WebSocket transport protocol.

## Architecture

### Frontend Components

- `AuthContext`: React context for managing authentication state
- `ProtectedRoute`: Component wrapper for protected pages
- `LoginPage`: User login form
- `RegisterPage`: User registration form
- `DashboardPage`: Protected dashboard showing user info

### Backend Integration

- `transport.ts`: WebSocket transport layer matching your backend protocol
- `authService`: Service class for API communication using WebSocket transport
- API routes in `/api/auth/[...route]` that proxy to the Node.js backend
- Cookie management for session tokens

### Security Features

- HTTP-only cookies for token storage
- Server-side session validation
- Automatic token refresh
- Protected route middleware

## Transport Protocol

The system uses your custom WebSocket transport protocol:

```typescript
// Transport structure
{
  auth: {
    signin: ['email', 'password'],
    signout: [],
    restore: ['token'],
    register: ['username', 'email', 'password'],
  },
}
```

### WebSocket Communication

- **URL**: `ws://localhost:8001`
- **Protocol**: Custom packet-based protocol
- **Packet Format**: `{ type: 'call', id: number, method: string, args: any[] }`

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/signin` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/signout` - User logout
- `POST /api/auth/restore` - Session restoration

### Request/Response Format

```typescript
// Login Request
{
  email: string
  password: string
}

// Login Response
{
  status: 'logged' | 'rejected'
  response: {
    id: number
    email: string
    username?: string
    isAdmin?: boolean
    sessionId: string
    token: string
  }
}
```

## Usage

### Login Flow

1. User enters credentials on `/login`
2. Frontend calls `/api/auth/signin` via Next.js API route
3. Next.js API route uses WebSocket transport to call backend
4. Backend validates credentials and returns token
5. Token stored in HTTP-only cookie
6. User redirected to `/dashboard`

### Session Management

- Tokens automatically included in API requests
- Middleware checks authentication on route changes
- Unauthenticated users redirected to `/login`
- Authenticated users redirected to `/dashboard` when accessing login/register

### Logout Flow

1. User clicks logout button
2. Frontend calls `/api/auth/signout`
3. Backend invalidates session via WebSocket
4. Cookie removed from browser
5. User redirected to `/login`

## Configuration

### Environment Variables

- `BACKEND_URL`: WebSocket backend URL (default: ws://localhost:8001)

### Backend Requirements

The Node.js backend must implement these WebSocket endpoints:

- `auth/signin` - Accept email/password, return user data + token
- `auth/register` - Accept username/email/password, create user
- `auth/signout` - Invalidate session
- `auth/restore` - Validate token, return user data

## Security Considerations

- HTTP-only cookies prevent XSS attacks
- Server-side session validation
- Automatic token expiration
- Secure cookie settings in production
- CSRF protection through SameSite cookie attribute

## Development

### Running the System

1. Start the Node.js backend on port 8001 with WebSocket support
2. Start the Next.js frontend on port 3001
3. Access the application at http://localhost:3001

### Testing Authentication

1. Register a new account at `/register`
2. Login with credentials at `/login`
3. Access protected dashboard at `/dashboard`
4. Test logout functionality

## Troubleshooting

### Common Issues

1. **WebSocket Connection**: Ensure backend WebSocket server is running on port 8001
2. **CORS Errors**: Ensure backend allows WebSocket connections from frontend origin
3. **Cookie Issues**: Check cookie settings and domain configuration
4. **Session Expiry**: Tokens expire after 7 days by default
5. **Backend Connection**: Verify WebSocket server is running and accessible

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` and checking browser console for WebSocket connection and authentication flow details.

### WebSocket Debugging

Check browser DevTools Network tab for WebSocket frames and console for transport protocol messages. 