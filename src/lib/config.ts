// Centralized configuration for the application
export const config = {
  // Backend server configuration
  backend: {
    // Default backend port
    port: 8001,
    
    // Backend host configuration
    host: {
      // Local development
      localhost: 'localhost',
      // Network access (your computer's IP)
      network: '10.101.46.112',
    },
    
    // Protocol configuration
    protocol: {
      ws: 'ws',
      http: 'http',
    },
    
    // Get backend URL based on current environment
    getUrl: () => {
      if (typeof window === 'undefined') {
        // Server-side, use localhost
        return `ws://localhost:${config.backend.port}`
      }
      
      // Client-side, check if we're accessing from network IP
      const hostname = window.location.hostname
      
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `ws://localhost:${config.backend.port}`
      } else {
        // Network access, use the same hostname as the frontend
        return `ws://${hostname}:${config.backend.port}`
      }
    },
    
    // Get HTTP URL for API calls
    getHttpUrl: () => {
      if (typeof window === 'undefined') {
        return `http://localhost:${config.backend.port}`
      }
      
      const hostname = window.location.hostname
      
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `http://localhost:${config.backend.port}`
      } else {
        return `http://${hostname}:${config.backend.port}`
      }
    }
  },
  
  // Frontend configuration
  frontend: {
    // Development server port
    port: 3000,
    
    // Host configuration
    host: {
      localhost: 'localhost',
      network: '10.101.46.112',
    },
    
    // Get frontend URL
    getUrl: () => {
      if (typeof window === 'undefined') {
        return `http://localhost:${config.frontend.port}`
      }
      
      const protocol = window.location.protocol
      const hostname = window.location.hostname
      const port = window.location.port || config.frontend.port
      
      return `${protocol}//${hostname}:${port}`
    }
  },
  
  // Authentication configuration
  auth: {
    // Cookie settings
    cookie: {
      name: 'auth-token',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'Lax' as const,
    },
    
    // Session timeout (in milliseconds)
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    
    // Redirect paths
    redirects: {
      login: '/login',
      dashboard: '/dashboard',
      register: '/register',
    }
  },
  
  // API configuration
  api: {
    // Request timeout (in milliseconds)
    timeout: 10000,
    
    // Retry configuration
    retry: {
      attempts: 3,
      delay: 1000,
    },
    
    // Headers
    headers: {
      'Content-Type': 'application/json',
    }
  },
  
  // Development configuration
  development: {
    // Enable debug logging
    debug: true,
    
    // Show connection status
    showConnectionStatus: true,
    
    // Test endpoints
    testEndpoints: {
      connection: '/test-connection',
      health: '/api/health',
    }
  }
}

// Environment-specific overrides
export const getConfig = () => {
  const env = process.env.NODE_ENV || 'development'
  
  if (env === 'production') {
    return {
      ...config,
      development: {
        ...config.development,
        debug: false,
        showConnectionStatus: false,
      }
    }
  }
  
  return config
}

// Export the main config
export default config 