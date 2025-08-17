'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Calendar, 
  FileText, 
  Clock,
  Users,
  Plane,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Bed,
  Truck,
  Car,
  UserCheck,
  Building,
  CreditCard,
  Ticket,
  Bus,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Settings,
  Database,
  ClipboardList,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface SidebarSubItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  active: boolean
}

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href?: string
  active: boolean
  subItems?: SidebarSubItem[]
  isExpanded?: boolean
}

interface SidebarProps {
  eventId: string
  items?: SidebarItem[]
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ eventId, items, isOpen, onToggle }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydration-safe localStorage handling
  useEffect(() => {
    setIsHydrated(true)
    const stored = localStorage.getItem('sidebarCollapsed')
    if (stored !== null) {
      setIsCollapsed(stored === 'true')
    }
  }, [])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('sidebarCollapsed', isCollapsed ? 'true' : 'false')
    }
  }, [isCollapsed, isHydrated])

  // Auto-expand sections based on current path
  useEffect(() => {
    if (!isHydrated) return // Don't run until hydrated
    
    setExpandedSections(prev => {
      const newExpanded = new Set(prev)
      
      // Check which sections should be expanded based on current path
      if (pathname.includes('/fleet-management')) {
        newExpanded.add('Fleet Management')
      }
      if (pathname.includes('/visa') || pathname.includes('/accommodation') || pathname.includes('/air-transfer') || pathname.includes('/tickets')) {
        newExpanded.add('Travel')
      }
      if (pathname.includes('/hotel-transportation')) {
        newExpanded.add('Hotel Transportation')
      }
      // Note: VAPP is now a main navigation item, not a sublink
      
      return newExpanded
    })
  }, [pathname, isHydrated])

  const defaultItems: SidebarItem[] = [
    { 
      icon: BarChart3, 
      label: 'Dashboard', 
      href: `/events/${eventId}`, 
      active: pathname === `/events/${eventId}` 
    },
    { 
      icon: Calendar, 
      label: 'Flight Schedule', 
      href: `/events/${eventId}/flight-schedules`, 
      active: pathname === `/events/${eventId}/flight-schedules` 
    },
    { 
      icon: FileText, 
      label: 'Transport Reports', 
      href: `/events/${eventId}/transport-reports`, 
      active: pathname === `/events/${eventId}/transport-reports` 
    },
        {
      icon: Clock,
      label: 'Real-Time Status',
      href: `/events/${eventId}/status`,
      active: pathname === `/events/${eventId}/status`
    },
    {
      icon: ClipboardList,
      label: 'VAPP',
      href: `/events/${eventId}/vapp`,
      active: pathname === `/events/${eventId}/vapp`
    },
    { 
      icon: Building, 
      label: 'Hotel Transportation', 
      active: pathname.includes('/hotel-transportation'),
      isExpanded: expandedSections.has('hotel-transportation'),
      subItems: [
        { 
          icon: Settings, 
          label: 'Hotel Transport Operation', 
          href: `/events/${eventId}/hotel-transportation/operation`, 
          active: pathname === `/events/${eventId}/hotel-transportation/operation` 
        },
        { 
          icon: Users, 
          label: 'Passengers', 
          href: `/events/${eventId}/hotel-transportation/passengers`, 
          active: pathname === `/events/${eventId}/hotel-transportation/passengers` 
        }
      ]
    },
    { 
      icon: Truck, 
      label: 'Fleet Management', 
      active: pathname.includes('/fleet-management'),
      isExpanded: expandedSections.has('fleet-management'),
      subItems: [
        { 
          icon: UserCheck, 
          label: 'Driver Management', 
          href: `/events/${eventId}/fleet-management/drivers`, 
          active: pathname === `/events/${eventId}/fleet-management/drivers` 
        },
        { 
          icon: Database, 
          label: 'Fleet ID', 
          href: `/events/${eventId}/fleet-management/fleet-id`, 
          active: pathname === `/events/${eventId}/fleet-management/fleet-id` 
        },
        { 
          icon: ClipboardList, 
          label: 'Fleet Assignment', 
          href: `/events/${eventId}/fleet-management/assignment`, 
          active: pathname === `/events/${eventId}/fleet-management/assignment` 
        },
        { 
          icon: Settings, 
          label: 'Commissioning & De-commissioning', 
          href: `/events/${eventId}/fleet-management/commissioning`, 
          active: pathname === `/events/${eventId}/fleet-management/commissioning` 
        },
        
      ]
    },
    { 
      icon: Plane, 
      label: 'Travel', 
      active: pathname.includes('/travel') || pathname.includes('/visa') || pathname.includes('/accommodation') || pathname.includes('/air-transfer') || pathname.includes('/tickets'),
      isExpanded: expandedSections.has('travel'),
      subItems: [
        { 
          icon: CreditCard, 
          label: 'Visa', 
          href: `/events/${eventId}/visa`, 
          active: pathname === `/events/${eventId}/visa` 
        },
        { 
          icon: Bed, 
          label: 'Accommodation', 
          href: `/events/${eventId}/accommodation`, 
          active: pathname === `/events/${eventId}/accommodation` 
        },
        { 
          icon: Plane, 
          label: 'Air Transfer', 
          href: `/events/${eventId}/air-transfer`, 
          active: pathname === `/events/${eventId}/air-transfer` 
        },
        { 
          icon: Ticket, 
          label: 'Tickets', 
          href: `/events/${eventId}/tickets`, 
          active: pathname === `/events/${eventId}/tickets` 
        }
      ]
    },
    { 
      icon: Bus, 
      label: 'Shuttle System', 
      href: `/events/${eventId}/shuttle-system`, 
      active: pathname === `/events/${eventId}/shuttle-system` 
    },
    { 
      icon: CheckSquare, 
      label: 'Tasks', 
      href: `/events/${eventId}/tasks`, 
      active: pathname === `/events/${eventId}/tasks` 
    }
  ]

  const sidebarItems = items || defaultItems

  const handleItemClick = (href: string) => {
    // Only close sidebar on mobile (when isOpen is true)
    if (isOpen) {
      onToggle()
    }
    
    // Ensure the parent section stays open when navigating to sublinks
    setExpandedSections(prev => {
      const newExpanded = new Set(prev)
      
      if (href.includes('/hotel-transportation')) {
        newExpanded.add('Hotel Transportation')
      } else if (href.includes('/fleet-management')) {
        newExpanded.add('Fleet Management')
      } else if (href.includes('/visa') || href.includes('/accommodation') || href.includes('/air-transfer') || href.includes('/tickets')) {
        newExpanded.add('Travel')
      }
      
      return newExpanded
    })
    
    router.push(href)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleSection = (sectionLabel: string) => {
    const newExpanded = new Set(expandedSections)
    
    // Allow manual toggle of sections
    if (newExpanded.has(sectionLabel)) {
      newExpanded.delete(sectionLabel)
    } else {
      newExpanded.add(sectionLabel)
    }
    
    setExpandedSections(newExpanded)
  }

  // Function to check if a section should stay open based on current path
  const shouldSectionStayOpen = (sectionLabel: string): boolean => {
    switch (sectionLabel) {
      case 'Hotel Transportation':
        return pathname.includes('/hotel-transportation')
      case 'Fleet Management':
        return pathname.includes('/fleet-management')
      case 'Travel':
        return pathname.includes('/visa') || pathname.includes('/accommodation') || pathname.includes('/air-transfer') || pathname.includes('/tickets')
      default:
        return false
    }
  }

  // Mobile Sidebar using Sheet component
  const MobileSidebar = () => (
    <Sheet open={isOpen} onOpenChange={onToggle}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        <SidebarContent />
      </SheetContent>
    </Sheet>
  )

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className={cn(
      "hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-80"
    )}>
      <SidebarContent />
    </div>
  )

  // Shared sidebar content
  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex h-14 items-center border-b px-4">
        {/* Collapse Button - Left Side */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 mr-2"
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        
        {/* Event Title and Icon */}
        <div className="flex items-center space-x-2">
          {!isCollapsed && (
            <>
              <Plane className="h-5 w-5 text-primary" />
              <span className="font-semibold">Event {eventId}</span>
            </>
          )}
          {isCollapsed && (
            <div className="flex items-center justify-center w-8 h-8" title={`Event ${eventId}`}>
              {/* Icon hidden when collapsed - just empty space */}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          
          // If item has subItems, render as collapsible section
          if (item.subItems && !isCollapsed) {
            const isExpanded = expandedSections.has(item.label)
            const isAutoExpanded = shouldSectionStayOpen(item.label)
            
            return (
              <Collapsible
                key={item.label}
                open={isExpanded}
                onOpenChange={() => toggleSection(item.label)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={item.active ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-between px-3 h-10",
                      isAutoExpanded && isExpanded && "bg-muted/50"
                    )}
                    title={isAutoExpanded && isExpanded ? "Section automatically expanded - click to manually close" : "Click to expand/collapse section"}
                  >
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-2" />
                      <span>{item.label}</span>
                      {isAutoExpanded && isExpanded && (
                        <span className="ml-2 text-xs text-muted-foreground">(auto)</span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="space-y-1">
                  <div className="ml-6 space-y-1">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon
                      return (
                        <Button
                          key={subItem.href}
                          variant={subItem.active ? "secondary" : "ghost"}
                          className="w-full justify-start px-3 h-9 text-sm"
                          onClick={() => handleItemClick(subItem.href)}
                        >
                          <SubIcon className="h-4 w-4 mr-2" />
                          <span>{subItem.label}</span>
                        </Button>
                      )
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          }
          
          // If item has subItems but sidebar is collapsed, show main item only
          if (item.subItems && isCollapsed) {
            return (
              <Button
                key={item.label}
                variant={item.active ? "secondary" : "ghost"}
                className="w-full justify-start px-2 h-10"
                onClick={() => toggleSection(item.label)}
                title={item.label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            )
          }
          
          // Regular item without subItems
          return (
            <Button
              key={item.href || item.label}
              variant={item.active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed ? "px-2" : "px-3"
              )}
              onClick={() => item.href && handleItemClick(item.href)}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          )
        })}
      </nav>
    </>
  )

  // Don't render until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="hidden lg:block">
        <div className="w-64 h-screen bg-background border-r animate-pulse">
          <div className="p-4">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  )
} 