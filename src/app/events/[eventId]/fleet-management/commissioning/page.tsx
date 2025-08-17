'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/layout'

export default function FleetCommissioningPage() {
  const params = useParams()
  const eventId = params.eventId as string

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commissioning & De-commissioning"
        description="Manage vehicle commissioning and decommissioning for this event"
      />
    </div>
  )
}
