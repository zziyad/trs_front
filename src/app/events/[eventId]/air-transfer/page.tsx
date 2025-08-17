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
import { Plus, Upload, Plane, FileText, CheckCircle, Calendar } from 'lucide-react'
import { toast } from 'sonner'

interface Ticket {
  id: string
  name: string
  surname: string
  passportNumber: string
  passportExpiryDate: string
  dateOfBirth: string
  nationality: string
  flightNumber: string
  departureDate: string
  arrivalDate: string
  seatNumber: string
  ticketClass: string
  status: 'confirmed' | 'pending' | 'cancelled'
  createdAt: string
}

const nationalities = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan', 'China', 'India', 'Brazil']
const ticketClasses = ['Economy', 'Premium Economy', 'Business', 'First Class']

export default function AirTransferPage() {
  const params = useParams()
  const eventId = params.eventId as string

  // Initialize with mock data for demonstration
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      name: 'John',
      surname: 'Doe',
      passportNumber: 'A12345678',
      passportExpiryDate: '2025-12-31',
      dateOfBirth: '1985-06-15',
      nationality: 'United States',
      flightNumber: 'AA123',
      departureDate: '2024-03-20',
      arrivalDate: '2024-03-20',
      seatNumber: '12A',
      ticketClass: 'Economy',
      status: 'confirmed',
      createdAt: '2024-03-15T10:00:00.000Z'
    },
    {
      id: '2',
      name: 'Jane',
      surname: 'Smith',
      passportNumber: 'B87654321',
      passportExpiryDate: '2026-08-15',
      dateOfBirth: '1990-03-22',
      nationality: 'Canada',
      flightNumber: 'AA123',
      departureDate: '2024-03-20',
      arrivalDate: '2024-03-20',
      seatNumber: '12B',
      ticketClass: 'Economy',
      status: 'confirmed',
      createdAt: '2024-03-15T10:30:00.000Z'
    },
    {
      id: '3',
      name: 'Michael',
      surname: 'Johnson',
      passportNumber: 'C11223344',
      passportExpiryDate: '2027-01-10',
      dateOfBirth: '1988-11-05',
      nationality: 'United Kingdom',
      flightNumber: 'BA456',
      departureDate: '2024-03-21',
      arrivalDate: '2024-03-21',
      seatNumber: '15C',
      ticketClass: 'Business',
      status: 'pending',
      createdAt: '2024-03-15T11:00:00.000Z'
    },
    {
      id: '4',
      name: 'Sarah',
      surname: 'Williams',
      passportNumber: 'D55667788',
      passportExpiryDate: '2025-09-20',
      dateOfBirth: '1992-07-12',
      nationality: 'Australia',
      flightNumber: 'QF789',
      departureDate: '2024-03-22',
      arrivalDate: '2024-03-22',
      seatNumber: '8A',
      ticketClass: 'First Class',
      status: 'confirmed',
      createdAt: '2024-03-15T11:30:00.000Z'
    }
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    passportNumber: '',
    passportExpiryDate: '',
    dateOfBirth: '',
    nationality: '',
    flightNumber: '',
    departureDate: '',
    arrivalDate: '',
    seatNumber: '',
    ticketClass: '',
    status: 'confirmed' as const
  })

  const ticketStats = [
    {
      title: 'Total Tickets',
      value: tickets.length,
      description: 'All registered tickets',
      icon: FileText
    },
    {
      title: 'Confirmed',
      value: tickets.filter(t => t.status === 'confirmed').length,
      description: 'Confirmed tickets',
      icon: CheckCircle
    },
    {
      title: 'Pending',
      value: tickets.filter(t => t.status === 'pending').length,
      description: 'Pending approval',
      icon: Calendar
    },
    {
      title: 'Active Flights',
      value: new Set(tickets.map(t => t.flightNumber)).size,
      description: 'Unique flights',
      icon: Plane
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newTicket: Ticket = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    }

    // Log the new ticket before state update
    console.log('New ticket added:', newTicket)
    
    // Update state and log the updated list
    setTickets(prev => {
      const updatedTickets = [...prev, newTicket]
      console.log('Updated tickets list:', updatedTickets)
      return updatedTickets
    })
    
    setFormData({
      name: '', surname: '', passportNumber: '', passportExpiryDate: '', dateOfBirth: '',
      nationality: '', flightNumber: '', departureDate: '', arrivalDate: '', seatNumber: '',
      ticketClass: '', status: 'confirmed'
    })
    setIsModalOpen(false)
    toast.success('Ticket created successfully!')
  }

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const mockExcelData: Omit<Ticket, 'id' | 'createdAt'>[] = [
      {
        name: 'John', surname: 'Doe', passportNumber: 'A12345678', passportExpiryDate: '2025-12-31',
        dateOfBirth: '1985-06-15', nationality: 'United States', flightNumber: 'AA123',
        departureDate: '2024-03-20', arrivalDate: '2024-03-20', seatNumber: '12A',
        ticketClass: 'Economy', status: 'confirmed'
      },
      {
        name: 'Jane', surname: 'Smith', passportNumber: 'B87654321', passportExpiryDate: '2026-08-15',
        dateOfBirth: '1990-03-22', nationality: 'Canada', flightNumber: 'AA123',
        departureDate: '2024-03-20', arrivalDate: '2024-03-20', seatNumber: '12B',
        ticketClass: 'Economy', status: 'confirmed'
      }
    ]

    const newTickets: Ticket[] = mockExcelData.map((data, index) => ({
      ...data, id: `excel-${Date.now()}-${index}`, createdAt: new Date().toISOString()
    }))

    // Log the mock data and new tickets before state update
    console.log('Excel data uploaded:', mockExcelData)
    console.log('New tickets to be added:', newTickets)
    
    // Update state and log the updated list
    setTickets(prev => {
      const updatedTickets = [...prev, ...newTickets]
      console.log('Updated tickets list after Excel upload:', updatedTickets)
      return updatedTickets
    })
    
    toast.success(`${newTickets.length} tickets imported from Excel!`)
    
    // Reset file input
    e.target.value = ''
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Air Tickets Management"
        description="Manage air tickets, passenger information, and flight details for this event"
        actions={
          <div className="flex gap-2">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Air Ticket</DialogTitle>
                  <DialogDescription>Fill in all required information for the air ticket</DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="surname">Surname *</Label>
                        <Input id="surname" value={formData.surname} onChange={(e) => handleInputChange('surname', e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passportNumber">Passport Number *</Label>
                        <Input id="passportNumber" value={formData.passportNumber} onChange={(e) => handleInputChange('passportNumber', e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passportExpiryDate">Passport Expiry Date *</Label>
                        <Input id="passportExpiryDate" type="date" value={formData.passportExpiryDate} onChange={(e) => handleInputChange('passportExpiryDate', e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange('dateOfBirth', e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nationality">Nationality *</Label>
                        <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
                          <SelectTrigger><SelectValue placeholder="Select nationality" /></SelectTrigger>
                          <SelectContent>
                            {nationalities.map((nationality) => (
                              <SelectItem key={nationality} value={nationality}>{nationality}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Flight Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="flightNumber">Flight Number *</Label>
                        <Input id="flightNumber" value={formData.flightNumber} onChange={(e) => handleInputChange('flightNumber', e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="departureDate">Departure Date *</Label>
                        <Input id="departureDate" type="date" value={formData.departureDate} onChange={(e) => handleInputChange('departureDate', e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="arrivalDate">Arrival Date *</Label>
                        <Input id="arrivalDate" type="date" value={formData.arrivalDate} onChange={(e) => handleInputChange('arrivalDate', e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seatNumber">Seat Number *</Label>
                        <Input id="seatNumber" value={formData.seatNumber} onChange={(e) => handleInputChange('seatNumber', e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ticketClass">Ticket Class *</Label>
                        <Select value={formData.ticketClass} onValueChange={(value) => handleInputChange('ticketClass', value)}>
                          <SelectTrigger><SelectValue placeholder="Select ticket class" /></SelectTrigger>
                          <SelectContent>
                            {ticketClasses.map((ticketClass) => (
                              <SelectItem key={ticketClass} value={ticketClass}>{ticketClass}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select value={formData.status} onValueChange={(value: 'confirmed' | 'pending' | 'cancelled') => handleInputChange('status', value)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">Create Ticket</Button>
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <div className="relative">
              <input type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Excel
              </Button>
            </div>
          </div>
        }
      />

      <StatsGrid items={ticketStats} />

      <Card>
        <CardHeader>
          <CardTitle>Air Tickets</CardTitle>
          <CardDescription>View all registered air tickets for this event</CardDescription>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Plane className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No tickets created yet. Create your first ticket or upload an Excel file to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Passenger</TableHead>
                    <TableHead>Passport</TableHead>
                    <TableHead>Flight</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Seat</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.name} {ticket.surname}</div>
                          <div className="text-sm text-muted-foreground">{ticket.nationality}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-mono">{ticket.passportNumber}</div>
                          <div className="text-sm text-muted-foreground">Exp: {ticket.passportExpiryDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{ticket.flightNumber}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">Dep: {ticket.departureDate}</div>
                          <div className="text-sm">Arr: {ticket.arrivalDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono">{ticket.seatNumber}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{ticket.ticketClass}</div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
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
