'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  Truck, 
  MapPin, 
  Edit, 
  Trash2, 
  Eye
} from 'lucide-react'
import { toast } from 'sonner'
import EventFormModal from './EventFormModal'

interface Event {
  id: string
  name: string
  description: string
  guestNumber: number
  venue: string
  fleet: number
  country: string
  hotels: string[]
  destinations: string[]
  vapp: number
  startDate: string
  endDate: string
  status: 'planning' | 'active' | 'completed' | 'cancelled'
  organizer: string
  createdAt: string
  updatedAt: string
}

export default function EventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      name: 'Summer Aviation Conference 2024',
      description: 'Annual aviation industry conference bringing together professionals from across the sector',
      guestNumber: 5000,
      venue: 'International Airport Conference Center',
      fleet: 150,
      country: 'United States',
      hotels: ['Grand Hotel Downtown', 'Luxury Resort', 'Business Center Hotel'],
      destinations: ['International Airport', 'Conference Center', 'Downtown Area'],
      vapp: 5000,
      startDate: '2024-07-15',
      endDate: '2024-07-17',
      status: 'active',
      organizer: 'Sarah Johnson',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Tech Innovation Summit',
      description: 'Technology innovation summit for industry leaders and startups',
      guestNumber: 3000,
      venue: 'Tech Convention Center',
      fleet: 100,
      country: 'United States',
      hotels: ['Tech Hotel', 'Innovation Inn'],
      destinations: ['Tech District', 'Convention Center'],
      vapp: 3000,
      startDate: '2024-08-20',
      endDate: '2024-08-22',
      status: 'planning',
      organizer: 'Mike Davis',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Filter events based on search and status
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Event['status']) => {
    const statusConfig = {
      planning: { variant: 'secondary', label: 'Planning' },
      active: { variant: 'default', label: 'Active' },
      completed: { variant: 'outline', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' }
    }
    
    const config = statusConfig[status]
    return <Badge variant={config.variant as "default" | "secondary" | "destructive" | "outline"}>{config.label}</Badge>
  }

  const handleCreateEvent = (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    
    setEvents(prev => [newEvent, ...prev])
    setIsCreateModalOpen(false)
    toast.success('Event created successfully!')
    
    // Redirect to the newly created event page
    router.push(`/event/${newEvent.id}`)
  }

  const handleEditEvent = (eventData: Event) => {
    setEvents(prev => prev.map(event => 
      event.id === eventData.id 
        ? { ...eventData, updatedAt: new Date().toISOString().split('T')[0] }
        : event
    ))
    setIsEditModalOpen(false)
    setSelectedEvent(null)
    toast.success('Event updated successfully!')
  }

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      setEvents(prev => prev.filter(event => event.id !== eventId))
      toast.success('Event deleted successfully!')
    }
  }

  const openEditModal = (event: Event) => {
    setSelectedEvent(event)
    setIsEditModalOpen(true)
  }

  const viewEvent = (eventId: string) => {
    router.push(`/event/${eventId}`)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Navigation Header */}
      {/* <div className="flex items-center gap-4 mb-6">
        <div className="flex-1" />
        <Button variant="outline" onClick={() => router.push('/data-parser')}>
          Data Parser
        </Button>
      </div> */}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage events with transport coordination
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Event
              </DialogTitle>
              <DialogDescription>
                Fill out the form below to create a new event
              </DialogDescription>
            </DialogHeader>
            <EventFormModal
              mode="create"
              onSubmit={handleCreateEvent}
              onClose={() => setIsCreateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events by name, venue, or organizer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {events.length === 0 ? 'No events created yet. Create your first event above.' : 'No events match your search criteria.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Fleet</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {event.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>{event.endDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            <div>{event.startDate}</div>
                            {/* <div className="text-muted-foreground">to {event.endDate}</div> */}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{event.guestNumber.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span>{event.fleet}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell>{event.organizer}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewEvent(event.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Event Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Event: {selectedEvent?.name}
            </DialogTitle>
            <DialogDescription>
              Update event information and settings
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <EventFormModal
              mode="edit"
              event={selectedEvent}
              onSubmit={(eventData) => {
                const fullEventData: Event = {
                  ...eventData,
                  id: selectedEvent.id,
                  createdAt: selectedEvent.createdAt,
                  updatedAt: new Date().toISOString().split('T')[0]
                }
                handleEditEvent(fullEventData)
              }}
              onClose={() => {
                setIsEditModalOpen(false)
                setSelectedEvent(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
