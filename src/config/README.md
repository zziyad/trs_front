# TRS Configuration System

This directory contains centralized configuration files for the TRS (Transportation & Resource System) application. These configurations provide a single source of truth for navigation, routing, and sitemap information.

## 📁 File Structure

```
src/config/
├── index.ts           # Main export file with all configurations
├── navigation.ts      # Navigation structure and sidebar configuration
├── routes.ts          # Route definitions and metadata
├── sitemap.ts         # Sitemap configuration for SEO
└── README.md          # This documentation file
```

## 🚀 Quick Start

```typescript
// Import all configurations
import { navigationConfig, routesConfig, sitemapConfig } from '@/config'

// Or import specific items
import { getNavigationItem, getRouteConfig } from '@/config'

// Or use the main config object
import config from '@/config'
```

## 📋 Configuration Files

### 1. Navigation Configuration (`navigation.ts`)

Defines the hierarchical navigation structure for the sidebar and main navigation.

**Features:**
- Hierarchical navigation with sections and subsections
- Icon assignments for each navigation item
- Descriptions for tooltips and accessibility
- Helper functions for navigation management

**Usage:**
```typescript
import { navigationConfig, getNavigationItem } from '@/config'

// Get all navigation sections
const sections = navigationConfig

// Get specific navigation item
const dashboardItem = getNavigationItem('dashboard')

// Get sidebar navigation with resolved event IDs
import { getSidebarNavigation } from '@/config'
const sidebarNav = getSidebarNavigation()
```

**Structure:**
```typescript
interface NavigationSection {
  id: string
  title: string
  items: NavigationItem[]
}

interface NavigationItem {
  id: string
  title: string
  href: string
  icon: any
  description?: string
  children?: NavigationItem[]
}
```

### 2. Routes Configuration (`routes.ts`)

Defines all application routes with their metadata, components, and configurations.

**Features:**
- Route-to-component mapping
- Page metadata (title, description, icons)
- Breadcrumb structure
- Layout assignments
- Authentication requirements

**Usage:**
```typescript
import { routesConfig, getRouteConfig } from '@/config'

// Get route configuration
const dashboardRoute = getRouteConfig('dashboard')

// Get routes by section
import { getFleetManagementRoutes } from '@/config'
const fleetRoutes = getFleetManagementRoutes()

// Generate dynamic routes
import { generateDynamicRoutes } from '@/config'
const dynamicRoutes = generateDynamicRoutes('event-123')
```

**Structure:**
```typescript
interface RouteConfig {
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
```

### 3. Sitemap Configuration (`sitemap.ts`)

Provides sitemap information for SEO and search engine optimization.

**Features:**
- XML and JSON sitemap generation
- Change frequency and priority settings
- Section-based organization
- Breadcrumb structure generation

**Usage:**
```typescript
import { sitemapConfig, generateXMLSitemap } from '@/config'

// Generate XML sitemap
const xmlSitemap = generateXMLSitemap('https://example.com', 'event-123')

// Get sitemap items by section
import { getSitemapItemsBySection } from '@/config'
const fleetItems = getSitemapItemsBySection('Fleet Management')
```

**Structure:**
```typescript
interface SitemapItem {
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
```

## 🔧 Helper Functions

### Navigation Helpers
- `getNavigationItem(id)` - Get navigation item by ID
- `getNavigationItemByHref(href)` - Get navigation item by URL
- `getBreadcrumbs(pathname)` - Generate breadcrumbs for a path
- `isRouteActive(href, currentPath)` - Check if a route is active
- `getSidebarNavigation()` - Get navigation for sidebar use

### Route Helpers
- `getRouteConfig(path)` - Get route configuration by path
- `getRouteConfigByComponent(componentName)` - Get route by component name
- `getRoutesBySection(section)` - Get all routes in a section
- `generateDynamicRoutes(eventId)` - Generate routes with event ID

