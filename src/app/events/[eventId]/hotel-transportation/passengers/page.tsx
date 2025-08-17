'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/layout'

export default function HotelTransportPassengersPage() {
  const params = useParams()
  const eventId = params.eventId as string

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hotel Transport Passengers"
        description="Manage passenger information and assignments for hotel transportation"
      />
    </div>
  )
}
