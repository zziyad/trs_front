'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/layout'

export default function AirTransferPage() {
  const params = useParams()
  const eventId = params.eventId as string

  return (
    <div className="space-y-6">
      <PageHeader
        title="Air Transfer"
        description="Coordinate air transfer operations for this event"
      />
    </div>
  )
}
