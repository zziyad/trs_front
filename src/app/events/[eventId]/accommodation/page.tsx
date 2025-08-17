'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PageHeader, StatsGrid } from '@/components/layout'
import { Users, Phone, Mail, Calendar, Bed, Plus, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Accommodation {
  id: string
  eventId: string
  guestName: string
  phoneNumber: string
  email: string
  checkInDate: string
  checkOutDate: string
  roomType: string
  specialRequests: string
  status: 'checked-in' | 'checked-out'
  additionalNotes: string
  createdAt: string
}

export default function EventAccommodationPage() {
  const params = useParams()
  const eventId = params.eventId as string
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<Omit<Accommodation, 'id' | 'eventId' | 'createdAt'>>({
    guestName: '',
    phoneNumber: '',
    email: '',
    checkInDate: '',
    checkOutDate: '',
    roomType: '',
    specialRequests: '',
    status: 'checked-in',
    additionalNotes: ''
  })

  const [accommodations, setAccommodations] = useState<Accommodation[]>([
    {
      id: '1',
      eventId: eventId,
      guestName: 'John Smith',
      phoneNumber: '+1234567890',
      email: 'john.smith@email.com',
      checkInDate: '2025-01-15',
      checkOutDate: '2025-01-20',
      roomType: 'Standard Double',
      specialRequests: 'Early check-in if possible',
      status: 'checked-in',
      additionalNotes: 'VIP guest - provide extra amenities',
      createdAt: '2025-01-10T09:00:00Z'
    },
    {
      id: '2',
      eventId: eventId,
      guestName: 'Sarah Johnson',
      phoneNumber: '+1987654321',
      email: 'sarah.johnson@email.com',
      checkInDate: '2025-01-16',
      checkOutDate: '2025-01-22',
      roomType: 'Deluxe Suite',
      specialRequests: 'Non-smoking room, high floor',
      status: 'checked-in',
      additionalNotes: 'Allergic to feathers - provide alternative pillows',
      createdAt: '2025-01-11T14:00:00Z'
    },
    {
      id: '3',
      eventId: eventId,
      guestName: 'Mike Wilson',
      phoneNumber: '+1555123456',
      email: 'mike.wilson@email.com',
      checkInDate: '2025-01-14',
      checkOutDate: '2025-01-18',
      roomType: 'Standard Single',
      specialRequests: 'Late check-out until 2 PM',
      status: 'checked-out',
      additionalNotes: 'Business traveler - quiet room preferred',
      createdAt: '2025-01-09T11:00:00Z'
    }
  ])

  const accommodationStats = [
    {
      title: 'Total Bookings',
      value: accommodations.length,
      description: 'All accommodations',
      icon: Bed
    },
    {
      title: 'Checked In',
      value: accommodations.filter(acc => acc.status === 'checked-in').length,
      description: 'Currently staying',
      icon: CheckCircle
    },
    {
      title: 'Checked Out',
      value: accommodations.filter(acc => acc.status === 'checked-out').length,
      description: 'Completed stays',
      icon: XCircle
    },
    {
      title: 'Active Stays',
      value: accommodations.filter(acc => {
        const today = new Date()
        const checkIn = new Date(acc.checkInDate)
        const checkOut = new Date(acc.checkOutDate)
        return checkIn <= today && today <= checkOut && acc.status === 'checked-in'
      }).length,
      description: 'Current guests',
      icon: Users
    }
  ]

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!formData.guestName || !formData.phoneNumber || !formData.email || 
        !formData.checkInDate || !formData.checkOutDate || !formData.roomType) {
      toast.error('Please fill in all required fields')
      return false
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return false
    }

    const checkIn = new Date(formData.checkInDate)
    const checkOut = new Date(formData.checkOutDate)
    
    if (checkOut <= checkIn) {
      toast.error('Check-out date must be after check-in date')
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Create new accommodation
    const newAccommodation: Accommodation = {
      id: Date.now().toString(),
      eventId: eventId,
      ...formData,
      createdAt: new Date().toISOString()
    }

    // Add to list
    setAccommodations(prev => [newAccommodation, ...prev])

    // Log to console as required
    console.log('New Accommodation Created:', newAccommodation)

    // Show success message
    toast.success('Accommodation booking created successfully!')

    // Clear form and close modal
    setFormData({
      guestName: '',
      phoneNumber: '',
      email: '',
      checkInDate: '',
      checkOutDate: '',
      roomType: '',
      specialRequests: '',
      status: 'checked-in',
      additionalNotes: ''
    })
    
    setIsModalOpen(false)
  }

  const handleStatusToggle = (accommodationId: string) => {
    setAccommodations(prev => prev.map(acc => 
      acc.id === accommodationId 
        ? { ...acc, status: acc.status === 'checked-in' ? 'checked-out' : 'checked-in' }
        : acc
    ))
    toast.success('Accommodation status updated successfully!')
  }

  const handleDelete = (accommodationId: string) => {
    setAccommodations(prev => prev.filter(acc => acc.id !== accommodationId))
    toast.success('Accommodation booking deleted successfully!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'checked-out':
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checked-in':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'checked-out':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Bed className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Accommodation Management"
        description="Manage guest accommodations and room bookings for this event"
        actions={
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Accommodation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Accommodation Booking</DialogTitle>
                <DialogDescription>
                  Fill in all required information for the accommodation booking
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Guest Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Guest Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="guestName">Guest Name *</Label>
                      <Input
                        id="guestName"
                        value={formData.guestName}
                        onChange={(e) => handleInputChange('guestName', e.target.value)}
                        placeholder="Enter guest full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        placeholder="+1234567890"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="guest@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Stay Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Stay Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkInDate">Check-in Date *</Label>
                      <Input
                        id="checkInDate"
                        type="date"
                        value={formData.checkInDate}
                        onChange={(e) => handleInputChange('checkInDate', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="checkOutDate">Check-out Date *</Label>
                      <Input
                        id="checkOutDate"
                        type="date"
                        value={formData.checkOutDate}
                        onChange={(e) => handleInputChange('checkOutDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="roomType">Room Type *</Label>
                    <Select value={formData.roomType} onValueChange={(value) => handleInputChange('roomType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard Single">Standard Single</SelectItem>
                        <SelectItem value="Standard Double">Standard Double</SelectItem>
                        <SelectItem value="Deluxe Suite">Deluxe Suite</SelectItem>
                        <SelectItem value="Executive Suite">Executive Suite</SelectItem>
                        <SelectItem value="Presidential Suite">Presidential Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Special Requests & Notes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Special Requests & Notes</h3>
                  
                  <div>
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      placeholder="Any special requests or preferences"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                      placeholder="Additional information about the guest or booking"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Status</h3>
                  
                  <div>
                    <Label>Current Status</Label>
                    <RadioGroup
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value)}
                      className="flex flex-col space-y-1 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="checked-in" id="checked-in" />
                        <Label htmlFor="checked-in" className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Checked-in (Green)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="checked-out" id="checked-out" />
                        <Label htmlFor="checked-out" className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          Checked-out (Red)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Create Booking
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
      
      <StatsGrid items={accommodationStats} />
      
      {/* Accommodations List */}
      <Card>
        <CardHeader>
          <CardTitle>Accommodation Bookings</CardTitle>
          <CardDescription>View all accommodation bookings for this event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accommodations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No accommodation bookings created yet for this event.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Guest</th>
                      <th className="text-left p-2 font-medium">Contact</th>
                      <th className="text-left p-2 font-medium">Stay Dates</th>
                      <th className="text-left p-2 font-medium">Room Type</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accommodations.map((accommodation) => (
                      <tr key={accommodation.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{accommodation.guestName}</div>
                            {accommodation.specialRequests && (
                              <div className="text-xs text-muted-foreground">
                                {accommodation.specialRequests}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {accommodation.phoneNumber}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {accommodation.email}
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(accommodation.checkInDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(accommodation.checkOutDate)}
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <Bed className="h-3 w-3" />
                              {accommodation.roomType}
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(accommodation.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(accommodation.status)}`}>
                              {accommodation.status.charAt(0).toUpperCase() + accommodation.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusToggle(accommodation.id)}
                            >
                              {accommodation.status === 'checked-in' ? 'Check Out' : 'Check In'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(accommodation.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
