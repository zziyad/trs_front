// Export all configuration modules
export * from './navigation'
export * from './routes'
export * from './sitemap'

// Import default exports for re-export
import navigationConfig from './navigation'
import routesConfig from './routes'
import sitemapConfig from './sitemap'

// Re-export default exports
export { navigationConfig, routesConfig, sitemapConfig }

// Configuration constants
export const APP_CONFIG = {
  name: 'TRS - Transportation & Resource System',
  version: '1.0.0',
  description: 'Comprehensive transportation and resource management system for events',
  author: 'TRS Team',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  defaultEventId: '1'
}

// Navigation structure constants
export const NAVIGATION_STRUCTURE = {
  MAIN: 'main',
  HOTEL_TRANSPORTATION: 'hotel-transportation',
  FLEET_MANAGEMENT: 'fleet-management',
  TRAVEL: 'travel'
}

// Route patterns
export const ROUTE_PATTERNS = {
  EVENT_BASE: '/events/[eventId]',
  DASHBOARD: '/events/[eventId]/dashboard',
  AAD: '/events/[eventId]/aad',
  FLIGHT_SCHEDULE: '/events/[eventId]/flight-schedule',
  TRANSPORT_REPORTS: '/events/[eventId]/transport-reports',
  REAL_TIME_STATUS: '/events/[eventId]/real-time-status',
  
  // Hotel Transportation
  HOTEL_TRANSPORT_OPERATION: '/events/[eventId]/hotel-transportation/operation',
  PASSENGERS: '/events/[eventId]/hotel-transportation/passengers',
  
  // Fleet Management
  DRIVER_MANAGEMENT: '/events/[eventId]/fleet-management/drivers',
  FLEET_ID: '/events/[eventId]/fleet-management/fleet-id',
  FLEET_ASSIGNMENT: '/events/[eventId]/fleet-management/assignment',
  COMMISSIONING: '/events/[eventId]/fleet-management/commissioning',
      VAPP: '/events/[eventId]/vapp',
  
  // Travel
  VISA: '/events/[eventId]/visa',
  ACCOMMODATION: '/events/[eventId]/accommodation',
  AIR_TRANSFER: '/events/[eventId]/air-transfer',
  TICKETS: '/events/[eventId]/tickets'
}

// Icon mappings
export const ICON_MAPPINGS = {
  LayoutDashboard: 'LayoutDashboard',
  Plane: 'Plane',
  FileText: 'FileText',
  BarChart3: 'BarChart3',
  Activity: 'Activity',
  Building: 'Building',
  Car: 'Car',
  Truck: 'Truck',
  UserCheck: 'UserCheck',
  CreditCard: 'CreditCard',
  Ticket: 'Ticket',
  Bus: 'Bus',
  Settings: 'Settings',
  Database: 'Database',
  ClipboardList: 'ClipboardList',
  MapPin: 'MapPin',
  Phone: 'Phone',
  Mail: 'Mail',
  Hash: 'Hash'
}

// Page metadata
export const PAGE_METADATA = {
  dashboard: {
    title: 'Dashboard',
    description: 'Overview and statistics for the event',
    keywords: ['dashboard', 'overview', 'statistics', 'event']
  },
  aad: {
    title: 'AAD',
    description: 'AAD management and configuration',
    keywords: ['aad', 'management', 'configuration']
  },
  flightSchedule: {
    title: 'Flight Schedule',
    description: 'Manage flight schedules and timings',
    keywords: ['flight', 'schedule', 'timing', 'aviation']
  },
  transportReports: {
    title: 'Transport Reports',
    description: 'Transportation analytics and reports',
    keywords: ['transport', 'reports', 'analytics', 'transportation']
  },
  realTimeStatus: {
    title: 'Real-Time Status',
    description: 'Live tracking and status updates',
    keywords: ['real-time', 'status', 'tracking', 'live']
  }
}

// Export configuration utilities
export const configUtils = {
  // Get route with event ID
  getRouteWithEventId: (route: string, eventId: string): string => {
    return route.replace('[eventId]', eventId)
  },
  
  // Get route without event ID
  getRouteWithoutEventId: (route: string): string => {
    return route.replace(/\/\d+\//, '/[eventId]/')
  },
  
  // Check if route is active
  isRouteActive: (currentPath: string, targetRoute: string, eventId: string): boolean => {
    const normalizedTarget = targetRoute.replace('[eventId]', eventId)
    return currentPath === normalizedTarget
  },
  
  // Get breadcrumbs for a route
  getBreadcrumbsForRoute: (route: string): string[] => {
    // This would be implemented based on the navigation structure
    return []
  }
}

// Default export for the entire configuration
export default {
  navigation: navigationConfig,
  routes: routesConfig,
  sitemap: sitemapConfig,
  app: APP_CONFIG,
  structure: NAVIGATION_STRUCTURE,
  patterns: ROUTE_PATTERNS,
  icons: ICON_MAPPINGS,
  metadata: PAGE_METADATA,
  utils: configUtils
}
