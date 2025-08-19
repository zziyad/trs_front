'use client'

import { useParams } from 'next/navigation'
import { useState, useCallback, useMemo } from 'react'
import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  UserPlus, 
  Upload, 
  Search, 
  Building, 
  MapPin, 
  UserCheck, 
  Phone, 
  Mail,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X,
  Clock
} from 'lucide-react'

interface StaffMember {
  id: string
  name: string
  position: string
  supervisor: string
  city: string
  venue: string
  contact: string
  email: string
  department: string
  startDate: string
  status: 'active' | 'inactive' | 'temporary'
}

interface StaffStats {
  total: number
  byCity: Record<string, number>
  byVenue: Record<string, number>
  bySupervisor: Record<string, { total: number; positions: Record<string, number> }>
  byPosition: Record<string, number>
  byStatus: Record<string, number>
}

export default function StaffStatisticsPage() {
  const params = useParams()
  const eventId = params.eventId as string

  const [staff, setStaff] = useState<StaffMember[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCity, setFilterCity] = useState<string>('all')
  const [filterVenue, setFilterVenue] = useState<string>('all')
  const [filterSupervisor, setFilterSupervisor] = useState<string>('all')
  const [filterPosition, setFilterPosition] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isImporting, setIsImporting] = useState(false)
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  // Calculate statistics from staff data
  const stats = useMemo((): StaffStats => {
    const byCity: Record<string, number> = {}
    const byVenue: Record<string, number> = {}
    const bySupervisor: Record<string, { total: number; positions: Record<string, number> }> = {}
    const byPosition: Record<string, number> = {}
    const byStatus: Record<string, number> = {}

    staff.forEach(member => {
      byCity[member.city] = (byCity[member.city] || 0) + 1
      byVenue[member.venue] = (byVenue[member.venue] || 0) + 1
      
      if (!bySupervisor[member.supervisor]) {
        bySupervisor[member.supervisor] = { total: 0, positions: {} }
      }
      bySupervisor[member.supervisor].total += 1
      bySupervisor[member.supervisor].positions[member.position] = 
        (bySupervisor[member.supervisor].positions[member.position] || 0) + 1
      
      byPosition[member.position] = (byPosition[member.position] || 0) + 1
      byStatus[member.status] = (byStatus[member.status] || 0) + 1
    })

    return {
      total: staff.length,
      byCity,
      byVenue,
      bySupervisor,
      byPosition,
      byStatus
    }
  }, [staff])

  // Filtered staff based on search and filters
  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.venue.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCity = filterCity === 'all' || member.city === filterCity
      const matchesVenue = filterVenue === 'all' || member.venue === filterVenue
      const matchesSupervisor = filterSupervisor === 'all' || member.supervisor === filterSupervisor
      const matchesPosition = filterPosition === 'all' || member.position === filterPosition
      const matchesStatus = filterStatus === 'all' || member.status === filterStatus
      
      return matchesSearch && matchesCity && matchesVenue && matchesSupervisor && matchesPosition && matchesStatus
    })
  }, [staff, searchTerm, filterCity, filterVenue, filterSupervisor, filterPosition, filterStatus])

  // Mock Excel data for demonstration
  const mockExcelData: StaffMember[] = [
    {
      id: '1',
      name: 'John Smith',
      position: 'Marshal',
      supervisor: 'Sarah Johnson',
      city: 'Baku',
      venue: 'Main Stadium',
      contact: '+994501234567',
      email: 'john.smith@event.com',
      department: 'Security',
      startDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      position: 'Manager',
      supervisor: 'David Wilson',
      city: 'Baku',
      venue: 'Conference Center',
      contact: '+994501234568',
      email: 'maria.garcia@event.com',
      department: 'Operations',
      startDate: '2024-01-10',
      status: 'active'
    },
    {
      id: '3',
      name: 'Ahmed Hassan',
      position: 'Technician',
      supervisor: 'Sarah Johnson',
      city: 'Baku',
      venue: 'Main Stadium',
      contact: '+994501234569',
      email: 'ahmed.hassan@event.com',
      department: 'Technical',
      startDate: '2024-01-20',
      status: 'active'
    },
    {
      id: '4',
      name: 'Lisa Chen',
      position: 'Marshal',
      supervisor: 'David Wilson',
      city: 'Baku',
      venue: 'Exhibition Hall',
      contact: '+994501234570',
      email: 'lisa.chen@event.com',
      department: 'Security',
      startDate: '2024-01-12',
      status: 'temporary'
    },
    {
      id: '5',
      name: 'Carlos Rodriguez',
      position: 'Technician',
      supervisor: 'Sarah Johnson',
      city: 'Baku',
      venue: 'Conference Center',
      contact: '+994501234571',
      email: 'carlos.rodriguez@event.com',
      department: 'Technical',
      startDate: '2024-01-18',
      status: 'active'
    }
  ]

  // Handle Excel file import
  const handleExcelImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportMessage(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const importedStaff = mockExcelData
      
      setStaff(prevStaff => {
        const newStaff = [...prevStaff, ...importedStaff]
        
        console.log('=== STAFF DATA IMPORTED ===')
        newStaff.forEach((member, index) => {
          console.log(`${index + 1}. ${member.name} - ${member.position}`)
          console.log(`   Supervisor: ${member.supervisor}`)
          console.log(`   City: ${member.city}, Venue: ${member.venue}`)
          console.log(`   Contact: ${member.contact}, Email: ${member.email}`)
          console.log(`   Department: ${member.department}`)
          console.log(`   Start Date: ${member.startDate}`)
          console.log(`   Status: ${member.status}`)
          console.log('---')
        })
        console.log(`Total Staff Count: ${newStaff.length}`)
        console.log('=== END STAFF DATA ===')
        
        return newStaff
      })

      setImportMessage({
        type: 'success',
        message: `Successfully imported ${importedStaff.length} staff members!`
      })

      event.target.value = ''
      
    } catch (error) {
      console.error('Error importing Excel file:', error)
      setImportMessage({
        type: 'error',
        message: 'Error importing Excel file. Please try again.'
      })
    } finally {
      setIsImporting(false)
    }
  }, [])

  // Add manual staff member
  const addMockStaff = () => {
    const newStaff: StaffMember = {
      id: Date.now().toString(),
      name: `Staff Member ${staff.length + 1}`,
      position: 'General',
      supervisor: 'Default Supervisor',
      city: 'Baku',
      venue: 'Main Venue',
      contact: '+994500000000',
      email: `staff${staff.length + 1}@event.com`,
      department: 'General',
      startDate: new Date().toISOString().split('T')[0],
      status: 'active'
    }

    setStaff(prev => [...prev, newStaff])
    
    console.log('New staff member added:', newStaff)
    console.log('Updated staff list:', [...staff, newStaff])
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Active</Badge>
      case 'inactive':
        return <Badge variant="secondary" className="flex items-center gap-1"><X className="h-3 w-3" />Inactive</Badge>
      case 'temporary':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" />Temporary</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get unique values for filters
  const uniqueCities = useMemo(() => ['all', ...Object.keys(stats.byCity)], [stats.byCity])
  const uniqueVenues = useMemo(() => ['all', ...Object.keys(stats.byVenue)], [stats.byVenue])
  const uniqueSupervisors = useMemo(() => ['all', ...Object.keys(stats.bySupervisor)], [stats.bySupervisor])
  const uniquePositions = useMemo(() => ['all', ...Object.keys(stats.byPosition)], [stats.byPosition])
  const uniqueStatuses = useMemo(() => ['all', ...Object.keys(stats.byStatus)], [stats.byStatus])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Statistics"
        description="Comprehensive dashboard for staff management, statistics, and data import"
        actions={
          <div className="flex gap-2">
            <Button onClick={addMockStaff} variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
            <Button disabled={isImporting}>
              <Upload className="mr-2 h-4 w-4" />
              {isImporting ? 'Importing...' : 'Import Excel'}
            </Button>
          </div>
        }
      />

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Staff Data
          </CardTitle>
          <CardDescription>
            Upload an Excel file with staff details to populate the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="excel-upload">Select Excel File</Label>
              <Input
                id="excel-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleExcelImport}
                disabled={isImporting}
                className="cursor-pointer"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Supported formats: .xlsx, .xls, .csv</p>
              <p>Required columns: Name, Position, Supervisor, City, Venue, Contact, Email, Department, Start Date, Status</p>
            </div>
          </div>
          
          {importMessage && (
            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              importMessage.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {importMessage.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {importMessage.message}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Statistics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              <p className="text-sm text-blue-700">Total Staff</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Building className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-900">{Object.keys(stats.byVenue).length}</p>
              <p className="text-sm text-green-700">Venues</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-900">{Object.keys(stats.byCity).length}</p>
              <p className="text-sm text-purple-700">Cities</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <UserCheck className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-orange-900">{Object.keys(stats.bySupervisor).length}</p>
              <p className="text-sm text-orange-700">Supervisors</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Statistics Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Detailed Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="supervisors">Supervisors</TabsTrigger>
              <TabsTrigger value="positions">Positions</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Staff by Position</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.byPosition).map(([position, count]) => (
                      <div key={position} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="font-medium">{position}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Staff by Status</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.byStatus).map(([status, count]) => (
                      <div key={status} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="font-medium capitalize">{status}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="supervisors" className="space-y-4">
              <div className="space-y-4">
                {Object.entries(stats.bySupervisor).map(([supervisor, data]) => (
                  <Card key={supervisor}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{supervisor}</CardTitle>
                      <CardDescription>Total Staff: {data.total}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(data.positions).map(([position, count]) => (
                          <div key={position} className="text-center p-2 bg-muted rounded">
                            <p className="font-medium">{position}</p>
                            <p className="text-sm text-muted-foreground">{count}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="positions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.byPosition).map(([position, count]) => (
                  <Card key={position}>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{count}</p>
                        <p className="text-sm text-muted-foreground">{position}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="locations" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Staff by City</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.byCity).map(([city, count]) => (
                      <div key={city} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="font-medium">{city}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Staff by Venue</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.byVenue).map(([venue, count]) => (
                      <div key={venue} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="font-medium">{venue}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <Label htmlFor="search">Search Staff</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, position, supervisor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="city-filter">City</Label>
              <Select value={filterCity} onValueChange={setFilterCity}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCities.map(city => (
                    <SelectItem key={city} value={city}>
                      {city === 'all' ? 'All Cities' : city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="venue-filter">Venue</Label>
              <Select value={filterVenue} onValueChange={setFilterVenue}>
                <SelectTrigger>
                  <SelectValue placeholder="All Venues" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueVenues.map(venue => (
                    <SelectItem key={venue} value={venue}>
                      {venue === 'all' ? 'All Venues' : venue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="position-filter">Position</Label>
              <Select value={filterPosition} onValueChange={setFilterPosition}>
                <SelectTrigger>
                  <SelectValue placeholder="All Positions" />
                </SelectTrigger>
                <SelectContent>
                  {uniquePositions.map(position => (
                    <SelectItem key={position} value={position}>
                      {position === 'all' ? 'All Positions' : position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status === 'all' ? 'All Statuses' : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff List Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Staff List ({filteredStaff.length} of {staff.length})
          </CardTitle>
          <CardDescription>
            Complete list of all staff members with detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStaff.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">No staff members found</p>
              <p className="text-sm">Try adjusting your search or filter criteria, or import staff data</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Supervisor</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>{member.supervisor}</TableCell>
                      <TableCell>{member.city}</TableCell>
                      <TableCell>{member.venue}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {member.contact}
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">{member.email}</span>
                      </TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>{member.startDate}</TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
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
          <CardTitle className="text-lg">How to Use Staff Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. <strong>Import Data:</strong> Upload Excel files with staff information to populate the dashboard</p>
          <p>2. <strong>View Statistics:</strong> Check the overview cards for quick insights into staff numbers</p>
          <p>3. <strong>Detailed Analysis:</strong> Use tabs to explore staff by supervisors, positions, and locations</p>
          <p>4. <strong>Search & Filter:</strong> Find specific staff members using search and multiple filter options</p>
          <p>5. <strong>Data Validation:</strong> Ensure your Excel files have all required columns for proper import</p>
          <p>6. <strong>Console Logging:</strong> All imported staff data is logged to browser console for verification</p>
        </CardContent>
      </Card>
    </div>
  )
}
