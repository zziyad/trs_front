'use client'

import { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PageHeader, StatsGrid, SearchAndFilter } from '@/components/layout'
import { Users, MapPin, Building, UserCheck, Plus, Upload, Download, Search, Filter } from 'lucide-react'
import { toast } from 'sonner'

interface StaffMember {
  id: string
  eventId: string
  name: string
  position: string
  supervisor: string
  city: string
  venue: string
  contact: string
  email: string
  department: string
  startDate: string
  status: 'active' | 'inactive'
  createdAt: string
}

export default function EventStaffPage() {
  const params = useParams()
  const eventId = params.eventId as string
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterValue, setFilterValue] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [staffPerPage] = useState(10)
  
  const [formData, setFormData] = useState<Omit<StaffMember, 'id' | 'eventId' | 'createdAt'>>({
    name: '',
    position: '',
    supervisor: '',
    city: '',
    venue: '',
    contact: '',
    email: '',
    department: '',
    startDate: '',
    status: 'active'
  })

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: '1',
      eventId: eventId,
      name: 'John Smith',
      position: 'Event Coordinator',
      supervisor: 'Sarah Johnson',
      city: 'New York',
      venue: 'Convention Center',
      contact: '+1234567890',
      email: 'john.smith@event.com',
      department: 'Operations',
      startDate: '2025-01-01',
      status: 'active',
      createdAt: '2025-01-01T09:00:00Z'
    },
    {
      id: '2',
      eventId: eventId,
      name: 'Sarah Johnson',
      position: 'Senior Manager',
      supervisor: 'Mike Wilson',
      city: 'Los Angeles',
      venue: 'Exhibition Hall',
      contact: '+1987654321',
      email: 'sarah.johnson@event.com',
      department: 'Management',
      startDate: '2025-01-02',
      status: 'active',
      createdAt: '2025-01-02T10:00:00Z'
    },
    {
      id: '3',
      eventId: eventId,
      name: 'Mike Wilson',
      position: 'Event Director',
      supervisor: 'None',
      city: 'Chicago',
      venue: 'Main Arena',
      contact: '+1555123456',
      email: 'mike.wilson@event.com',
      department: 'Executive',
      startDate: '2025-01-03',
      status: 'active',
      createdAt: '2025-01-03T11:00:00Z'
    },
    {
      id: '4',
      eventId: eventId,
      name: 'Lisa Brown',
      position: 'Marketing Specialist',
      supervisor: 'Sarah Johnson',
      city: 'Miami',
      venue: 'Marketing Office',
      contact: '+1444333222',
      email: 'lisa.brown@event.com',
      department: 'Marketing',
      startDate: '2025-01-04',
      status: 'active',
      createdAt: '2025-01-04T12:00:00Z'
    },
    {
      id: '5',
      eventId: eventId,
      name: 'David Lee',
      position: 'Technical Support',
      supervisor: 'John Smith',
      city: 'San Francisco',
      venue: 'Tech Center',
      contact: '+1333444555',
      email: 'david.lee@event.com',
      department: 'IT',
      startDate: '2025-01-05',
      status: 'inactive',
      createdAt: '2025-01-05T13:00:00Z'
    }
  ])

  // Calculate statistics
  const totalStaff = staffMembers.length
  const activeStaff = staffMembers.filter(staff => staff.status === 'active').length
  const inactiveStaff = staffMembers.filter(staff => staff.status === 'inactive').length
  const uniqueCities = new Set(staffMembers.map(staff => staff.city)).size
  const uniqueVenues = new Set(staffMembers.map(staff => staff.venue)).size

  const staffStats = [
    {
      title: 'Total Staff',
      value: totalStaff,
      description: 'All staff members',
      icon: Users
    },
    {
      title: 'Active Staff',
      value: activeStaff,
      description: 'Currently working',
      icon: UserCheck
    },
    {
      title: 'Cities',
      value: uniqueCities,
      description: 'Staff locations',
      icon: MapPin
    },
    {
      title: 'Venues',
      value: uniqueVenues,
      description: 'Work locations',
      icon: Building
    }
  ]

  const filterOptions = [
    { value: 'all', label: 'All Staff' },
    { value: 'active', label: 'Active Only' },
    { value: 'inactive', label: 'Inactive Only' },
    { value: 'operations', label: 'Operations' },
    { value: 'management', label: 'Management' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'it', label: 'IT' }
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
    const requiredFields = ['name', 'position', 'supervisor', 'city', 'venue', 'contact', 'email', 'department', 'startDate']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return false
    }

    // Create new staff member
    const newStaff: StaffMember = {
      id: Date.now().toString(),
      eventId: eventId,
      ...formData,
      createdAt: new Date().toISOString()
    }

    // Add to list
    setStaffMembers(prev => [newStaff, ...prev])

    // Log to console as required
    console.log('New Staff Member Added:', newStaff)

    // Show success message
    toast.success('Staff member added successfully!')

    // Clear form and close modal
    setFormData({
      name: '',
      position: '',
      supervisor: '',
      city: '',
      venue: '',
      contact: '',
      email: '',
      department: '',
      startDate: '',
      status: 'active'
    })
    
    setIsModalOpen(false)
  }

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string
        const lines = csv.split('\n')
        const headers = lines[0].split(',').map(h => h.trim())
        
        // Validate required columns
        const requiredColumns = ['Name', 'Position', 'Supervisor', 'City', 'Venue', 'Contact', 'Email', 'Department', 'StartDate']
        const missingColumns = requiredColumns.filter(col => !headers.includes(col))
        
        if (missingColumns.length > 0) {
          toast.error(`Missing required columns: ${missingColumns.join(', ')}`)
          return
        }

        const newStaffMembers: StaffMember[] = []
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim())
            const staffData: StaffMember = {
              id: Date.now().toString() + i,
              eventId: eventId,
              name: values[headers.indexOf('Name')] || '',
              position: values[headers.indexOf('Position')] || '',
              supervisor: values[headers.indexOf('Supervisor')] || '',
              city: values[headers.indexOf('City')] || '',
              venue: values[headers.indexOf('Venue')] || '',
              contact: values[headers.indexOf('Contact')] || '',
              email: values[headers.indexOf('Email')] || '',
              department: values[headers.indexOf('Department')] || '',
              startDate: values[headers.indexOf('StartDate')] || '',
              status: 'active',
              createdAt: new Date().toISOString()
            }
            newStaffMembers.push(staffData)
          }
        }

        if (newStaffMembers.length > 0) {
          setStaffMembers(prev => [...newStaffMembers, ...prev])
          
          // Log all imported staff data to console as required
          console.log('Staff Data Imported from Excel/CSV:', newStaffMembers)
          
          toast.success(`Successfully imported ${newStaffMembers.length} staff members!`)
        } else {
          toast.error('No valid data found in the file')
        }
      } catch (error) {
        console.error('Error parsing file:', error)
        toast.error('Error reading file. Please check the format.')
      }
    }
    
    reader.readAsText(file)
    
    // Reset file input
    event.target.value = ''
  }, [eventId])

  // Filter and search staff
  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.venue.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterValue === 'all' || 
                         staff.status === filterValue || 
                         staff.department.toLowerCase() === filterValue
    
    return matchesSearch && matchesFilter
  })

  // Pagination
  const indexOfLastStaff = currentPage * staffPerPage
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage
  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff)
  const totalPages = Math.ceil(filteredStaff.length / staffPerPage)

  // Staff allocation by supervisor
  const staffBySupervisor = staffMembers.reduce((acc, staff) => {
    if (!acc[staff.supervisor]) {
      acc[staff.supervisor] = {}
    }
    if (!acc[staff.supervisor][staff.position]) {
      acc[staff.supervisor][staff.position] = 0
    }
    acc[staff.supervisor][staff.position]++
    return acc
  }, {} as Record<string, Record<string, number>>)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Staff Management"
        description="Manage staff members, view statistics, and import staff data for this event"
        actions={
          <div className="flex gap-2">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Staff Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                  <DialogDescription>
                    Fill in all required information for the new staff member
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="position">Position *</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        placeholder="e.g., Event Coordinator"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="supervisor">Supervisor *</Label>
                      <Input
                        id="supervisor"
                        value={formData.supervisor}
                        onChange={(e) => handleInputChange('supervisor', e.target.value)}
                        placeholder="Supervisor name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="department">Department *</Label>
                      <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Management">Management</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="venue">Venue *</Label>
                      <Input
                        id="venue"
                        value={formData.venue}
                        onChange={(e) => handleInputChange('venue', e.target.value)}
                        placeholder="Work venue"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact">Contact *</Label>
                      <Input
                        id="contact"
                        type="tel"
                        value={formData.contact}
                        onChange={(e) => handleInputChange('contact', e.target.value)}
                        placeholder="Phone number"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      Add Staff Member
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

            <div className="relative">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="pointer-events-none">
                <Upload className="mr-2 h-4 w-4" />
                Import Excel/CSV
              </Button>
            </div>
          </div>
        }
      />
      
      <StatsGrid items={staffStats} />
      
      {/* Staff Allocation by Supervisor */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Staff Allocation by Supervisor</CardTitle>
          <CardDescription>Breakdown of staff members under each supervisor by position</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(staffBySupervisor).map(([supervisor, positions]) => (
              <div key={supervisor} className="border rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3">{supervisor}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(positions).map(([position, count]) => (
                    <div key={position} className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{count}</div>
                      <div className="text-sm text-muted-foreground">{position}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Search and Filter */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search staff by name, position, supervisor, city, or venue..."
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        filterOptions={filterOptions}
        filterPlaceholder="Filter by status, city, or venue"
      />
      
      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
          <CardDescription>All staff members for this event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentStaff.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No staff members found matching your criteria.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Name</th>
                        <th className="text-left p-2 font-medium">Position</th>
                        <th className="text-left p-2 font-medium">Supervisor</th>
                        <th className="text-left p-2 font-medium">Location</th>
                        <th className="text-left p-2 font-medium">Contact</th>
                        <th className="text-left p-2 font-medium">Status</th>
                        <th className="text-left p-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentStaff.map((staff) => (
                        <tr key={staff.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">
                            <div>
                              <div className="font-medium">{staff.name}</div>
                              <div className="text-sm text-muted-foreground">{staff.department}</div>
                            </div>
                          </td>
                          <td className="p-2">{staff.position}</td>
                          <td className="p-2">{staff.supervisor}</td>
                          <td className="p-2">
                            <div className="text-sm">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {staff.city}
                              </div>
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {staff.venue}
                              </div>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="text-sm">
                              <div>{staff.contact}</div>
                              <div className="text-muted-foreground">{staff.email}</div>
                            </div>
                          </td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                              {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Toggle status
                                  setStaffMembers(prev => prev.map(s => 
                                    s.id === staff.id 
                                      ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
                                      : s
                                  ))
                                }}
                              >
                                {staff.status === 'active' ? 'Deactivate' : 'Activate'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {indexOfFirstStaff + 1} to {Math.min(indexOfLastStaff, filteredStaff.length)} of {filteredStaff.length} staff members
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
