'use client'

import React from 'react'
import { Navbar } from './Navbar'
import { Container } from './Container'

interface SimpleLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  showBackButton?: boolean
  backUrl?: string
}

export function SimpleLayout({
  children,
  title,
  subtitle,
  showBackButton = false,
  backUrl
}: SimpleLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar
        title={title}
        subtitle={subtitle}
        showBackButton={showBackButton}
        backUrl={backUrl}
        showMenuToggle={false}
      />

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
  )
} 