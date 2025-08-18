# TRS Frontend Layout System

This document describes the standardized layout system implemented across all pages in the TRS Frontend application.

## Overview

The layout system provides consistent structure, spacing, and styling across all pages while maintaining flexibility for different content types. It consists of several reusable components that can be combined to create standardized pages.

## Core Components

### 1. PageLayout
The base layout wrapper that provides consistent padding, background, and container structure.

```tsx
import { PageLayout } from '@/components/layout'

<PageLayout>
  {/* Page content */}
</PageLayout>
```

**Props:**
- `className`: Additional CSS classes
- `containerClassName`: CSS classes for the container
- `showContainer`: Whether to wrap content in a Container component (default: true)

### 2. PageHeader
Standardized page header with title, description, and optional actions.

```tsx
import { PageHeader } from '@/components/layout'

<PageHeader
  title="Page Title"
  description="Page description"
  actions={<Button>Action</Button>}
/>
```

**Props:**
- `title`: Page title (required)
- `description`: Page description (optional)
- `actions`: Action buttons or controls (optional)
- `className`: Additional CSS classes
- `titleClassName`: CSS classes for the title
- `descriptionClassName`: CSS classes for the description

### 3. StatsGrid
Consistent statistics display grid with configurable columns.

```tsx
import { StatsGrid } from '@/components/layout'

const statsItems = [
  {
    title: 'Total Users',
    value: 150,
    description: 'Active users',
    icon: Users
  }
]

<StatsGrid items={statsItems} gridCols="4" />
```

**Props:**
- `items`: Array of statistics items
- `gridCols`: Number of columns ('2', '3', '4', '5') - default: '4'
- `className`: Additional CSS classes

### 4. SearchAndFilter
Standardized search and filter interface.

```tsx
import { SearchAndFilter } from '@/components/layout'

<SearchAndFilter
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  searchPlaceholder="Search items..."
  filterValue={filterValue}
  onFilterChange={setFilterValue}
  filterOptions={[
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' }
  ]}
  filterPlaceholder="Filter by status"
/>
```

**Props:**
- `searchTerm`: Current search term
- `onSearchChange`: Search term change handler
- `searchPlaceholder`: Search input placeholder
- `filterValue`: Current filter value
- `onFilterChange`: Filter change handler
- `filterOptions`: Array of filter options
- `filterPlaceholder`: Filter dropdown placeholder
- `className`: Additional CSS classes
- `showFilter`: Whether to show the filter dropdown (default: true)

### 5. PageTemplate
Complete page template that combines all components for quick page creation.

```tsx
import { PageTemplate } from '@/components/layout'

<PageTemplate
  title="Users"
  description="Manage system users"
  actions={<Button>Add User</Button>}
  stats={statsItems}
  searchConfig={{
    searchTerm: searchTerm,
    onSearchChange: setSearchTerm,
    searchPlaceholder: "Search users...",
    filterValue: filterValue,
    onFilterChange: setFilterValue,
    filterOptions: filterOptions,
    filterPlaceholder: "Filter by role"
  }}
>
  {/* Page content */}
</PageTemplate>
```

## Page Types and Layouts

### 1. Dashboard Page
- Uses `PageLayout` with `PageHeader`
- Maintains card-heavy design
- Consistent spacing with other pages

```tsx
<PageLayout>
  <PageHeader
    title="Dashboard"
    description="Welcome to your dashboard"
    actions={<Button>Logout</Button>}
  />
  {/* Dashboard cards */}
</PageLayout>
```

### 2. Event Pages
- Use `DefaultLayout` with sidebar navigation
- Content wrapped in standardized components
- Consistent header and stats patterns
- Sidebar navigation is hardcoded in `Sidebar.tsx` component

```tsx
<div className="space-y-6">
  <PageHeader title="Event Name" description="Event description" />
  <StatsGrid items={statsItems} />
  <SearchAndFilter {...searchConfig} />
  {/* Page content */}
</div>
```

### 3. Standalone Pages (Config, Auth)
- Use `PageLayout` without sidebar
- Consistent padding and structure
- Centered content for auth pages

```tsx
<PageLayout showContainer={false}>
  <div className="min-h-screen flex items-center justify-center">
    {/* Centered content */}
  </div>
</PageLayout>
```

### 4. Event Task Management Pages
- Located at `/events/[eventId]/tasks/`
- Use event-specific layout with sidebar navigation
- Include complex functionality like tabs, sorting, and filtering
- Maintain consistent spacing and component patterns
- Tasks are associated with specific events

