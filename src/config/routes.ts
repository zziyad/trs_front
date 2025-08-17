import { NavigationItem } from './navigation'

export interface RouteConfig {
  path: string
  component: string
  title: string
  description: string
  icon?: string
  layout?: string
  auth?: boolean
  roles?: string[]
  breadcrumbs?: string[]
}

export const routesConfig: Record<string, RouteConfig> = {
  // Main Navigation Routes
  'dashboard': {
    path: '/events/[eventId]/dashboard',
    component: 'DashboardPage',
    title: 'Dashboard',
    description: 'Overview and statistics for the event',
    icon: 'LayoutDashboard',
    layout: 'default'
  },
  'aad': {
    path: '/events/[eventId]/aad',
    component: 'AADPage',
    title: 'AAD',
    description: 'AAD management and configuration',
    icon: 'FileText',
    layout: 'default'
  },
  'flight-schedule': {
    path: '/events/[eventId]/flight-schedule',
    component: 'FlightSchedulePage',
    title: 'Flight Schedule',
    description: 'Manage flight schedules and timings',
    icon: 'Plane',
    layout: 'default'
  },
  'transport-reports': {
    path: '/events/[eventId]/transport-reports',
    component: 'TransportReportsPage',
    title: 'Transport Reports',
    description: 'Transportation analytics and reports',
    icon: 'BarChart3',
    layout: 'default'
  },
  'real-time-status': {
    path: '/events/[eventId]/real-time-status',
    component: 'RealTimeStatusPage',
    title: 'Real-Time Status',
    description: 'Live tracking and status updates',
    icon: 'Activity',
    layout: 'default'
  },

  // Hotel Transportation Routes
  'hotel-transport-operation': {
    path: '/events/[eventId]/hotel-transportation/operation',
    component: 'HotelTransportOperationPage',
    title: 'Hotel Transport Operation',
    description: 'Manage hotel transportation operations',
    icon: 'Building',
    layout: 'default',
    breadcrumbs: ['Hotel Transportation', 'Hotel Transport Operation']
  },
  'passengers': {
    path: '/events/[eventId]/hotel-transportation/passengers',
    component: 'PassengersPage',
    title: 'Passengers',
    description: 'Passenger management and tracking',
    icon: 'UserCheck',
    layout: 'default',
    breadcrumbs: ['Hotel Transportation', 'Passengers']
  },

  // Fleet Management Routes
  'driver-management': {
    path: '/events/[eventId]/fleet-management/drivers',
    component: 'DriverManagementPage',
    title: 'Driver Management',
    description: 'Manage drivers and their assignments',
    icon: 'UserCheck',
    layout: 'default',
    breadcrumbs: ['Fleet Management', 'Driver Management']
  },
  'fleet-id': {
    path: '/events/[eventId]/fleet-management/fleet-id',
    component: 'FleetIDPage',
    title: 'Fleet ID',
    description: 'Fleet identification and management',
    icon: 'Hash',
    layout: 'default',
    breadcrumbs: ['Fleet Management', 'Fleet ID']
  },
  'fleet-assignment': {
    path: '/events/[eventId]/fleet-management/assignment',
    component: 'FleetAssignmentPage',
    title: 'Fleet Assignment',
    description: 'Assign vehicles to routes and drivers',
    icon: 'Truck',
    layout: 'default',
    breadcrumbs: ['Fleet Management', 'Fleet Assignment']
  },
  'commissioning': {
    path: '/events/[eventId]/fleet-management/commissioning',
    component: 'CommissioningPage',
    title: 'Commissioning & De-commissioning',
    description: 'Vehicle commissioning and decommissioning',
    icon: 'Settings',
    layout: 'default',
    breadcrumbs: ['Fleet Management', 'Commissioning & De-commissioning']
  },
  'vapp': {
    path: '/events/[eventId]/vapp',
    component: 'VAPPage',
    title: 'VAPP',
    description: 'Vehicle Assignment and Planning Protocol',
    icon: 'ClipboardList',
    layout: 'default',
    breadcrumbs: ['VAPP']
  },

  // Travel Routes
  'visa': {
    path: '/events/[eventId]/visa',
    component: 'VisaPage',
    title: 'Visa',
    description: 'Visa application and management',
    icon: 'CreditCard',
    layout: 'default',
    breadcrumbs: ['Travel', 'Visa']
  },
  'accommodation': {
    path: '/events/[eventId]/accommodation',
    component: 'AccommodationPage',
    title: 'Accommodation',
    description: 'Hotel and accommodation management',
    icon: 'Building',
    layout: 'default',
    breadcrumbs: ['Travel', 'Accommodation']
  },
  'air-transfer': {
    path: '/events/[eventId]/air-transfer',
    component: 'AirTransferPage',
    title: 'Air Transfer',
    description: 'Airport transfer services',
    icon: 'Plane',
    layout: 'default',
    breadcrumbs: ['Travel', 'Air Transfer']
  },
  'tickets': {
    path: '/events/[eventId]/tickets',
    component: 'TicketsPage',
    title: 'Tickets',
    description: 'Travel ticket management',
    icon: 'Ticket',
    layout: 'default',
    breadcrumbs: ['Travel', 'Tickets']
  }
}

// Helper function to get route config by path
export const getRouteConfig = (path: string): RouteConfig | null => {
  return routesConfig[path] || null
}

// Helper function to get route config by component name
export const getRouteConfigByComponent = (componentName: string): RouteConfig | null => {
  return Object.values(routesConfig).find(route => route.component === componentName) || null
}

// Helper function to get all routes
export const getAllRouteConfigs = (): RouteConfig[] => {
  return Object.values(routesConfig)
}

// Helper function to get routes by section
export const getRoutesBySection = (section: string): RouteConfig[] => {
  const sectionRoutes: RouteConfig[] = []
  
  Object.entries(routesConfig).forEach(([key, route]) => {
    if (route.breadcrumbs && route.breadcrumbs[0] === section) {
      sectionRoutes.push(route)
    }
  })
  
  return sectionRoutes
}

// Helper function to get main navigation routes
export const getMainNavigationRoutes = (): RouteConfig[] => {
  return [
    routesConfig['dashboard'],
    routesConfig['aad'],
    routesConfig['flight-schedule'],
    routesConfig['transport-reports'],
    routesConfig['real-time-status']
  ].filter(Boolean)
}

// Helper function to get hotel transportation routes
export const getHotelTransportationRoutes = (): RouteConfig[] => {
  return getRoutesBySection('Hotel Transportation')
}

// Helper function to get fleet management routes
export const getFleetManagementRoutes = (): RouteConfig[] => {
  return getRoutesBySection('Fleet Management')
}

// Helper function to get travel routes
export const getTravelRoutes = (): RouteConfig[] => {
  return getRoutesBySection('Travel')
}

// Helper function to generate dynamic routes for Next.js
export const generateDynamicRoutes = (eventId: string): Record<string, string> => {
  const dynamicRoutes: Record<string, string> = {}
  
  Object.entries(routesConfig).forEach(([key, route]) => {
    const dynamicPath = route.path.replace('[eventId]', eventId)
    dynamicRoutes[key] = dynamicPath
  })
  
  return dynamicRoutes
}

// Alias for backward compatibility
export const getAllRoutes = getAllRouteConfigs

// Export for use in other components
export default routesConfig
