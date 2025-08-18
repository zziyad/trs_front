'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Bus, 
  Plus, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Truck, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Play,
  Calendar
} from 'lucide-react'

interface ShuttleData {
  id: string
  shuttleID: string
  fromLocation: string
  toLocation: string
  departureTime: string
  arrivalTime: string
  driverName: string
  driverContact: string
  vehicleFleet: string
  status: 'Scheduled' | 'In Transit' | 'Completed' | 'Cancelled'
  createdAt: string
}

export default function ShuttleSystemPage() {
  const params = useParams()
  const eventId = params.eventId as string

  const [shuttles, setShuttles] = useState<ShuttleData[]>([])
  const [formData, setFormData] = useState<Omit<ShuttleData, 'id' | 'createdAt'>>({
    shuttleID: '',
    fromLocation: '',
    toLocation: '',
    departureTime: '',
    arrivalTime: '',
    driverName: '',
    driverContact: '',
    vehicleFleet: '',
    status: 'Scheduled'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.shuttleID.trim()) {
      newErrors.shuttleID = 'Shuttle ID is required'
    }
    if (!formData.fromLocation.trim()) {
      newErrors.fromLocation = 'From location is required'
    }
    if (!formData.toLocation.trim()) {
      newErrors.toLocation = 'To location is required'
    }
    if (!formData.departureTime) {
      newErrors.departureTime = 'Departure time is required'
    }
    if (!formData.arrivalTime) {
      newErrors.arrivalTime = 'Arrival time is required'
    }
    if (!formData.driverName.trim()) {
      newErrors.driverName = 'Driver name is required'
    }
    if (!formData.driverContact.trim()) {
      newErrors.driverContact = 'Driver contact is required'
    }
    if (!formData.vehicleFleet.trim()) {
      newErrors.vehicleFleet = 'Vehicle/Fleet number is required'
    }

    // Validate time logic
    if (formData.departureTime && formData.arrivalTime) {
      const departure = new Date(formData.departureTime)
      const arrival = new Date(formData.arrivalTime)
      if (departure >= arrival) {
        newErrors.arrivalTime = 'Arrival time must be after departure time'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const newShuttle: ShuttleData = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toLocaleString()
      }

      setShuttles(prev => [...prev, newShuttle])

      // Log the newly submitted shuttle data to console
      console.log('New Shuttle Data Submitted:', newShuttle)
      console.log('Updated Shuttles List:', [...shuttles, newShuttle])

      // Reset form
      setFormData({
        shuttleID: '',
        fromLocation: '',
        toLocation: '',
        departureTime: '',
        arrivalTime: '',
        driverName: '',
        driverContact: '',
        vehicleFleet: '',
        status: 'Scheduled'
      })

      setErrors({})
      
    } catch (error) {
      console.error('Error submitting shuttle data:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle status updates in the list
  const handleStatusChange = (shuttleId: string, newStatus: ShuttleData['status']) => {
    const updatedShuttles = shuttles.map(shuttle => 
      shuttle.id === shuttleId ? { ...shuttle, status: newStatus } : shuttle
    )
    
    setShuttles(updatedShuttles)
    
    // Log the status update
    const updatedShuttle = updatedShuttles.find(s => s.id === shuttleId)
    console.log('Shuttle Status Updated:', {
      shuttleID: updatedShuttle?.shuttleID,
      oldStatus: shuttles.find(s => s.id === shuttleId)?.status,
      newStatus: newStatus
    })
    console.log('Updated Shuttles List:', updatedShuttles)
  }

  // Get status badge with appropriate styling
  const getStatusBadge = (status: ShuttleData['status']) => {
    switch (status) {
      case 'Scheduled':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />Scheduled</Badge>
      case 'In Transit':
        return <Badge variant="default" className="flex items-center gap-1"><Play className="h-3 w-3" />In Transit</Badge>
      case 'Completed':
        return <Badge variant="outline" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Completed</Badge>
      case 'Cancelled':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get status color for visual feedback
  const getStatusColor = (status: ShuttleData['status']) => {
    switch (status) {
      case 'Scheduled':
        return 'text-blue-600'
      case 'In Transit':
        return 'text-green-600'
      case 'Completed':
        return 'text-gray-600'
      case 'Cancelled':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shuttle System"
        description="Manage shuttle bus operations and routes for this event"
        actions={
          <Button variant="outline" onClick={() => window.location.reload()}>
            <Bus className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      {/* Shuttle Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Shuttle
          </CardTitle>
          <CardDescription>
            Fill in the shuttle details below to create a new shuttle entry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shuttleID">Shuttle ID *</Label>
                <Input
                  id="shuttleID"
                  placeholder="e.g., S001, S002"
                  value={formData.shuttleID}
                  onChange={(e) => handleInputChange('shuttleID', e.target.value)}
                  className={errors.shuttleID ? 'border-red-500' : ''}
                />
                {errors.shuttleID && (
                  <p className="text-sm text-red-500 mt-1">{errors.shuttleID}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="vehicleFleet">Vehicle / Fleet Number *</Label>
                <Input
                  id="vehicleFleet"
                  placeholder="e.g., NP-49-01, ABC-123"
                  value={formData.vehicleFleet}
                  onChange={(e) => handleInputChange('vehicleFleet', e.target.value)}
                  className={errors.vehicleFleet ? 'border-red-500' : ''}
                />
                {errors.vehicleFleet && (
                  <p className="text-sm text-red-500 mt-1">{errors.vehicleFleet}</p>
                )}
              </div>
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromLocation">From Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fromLocation"
                    placeholder="e.g., Baku Airport, Hotel A"
                    value={formData.fromLocation}
                    onChange={(e) => handleInputChange('fromLocation', e.target.value)}
                    className={`pl-10 ${errors.fromLocation ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.fromLocation && (
                  <p className="text-sm text-red-500 mt-1">{errors.fromLocation}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="toLocation">To Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="toLocation"
                    placeholder="e.g., Ganja Hotel, Conference Center"
                    value={formData.toLocation}
                    onChange={(e) => handleInputChange('toLocation', e.target.value)}
                    className={`pl-10 ${errors.toLocation ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.toLocation && (
                  <p className="text-sm text-red-500 mt-1">{errors.toLocation}</p>
                )}
              </div>
            </div>

            {/* Time Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departureTime">Departure Time *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="departureTime"
                    type="datetime-local"
                    value={formData.departureTime}
                    onChange={(e) => handleInputChange('departureTime', e.target.value)}
                    className={`pl-10 ${errors.departureTime ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.departureTime && (
                  <p className="text-sm text-red-500 mt-1">{errors.departureTime}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="arrivalTime">Arrival Time *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="arrivalTime"
                    type="datetime-local"
                    value={formData.arrivalTime}
                    onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                    className={`pl-10 ${errors.arrivalTime ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.arrivalTime && (
                  <p className="text-sm text-red-500 mt-1">{errors.arrivalTime}</p>
                )}
              </div>
            </div>

            {/* Driver Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="driverName">Driver Name & Surname *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="driverName"
                    placeholder="e.g., John Doe, Ahmed Hassan"
                    value={formData.driverName}
                    onChange={(e) => handleInputChange('driverName', e.target.value)}
                    className={`pl-10 ${errors.driverName ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.driverName && (
                  <p className="text-sm text-red-500 mt-1">{errors.driverName}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="driverContact">Driver Contact Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="driverContact"
                    placeholder="e.g., +994501234567"
                    value={formData.driverContact}
                    onChange={(e) => handleInputChange('driverContact', e.target.value)}
                    className={`pl-10 ${errors.driverContact ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.driverContact && (
                  <p className="text-sm text-red-500 mt-1">{errors.driverContact}</p>
                )}
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ShuttleData['status']) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Shuttle
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Shuttles List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bus className="h-5 w-5" />
            All Shuttles ({shuttles.length})
          </CardTitle>
          <CardDescription>
            View and manage all shuttle entries. Click on status to update.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {shuttles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bus className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">No shuttles created yet</p>
              <p className="text-sm">Create your first shuttle using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shuttle ID</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shuttles.map((shuttle) => (
                    <TableRow key={shuttle.id}>
                      <TableCell className="font-medium">{shuttle.shuttleID}</TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">From:</span> {shuttle.fromLocation}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">To:</span> {shuttle.toLocation}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">Depart:</span> {new Date(shuttle.departureTime).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">Arrive:</span> {new Date(shuttle.arrivalTime).toLocaleString()}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <User className="h-3 w-3 text-muted-foreground" />
                            {shuttle.driverName}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {shuttle.driverContact}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Truck className="h-3 w-3 text-muted-foreground" />
                          {shuttle.vehicleFleet}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Select
                          value={shuttle.status}
                          onValueChange={(value: ShuttleData['status']) => 
                            handleStatusChange(shuttle.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="In Transit">In Transit</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      <TableCell className="text-sm text-muted-foreground">
                        {shuttle.createdAt}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">How to Use Shuttle System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. <strong>Create Shuttle:</strong> Fill in all required fields and click "Create Shuttle"</p>
          <p>2. <strong>Required Fields:</strong> All fields marked with * are mandatory</p>
          <p>3. <strong>Time Validation:</strong> Arrival time must be after departure time</p>
          <p>4. <strong>Status Updates:</strong> Click on status dropdown in the list to update shuttle status</p>
          <p>5. <strong>Console Logging:</strong> All shuttle data and status updates are logged to browser console</p>
          <p>6. <strong>Data Persistence:</strong> Shuttle list is maintained during the session</p>
        </CardContent>
      </Card>
    </div>
  )
}