```tsx
// Event-specific task page structure
<div className="space-y-6">
  <div className="flex justify-between items-center">
    <h1 className="text-3xl font-bold tracking-tight">Event Tasks</h1>
    <p className="text-muted-foreground">
      Manage and organize tasks for this event
    </p>
  </div>
  
  {/* Statistics Grid */}
  <StatsGrid items={taskStats} />
  
  {/* Task management interface with tabs and sorting */}
</div>
```

### 5. Event Application Pages
- Located at `/events/[eventId]/visa/` (or other application types)
- Use event-specific layout with sidebar navigation
- Include complex forms with validation and data management
- Maintain consistent spacing and component patterns
- Applications are associated with specific events
- Can include data lists and management features

```tsx
// Event-specific application page structure
export default function EventVisaPage() {
  const params = useParams()
  const eventId = params.eventId as string
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Visa Applications"
        description="Manage visa applications for this event"
        actions={
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Visa Application
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Visa Application</DialogTitle>
                <DialogDescription>
                  Fill in all required information for the visa application
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form sections with proper spacing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                  {/* Form fields */}
                </div>
                
                {/* Submit and Cancel buttons */}
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Submit Application
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      
      <StatsGrid items={visaStats} />
      
      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Visa Applications</CardTitle>
          <CardDescription>View all submitted applications for this event</CardDescription>
        </CardHeader>
        <CardContent>
          {/* List content */}
        </CardContent>
      </Card>
    </div>
  )
}
```

## Spacing and Layout Rules

### Consistent Spacing
- **Page sections**: `space-y-6` (24px between sections)
- **Card content**: `space-y-4` (16px between card elements)
- **Form elements**: `space-y-2` (8px between form fields)
- **Button groups**: `gap-2` (8px between buttons)

### Responsive Design
- **Mobile**: `p-4` (16px padding)
- **Small screens**: `sm:p-6` (24px padding)
- **Large screens**: `lg:p-8` (32px padding)

### Grid Systems
- **Stats**: Responsive grid with 2-5 columns
- **Content**: Flexible grid layouts using Tailwind's grid system
- **Cards**: Consistent card layouts with hover effects

## Sidebar Navigation System

### How It Works
The sidebar navigation is **hardcoded** directly in the `Sidebar.tsx` component, not in external configuration files. This makes it simple and reliable.

### Navigation Structure
```typescript
// Located in: src/components/layout/Sidebar.tsx
const defaultItems: SidebarItem[] = [
  { 
    icon: BarChart3, 
    label: 'Dashboard', 
    href: `/events/${eventId}`, 
    active: pathname === `/events/${eventId}` 
  },
  // ... more items
]
```

### Adding New Navigation Items
To add a new navigation link:

1. **Add to `defaultItems` array** in `Sidebar.tsx`
2. **Use proper icon** from `lucide-react`
3. **Set correct `href`** with `eventId` parameter
4. **Define `active` state** based on current pathname

### Example: Adding a New Page
```typescript
{
  icon: Settings,
  label: 'Settings',
  href: `/events/${eventId}/settings`,
  active: pathname === `/events/${eventId}/settings`
}
```

### Moving Navigation Items
To move a navigation item:

1. **Cut the item** from its current position in `defaultItems`
2. **Paste it** to the new desired position
3. **Update the `href`** if the path changes
4. **Test navigation** to ensure it works

### Important Notes
- **No external config files** needed
- **All navigation is self-contained** in the sidebar component
- **Changes require code updates** and page refresh
- **Simple and reliable** - no complex configuration system

### Current Navigation Structure
```
Main Navigation:
├── Dashboard
├── AAD
├── Flight Schedule
├── Transport Reports
├── Real-Time Status
├── VAPP
├── Hotel Transportation
│   ├── Hotel Transport Operation
│   └── Passengers
├── Fleet Management
│   ├── Driver Management
│   ├── Fleet ID
│   ├── Fleet Assignment
│   └── Commissioning & De-commissioning
└── Travel
    ├── Visa
    ├── Accommodation
    ├── Air Transfer
    └── Tickets
```

### Navigation Types
- **Main Items**: Direct navigation links (Dashboard, AAD, VAPP, etc.)
- **Collapsible Sections**: Items with sub-navigation (Hotel Transportation, Fleet Management, Travel)
- **Sub Items**: Links within collapsible sections

## Creating New Pages

### Step 1: Choose Layout Type
- **With sidebar**: Use `DefaultLayout` (event pages)
- **Without sidebar**: Use `PageLayout` (standalone pages)
- **Quick setup**: Use `PageTemplate` for standard pages

### Step 2: Add Standard Components
```tsx
// Always include PageHeader
<PageHeader title="Page Title" description="Description" />

// Add stats if applicable
<StatsGrid items={statsItems} />

// Add search/filter if needed
<SearchAndFilter {...searchConfig} />

// Wrap content in consistent spacing
<div className="space-y-6">
  {/* Page content */}
</div>
```

