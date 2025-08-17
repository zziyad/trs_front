'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/layout'

export default function FleetDriversPage() {
  const params = useParams()
  const eventId = params.eventId as string

  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver Management"
        description="Manage driver information, licenses, and assignments for this event"
      />
    </div>
  )
}
