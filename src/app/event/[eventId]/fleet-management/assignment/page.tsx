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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Truck, 
  User, 
  Building, 
  FileText, 
  RefreshCw, 
  CheckCircle, 
  Clock,
  MapPin,
  Calendar,
  Plus,
  Search
} from 'lucide-react'

interface FleetAssignmentData {
  id: string
  fleetId: string
  driverInfo: {
    name: string
    nationalId: string
    phone: string
    licenseNumber: string
  } | null
  hotelTransport: {
    passenger: string
    from: string
    to: string
    departureTime: string
    returnTime: string
  } | null
  vapp: {
    serialNumber: string
    justification: string
    status: string
    approvalDate: string
  } | null
  assignmentDate: string
  status: 'pending' | 'assigned' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
}

export default function FleetAssignmentPage() {
  const params = useParams()
  const eventId = params.eventId as string

  const [assignments, setAssignments] = useState<FleetAssignmentData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)

  // Mock data for demonstration
  const mockFleetData = [
    { id: 'F001', plateNumber: 'ABC-123', type: 'Sedan', capacity: 4 },
    { id: 'F002', plateNumber: 'XYZ-789', type: 'SUV', capacity: 6 },
    { id: 'F003', plateNumber: 'DEF-456', type: 'Van', capacity: 8 },
    { id: 'F004', plateNumber: 'GHI-789', type: 'Bus', capacity: 20 }
  ]

  const mockDriverData = [
    { fleetId: 'F001', name: 'John Doe', nationalId: 'AZE1234567', phone: '+994501234567', licenseNumber: 'DL001' },
    { fleetId: 'F002', name: 'Jane Smith', nationalId: 'AZE9876543', phone: '+994509876543', licenseNumber: 'DL002' },
    { fleetId: 'F003', name: 'Mike Johnson', nationalId: 'AZE5556666', phone: '+994505556666', licenseNumber: 'DL003' }
  ]

  const mockHotelTransportData = [
    { fleetId: 'F001', passenger: 'Alice Johnson', from: 'Hotel A', to: 'Airport', departureTime: '08:00', returnTime: '18:00' },
    { fleetId: 'F002', passenger: 'Bob Wilson', from: 'Hotel B', to: 'Conference Center', departureTime: '09:00', returnTime: '17:00' },
    { fleetId: 'F003', passenger: 'Carol Davis', from: 'Hotel C', to: 'Exhibition Hall', departureTime: '10:00', returnTime: '16:00' }
  ]

  const mockVAPPData = [
    { fleetId: 'F001', serialNumber: 'VAPP001', justification: 'Event transport', status: 'Approved', approvalDate: '2024-01-15' },
    { fleetId: 'F003', serialNumber: 'VAPP002', justification: 'Guest pickup', status: 'Pending', approvalDate: 'N/A' },
    { fleetId: 'F004', serialNumber: 'VAPP003', justification: 'Group transport', status: 'Approved', approvalDate: '2024-01-20' }
  ]

  const generateAssignments = () => {
    setIsLoading(true)
    try {
      const newAssignments: FleetAssignmentData[] = mockFleetData.map(fleet => {
        const driver = mockDriverData.find(d => d.fleetId === fleet.id) || null
        const transport = mockHotelTransportData.find(t => t.fleetId === fleet.id) || null
        const vapp = mockVAPPData.find(v => v.fleetId === fleet.id) || null

        let priority: FleetAssignmentData['priority'] = 'low'
        if (driver && transport && vapp) priority = 'high'
        else if (driver || transport || vapp) priority = 'medium'

        return {
          id: fleet.id,
          fleetId: fleet.id,
          driverInfo: driver,
          hotelTransport: transport,
          vapp: vapp,
          assignmentDate: new Date().toISOString().split('T')[0],
          status: 'pending' as const,
          priority
        }
      })

      setAssignments(newAssignments)
      setLastGenerated(new Date().toLocaleTimeString())
      
      console.log('Fleet Assignment Data Generated:', newAssignments)
      console.log('Data Sources Used:', { mockFleetData, mockDriverData, mockHotelTransportData, mockVAPPData })

    } catch (error) {
      console.error('Error generating assignments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (assignmentId: string, newStatus: FleetAssignmentData['status']) => {
    const updatedAssignments = assignments.map(assignment => 
      assignment.id === assignmentId ? { ...assignment, status: newStatus } : assignment
    )
    setAssignments(updatedAssignments)
    console.log('Assignment Status Updated:', assignmentId, 'New Status:', newStatus)
  }

  const handlePriorityChange = (assignmentId: string, newPriority: FleetAssignmentData['priority']) => {
    const updatedAssignments = assignments.map(assignment => 
      assignment.id === assignmentId ? { ...assignment, priority: newPriority } : assignment
    )
    setAssignments(updatedAssignments)
    console.log('Assignment Priority Updated:', assignmentId, 'New Priority:', newPriority)
  }

  const getStatusBadge = (status: FleetAssignmentData['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending</Badge>
      case 'assigned':
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Assigned</Badge>
      case 'in-progress':
        return <Badge variant="secondary" className="flex items-center gap-1"><Truck className="h-3 w-3" />In Progress</Badge>
      case 'completed':
        return <Badge variant="outline" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Completed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: FleetAssignmentData['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="flex items-center gap-1">High</Badge>
      case 'medium':
        return <Badge variant="secondary" className="flex items-center gap-1">Medium</Badge>
      case 'low':
        return <Badge variant="outline" className="flex items-center gap-1">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.fleetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (assignment.driverInfo?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (assignment.hotelTransport?.passenger || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus
    const matchesPriority = filterPriority === 'all' || assignment.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  useEffect(() => {
    generateAssignments()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet Assignment"
        description="Assign vehicles to specific routes and drivers for this event"
        actions={
          <Button onClick={generateAssignments} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Generating...' : 'Regenerate Assignments'}
          </Button>
        }
      />

      {/* Success Indicator */}
      {lastGenerated && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Fleet assignments last generated at {lastGenerated}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Sources Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Data Sources Summary
          </CardTitle>
          <CardDescription>
            Information consolidated from Fleet ID, Driver Management, Hotel Transportation, and VAPP
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
              <p className="text-sm text-green-700">Drivers Available</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Building className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="font-semibold text-purple-900">{mockHotelTransportData.length}</p>
              <p className="text-sm text-purple-700">Transport Routes</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Assignments</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by Fleet ID, Driver, or Passenger..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority-filter">Filter by Priority</Label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
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
                    <TableHead>Priority</TableHead>
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
                            <p className="text-sm text-muted-foreground">Phone: {assignment.driverInfo.phone}</p>
                            <p className="text-sm text-muted-foreground">License: {assignment.driverInfo.licenseNumber}</p>
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
                              <MapPin className="inline h-3 w-3 mr-1" />
                              {assignment.hotelTransport.from} → {assignment.hotelTransport.to}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <Calendar className="inline h-3 w-3 mr-1" />
                              {assignment.hotelTransport.departureTime} - {assignment.hotelTransport.returnTime}
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
                            <p className="text-sm text-muted-foreground">
                              Approved: {assignment.vapp.approvalDate}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">N/A</span>
                        )}
                      </TableCell>
                      
                      <TableCell>{assignment.assignmentDate}</TableCell>
                      <TableCell>{getPriorityBadge(assignment.priority)}</TableCell>
                      <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Select
                            value={assignment.status}
                            onValueChange={(value: FleetAssignmentData['status']) => 
                              handleStatusChange(assignment.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="assigned">Assigned</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Select
                            value={assignment.priority}
                            onValueChange={(value: FleetAssignmentData['priority']) => 
                              handlePriorityChange(assignment.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
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

      {/* Instructions Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. <strong>Data Consolidation:</strong> Information is gathered from Fleet ID, Driver Management, Hotel Transportation, and VAPP</p>
          <p>2. <strong>Missing Data:</strong> Any unavailable information is displayed as "N/A"</p>
          <p>3. <strong>Search & Filter:</strong> Use the search bar and filters to find specific assignments</p>
          <p>4. <strong>Status & Priority:</strong> Update assignment status and priority using the dropdowns</p>
          <p>5. <strong>Console Logging:</strong> All consolidated data is logged to browser console for debugging</p>
          <p>6. <strong>Priority Calculation:</strong> System automatically calculates priority based on data completeness</p>
        </CardContent>
      </Card>
    </div>
  )
}
