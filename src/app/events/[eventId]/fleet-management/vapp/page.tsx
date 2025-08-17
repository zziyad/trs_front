'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader, StatsGrid } from '@/components/layout'
import { Plus, Car, CheckCircle, XCircle, Clock, AlertTriangle, Search, Filter } from 'lucide-react'
import { toast } from 'sonner'

interface VAPP {
  id: string
  serialNumber: string
  plateNumber: string
  name: string
  surname: string
  mobileNumber: string
  department: string
  justification: string
  status: 'approved' | 'pending' | 'confirmed' | 'canceled'
  label: string
  createdAt: string
}

const departments = [
  'Operations', 'Security', 'Logistics', 'Management', 'Technical Support',
  'Customer Service', 'Maintenance', 'Administration', 'Emergency Response'
]

const statusOptions = [
  { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { value: 'canceled', label: 'Canceled', color: 'bg-red-100 text-red-800' }
]

export default function FleetVAPPage() {
  const params = useParams()
  const eventId = params.eventId as string

  // Initialize with mock data for demonstration
  const [vapps, setVapps] = useState<VAPP[]>([
    {
      id: '1',
      serialNumber: 'VAPP-001',
      plateNumber: 'ABC-123',
      name: 'John',
      surname: 'Doe',
      mobileNumber: '+1-555-0123',
      department: 'Operations',
      justification: 'Event logistics coordination and emergency response vehicle access',
      status: 'approved',
      label: 'Priority Access',
      createdAt: '2024-03-15T10:00:00.000Z'
    },
    {
      id: '2',
      serialNumber: 'VAPP-002',
      plateNumber: 'XYZ-789',
      name: 'Jane',
      surname: 'Smith',
      mobileNumber: '+1-555-0456',
      department: 'Security',
      justification: 'Security patrol and incident response vehicle access',
      status: 'confirmed',
      label: 'Security Vehicle',
      createdAt: '2024-03-15T10:30:00.000Z'
    },
    {
      id: '3',
      serialNumber: 'VAPP-003',
      plateNumber: 'DEF-456',
      name: 'Michael',
      surname: 'Johnson',
      mobileNumber: '+1-555-0789',
      department: 'Technical Support',
      justification: 'Technical equipment transport and maintenance vehicle access',
      status: 'pending',
      label: 'Technical Support',
      createdAt: '2024-03-15T11:00:00.000Z'
    },
    {
      id: '4',
      serialNumber: 'VAPP-004',
      plateNumber: 'GHI-789',
      name: 'Sarah',
      surname: 'Williams',
      mobileNumber: '+1-555-0124',
      department: 'Logistics',
      justification: 'Event supplies and materials transport vehicle access',
      status: 'canceled',
      label: 'Logistics Vehicle',
      createdAt: '2024-03-15T11:30:00.000Z'
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formData, setFormData] = useState({
    serialNumber: '',
    plateNumber: '',
    name: '',
    surname: '',
    mobileNumber: '',
    department: '',
    justification: '',
    status: 'pending' as const,
    label: ''
  })

  // Statistics for the dashboard
  const vappStats = [
    {
      title: 'Total VAPPs',
      value: vapps.length,
      description: 'All vehicle access passes',
      icon: Car
    },
    {
      title: 'Approved',
      value: vapps.filter(v => v.status === 'approved').length,
      description: 'Approved VAPPs',
      icon: CheckCircle
    },
    {
      title: 'Pending',
      value: vapps.filter(v => v.status === 'pending').length,
      description: 'Pending approval',
      icon: Clock
    },
    {
      title: 'Canceled',
      value: vapps.filter(v => v.status === 'canceled').length,
      description: 'Canceled VAPPs',
      icon: XCircle
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newVAPP: VAPP = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    }

    // Log the new VAPP before state update
    console.log('New VAPP created:', newVAPP)
    
    // Update state and log the updated list
    setVapps(prev => {
      const updatedVapps = [...prev, newVAPP]
      console.log('Updated VAPPs list:', updatedVapps)
      return updatedVapps
    })
    
    // Reset form and close modal
    setFormData({
      serialNumber: '',
      plateNumber: '',
      name: '',
      surname: '',
      mobileNumber: '',
      department: '',
      justification: '',
      status: 'pending',
      label: ''
    })
    setIsModalOpen(false)
    
    toast.success('VAPP created successfully!')
  }

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status)
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status)
    return statusOption ? statusOption.label : status
  }

  // Filter VAPPs based on search term and status filter
  const filteredVapps = vapps.filter(vapp => {
    const matchesSearch = 
      vapp.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vapp.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vapp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vapp.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vapp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vapp.label.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || vapp.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="VAPP Management"
        description="Manage Vehicle Access Passes and Permissions for this event"
        actions={
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create VAPP
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Vehicle Access Pass</DialogTitle>
                <DialogDescription>
                  Fill in all required information for the VAPP
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serialNumber">VAPP Serial Number *</Label>
                      <Input 
                        id="serialNumber" 
                        value={formData.serialNumber} 
                        onChange={(e) => handleInputChange('serialNumber', e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plateNumber">Plate Number *</Label>
                      <Input 
                        id="plateNumber" 
                        value={formData.plateNumber} 
                        onChange={(e) => handleInputChange('plateNumber', e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={(e) => handleInputChange('name', e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="surname">Surname *</Label>
                      <Input 
                        id="surname" 
                        value={formData.surname} 
                        onChange={(e) => handleInputChange('surname', e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobileNumber">Mobile Number *</Label>
                      <Input 
                        id="mobileNumber" 
                        value={formData.mobileNumber} 
                        onChange={(e) => handleInputChange('mobileNumber', e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((department) => (
                            <SelectItem key={department} value={department}>
                              {department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="justification">Justification *</Label>
                      <textarea
                        id="justification"
                        value={formData.justification}
                        onChange={(e) => handleInputChange('justification', e.target.value)}
                        className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select value={formData.status} onValueChange={(value: 'approved' | 'pending' | 'confirmed' | 'canceled') => handleInputChange('status', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="label">Label</Label>
                        <Input 
                          id="label" 
                          value={formData.label} 
                          onChange={(e) => handleInputChange('label', e.target.value)} 
                          placeholder="e.g., Priority Access, Security Vehicle"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit and Cancel buttons */}
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Create VAPP
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

      {/* Statistics Dashboard */}
      <StatsGrid items={vappStats} />

      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find specific VAPPs by searching or filtering</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search VAPPs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VAPPs List */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Access Passes</CardTitle>
          <CardDescription>
            View all VAPPs with their current status and details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredVapps.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Car className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No VAPPs found matching your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Plate Number</TableHead>
                    <TableHead>Name & Surname</TableHead>
                    <TableHead>Mobile Number</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Justification</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Label</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVapps.map((vapp) => (
                    <TableRow key={vapp.id}>
                      <TableCell>
                        <div className="font-mono font-medium">{vapp.serialNumber}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono">{vapp.plateNumber}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vapp.name} {vapp.surname}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono">{vapp.mobileNumber}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{vapp.department}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={vapp.justification}>
                          {vapp.justification}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vapp.status)}`}>
                          {getStatusLabel(vapp.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{vapp.label || '-'}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
