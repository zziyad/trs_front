'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout'
import { 
  BarChart3, 
  Calendar, 
  FileText, 
  Clock,
  Users,
  Plane,
  Truck,
  Building,
  Bus,
  CheckSquare,
  UserCheck,
  Database,
  ClipboardList,
  Settings,
  CreditCard,
  Bed,
  Ticket
} from 'lucide-react'

export default function SidebarDemoPage() {
  const params = useParams()
  const eventId = params.eventId as string

  const navigationStructure = [
    {
      title: 'Dashboard',
      icon: BarChart3,
      description: 'Shows all listed items with statistical view of specific event',
      href: `/events/${eventId}`,
      color: 'text-blue-600'
    },
    {
      title: 'Flight Schedule',
      icon: Calendar,
      description: 'Manage flight schedules and timings',
      href: `/events/${eventId}/flight-schedules`,
      color: 'text-green-600'
    },
    {
      title: 'Transport Reports',
      icon: FileText,
      description: 'Generate and view transport reports',
      href: `/events/${eventId}/transport-reports`,
      color: 'text-purple-600'
    },
    {
      title: 'Real-Time Status',
      icon: Clock,
      description: 'Monitor real-time status of all operations',
      href: `/events/${eventId}/status`,
      color: 'text-orange-600'
    },
    {
      title: 'Hotel Transportation',
      icon: Building,
      description: 'Manage hotel transportation operations',
      color: 'text-indigo-600',
      subItems: [
        {
          title: 'Hotel Transport Operation',
          icon: Settings,
          description: 'Configure and manage hotel transport operations',
          href: `/events/${eventId}/hotel-transportation/operation`
        },
        {
          title: 'Passengers',
          icon: Users,
          description: 'Manage passenger information and assignments',
          href: `/events/${eventId}/hotel-transportation/passengers`
        }
      ]
    },
    {
      title: 'Fleet Management',
      icon: Truck,
      description: 'Comprehensive fleet management system',
      color: 'text-red-600',
      subItems: [
        {
          title: 'Driver Management',
          icon: UserCheck,
          description: 'Manage driver information, licenses, and assignments',
          href: `/events/${eventId}/fleet-management/drivers`
        },
        {
          title: 'Fleet ID',
          icon: Database,
          description: 'Track and manage fleet identification system',
          href: `/events/${eventId}/fleet-management/fleet-id`
        },
        {
          title: 'Fleet Assignment',
          icon: ClipboardList,
          description: 'Assign vehicles to specific routes and drivers',
          href: `/events/${eventId}/fleet-management/assignment`
        },
        {
          title: 'Commissioning & De-commissioning',
          icon: Settings,
          description: 'Manage vehicle commissioning and decommissioning',
          href: `/events/${eventId}/fleet-management/commissioning`
        },
        {
          title: 'VAPP',
          icon: FileText,
          description: 'Vehicle Assignment and Planning Protocol',
          href: `/events/${eventId}/fleet-management/vapp`
        }
      ]
    },
    {
      title: 'Travel',
      icon: Plane,
      description: 'Manage all travel-related operations',
      color: 'text-teal-600',
      subItems: [
        {
          title: 'Visa',
          icon: CreditCard,
          description: 'Process and manage visa applications',
          href: `/events/${eventId}/visa`
        },
        {
          title: 'Accommodation',
          icon: Bed,
          description: 'Manage guest accommodations and bookings',
          href: `/events/${eventId}/accommodation`
        },
        {
          title: 'Air Transfer',
          icon: Plane,
          description: 'Coordinate air transfer operations',
          href: `/events/${eventId}/air-transfer`
        },
        {
          title: 'Tickets',
          icon: Ticket,
          description: 'Manage travel tickets and bookings',
          href: `/events/${eventId}/tickets`
        }
      ]
    },
    {
      title: 'Shuttle System',
      icon: Bus,
      description: 'Manage shuttle bus operations and routes',
      href: `/events/${eventId}/shuttle-system`,
      color: 'text-yellow-600'
    },
    {
      title: 'Tasks',
      icon: CheckSquare,
      description: 'Manage and track event-related tasks',
      href: `/events/${eventId}/tasks`,
      color: 'text-pink-600'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sidebar Navigation Demo"
        description="This page showcases the new hierarchical sidebar navigation structure with expandable sections and sublinks"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationStructure.map((item, index) => {
          const Icon = item.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100 ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    {item.href && (
                      <CardDescription className="text-sm text-blue-600 hover:underline cursor-pointer">
                        {item.href}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.description}
                </p>
                
                {item.subItems && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700">Sub-sections:</h4>
                    <div className="space-y-2">
                      {item.subItems.map((subItem, subIndex) => {
                        const SubIcon = subItem.icon
                        return (
                          <div key={subIndex} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                            <SubIcon className="h-4 w-4 text-gray-600" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{subItem.title}</div>
                              <div className="text-xs text-gray-500">{subItem.description}</div>
                              {subItem.href && (
                                <div className="text-xs text-blue-600 hover:underline cursor-pointer">
                                  {subItem.href}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Sidebar Features</CardTitle>
          <CardDescription>Key features of the new hierarchical sidebar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">🎯 Main Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Expandable sections with chevron indicators</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Auto-expand based on current page location</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Collapsible sidebar with smooth animations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Mobile-responsive with sheet overlay</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">🔧 Technical Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Built with Radix UI Collapsible components</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>TypeScript interfaces for type safety</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Local storage persistence for collapsed state</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Active state highlighting for current page</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
