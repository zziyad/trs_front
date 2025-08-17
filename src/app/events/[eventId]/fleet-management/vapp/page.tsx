'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/layout'

export default function FleetVAPPage() {
  const params = useParams()
  const eventId = params.eventId as string

  return (
    <div className="space-y-6">
      <PageHeader
        title="VAPP - Vehicle Assignment and Planning Protocol"
        description="Manage vehicle assignment and planning protocol for this event"
      />
    </div>
  )
}
