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
  Building, 
  User, 
  MapPin, 
  Truck, 
  Plus, 
  CheckCircle, 
  Clock,
  Navigation
} from 'lucide-react'

interface TransportOperation {
  id: string
  passenger: string
  from: string
  to: string
  fleetId: string
  status: 'dispatched' | 'arrived'
  createdAt: string
}

export default function HotelTransportOperationPage() {
  const params = useParams()
  const eventId = params.eventId as string

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [operations, setOperations] = useState<TransportOperation[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<Omit<TransportOperation, 'id' | 'createdAt'>>({
    passenger: '',
    from: '',
    to: '',
    fleetId: '',
    status: 'dispatched'
  })

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    if (!formData.passenger.trim() || !formData.from.trim() || !formData.to.trim() || !formData.fleetId.trim()) {
      alert('Please fill in all required fields: Passenger, From, To, and Fleet ID')
      return false
    }
    return true
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const newOperation: TransportOperation = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0]
      }

      // Add to operations list
      const updatedOperations = [newOperation, ...operations]
      setOperations(updatedOperations)

      // Log the complete dataset to console
      console.log('New Transport Operation Created:', newOperation)
      console.log('Updated Transport Operations List:', updatedOperations)

      // Reset form and close
      setFormData({
        passenger: '',
        from: '',
        to: '',
        fleetId: '',
        status: 'dispatched'
      })
      setIsFormOpen(false)

      alert('Transport operation created successfully! Check console for data.')

    } catch (error) {
      console.error('Error creating transport operation:', error)
      alert('Error creating transport operation. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = (operationId: string, newStatus: 'dispatched' | 'arrived') => {
    const updatedOperations = operations.map(op => 
      op.id === operationId ? { ...op, status: newStatus } : op
    )
    setOperations(updatedOperations)
    
    // Log the status change
    console.log('Status Updated for Operation:', operationId, 'New Status:', newStatus)
    console.log('Updated Transport Operations List:', updatedOperations)
  }

  const getStatusBadge = (status: 'dispatched' | 'arrived') => {
    if (status === 'arrived') {
      return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Arrived</Badge>
    }
    return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />Dispatched</Badge>
  }

  const getStatusColor = (status: 'dispatched' | 'arrived') => {
    if (status === 'arrived') return 'text-green-600 bg-green-50'
    return 'text-yellow-600 bg-yellow-50'
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hotel Transport Operation"
        description="Configure and manage hotel transport operations for this event"
        actions={
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Transport Operation
          </Button>
        }
      />

      {/* Transport Operations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Transport Operations List
          </CardTitle>
          <CardDescription>
            View all hotel transport operations and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {operations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Navigation className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">No transport operations yet</p>
              <p className="text-sm">Create your first transport operation to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Passenger</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Fleet ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operations.map((operation) => (
                    <TableRow 
                      key={operation.id}
                      className={getStatusColor(operation.status)}
                    >
                      <TableCell className="font-medium">{operation.passenger}</TableCell>
                      <TableCell>{operation.from}</TableCell>
                      <TableCell>{operation.to}</TableCell>
                      <TableCell>{operation.fleetId}</TableCell>
                      <TableCell>{getStatusBadge(operation.status)}</TableCell>
                      <TableCell>{operation.createdAt}</TableCell>
                      <TableCell>
                        <Select
                          value={operation.status}
                          onValueChange={(value: 'dispatched' | 'arrived') => 
                            handleStatusChange(operation.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dispatched">Dispatched</SelectItem>
                            <SelectItem value="arrived">Arrived</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Transport Operation Form */}
      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Transport Operation
            </CardTitle>
            <CardDescription>
              Fill in the details to create a new hotel transport operation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Passenger */}
                <div className="space-y-2">
                  <Label htmlFor="passenger" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Passenger *
                  </Label>
                  <Input
                    id="passenger"
                    type="text"
                    placeholder="Enter passenger name"
                    value={formData.passenger}
                    onChange={(e) => handleInputChange('passenger', e.target.value)}
                    required
                  />
                </div>

                {/* Fleet ID */}
                <div className="space-y-2">
                  <Label htmlFor="fleetId" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Fleet ID *
                  </Label>
                  <Input
                    id="fleetId"
                    type="text"
                    placeholder="Enter fleet identifier"
                    value={formData.fleetId}
                    onChange={(e) => handleInputChange('fleetId', e.target.value)}
                    required
                  />
                </div>

                {/* From */}
                <div className="space-y-2">
                  <Label htmlFor="from" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    From Hotel or Venue (Origin) *
                  </Label>
                  <Input
                    id="from"
                    type="text"
                    placeholder="Enter origin location"
                    value={formData.from}
                    onChange={(e) => handleInputChange('from', e.target.value)}
                    required
                  />
                </div>

                {/* To */}
                <div className="space-y-2">
                  <Label htmlFor="to" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    To (Destination) *
                  </Label>
                  <Input
                    id="to"
                    type="text"
                    placeholder="Enter destination location"
                    value={formData.to}
                    onChange={(e) => handleInputChange('to', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Status *
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'dispatched' | 'arrived') => 
                    handleInputChange('status', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dispatched">Dispatched</SelectItem>
                    <SelectItem value="arrived">Arrived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Form Actions */}
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Plus className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Transport Operation
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Instructions Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. <strong>View Operations:</strong> See all transport operations in the list above</p>
          <p>2. <strong>Create New:</strong> Click "Create Transport Operation" to add new entries</p>
          <p>3. <strong>Update Status:</strong> Use the dropdown in the Actions column to change status</p>
          <p>4. <strong>Console Logging:</strong> All data is logged to browser console for debugging</p>
          <p>5. <strong>Required Fields:</strong> Passenger, From, To, and Fleet ID are mandatory</p>
        </CardContent>
      </Card>
    </div>
  )
}
