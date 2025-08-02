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
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active: boolean
  href: string
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

  // Persist collapsed state in localStorage
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('sidebarCollapsed') : null
    if (stored !== null) {
      setIsCollapsed(stored === 'true')
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', isCollapsed ? 'true' : 'false')
    }
  }, [isCollapsed])

  const defaultItems: SidebarItem[] = [
    { icon: BarChart3, label: 'Dashboard', active: pathname === `/events/${eventId}`, href: `/events/${eventId}` },
    { icon: Calendar, label: 'Flight Schedule', active: pathname === `/events/${eventId}/flight-schedules`, href: `/events/${eventId}/flight-schedules` },
    { icon: FileText, label: 'Transport Reports', active: pathname === `/events/${eventId}/transport-reports`, href: `/events/${eventId}/transport-reports` },
    { icon: Clock, label: 'Real-time Status', active: pathname === `/events/${eventId}/status`, href: `/events/${eventId}/status` },
    { icon: Users, label: 'Passengers', active: pathname === `/events/${eventId}/passengers`, href: `/events/${eventId}/passengers` },
    { icon: FileText, label: 'Documents', active: pathname === `/events/${eventId}/documents`, href: `/events/${eventId}/documents` }
  ]

  const sidebarItems = items || defaultItems

  const handleItemClick = (href: string) => {
    // Only close sidebar on mobile (when isOpen is true)
    if (isOpen) {
      onToggle()
    }
    router.push(href)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Mobile Sidebar using Sheet component
  const MobileSidebar = () => (
    <Sheet open={isOpen} onOpenChange={onToggle}>
      <SheetContent side="left" className="w-64 p-0">
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
      isCollapsed ? "w-16" : "w-64"
    )}>
      <SidebarContent />
    </div>
  )

  // Shared sidebar content
  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center space-x-2">
          <Plane className="h-5 w-5 text-primary" />
          {!isCollapsed && (
            <span className="font-semibold">Event {eventId}</span>
          )}
        </div>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-8 w-8 p-0"
            onClick={toggleCollapse}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-8 w-8 p-0"
            onClick={toggleCollapse}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.href}
              variant={item.active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed ? "px-2" : "px-3"
              )}
              onClick={() => handleItemClick(item.href)}
            >
              <Icon className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          )
        })}
      </nav>
    </>
  )

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  )
} 