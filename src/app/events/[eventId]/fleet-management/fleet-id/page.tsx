'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PageHeader, StatsGrid, SearchAndFilter } from '@/components/layout'
import { Truck, Plus, User, Hash, Tag } from 'lucide-react'
import { toast } from 'sonner'

interface Fleet {
  id: string
  eventId: string
  fleetId: string
  plateNumber: string
  driverName: string
  driverMobile: string
  label: string
  description: string
  status: 'active' | 'inactive' | 'maintenance'
  location: string
  lastUpdated: string
  createdAt: string
}

export default function FleetIDPage() {
  const params = useParams()
  const eventId = params.eventId as string
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFleet, setSelectedFleet] = useState<Fleet | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterValue, setFilterValue] = useState('all')
  
  const [formData, setFormData] = useState<Omit<Fleet, 'id' | 'eventId' | 'lastUpdated' | 'createdAt'>>({
    fleetId: '',
    plateNumber: '',
    driverName: '',
    driverMobile: '',
    label: '',
    description: '',
    status: 'active',
    location: ''
  })

  const [fleets, setFleets] = useState<Fleet[]>([
    {
      id: '1',
      eventId: eventId,
      fleetId: 'FLT-001',
      plateNumber: 'ABC-123',
      driverName: 'John Smith',
      driverMobile: '+1234567890',
      label: 'Main Transport Fleet',
      description: 'Primary fleet for event transportation',
      status: 'active',
      location: 'New York',
      lastUpdated: '2025-01-15T10:00:00Z',
      createdAt: '2025-01-01T09:00:00Z'
    },
    {
      id: '2',
      eventId: eventId,
      fleetId: 'FLT-002',
      plateNumber: 'XYZ-789',
      driverName: 'Sarah Johnson',
      driverMobile: '+1987654321',
      label: 'VIP Transport',
      description: 'Luxury vehicles for VIP guests',
      status: 'active',
      location: 'Los Angeles',
      lastUpdated: '2025-01-14T15:30:00Z',
      createdAt: '2025-01-02T11:00:00Z'
    },
    {
      id: '3',
      eventId: eventId,
      fleetId: 'FLT-003',
      plateNumber: 'DEF-456',
      driverName: 'Mike Wilson',
      driverMobile: '+1555123456',
      label: 'Equipment Transport',
      description: 'Heavy vehicles for equipment and materials',
      status: 'maintenance',
      location: 'Chicago',
      lastUpdated: '2025-01-13T08:15:00Z',
      createdAt: '2025-01-03T14:00:00Z'
    },
    {
      id: '4',
      eventId: eventId,
      fleetId: 'FLT-004',
      plateNumber: 'GHI-789',
      driverName: 'Lisa Brown',
      driverMobile: '+1444333222',
      label: 'Staff Shuttle',
      description: 'Shuttle service for event staff',
      status: 'active',
      location: 'Miami',
      lastUpdated: '2025-01-12T16:45:00Z',
      createdAt: '2025-01-04T10:30:00Z'
    }
  ])

  // Calculate statistics
  const totalFleets = fleets.length
  const activeFleets = fleets.filter(fleet => fleet.status === 'active').length
  const maintenanceFleets = fleets.filter(fleet => fleet.status === 'maintenance').length
  const inactiveFleets = fleets.filter(fleet => fleet.status === 'inactive').length

  const fleetStats = [
    {
      title: 'Total Fleets',
      value: totalFleets,
      description: 'All fleet vehicles',
      icon: Truck
    },
    {
      title: 'Active',
      value: activeFleets,
      description: 'Operational vehicles',
      icon: Truck
    },
    {
      title: 'Maintenance',
      value: maintenanceFleets,
      description: 'Under repair',
      icon: Truck
    },
    {
      title: 'Inactive',
      value: inactiveFleets,
      description: 'Out of service',
      icon: Truck
    }
  ]

  const filterOptions = [
    { value: 'all', label: 'All Fleets' },
    { value: 'active', label: 'Active Only' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'inactive', label: 'Inactive Only' }
  ]

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = ['fleetId', 'plateNumber', 'driverName', 'driverMobile', 'label']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }

    // Check if fleet ID already exists
    if (fleets.some(fleet => fleet.fleetId === formData.fleetId)) {
      toast.error('Fleet ID already exists. Please use a unique ID.')
      return
    }

    // Create new fleet
    const newFleet: Fleet = {
      id: Date.now().toString(),
      eventId: eventId,
      ...formData,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }

    // Add to list
    setFleets(prev => [newFleet, ...prev])

    // Log to console as required
    console.log('New Fleet Created:', newFleet)

    // Show success message
    toast.success('Fleet created successfully!')

    // Clear form and close modal
    setFormData({
      fleetId: '',
      plateNumber: '',
      driverName: '',
      driverMobile: '',
      label: '',
      description: '',
      status: 'active',
      location: ''
    })
    
    setIsModalOpen(false)
  }

  const handleFleetClick = (fleet: Fleet) => {
    setSelectedFleet(fleet)
    
    // Log clicked fleet data to console as required
    console.log('Fleet Selected:', fleet)
    
    toast.success(`Fleet ${fleet.fleetId} selected`)
  }

  // Filter and search fleets
  const filteredFleets = fleets.filter(fleet => {
    const matchesSearch = fleet.fleetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fleet.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fleet.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fleet.label.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterValue === 'all' || fleet.status === filterValue
    
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Truck className="h-4 w-4 text-green-600" />
      case 'maintenance':
        return <Truck className="h-4 w-4 text-yellow-600" />
      case 'inactive':
        return <Truck className="h-4 w-4 text-red-600" />
      default:
        return <Truck className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet ID Management"
        description="Track and manage fleet identification system for this event"
        actions={
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Fleet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Fleet</DialogTitle>
                <DialogDescription>
                  Fill in all required information for the new fleet
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Fleet Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Fleet Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fleetId">Fleet ID *</Label>
                      <Input
                        id="fleetId"
                        value={formData.fleetId}
                        onChange={(e) => handleInputChange('fleetId', e.target.value)}
                        placeholder="e.g., FLT-001"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="plateNumber">Plate Number *</Label>
                      <Input
                        id="plateNumber"
                        value={formData.plateNumber}
                        onChange={(e) => handleInputChange('plateNumber', e.target.value)}
                        placeholder="e.g., ABC-123"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="label">Label *</Label>
                    <Input
                      id="label"
                      value={formData.label}
                      onChange={(e) => handleInputChange('label', e.target.value)}
                      placeholder="e.g., Main Transport Fleet"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Brief description of the fleet's purpose"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Driver Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Driver Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="driverName">Driver Name *</Label>
                      <Input
                        id="driverName"
                        value={formData.driverName}
                        onChange={(e) => handleInputChange('driverName', e.target.value)}
                        placeholder="Driver's full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="driverMobile">Driver Mobile *</Label>
                      <Input
                        id="driverMobile"
                        value={formData.driverMobile}
                        onChange={(e) => handleInputChange('driverMobile', e.target.value)}
                        placeholder="+1234567890"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Status and Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Status & Location</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Current location"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Create Fleet
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      
      <StatsGrid items={fleetStats} />
      
      {/* Search and Filter */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search fleets by ID, plate number, driver, or label..."
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        filterOptions={filterOptions}
        filterPlaceholder="Filter by status"
      />
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Fleet List */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet List</CardTitle>
            <CardDescription>Click on a fleet to view details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredFleets.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No fleets found matching your criteria.
                </p>
              ) : (
                filteredFleets.map((fleet) => (
                  <div
                    key={fleet.id}
                    onClick={() => handleFleetClick(fleet)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-primary ${
                      selectedFleet?.id === fleet.id ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-lg">{fleet.fleetId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(fleet.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fleet.status)}`}>
                          {fleet.status.charAt(0).toUpperCase() + fleet.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{fleet.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-3 w-3 text-muted-foreground" />
                        <span>{fleet.plateNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span>{fleet.driverName}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fleet Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Dashboard</CardTitle>
            <CardDescription>
              {selectedFleet ? `Details for ${selectedFleet.fleetId}` : 'Select a fleet to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedFleet ? (
              <div className="space-y-4">
                {/* Fleet ID and Status */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="text-2xl font-bold text-primary">{selectedFleet.fleetId}</div>
                    <div className="text-sm text-muted-foreground">{selectedFleet.label}</div>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedFleet.status)}`}>
                      {selectedFleet.status.charAt(0).toUpperCase() + selectedFleet.status.slice(1)}
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg border-b pb-2">Vehicle Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Plate Number:</span>
                      <div className="text-muted-foreground">{selectedFleet.plateNumber}</div>
                    </div>
                    <div>
                      <span className="font-medium">Location:</span>
                      <div className="text-muted-foreground">{selectedFleet.location || 'Not specified'}</div>
                    </div>
                  </div>
                </div>

                {/* Driver Information */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg border-b pb-2">Driver Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Driver Name:</span>
                      <div className="text-muted-foreground">{selectedFleet.driverName}</div>
                    </div>
                    <div>
                      <span className="font-medium">Mobile:</span>
                      <div className="text-muted-foreground">{selectedFleet.driverMobile}</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedFleet.description && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg border-b pb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedFleet.description}</p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg border-b pb-2">Timestamps</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Created:</span>
                      <div className="text-muted-foreground">{formatDate(selectedFleet.createdAt)}</div>
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>
                      <div className="text-muted-foreground">{formatDate(selectedFleet.lastUpdated)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a fleet from the list to view detailed information</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