### Step 3: Follow Content Patterns
- Use consistent card layouts
- Implement consistent button styles
- Follow established spacing patterns
- Use standardized dialog patterns

## Best Practices

### 1. Consistency
- Always use `PageHeader` for page titles
- Use `StatsGrid` for statistics display
- Implement consistent search/filter patterns
- Follow established spacing rules

### 2. Responsiveness
- Use responsive grid systems
- Implement mobile-first design
- Test on various screen sizes
- Use consistent breakpoints

### 3. Accessibility
- Maintain proper heading hierarchy
- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation

### 4. Performance
- Lazy load components when possible
- Optimize image loading
- Implement proper loading states
- Use efficient state management

## Examples

### Simple Page
```tsx
import { PageLayout, PageHeader } from '@/components/layout'

export default function SimplePage() {
  return (
    <PageLayout>
      <PageHeader
        title="Simple Page"
        description="A simple page example"
      />
      <div className="space-y-6">
        {/* Page content */}
      </div>
    </PageLayout>
  )
}
```

### Page with Stats and Search
```tsx
import { PageTemplate } from '@/components/layout'

export default function ComplexPage() {
  const stats = [
    { title: 'Total', value: 100, description: 'Items', icon: FileText }
  ]
  
  const searchConfig = {
    searchTerm: searchTerm,
    onSearchChange: setSearchTerm,
    searchPlaceholder: "Search...",
    filterValue: filterValue,
    onFilterChange: setFilterValue,
    filterOptions: [{ value: 'all', label: 'All' }]
  }

  return (
    <PageTemplate
      title="Complex Page"
      description="Page with stats and search"
      stats={stats}
      searchConfig={searchConfig}
    >
      {/* Page content */}
    </PageTemplate>
  )
}
```

### Task Management Page
```tsx
import { PageLayout, PageHeader, StatsGrid } from '@/components/layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus, ArrowUpDown, Calendar, Filter } from 'lucide-react'

export default function TaskManagementPage() {
  const taskStats = [
    { title: 'Total Tasks', value: 45, description: 'All tasks', icon: FileText },
    { title: 'Active', value: 23, description: 'Unresolved', icon: Clock },
    { title: 'Completed', value: 22, description: 'Resolved', icon: CheckCircle },
    { title: 'Urgent', value: 5, description: 'High priority', icon: AlertTriangle }
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Task Management"
        description="Manage and organize your tasks efficiently"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        }
      />
      
      <StatsGrid items={taskStats} />
      
      <div className="space-y-6">
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="priority">Priority</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="own">Own</TabsTrigger>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4">
            {/* Today's active tasks */}
          </TabsContent>
          
          <TabsContent value="priority" className="space-y-4">
            {/* Priority sorted tasks with sort icon */}
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4">
            {/* Date sorted tasks with sort icon */}
          </TabsContent>
          
          <TabsContent value="own" className="space-y-4">
            {/* User's own tasks */}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            {/* All tasks including resolved */}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  )
}
```

## Migration Guide

### From Old Layouts
1. Replace custom header divs with `PageHeader`
2. Replace custom stats grids with `StatsGrid`
3. Replace custom search/filter with `SearchAndFilter`
4. Wrap content in `PageLayout` or use `PageTemplate`
5. Update spacing to use consistent classes

### Benefits
- **Consistency**: All pages follow the same structure
- **Maintainability**: Changes to layout system affect all pages
- **Developer Experience**: Quick setup with reusable components
- **User Experience**: Consistent interface across the application

## Troubleshooting

### Common Issues
1. **Circular imports**: Import components directly, not from index
2. **Missing props**: Check component interfaces for required props
3. **Styling conflicts**: Use consistent CSS classes and avoid custom styles
4. **Responsive issues**: Test on various screen sizes and use responsive classes

### Sidebar Navigation Issues
1. **Navigation not updating**: Check `Sidebar.tsx` `defaultItems` array
2. **Wrong active state**: Verify `pathname` comparison in `active` property
3. **Missing icons**: Import icons from `lucide-react`
4. **Broken links**: Ensure `href` paths are correct and pages exist

### Configuration vs. Sidebar
**Important**: The sidebar navigation is **NOT** connected to the `src/config/` files. These are two separate systems:

- **Sidebar**: Hardcoded in `Sidebar.tsx` - **This is what actually works**
- **Config Files**: External configuration system - **Currently unused**

To change navigation, update the sidebar component directly, not the config files.

### Getting Help
- Check component interfaces for available props
- Review existing page implementations
- Consult this documentation
- Follow established patterns in the codebase
