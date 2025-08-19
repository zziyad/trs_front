import EventLayoutClient from './EventLayoutClient'

export default async function EventLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params
  return <EventLayoutClient eventId={eventId}>{children}</EventLayoutClient>
} 