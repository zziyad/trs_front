'use client'

import React from 'react'
import { DefaultLayout } from '@/components/layout/DefaultLayout'

interface EventLayoutClientProps {
  children: React.ReactNode
  eventId: string
}

export default function EventLayoutClient({ children, eventId }: EventLayoutClientProps) {
  return (
    <DefaultLayout
      eventId={eventId}
      title="Event Management"
      subtitle="Transport Reporting System"
      showBackButton={true}
      backUrl="/dashboard"
    >
      {children}
    </DefaultLayout>
  )
} 