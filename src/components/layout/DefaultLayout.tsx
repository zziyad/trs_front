'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { Container } from './Container'

interface DefaultLayoutProps {
  children: React.ReactNode
  eventId?: string
  title?: string
  subtitle?: string
  showBackButton?: boolean
  backUrl?: string
  sidebarItems?: Array<{
    icon: React.ComponentType<{ className?: string }>
    label: string
    active: boolean
    href: string
  }>
  showSidebar?: boolean
  showMenuToggle?: boolean
}

export function DefaultLayout({
  children,
  eventId,
  title,
  subtitle,
  showBackButton = false,
  backUrl,
  sidebarItems,
  showSidebar = true,
  showMenuToggle = true
}: DefaultLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Persist sidebar state in localStorage
  useEffect(() => {
    // On mount, read from localStorage
    const stored = typeof window !== 'undefined' ? localStorage.getItem('sidebarOpen') : null
    if (stored !== null) {
      setSidebarOpen(stored === 'true')
    }
  }, [])

  useEffect(() => {
    // Update localStorage when sidebarOpen changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', sidebarOpen ? 'true' : 'false')
    }
  }, [sidebarOpen])

  const handleMenuToggle = () => {
    setSidebarOpen((prev) => !prev)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar
        title={title}
        subtitle={subtitle}
        showBackButton={showBackButton}
        backUrl={backUrl}
        onMenuToggle={handleMenuToggle}
        showMenuToggle={showMenuToggle}
      />

      <div className="flex relative">
        {/* Sidebar */}
        {showSidebar && eventId && (
          <Sidebar
            eventId={eventId}
            items={sidebarItems}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Page Content */}
            <Container>
              {children}
            </Container>
          </div>
        </div>
      </div>
    </div>
  )
} 