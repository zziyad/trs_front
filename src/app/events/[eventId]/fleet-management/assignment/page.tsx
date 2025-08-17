'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/layout'

export default function FleetAssignmentPage() {
  const params = useParams()
  const eventId = params.eventId as string

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet Assignment"
        description="Assign vehicles to specific routes and drivers for this event"
      />
    </div>
  )
}