### Sitemap Helpers
- `getAllSitemapItems()` - Get all sitemap items
- `getSitemapItemsBySection(sectionName)` - Get items by section
- `generateXMLSitemap(baseUrl, eventId)` - Generate XML sitemap
- `generateJSONSitemap(baseUrl, eventId)` - Generate JSON sitemap

## 📱 Usage Examples

### 1. Sidebar Navigation
```typescript
import { navigationConfig } from '@/config'

function Sidebar() {
  return (
    <nav>
      {navigationConfig.map(section => (
        <div key={section.id}>
          <h3>{section.title}</h3>
          {section.items.map(item => (
            <Link key={item.id} href={item.href}>
              <item.icon />
              {item.title}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  )
}
```

### 2. Breadcrumbs
```typescript
import { getBreadcrumbs } from '@/config'

function Breadcrumbs({ pathname }: { pathname: string }) {
  const breadcrumbs = getBreadcrumbs(pathname)
  
  return (
    <nav>
      {breadcrumbs.map((item, index) => (
        <span key={item.id}>
          {index > 0 && ' > '}
          <Link href={item.href}>{item.title}</Link>
        </span>
      ))}
    </nav>
  )
}
```

### 3. Route Protection
```typescript
import { getRouteConfig } from '@/config'

function ProtectedRoute({ pathname, children }: { pathname: string, children: React.ReactNode }) {
  const routeConfig = getRouteConfig(pathname)
  
  if (routeConfig?.auth && !isAuthenticated) {
    return <Redirect to="/login" />
  }
  
  return <>{children}</>
}
```

### 4. Sitemap Generation
```typescript
import { generateXMLSitemap } from '@/config'

export async function generateStaticParams() {
  const xmlSitemap = generateXMLSitemap('https://example.com', 'event-123')
  
  // Write sitemap to public directory
  await writeFile('./public/sitemap.xml', xmlSitemap)
  
  return []
}
```

## 🎯 Navigation Structure

The navigation follows this hierarchical structure:

```
- Dashboard
- AAD
- Flight Schedule
- Transport Reports
- Real-Time Status
- Hotel Transportation
  - Hotel Transport Operation
  - Passengers
- Fleet Management
  - Driver Management
  - Fleet ID
  - Fleet Assignment
  - Commissioning & De-commissioning
  - VAPP
- Travel
  - Visa
  - Accommodation
  - Air Transfer
  - Tickets
```

## 🔄 Updating Configuration

### Adding New Routes
1. Add the route to `routes.ts`
2. Add navigation item to `navigation.ts`
3. Add sitemap item to `sitemap.ts`
4. Update the main `index.ts` export if needed

### Modifying Existing Routes
1. Update the relevant configuration file
2. The changes will automatically propagate to all components
3. No need to update multiple files manually

## 🚨 Best Practices

1. **Always use the configuration files** instead of hardcoding routes
2. **Use helper functions** for common operations
3. **Keep configurations centralized** - don't duplicate route information
4. **Use TypeScript interfaces** for type safety
5. **Update all related configs** when adding new routes

## 🔍 Troubleshooting

### Common Issues
1. **Route not found**: Check if the route is defined in `routes.ts`
2. **Navigation not showing**: Verify the item is in `navigation.ts`
3. **Sitemap errors**: Ensure all routes have corresponding sitemap entries

### Debug Mode
```typescript
import config from '@/config'
console.log('Full configuration:', config)
console.log('Navigation:', config.navigation)
console.log('Routes:', config.routes)
```

## 📚 Related Documentation

- [LAYOUT_SYSTEM.md](../docs/LAYOUT_SYSTEM.md) - Layout system documentation
- [Sidebar Component](../components/layout/Sidebar.tsx) - Sidebar implementation
- [PageHeader Component](../components/layout/PageHeader.tsx) - Page header component

---

For questions or issues with the configuration system, please refer to the main project documentation or contact the development team.
