'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PageHeader, StatsGrid } from '@/components/layout'
import { FileText, Clock, CheckCircle, AlertTriangle, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface VisaApplication {
  id: string
  eventId: string
  fullName: string
  dob: string
  placeOfBirth: string
  gender: string
  nationality: string
  passportNumber: string
  passportIssueDate: string
  passportExpiryDate: string
  passportPlaceOfIssue: string
  address: string
  city: string
  country: string
  phone: string
  email: string
  purposeOfVisit: string
  entryDate: string
  exitDate: string
  entries: string
  hotelName: string
  hotelAddress: string
  hotelPhone: string
  occupation: string
  employerName: string
  employerAddress: string
  employerPhone: string
  declaration: boolean
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
}

export default function EventVisaPage() {
  const params = useParams()
  const eventId = params.eventId as string
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<Omit<VisaApplication, 'id' | 'eventId' | 'status' | 'submittedAt'>>({
    fullName: '',
    dob: '',
    placeOfBirth: '',
    gender: '',
    nationality: '',
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    passportPlaceOfIssue: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    purposeOfVisit: '',
    entryDate: '',
    exitDate: '',
    entries: '',
    hotelName: '',
    hotelAddress: '',
    hotelPhone: '',
    occupation: '',
    employerName: '',
    employerAddress: '',
    employerPhone: '',
    declaration: false
  })

  const [visaApplications, setVisaApplications] = useState<VisaApplication[]>([
    {
      id: '1',
      eventId: eventId,
      fullName: 'John Doe',
      dob: '1990-01-01',
      placeOfBirth: 'Baku',
      gender: 'Male',
      nationality: 'Azerbaijani',
      passportNumber: 'AZ1234567',
      passportIssueDate: '2020-01-01',
      passportExpiryDate: '2030-01-01',
      passportPlaceOfIssue: 'Baku',
      address: '123 Street Name',
      city: 'Baku',
      country: 'Azerbaijan',
      phone: '+994501234567',
      email: 'john.doe@email.com',
      purposeOfVisit: 'Tourism',
      entryDate: '2025-09-01',
      exitDate: '2025-09-10',
      entries: 'Single',
      hotelName: 'Grand Hotel',
      hotelAddress: '456 Avenue',
      hotelPhone: '+994501112233',
      occupation: 'Engineer',
      employerName: 'TechCorp',
      employerAddress: '789 Business Street',
      employerPhone: '+994551234567',
      declaration: true,
      status: 'pending',
      submittedAt: '2025-01-15T10:00:00Z'
    },
    {
      id: '2',
      eventId: eventId,
      fullName: 'Jane Smith',
      dob: '1985-05-15',
      placeOfBirth: 'London',
      gender: 'Female',
      nationality: 'British',
      passportNumber: 'GB9876543',
      passportIssueDate: '2019-06-01',
      passportExpiryDate: '2029-06-01',
      passportPlaceOfIssue: 'London',
      address: '456 Park Lane',
      city: 'London',
      country: 'United Kingdom',
      phone: '+44123456789',
      email: 'jane.smith@email.com',
      purposeOfVisit: 'Business',
      entryDate: '2025-08-15',
      exitDate: '2025-08-25',
      entries: 'Multiple',
      hotelName: 'Business Hotel',
      hotelAddress: '789 Business Street',
      hotelPhone: '+44123456788',
      occupation: 'Manager',
      employerName: 'BusinessCorp',
      employerAddress: '321 Corporate Ave',
      employerPhone: '+44123456787',
      declaration: true,
      status: 'approved',
      submittedAt: '2025-01-14T14:00:00Z'
    }
  ])

  const visaStats = [
    {
      title: 'Total Applications',
      value: visaApplications.length,
      description: 'All visa applications',
      icon: FileText
    },
    {
      title: 'Pending',
      value: visaApplications.filter(app => app.status === 'pending').length,
      description: 'Awaiting review',
      icon: Clock
    },
    {
      title: 'Approved',
      value: visaApplications.filter(app => app.status === 'approved').length,
      description: 'Approved applications',
      icon: CheckCircle
    },
    {
      title: 'Rejected',
      value: visaApplications.filter(app => app.status === 'rejected').length,
      description: 'Rejected applications',
      icon: AlertTriangle
    }
  ]

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = [
      'fullName', 'dob', 'placeOfBirth', 'gender', 'nationality',
      'passportNumber', 'passportIssueDate', 'passportExpiryDate', 'passportPlaceOfIssue',
      'address', 'city', 'country', 'phone', 'email',
      'purposeOfVisit', 'entryDate', 'exitDate', 'entries',
      'hotelName', 'hotelAddress', 'hotelPhone',
      'occupation', 'employerName', 'employerAddress', 'employerPhone'
    ]
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }

    if (!formData.declaration) {
      toast.error('Please accept the declaration')
      return
    }

    // Create new visa application
    const newApplication: VisaApplication = {
      id: Date.now().toString(),
      eventId: eventId,
      ...formData,
      status: 'pending',
      submittedAt: new Date().toISOString()
    }

    // Add to list
    setVisaApplications(prev => [newApplication, ...prev])

    // Log to console as required
    console.log('New Visa Application Submitted:', newApplication)

    // Show success message
    toast.success('Visa application submitted successfully!')

    // Clear form and close modal
    setFormData({
      fullName: '',
      dob: '',
      placeOfBirth: '',
      gender: '',
      nationality: '',
      passportNumber: '',
      passportIssueDate: '',
      passportExpiryDate: '',
      passportPlaceOfIssue: '',
      address: '',
      city: '',
      country: '',
      phone: '',
      email: '',
      purposeOfVisit: '',
      entryDate: '',
      exitDate: '',
      entries: '',
      hotelName: '',
      hotelAddress: '',
      hotelPhone: '',
      occupation: '',
      employerName: '',
      employerAddress: '',
      employerPhone: '',
      declaration: false
    })
    
    setIsModalOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'rejected':
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
        title="Event Visa Applications"
        description="Manage visa applications for this event"
        actions={
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Visa Application
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Visa Application</DialogTitle>
                <DialogDescription>
                  Fill in all required information for the visa application
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="dob">Date of Birth *</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dob}
                        onChange={(e) => handleInputChange('dob', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                      <Input
                        id="placeOfBirth"
                        value={formData.placeOfBirth}
                        onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                        placeholder="City, Country"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="gender">Gender *</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nationality">Nationality *</Label>
                      <Input
                        id="nationality"
                        value={formData.nationality}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        placeholder="Your nationality"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="passportNumber">Passport Number *</Label>
                      <Input
                        id="passportNumber"
                        value={formData.passportNumber}
                        onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                        placeholder="Passport number"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="passportIssueDate">Date of Issue *</Label>
                      <Input
                        id="passportIssueDate"
                        type="date"
                        value={formData.passportIssueDate}
                        onChange={(e) => handleInputChange('passportIssueDate', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="passportExpiryDate">Date of Expiry *</Label>
                      <Input
                        id="passportExpiryDate"
                        type="date"
                        value={formData.passportExpiryDate}
                        onChange={(e) => handleInputChange('passportExpiryDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="passportPlaceOfIssue">Place of Issue *</Label>
                    <Input
                      id="passportPlaceOfIssue"
                      value={formData.passportPlaceOfIssue}
                      onChange={(e) => handleInputChange('passportPlaceOfIssue', e.target.value)}
                      placeholder="City, Country"
                      required
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address">Residential Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Street address"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        placeholder="Country"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
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
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Travel Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Travel Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="purposeOfVisit">Purpose of Visit *</Label>
                      <Select value={formData.purposeOfVisit} onValueChange={(value) => handleInputChange('purposeOfVisit', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tourism">Tourism</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Study">Study</SelectItem>
                          <SelectItem value="Work">Work</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="entries">Number of Entries *</Label>
                      <Select value={formData.entries} onValueChange={(value) => handleInputChange('entries', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select entries" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Double">Double</SelectItem>
                          <SelectItem value="Multiple">Multiple</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="entryDate">Intended Date of Entry *</Label>
                      <Input
                        id="entryDate"
                        type="date"
                        value={formData.entryDate}
                        onChange={(e) => handleInputChange('entryDate', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="exitDate">Intended Date of Exit *</Label>
                      <Input
                        id="exitDate"
                        type="date"
                        value={formData.exitDate}
                        onChange={(e) => handleInputChange('exitDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Accommodation Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Accommodation Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hotelName">Hotel/Host Name *</Label>
                      <Input
                        id="hotelName"
                        value={formData.hotelName}
                        onChange={(e) => handleInputChange('hotelName', e.target.value)}
                        placeholder="Hotel or host name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="hotelPhone">Phone *</Label>
                      <Input
                        id="hotelPhone"
                        type="tel"
                        value={formData.hotelPhone}
                        onChange={(e) => handleInputChange('hotelPhone', e.target.value)}
                        placeholder="+1234567890"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="hotelAddress">Address *</Label>
                    <Input
                      id="hotelAddress"
                      value={formData.hotelAddress}
                      onChange={(e) => handleInputChange('hotelAddress', e.target.value)}
                      placeholder="Hotel/host address"
                      required
                    />
                  </div>
                </div>

                {/* Employment/Education */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Employment/Education</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="occupation">Occupation *</Label>
                      <Input
                        id="occupation"
                        value={formData.occupation}
                        onChange={(e) => handleInputChange('occupation', e.target.value)}
                        placeholder="Your occupation"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="employerName">Employer/School Name *</Label>
                      <Input
                        id="employerName"
                        value={formData.employerName}
                        onChange={(e) => handleInputChange('employerName', e.target.value)}
                        placeholder="Company or school name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employerAddress">Employer/School Address *</Label>
                      <Input
                        id="employerAddress"
                        value={formData.employerAddress}
                        onChange={(e) => handleInputChange('employerAddress', e.target.value)}
                        placeholder="Company or school address"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="employerPhone">Phone *</Label>
                      <Input
                        id="employerPhone"
                        type="tel"
                        value={formData.employerPhone}
                        onChange={(e) => handleInputChange('employerPhone', e.target.value)}
                        placeholder="+1234567890"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Declaration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Declaration</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="declaration"
                      checked={formData.declaration}
                      onCheckedChange={(checked) => handleInputChange('declaration', checked as boolean)}
                      required
                    />
                    <Label htmlFor="declaration" className="text-sm">
                      I declare that the above information is true and correct to the best of my knowledge *
                    </Label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Submit Visa Application
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
      
      <StatsGrid items={visaStats} />
      
      {/* Visa Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Visa Applications</CardTitle>
          <CardDescription>View all submitted applications for this event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {visaApplications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No visa applications submitted yet for this event.
              </p>
            ) : (
              visaApplications.map((application) => (
                <div key={application.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{application.fullName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Passport: {application.passportNumber} | Nationality: {application.nationality}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(application.submittedAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Purpose:</span> {application.purposeOfVisit}
                    </div>
                    <div>
                      <span className="font-medium">Entry Date:</span> {formatDate(application.entryDate)}
                    </div>
                    <div>
                      <span className="font-medium">Exit Date:</span> {formatDate(application.exitDate)}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Contact:</span> {application.phone} | {application.email}
                      </div>
                      <div>
                        <span className="font-medium">Accommodation:</span> {application.hotelName}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
