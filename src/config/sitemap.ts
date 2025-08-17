import { routesConfig } from './routes'
import { navigationConfig } from './navigation'

export interface SitemapItem {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
  title: string
  description: string
  section: string
  subsection?: string
  icon?: string
}

export interface SitemapSection {
  name: string
  items: SitemapItem[]
  description: string
}

export const sitemapConfig: SitemapSection[] = [
  {
    name: 'Main Navigation',
    description: 'Primary application sections',
    items: [
      {
        url: '/events/[eventId]/dashboard',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
        title: 'Dashboard',
        description: 'Overview and statistics for the event',
        section: 'Main Navigation',
        icon: 'LayoutDashboard'
      },
      {
        url: '/events/[eventId]/aad',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
        title: 'AAD',
        description: 'AAD management and configuration',
        section: 'Main Navigation',
        icon: 'FileText'
      },
      {
        url: '/events/[eventId]/flight-schedule',
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.9,
        title: 'Flight Schedule',
        description: 'Manage flight schedules and timings',
        section: 'Main Navigation',
        icon: 'Plane'
      },
      {
        url: '/events/[eventId]/transport-reports',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
        title: 'Transport Reports',
        description: 'Transportation analytics and reports',
        section: 'Main Navigation',
        icon: 'BarChart3'
      },
      {
        url: '/events/[eventId]/real-time-status',
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 0.9,
        title: 'Real-Time Status',
        description: 'Live tracking and status updates',
        section: 'Main Navigation',
        icon: 'Activity'
      }
    ]
  },
  {
    name: 'Hotel Transportation',
    description: 'Hotel transportation management and operations',
    items: [
      {
        url: '/events/[eventId]/hotel-transportation/operation',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
        title: 'Hotel Transport Operation',
        description: 'Manage hotel transportation operations',
        section: 'Hotel Transportation',
        subsection: 'Hotel Transport Operation',
        icon: 'Building'
      },
      {
        url: '/events/[eventId]/hotel-transportation/passengers',
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.9,
        title: 'Passengers',
        description: 'Passenger management and tracking',
        section: 'Hotel Transportation',
        subsection: 'Passengers',
        icon: 'UserCheck'
      }
    ]
  },
  {
    name: 'Fleet Management',
    description: 'Vehicle fleet management and operations',
    items: [
      {
        url: '/events/[eventId]/fleet-management/drivers',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
        title: 'Driver Management',
        description: 'Manage drivers and their assignments',
        section: 'Fleet Management',
        subsection: 'Driver Management',
        icon: 'UserCheck'
      },
      {
        url: '/events/[eventId]/fleet-management/fleet-id',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        title: 'Fleet ID',
        description: 'Fleet identification and management',
        section: 'Fleet Management',
        subsection: 'Fleet ID',
        icon: 'Hash'
      },
      {
        url: '/events/[eventId]/fleet-management/assignment',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
        title: 'Fleet Assignment',
        description: 'Assign vehicles to routes and drivers',
        section: 'Fleet Management',
        subsection: 'Fleet Assignment',
        icon: 'Truck'
      },
      {
        url: '/events/[eventId]/fleet-management/commissioning',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
        title: 'Commissioning & De-commissioning',
        description: 'Vehicle commissioning and decommissioning',
        section: 'Fleet Management',
        subsection: 'Commissioning & De-commissioning',
        icon: 'Settings'
      },
      {
        url: '/events/[eventId]/fleet-management/vapp',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        title: 'VAPP',
        description: 'Vehicle Assignment and Planning Protocol',
        section: 'Fleet Management',
        subsection: 'VAPP',
        icon: 'ClipboardList'
      }
    ]
  },
  {
    name: 'Travel',
    description: 'Travel management and services',
    items: [
      {
        url: '/events/[eventId]/visa',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
        title: 'Visa',
        description: 'Visa application and management',
        section: 'Travel',
        subsection: 'Visa',
        icon: 'CreditCard'
      },
      {
        url: '/events/[eventId]/accommodation',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
        title: 'Accommodation',
        description: 'Hotel and accommodation management',
        section: 'Travel',
        subsection: 'Accommodation',
        icon: 'Building'
      },
      {
        url: '/events/[eventId]/air-transfer',
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.9,
        title: 'Air Transfer',
        description: 'Airport transfer services',
        section: 'Travel',
        subsection: 'Air Transfer',
        icon: 'Plane'
      },
      {
        url: '/events/[eventId]/tickets',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
        title: 'Tickets',
        description: 'Travel ticket management',
        section: 'Travel',
        subsection: 'Tickets',
        icon: 'Ticket'
      }
    ]
  }
]

// Helper function to get all sitemap items
export const getAllSitemapItems = (): SitemapItem[] => {
  return sitemapConfig.flatMap(section => section.items)
}

// Helper function to get sitemap items by section
export const getSitemapItemsBySection = (sectionName: string): SitemapItem[] => {
  const section = sitemapConfig.find(s => s.name === sectionName)
  return section ? section.items : []
}

// Helper function to get sitemap item by URL
export const getSitemapItemByUrl = (url: string): SitemapItem | null => {
  return getAllSitemapItems().find(item => item.url === url) || null
}

// Helper function to generate XML sitemap
export const generateXMLSitemap = (baseUrl: string, eventId: string): string => {
  const items = getAllSitemapItems()
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  
  items.forEach(item => {
    const url = `${baseUrl}${item.url.replace('[eventId]', eventId)}`
    xml += '  <url>\n'
    xml += `    <loc>${url}</loc>\n`
    xml += `    <lastmod>${item.lastModified.toISOString()}</lastmod>\n`
    xml += `    <changefreq>${item.changeFrequency}</changefreq>\n`
    xml += `    <priority>${item.priority}</priority>\n`
    xml += '  </url>\n'
  })
  
  xml += '</urlset>'
  return xml
}

// Helper function to generate JSON sitemap
export const generateJSONSitemap = (baseUrl: string, eventId: string): object => {
  const items = getAllSitemapItems()
  
  return {
    baseUrl,
    eventId,
    lastModified: new Date().toISOString(),
    totalPages: items.length,
    pages: items.map(item => ({
      ...item,
      url: `${baseUrl}${item.url.replace('[eventId]', eventId)}`,
      lastModified: item.lastModified.toISOString()
    }))
  }
}

// Helper function to get navigation structure for breadcrumbs
export const getBreadcrumbStructure = (): Record<string, string[]> => {
  const breadcrumbs: Record<string, string[]> = {}
  
  sitemapConfig.forEach(section => {
    section.items.forEach(item => {
      if (item.subsection) {
        breadcrumbs[item.url] = [item.section, item.subsection]
      } else {
        breadcrumbs[item.url] = [item.section]
      }
    })
  })
  
  return breadcrumbs
}

// Export for use in other components
export default sitemapConfig
