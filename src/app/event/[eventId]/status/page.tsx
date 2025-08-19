'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Clock, 
  Building, 
  MapPin, 
  User, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter
} from 'lucide-react'
import { toast } from 'sonner'

interface RealTimeStatus {
  id: number
  vehicle_type: string
  driver_name: string
  location: string
  status: 'dispatched' | 'arrived' | 'en_route'
  destination: string
  estimated_arrival: string
  notes: string
  created_at: string
}

export default function RealTimeStatusPage() {
  const [statuses] = useState<RealTimeStatus[]>([
    {
      id: 1,
      vehicle_type: "Luxury Sedan",
      driver_name: "John Smith",
      location: "Airport Terminal 1",
      status: "dispatched",
      destination: "Grand Hotel Downtown",
      estimated_arrival: "2024-07-15T14:30:00Z",
      notes: "VIP passenger pickup - priority service",
      created_at: "2024-07-15T14:00:00Z"
    },
    {
      id: 2,
      vehicle_type: "Shuttle Bus",
      driver_name: "Sarah Johnson",
      location: "Conference Center",
      status: "arrived",
      destination: "Airport Terminal 2",
      estimated_arrival: "2024-07-15T16:00:00Z",
      notes: "Group transport - 15 passengers",
      created_at: "2024-07-15T15:30:00Z"
    },
    {
      id: 3,
      vehicle_type: "SUV",
      driver_name: "Mike Davis",
      location: "Downtown Office",
      status: "en_route",
      destination: "Airport Terminal 1",
      estimated_arrival: "2024-07-15T17:15:00Z",
      notes: "Executive transport - urgent pickup",
      created_at: "2024-07-15T16:45:00Z"
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<RealTimeStatus | null>(null)

  // Filter statuses based on search term and status
  const filteredStatuses = statuses.filter(status => {
    const matchesSearch = 
      status.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.notes.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || status.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'dispatched':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'arrived':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'en_route':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusCircleColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'dispatched':
        return 'bg-green-500'
      case 'arrived':
        return 'bg-red-500'
      case 'en_route':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCreateStatus = () => {
    setIsCreateDialogOpen(true)
  }

  const handleEditStatus = (status: RealTimeStatus) => {
    setSelectedStatus(status)
    setIsEditDialogOpen(true)
  }

  const handleDeleteStatus = (id: number) => {
    if (confirm('Are you sure you want to delete this status?')) {
      toast.success('Status deleted successfully!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-Time Status</h1>
          <p className="text-muted-foreground">
            Track vehicle status and guest movements in real-time
          </p>
        </div>
        <Button onClick={handleCreateStatus}>
          <Plus className="mr-2 h-4 w-4" />
          Add Status
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search statuses..."
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
            <SelectItem value="dispatched">Dispatched</SelectItem>
            <SelectItem value="en_route">En Route</SelectItem>
            <SelectItem value="arrived">Arrived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status List */}
      <div className="space-y-4">
        {filteredStatuses.map((status) => (
          <Card key={status.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusCircleColor(status.status)}`}></div>
                  <div>
                    <CardTitle className="text-lg">
                      {status.vehicle_type} - {status.driver_name}
                    </CardTitle>
                    <CardDescription>
                      {formatDate(status.created_at)}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(status.status)}>
                    {status.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditStatus(status)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteStatus(status.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Current Location:</span>
                  <span>{status.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Destination:</span>
                  <span>{status.destination}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">ETA:</span>
                  <span>{formatTime(status.estimated_arrival)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Driver:</span>
                  <span>{status.driver_name}</span>
                </div>
              </div>
              {status.notes && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Notes:</span> {status.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Status Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Real-Time Status</DialogTitle>
            <DialogDescription>
              Update vehicle status and location
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="vehicle_type">Vehicle Type</Label>
              <Input id="vehicle_type" placeholder="e.g., Luxury Sedan, Shuttle Bus" />
            </div>
            <div>
              <Label htmlFor="driver_name">Driver Name</Label>
              <Input id="driver_name" placeholder="Enter driver name" />
            </div>
            <div>
              <Label htmlFor="location">Current Location</Label>
              <Input id="location" placeholder="e.g., Airport Terminal 1" />
            </div>
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" placeholder="e.g., Grand Hotel Downtown" />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dispatched">Dispatched</SelectItem>
                  <SelectItem value="en_route">En Route</SelectItem>
                  <SelectItem value="arrived">Arrived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="eta">Estimated Arrival</Label>
              <Input id="eta" type="datetime-local" />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Additional notes..." />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast.success('Status added successfully!')
                setIsCreateDialogOpen(false)
              }}>
                Add Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Real-Time Status</DialogTitle>
            <DialogDescription>
              Update vehicle status and location
            </DialogDescription>
          </DialogHeader>
          {selectedStatus && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_vehicle_type">Vehicle Type</Label>
                <Input id="edit_vehicle_type" defaultValue={selectedStatus.vehicle_type} />
              </div>
              <div>
                <Label htmlFor="edit_driver_name">Driver Name</Label>
                <Input id="edit_driver_name" defaultValue={selectedStatus.driver_name} />
              </div>
              <div>
                <Label htmlFor="edit_location">Current Location</Label>
                <Input id="edit_location" defaultValue={selectedStatus.location} />
              </div>
              <div>
                <Label htmlFor="edit_destination">Destination</Label>
                <Input id="edit_destination" defaultValue={selectedStatus.destination} />
              </div>
              <div>
                <Label htmlFor="edit_status">Status</Label>
                <Select defaultValue={selectedStatus.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dispatched">Dispatched</SelectItem>
                    <SelectItem value="en_route">En Route</SelectItem>
                    <SelectItem value="arrived">Arrived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_eta">Estimated Arrival</Label>
                <Input id="edit_eta" type="datetime-local" defaultValue={selectedStatus.estimated_arrival.slice(0, 16)} />
              </div>
              <div>
                <Label htmlFor="edit_notes">Notes</Label>
                <Textarea id="edit_notes" defaultValue={selectedStatus.notes} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success('Status updated successfully!')
                  setIsEditDialogOpen(false)
                }}>
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 