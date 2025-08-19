'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { 
  Users, 
  Search, 
  Filter,
  User,
  Building,
  Calendar,
  MapPin,
  Mail,
  CheckCircle,
  Clock,
  XCircle,
  Plane,
  Home,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'

interface Passenger {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  hotel_name: string
  room_number: string
  flight_number: string
  arrival_time: string
  departure_time: string
  status: 'in_house' | 'checked_out' | 'arriving' | 'departing'
  special_requirements: string
  created_at: string
}

export default function PassengersPage() {
  const [passengers] = useState<Passenger[]>([
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      hotel_name: "Grand Hotel Downtown",
      room_number: "1205",
      flight_number: "AA123",
      arrival_time: "2024-07-15T10:30:00Z",
      departure_time: "2024-07-17T16:45:00Z",
      status: "in_house",
      special_requirements: "Wheelchair accessible transport",
      created_at: "2024-07-15T08:00:00Z"
    },
    {
      id: 2,
      first_name: "Sarah",
      last_name: "Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 234-5678",
      hotel_name: "Luxury Resort",
      room_number: "804",
      flight_number: "DL456",
      arrival_time: "2024-07-15T14:15:00Z",
      departure_time: "2024-07-18T12:30:00Z",
      status: "arriving",
      special_requirements: "VIP service required",
      created_at: "2024-07-15T12:00:00Z"
    },
    {
      id: 3,
      first_name: "Mike",
      last_name: "Davis",
      email: "mike.davis@example.com",
      phone: "+1 (555) 345-6789",
      hotel_name: "Business Center Hotel",
      room_number: "1502",
      flight_number: "UA789",
      arrival_time: "2024-07-16T09:00:00Z",
      departure_time: "2024-07-19T18:00:00Z",
      status: "checked_out",
      special_requirements: "Early morning pickup",
      created_at: "2024-07-15T16:30:00Z"
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null)

  // Filter passengers based on search term and status
  const filteredPassengers = passengers.filter(passenger => {
    const matchesSearch = 
      passenger.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.hotel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.flight_number.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || passenger.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_house':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'checked_out':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      case 'arriving':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'departing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_house':
        return <CheckCircle className="h-4 w-4" />
      case 'checked_out':
        return <XCircle className="h-4 w-4" />
      case 'arriving':
        return <Plane className="h-4 w-4" />
      case 'departing':
        return <Clock className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCreatePassenger = () => {
    setIsCreateDialogOpen(true)
  }

  const handleEditPassenger = (passenger: Passenger) => {
    setSelectedPassenger(passenger)
    setIsEditDialogOpen(true)
  }

  const handleDeletePassenger = (id: number) => {
    if (confirm('Are you sure you want to delete this passenger?')) {
      toast.success('Passenger deleted successfully!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Passengers</h1>
          <p className="text-muted-foreground">
            Manage passenger information and transport requirements
          </p>
        </div>
        <Button onClick={handleCreatePassenger}>
          <Plus className="mr-2 h-4 w-4" />
          Add Passenger
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Passengers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passengers.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered passengers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In House</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {passengers.filter(p => p.status === 'in_house').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently staying
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arriving</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {passengers.filter(p => p.status === 'arriving').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Expected arrivals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {passengers.filter(p => p.status === 'departing').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Scheduled departures
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search passengers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in_house">In House</SelectItem>
            <SelectItem value="arriving">Arriving</SelectItem>
            <SelectItem value="departing">Departing</SelectItem>
            <SelectItem value="checked_out">Checked Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Passengers List */}
      <div className="space-y-4">
        {filteredPassengers.map((passenger) => (
          <Card key={passenger.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {passenger.first_name} {passenger.last_name}
                    </CardTitle>
                    <CardDescription>
                      {passenger.email} • {passenger.phone}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(passenger.status)}>
                    {getStatusIcon(passenger.status)}
                    <span className="ml-1">{passenger.status.replace('_', ' ').toUpperCase()}</span>
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditPassenger(passenger)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePassenger(passenger.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Hotel:</span>
                  <span>{passenger.hotel_name} - Room {passenger.room_number}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Plane className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Flight:</span>
                  <span>{passenger.flight_number}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Arrival:</span>
                  <span>{formatDate(passenger.arrival_time)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Departure:</span>
                  <span>{formatDate(passenger.departure_time)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Location:</span>
                  <span>{passenger.hotel_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Contact:</span>
                  <span>{passenger.email}</span>
                </div>
              </div>
              {passenger.special_requirements && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Special Requirements:</span> {passenger.special_requirements}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Passenger Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Passenger</DialogTitle>
            <DialogDescription>
              Add a new passenger to the event
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" placeholder="Enter first name" />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" placeholder="Enter last name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hotel_name">Hotel Name</Label>
                <Input id="hotel_name" placeholder="Enter hotel name" />
              </div>
              <div>
                <Label htmlFor="room_number">Room Number</Label>
                <Input id="room_number" placeholder="Enter room number" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="flight_number">Flight Number</Label>
                <Input id="flight_number" placeholder="Enter flight number" />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arriving">Arriving</SelectItem>
                    <SelectItem value="in_house">In House</SelectItem>
                    <SelectItem value="departing">Departing</SelectItem>
                    <SelectItem value="checked_out">Checked Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="arrival_time">Arrival Time</Label>
                <Input id="arrival_time" type="datetime-local" />
              </div>
              <div>
                <Label htmlFor="departure_time">Departure Time</Label>
                <Input id="departure_time" type="datetime-local" />
              </div>
            </div>
            <div>
              <Label htmlFor="special_requirements">Special Requirements</Label>
              <Input id="special_requirements" placeholder="Any special requirements..." />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast.success('Passenger added successfully!')
                setIsCreateDialogOpen(false)
              }}>
                Add Passenger
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Passenger Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Passenger</DialogTitle>
            <DialogDescription>
              Update passenger information
            </DialogDescription>
          </DialogHeader>
          {selectedPassenger && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_first_name">First Name</Label>
                  <Input id="edit_first_name" defaultValue={selectedPassenger.first_name} />
                </div>
                <div>
                  <Label htmlFor="edit_last_name">Last Name</Label>
                  <Input id="edit_last_name" defaultValue={selectedPassenger.last_name} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_email">Email</Label>
                  <Input id="edit_email" type="email" defaultValue={selectedPassenger.email} />
                </div>
                <div>
                  <Label htmlFor="edit_phone">Phone</Label>
                  <Input id="edit_phone" defaultValue={selectedPassenger.phone} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_hotel_name">Hotel Name</Label>
                  <Input id="edit_hotel_name" defaultValue={selectedPassenger.hotel_name} />
                </div>
                <div>
                  <Label htmlFor="edit_room_number">Room Number</Label>
                  <Input id="edit_room_number" defaultValue={selectedPassenger.room_number} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_flight_number">Flight Number</Label>
                  <Input id="edit_flight_number" defaultValue={selectedPassenger.flight_number} />
                </div>
                <div>
                  <Label htmlFor="edit_status">Status</Label>
                  <Select defaultValue={selectedPassenger.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="arriving">Arriving</SelectItem>
                      <SelectItem value="in_house">In House</SelectItem>
                      <SelectItem value="departing">Departing</SelectItem>
                      <SelectItem value="checked_out">Checked Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_arrival_time">Arrival Time</Label>
                  <Input id="edit_arrival_time" type="datetime-local" defaultValue={selectedPassenger.arrival_time.slice(0, 16)} />
                </div>
                <div>
                  <Label htmlFor="edit_departure_time">Departure Time</Label>
                  <Input id="edit_departure_time" type="datetime-local" defaultValue={selectedPassenger.departure_time.slice(0, 16)} />
                </div>
              </div>
              <div>
                <Label htmlFor="edit_special_requirements">Special Requirements</Label>
                <Input id="edit_special_requirements" defaultValue={selectedPassenger.special_requirements} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success('Passenger updated successfully!')
                  setIsEditDialogOpen(false)
                }}>
                  Update Passenger
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 