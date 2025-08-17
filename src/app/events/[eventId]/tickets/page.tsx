'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/layout'

export default function TicketsPage() {
  const params = useParams()
  const eventId = params.eventId as string

  return (
    <div className="space-y-6">
      <PageHeader
        title="Travel Tickets"
        description="Manage travel tickets and bookings for this event"
      />
    </div>
  )
}
