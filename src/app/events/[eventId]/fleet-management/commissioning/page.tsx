'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Calendar, Truck, FileText, Plus, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface FleetCommissioning {
  id: string
  fleetId: string
  vap: string | null
  startDate: string
  endDate: string
  plateNumber: string
  driver: string
  label: string
  status: 'active' | 'pending' | 'decommissioned'
  isDecommissioned: boolean
}

export default function FleetCommissioningPage() {
  const params = useParams()
  const eventId = params.eventId as string

  const [fleetData, setFleetData] = useState<FleetCommissioning>({
    id: '',
    fleetId: '',
    vap: null,
    startDate: '',
    endDate: '',
    plateNumber: '',
    driver: '',
    label: '',
    status: 'active',
    isDecommissioned: false
  })

  const [fleetList, setFleetList] = useState<FleetCommissioning[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-update status based on dates
  useEffect(() => {
    const updateFleetStatuses = () => {
      setFleetList(prev => prev.map(fleet => {
        const today = new Date()
        const endDate = new Date(fleet.endDate)
        const startDate = new Date(fleet.startDate)

        let newStatus: FleetCommissioning['status'] = 'active'
        let isDecommissioned = false

        if (today >= endDate) {
          newStatus = 'decommissioned'
          isDecommissioned = true
        } else if (today >= startDate && today < endDate) {
          newStatus = 'pending'
        }

        return { ...fleet, status: newStatus, isDecommissioned }
      }))
    }

    updateFleetStatuses()
    const interval = setInterval(updateFleetStatuses, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const handleInputChange = (field: keyof FleetCommissioning, value: string) => {
    setFleetData(prev => ({ ...prev, [field]: value }))
  }

  const handleVAPChange = (value: string) => {
    setFleetData(prev => ({ 
      ...prev, 
      vap: value.trim() === '' ? null : value.trim() 
    }))
  }

  const validateForm = (): boolean => {
    if (!fleetData.fleetId.trim() || !fleetData.startDate || !fleetData.endDate) {
      alert('Please fill in all required fields: Fleet ID, Start Date, and End Date')
      return false
    }

    const startDate = new Date(fleetData.startDate)
    const endDate = new Date(fleetData.endDate)
    
    if (startDate >= endDate) {
      alert('End Date must be after Start Date')
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
      const newFleet: FleetCommissioning = {
        ...fleetData,
        id: Date.now().toString(),
        status: 'active',
        isDecommissioned: false
      }

      // Add to list
      setFleetList(prev => [newFleet, ...prev])

      // Log the complete dataset to console
      console.log('Fleet Commissioning Data Submitted:', newFleet)
      console.log('Updated Fleet List:', [newFleet, ...fleetList])

      // Reset form
      setFleetData({
        id: '',
        fleetId: '',
        vap: null,
        startDate: '',
        endDate: '',
        plateNumber: '',
        driver: '',
        label: '',
        status: 'active',
        isDecommissioned: false
      })

      alert('Fleet commissioning entry created successfully! Check console for data.')

    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error creating fleet commissioning entry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDecommission = (fleetId: string) => {
    const fleet = fleetList.find(f => f.id === fleetId)
    if (!fleet) return

    const today = new Date()
    const endDate = new Date(fleet.endDate)
    
    if (today < endDate) {
      // Set decommissioning end date to today
      const updatedFleet = {
        ...fleet,
        endDate: today.toISOString().split('T')[0],
        status: 'decommissioned' as const,
        isDecommissioned: true
      }

      setFleetList(prev => prev.map(f => f.id === fleetId ? updatedFleet : f))
      
      // Log the decommissioning action
      console.log('Fleet Decommissioned:', updatedFleet)
      console.log('Updated Fleet List after Decommissioning:', fleetList.map(f => f.id === fleetId ? updatedFleet : f))
      
      alert('Fleet marked as decommissioned successfully!')
    } else {
      alert('This fleet is already decommissioned.')
    }
  }

  const getStatusBadge = (fleet: FleetCommissioning) => {
    if (fleet.isDecommissioned) {
      return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Decommissioned</Badge>
    }
    
    switch (fleet.status) {
      case 'active':
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Active</Badge>
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusColor = (fleet: FleetCommissioning) => {
    if (fleet.isDecommissioned) return 'text-red-600 bg-red-50'
    if (fleet.status === 'pending') return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commissioning & De-commissioning"
        description="Manage vehicle commissioning and decommissioning for this event"
      />

      {/* Commissioning Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Fleet Commissioning Form
          </CardTitle>
          <CardDescription>
            Create new fleet commissioning entries with all required information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fleet ID */}
              <div className="space-y-2">
                <Label htmlFor="fleetId" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Fleet ID *
                </Label>
                <Input
                  id="fleetId"
                  type="text"
                  placeholder="Enter fleet identifier"
                  value={fleetData.fleetId}
                  onChange={(e) => handleInputChange('fleetId', e.target.value)}
                  required
                />
              </div>

              {/* VAP */}
              <div className="space-y-2">
                <Label htmlFor="vap" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  VAP (Optional)
                </Label>
                <Input
                  id="vap"
                  type="text"
                  placeholder="Enter VAP or leave empty for N/A"
                  value={fleetData.vap || ''}
                  onChange={(e) => handleVAPChange(e.target.value)}
                />
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Start Date *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={fleetData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  End Date *
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={fleetData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  required
                />
              </div>

              {/* Plate Number */}
              <div className="space-y-2">
                <Label htmlFor="plateNumber" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Plate Number
                </Label>
                <Input
                  id="plateNumber"
                  type="text"
                  placeholder="Enter vehicle plate number"
                  value={fleetData.plateNumber}
                  onChange={(e) => handleInputChange('plateNumber', e.target.value)}
                />
              </div>

              {/* Driver */}
              <div className="space-y-2">
                <Label htmlFor="driver" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Driver
                </Label>
                <Input
                  id="driver"
                  type="text"
                  placeholder="Enter driver name"
                  value={fleetData.driver}
                  onChange={(e) => handleInputChange('driver', e.target.value)}
                />
              </div>
            </div>

            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="label" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Label
              </Label>
              <Input
                id="label"
                type="text"
                placeholder="Enter fleet label or description"
                value={fleetData.label}
                onChange={(e) => handleInputChange('label', e.target.value)}
              />
            </div>

            {/* Submit Button */}
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
                    Create Commissioning Entry
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Fleet List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Fleet Commissioning List
          </CardTitle>
          <CardDescription>
            View all fleet commissioning and decommissioning entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {fleetList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No fleet commissioning entries yet. Create your first entry above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fleet ID</TableHead>
                    <TableHead>VAP</TableHead>
                    <TableHead>Plate Number</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fleetList.map((fleet) => (
                    <TableRow 
                      key={fleet.id}
                      className={fleet.isDecommissioned ? 'bg-red-50' : ''}
                    >
                      <TableCell className="font-medium">{fleet.fleetId}</TableCell>
                      <TableCell>{fleet.vap || 'N/A'}</TableCell>
                      <TableCell>{fleet.plateNumber || 'N/A'}</TableCell>
                      <TableCell>{fleet.driver || 'N/A'}</TableCell>
                      <TableCell>{fleet.startDate}</TableCell>
                      <TableCell className={fleet.isDecommissioned ? 'text-red-600 font-medium' : ''}>
                        {fleet.endDate}
                      </TableCell>
                      <TableCell>{getStatusBadge(fleet)}</TableCell>
                      <TableCell>{fleet.label || 'N/A'}</TableCell>
                      <TableCell>
                        {!fleet.isDecommissioned && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDecommission(fleet.id)}
                            className="flex items-center gap-1"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            Decommission
                          </Button>
                        )}
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
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. <strong>Commissioning:</strong> Create new fleet entries with start and end dates</p>
          <p>2. <strong>Status Updates:</strong> System automatically updates status based on dates</p>
          <p>3. <strong>Decommissioning:</strong> Click "Decommission" button to mark fleet as decommissioned</p>
          <p>4. <strong>Console Logging:</strong> All data is logged to browser console for debugging</p>
          <p>5. <strong>VAP Handling:</strong> Leave VAP empty to display as "N/A"</p>
        </CardContent>
      </Card>
    </div>
  )
}
