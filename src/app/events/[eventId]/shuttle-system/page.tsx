'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/layout'

export default function ShuttleSystemPage() {
  const params = useParams()
  const eventId = params.eventId as string

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shuttle System"
        description="Manage shuttle bus operations and routes for this event"
      />
    </div>
  )
}
