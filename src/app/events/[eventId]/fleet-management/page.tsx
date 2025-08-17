'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/layout'

export default function EventFleetManagementPage() {
  const params = useParams()
  const eventId = params.eventId as string

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Fleet Management"
        description="Manage fleet vehicles, drivers, and transportation for this event"
      />
    </div>
  )
}
