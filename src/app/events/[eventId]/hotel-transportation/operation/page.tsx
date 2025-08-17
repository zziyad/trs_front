'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/layout'

export default function HotelTransportOperationPage() {
  const params = useParams()
  const eventId = params.eventId as string

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hotel Transport Operation"
        description="Configure and manage hotel transport operations for this event"
      />
    </div>
  )
}
