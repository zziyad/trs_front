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
import { 
  Truck, 
  User, 
  Building, 
  FileText, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Users,
  MapPin,
  Calendar
} from 'lucide-react'

interface FleetAssignment {
  id: string
  fleetId: string
  driverInfo: {
    name: string
    nationalId: string
    phone: string
  } | null
  hotelTransport: {
    passenger: string
    from: string
    to: string
  } | null
  vapp: {
    serialNumber: string
    justification: string
    status: string
  } | null
  assignmentDate: string
  status: 'assigned' | 'in-transit' | 'completed'
}

export default function AADPage() {
  const params = useParams()
  const eventId = params.eventId as string

  const [assignments, setAssignments] = useState<FleetAssignment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Mock data for demonstration
  const mockFleetData = [
    { id: 'F001', plateNumber: 'ABC-123', type: 'Sedan' },
    { id: 'F002', plateNumber: 'XYZ-789', type: 'SUV' },
    { id: 'F003', plateNumber: 'DEF-456', type: 'Van' }
  ]

  const mockDriverData = [
    { fleetId: 'F001', name: 'John Doe', nationalId: 'AZE1234567', phone: '+994501234567' },
    { fleetId: 'F002', name: 'Jane Smith', nationalId: 'AZE9876543', phone: '+994509876543' }
  ]

  const mockHotelTransportData = [
    { fleetId: 'F001', passenger: 'Alice Johnson', from: 'Hotel A', to: 'Airport' },
    { fleetId: 'F002', passenger: 'Bob Wilson', from: 'Hotel B', to: 'Conference Center' }
  ]

  const mockVAPPData = [
    { fleetId: 'F001', serialNumber: 'VAPP001', justification: 'Event transport', status: 'Approved' },
    { fleetId: 'F003', serialNumber: 'VAPP002', justification: 'Guest pickup', status: 'Pending' }
  ]

  const generateAssignments = () => {
    setIsLoading(true)
    try {
      const newAssignments: FleetAssignment[] = mockFleetData.map(fleet => {
        const driver = mockDriverData.find(d => d.fleetId === fleet.id) || null
        const transport = mockHotelTransportData.find(t => t.fleetId === fleet.id) || null
        const vapp = mockVAPPData.find(v => v.fleetId === fleet.id) || null

        return {
          id: fleet.id,
          fleetId: fleet.id,
          driverInfo: driver,
          hotelTransport: transport,
          vapp: vapp,
          assignmentDate: new Date().toISOString().split('T')[0],
          status: 'assigned' as const
        }
      })

      setAssignments(newAssignments)
      console.log('Fleet Assignment Data Generated:', newAssignments)
      alert('Fleet assignments generated successfully! Check console for consolidated data.')
    } catch (error) {
      console.error('Error generating assignments:', error)
      alert('Error generating fleet assignments. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (assignmentId: string, newStatus: FleetAssignment['status']) => {
    const updatedAssignments = assignments.map(assignment => 
      assignment.id === assignmentId ? { ...assignment, status: newStatus } : assignment
    )
    setAssignments(updatedAssignments)
    console.log('Assignment Status Updated:', assignmentId, 'New Status:', newStatus)
  }

  const getStatusBadge = (status: FleetAssignment['status']) => {
    switch (status) {
      case 'assigned':
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Assigned</Badge>
      case 'in-transit':
        return <Badge variant="secondary" className="flex items-center gap-1"><Truck className="h-3 w-3" />In Transit</Badge>
      case 'completed':
        return <Badge variant="outline" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Completed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.fleetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (assignment.driverInfo?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (assignment.hotelTransport?.passenger || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || assignment.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  useEffect(() => {
    generateAssignments()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet Assignment (AAD)"
        description="Consolidated view of fleet assignments combining information from Fleet ID, Driver Management, Hotel Transportation, and VAPP"
        actions={
          <Button onClick={generateAssignments} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Generating...' : 'Regenerate Assignments'}
          </Button>
        }
      />

      {/* Data Sources Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Data Sources Summary
          </CardTitle>
          <CardDescription>
            Information consolidated from multiple sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Truck className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold text-blue-900">{mockFleetData.length}</p>
              <p className="text-sm text-blue-700">Fleet Vehicles</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <User className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="font-semibold text-green-900">{mockDriverData.length}</p>
              <p className="text-sm text-green-700">Drivers Assigned</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Building className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="font-semibold text-purple-900">{mockHotelTransportData.length}</p>
              <p className="text-sm text-purple-700">Transport Operations</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <FileText className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="font-semibold text-orange-900">{mockVAPPData.length}</p>
              <p className="text-sm text-orange-700">VAPP Applications</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Assignments</Label>
              <Input
                id="search"
                placeholder="Search by Fleet ID, Driver, or Passenger..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Label htmlFor="status-filter">Filter by Status</Label>
              <select
                id="status-filter"
                className="w-full p-2 border rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="assigned">Assigned</option>
                <option value="in-transit">In Transit</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consolidated Fleet Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Consolidated Fleet Assignments
          </CardTitle>
          <CardDescription>
            Unified view combining all data sources with proper handling of missing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">No assignments found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fleet ID</TableHead>
                    <TableHead>Driver Information</TableHead>
                    <TableHead>Hotel Transport</TableHead>
                    <TableHead>VAPP Details</TableHead>
                    <TableHead>Assignment Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.fleetId}</TableCell>
                      
                      <TableCell>
                        {assignment.driverInfo ? (
                          <div className="space-y-1">
                            <p className="font-medium">{assignment.driverInfo.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {assignment.driverInfo.nationalId}</p>
                            <p className="text-sm text-muted-foreground">{assignment.driverInfo.phone}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">N/A</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {assignment.hotelTransport ? (
                          <div className="space-y-1">
                            <p className="font-medium">{assignment.hotelTransport.passenger}</p>
                            <p className="text-sm text-muted-foreground">
                              {assignment.hotelTransport.from} → {assignment.hotelTransport.to}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">N/A</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {assignment.vapp ? (
                          <div className="space-y-1">
                            <p className="font-medium">{assignment.vapp.serialNumber}</p>
                            <p className="text-sm text-muted-foreground">{assignment.vapp.justification}</p>
                            <Badge variant={assignment.vapp.status === 'Approved' ? 'default' : 'secondary'}>
                              {assignment.vapp.status}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">N/A</span>
                        )}
                      </TableCell>
                      
                      <TableCell>{assignment.assignmentDate}</TableCell>
                      <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                      <TableCell>
                        <select
                          className="p-2 border rounded-md text-sm"
                          value={assignment.status}
                          onChange={(e) => handleStatusChange(assignment.id, e.target.value as FleetAssignment['status'])}
                        >
                          <option value="assigned">Assigned</option>
                          <option value="in-transit">In Transit</option>
                          <option value="completed">Completed</option>
                        </select>
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
          <p>1. <strong>Data Consolidation:</strong> Information is gathered from Fleet ID, Driver Management, Hotel Transportation, and VAPP</p>
          <p>2. <strong>Missing Data:</strong> Any unavailable information is displayed as "N/A"</p>
          <p>3. <strong>Search & Filter:</strong> Use the search bar and status filter to find specific assignments</p>
          <p>4. <strong>Status Updates:</strong> Change assignment status using the dropdown in the Actions column</p>
          <p>5. <strong>Console Logging:</strong> All consolidated data is logged to browser console for debugging</p>
        </CardContent>
      </Card>
    </div>
  )
}
