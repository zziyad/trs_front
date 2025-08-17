import {
  LayoutDashboard,
  Plane,
  FileText,
  BarChart3,
  Activity,
  Building,
  Car,
  Truck,
  UserCheck,
  CreditCard,
  Ticket,
  Bus,
  Settings,
  Database,
  ClipboardList,
  MapPin,
  Phone,
  Mail,
  Hash
} from 'lucide-react'

export interface NavigationItem {
  id: string
  title: string
  href: string
  icon: any
  description?: string
  children?: NavigationItem[]
  isExternal?: boolean
  badge?: string
  disabled?: boolean
}

export interface NavigationSection {
  id: string
  title: string
  items: NavigationItem[]
}

export const navigationConfig: NavigationSection[] = [
  {
    id: 'main',
    title: 'Main Navigation',
    items: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        href: '/events/[eventId]/dashboard',
        icon: LayoutDashboard,
        description: 'Overview and statistics for the event'
      },
      {
        id: 'aad',
        title: 'AAD',
        href: '/events/[eventId]/aad',
        icon: FileText,
        description: 'AAD management and configuration'
      },
      {
        id: 'flight-schedule',
        title: 'Flight Schedule',
        href: '/events/[eventId]/flight-schedule',
        icon: Plane,
        description: 'Manage flight schedules and timings'
      },
      {
        id: 'transport-reports',
        title: 'Transport Reports',
        href: '/events/[eventId]/transport-reports',
        icon: BarChart3,
        description: 'Transportation analytics and reports'
      },
      {
        id: 'real-time-status',
        title: 'Real-Time Status',
        href: '/events/[eventId]/real-time-status',
        icon: Activity,
        description: 'Live tracking and status updates'
      },
      {
        id: 'vapp',
        title: 'VAPP',
        href: '/events/[eventId]/vapp',
        icon: ClipboardList,
        description: 'Vehicle Assignment and Planning Protocol'
      }
    ]
  },
  {
    id: 'hotel-transportation',
    title: 'Hotel Transportation',
    items: [
      {
        id: 'hotel-transport-operation',
        title: 'Hotel Transport Operation',
        href: '/events/[eventId]/hotel-transportation/operation',
        icon: Building,
        description: 'Manage hotel transportation operations'
      },
      {
        id: 'passengers',
        title: 'Passengers',
        href: '/events/[eventId]/hotel-transportation/passengers',
        icon: UserCheck,
        description: 'Passenger management and tracking'
      }
    ]
  },
  {
    id: 'fleet-management',
    title: 'Fleet Management',
    items: [
      {
        id: 'driver-management',
        title: 'Driver Management',
        href: '/events/[eventId]/fleet-management/drivers',
        icon: UserCheck,
        description: 'Manage drivers and their assignments'
      },
      {
        id: 'fleet-id',
        title: 'Fleet ID',
        href: '/events/[eventId]/fleet-management/fleet-id',
        icon: Hash,
        description: 'Fleet identification and management'
      },
      {
        id: 'fleet-assignment',
        title: 'Fleet Assignment',
        href: '/events/[eventId]/fleet-management/assignment',
        icon: Truck,
        description: 'Assign vehicles to routes and drivers'
      },
      {
        id: 'commissioning',
        title: 'Commissioning & De-commissioning',
        href: '/events/[eventId]/fleet-management/commissioning',
        icon: Settings,
        description: 'Vehicle commissioning and decommissioning'
      },

    ]
  },
  {
    id: 'travel',
    title: 'Travel',
    items: [
      {
        id: 'visa',
        title: 'Visa',
        href: '/events/[eventId]/visa',
        icon: CreditCard,
        description: 'Visa application and management'
      },
      {
        id: 'accommodation',
        title: 'Accommodation',
        href: '/events/[eventId]/accommodation',
        icon: Building,
        description: 'Hotel and accommodation management'
      },
      {
        id: 'air-transfer',
        title: 'Air Transfer',
        href: '/events/[eventId]/air-transfer',
        icon: Plane,
        description: 'Airport transfer services'
      },
      {
        id: 'tickets',
        title: 'Tickets',
        href: '/events/[eventId]/tickets',
        icon: Ticket,
        description: 'Travel ticket management'
      }
    ]
  }
]

// Helper function to get navigation item by ID
export const getNavigationItem = (id: string): NavigationItem | null => {
  for (const section of navigationConfig) {
    const item = section.items.find(item => item.id === id)
    if (item) return item
  }
  return null
}

// Helper function to get navigation item by href
export const getNavigationItemByHref = (href: string): NavigationItem | null => {
  for (const section of navigationConfig) {
    const item = section.items.find(item => item.href === href)
    if (item) return item
  }
  return null
}

// Helper function to get breadcrumbs for a given path
export const getBreadcrumbs = (pathname: string): NavigationItem[] => {
  const breadcrumbs: NavigationItem[] = []
  const pathSegments = pathname.split('/').filter(Boolean)
  
  // Find the event ID segment
  const eventIndex = pathSegments.findIndex(segment => segment === 'events')
  if (eventIndex === -1) return breadcrumbs
  
  // Build breadcrumbs from the path
  for (let i = eventIndex; i < pathSegments.length; i++) {
    const segment = pathSegments[i]
    const item = getNavigationItemByHref(`/${pathSegments.slice(0, i + 1).join('/')}`)
    if (item) {
      breadcrumbs.push(item)
    }
  }
  
  return breadcrumbs
}

// Helper function to check if a route is active
export const isRouteActive = (href: string, currentPath: string): boolean => {
  // Replace [eventId] with actual event ID for comparison
  const normalizedHref = href.replace('[eventId]', '\\d+')
  const regex = new RegExp(`^${normalizedHref}$`)
  return regex.test(currentPath)
}

// Helper function to get all routes for sitemap generation
export const getAllNavigationRoutes = (): string[] => {
  const routes: string[] = []
  
  for (const section of navigationConfig) {
    for (const item of section.items) {
      routes.push(item.href)
    }
  }
  
  return routes
}

// Helper function to get navigation structure for sidebar
export const getSidebarNavigation = () => {
  return navigationConfig.map(section => ({
    ...section,
    items: section.items.map(item => ({
      ...item,
      href: item.href.replace('[eventId]', '1') // Default event ID for sidebar
    }))
  }))
}

// Export individual sections for specific use cases
export const mainNavigation = navigationConfig.find(section => section.id === 'main')?.items || []
export const hotelTransportation = navigationConfig.find(section => section.id === 'hotel-transportation')?.items || []
export const fleetManagement = navigationConfig.find(section => section.id === 'fleet-management')?.items || []
export const travel = navigationConfig.find(section => section.id === 'travel')?.items || []

// Export for use in other components
export default navigationConfig
