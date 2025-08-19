'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, FileSpreadsheet, Calendar, Plane, Building, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { BarChart3, Calendar as CalendarIcon, FileText, Clock, Users } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

interface UserSession {
  user_id: number
  username: string
  email: string
  is_active: boolean
  permissions: string[]
}

interface FlightSchedule {
  flight_id: number
  event_id: number
  first_name: string
  last_name: string
  flight_number: string
  arrival_time: string
  property_name: string
  vehicle_standby_arrival_time: string
  departure_time: string
  vehicle_standby_departure_time: string
  status: string
  created_at: string
}

export default function FlightSchedulesPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = parseInt(params.eventId as string)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  // Mock flight schedules data
  const [schedules, setSchedules] = useState<FlightSchedule[]>([
    {
      flight_id: 1,
      event_id: eventId,
      first_name: "John",
      last_name: "Doe",
      flight_number: "AA123",
      arrival_time: "2024-07-15T10:30:00Z",
      property_name: "Grand Hotel Downtown",
      vehicle_standby_arrival_time: "2024-07-15T10:00:00Z",
      departure_time: "2024-07-17T16:45:00Z",
      vehicle_standby_departure_time: "2024-07-17T16:15:00Z",
      status: "Arrived",
      created_at: "2024-07-15T08:00:00Z"
    },
    {
      flight_id: 2,
      event_id: eventId,
      first_name: "Sarah",
      last_name: "Johnson",
      flight_number: "DL456",
      arrival_time: "2024-07-15T14:15:00Z",
      property_name: "Luxury Resort",
      vehicle_standby_arrival_time: "2024-07-15T13:45:00Z",
      departure_time: "2024-07-18T12:30:00Z",
      vehicle_standby_departure_time: "2024-07-18T12:00:00Z",
      status: "Delay",
      created_at: "2024-07-15T12:00:00Z"
    },
    {
      flight_id: 3,
      event_id: eventId,
      first_name: "Mike",
      last_name: "Davis",
      flight_number: "UA789",
      arrival_time: "2024-07-16T09:00:00Z",
      property_name: "Business Center Hotel",
      vehicle_standby_arrival_time: "2024-07-16T08:30:00Z",
      departure_time: "2024-07-19T18:00:00Z",
      vehicle_standby_departure_time: "2024-07-19T17:30:00Z",
      status: "pending",
      created_at: "2024-07-15T16:30:00Z"
    }
  ])

  // Check user permissions on component mount
  useEffect(() => {
    const checkUserPermissions = async () => {
      try {
        // Mock user session - in real app this would call your API
        const mockUserSession: UserSession = {
          user_id: 1,
          username: "Demo User",
          email: "demo@example.com",
          is_active: true,
          permissions: ["flight_schedules:read", "flight_schedules:upload", "flight_schedules:download", "flight_schedules:write"]
        }
        setUserSession(mockUserSession)
      } catch (error) {
        console.error('Error checking permissions:', error)
        toast.error('Failed to check permissions')
      } finally {
        setLoading(false)
      }
    }

    checkUserPermissions()
  }, [router])

  // Check if user has required permissions with defensive checks
  const hasReadPermission = userSession && Array.isArray(userSession.permissions) && userSession.permissions.includes('flight_schedules:read')
  const hasUploadPermission = userSession && Array.isArray(userSession.permissions) && userSession.permissions.includes('flight_schedules:upload')
  const hasDownloadPermission = userSession && Array.isArray(userSession.permissions) && userSession.permissions.includes('flight_schedules:download')
  const hasWritePermission = userSession && Array.isArray(userSession.permissions) && userSession.permissions.includes('flight_schedules:write')

  // Debug: Log raw schedules data before formatting
  console.log('Raw schedules data:', schedules)
  console.log('User session:', userSession)
  console.log('Permissions check:', {
    hasReadPermission,
    hasUploadPermission,
    hasDownloadPermission,
    hasWritePermission,
    permissions: userSession?.permissions
  })



  const STATUS_OPTIONS = [
    { value: 'Arrived', label: 'Arrived', color: 'bg-green-100 text-green-800' },
    { value: 'Delay', label: 'Delay', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'No show', label: 'No show', color: 'bg-red-100 text-red-800' },
    { value: 'Re scheduled', label: 'Re scheduled', color: 'bg-blue-100 text-blue-800' },
    { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
  ]

  const getStatusBadgeColor = (status: string) => {
    const found = STATUS_OPTIONS.find(opt => opt.value.toLowerCase() === status.toLowerCase())
    return found ? found.color : 'bg-gray-100 text-gray-800'
  }

  const [statusUpdating, setStatusUpdating] = useState<{ [flightId: number]: boolean }>({})
  const [localSchedules, setLocalSchedules] = useState(schedules)

  useEffect(() => {
    setLocalSchedules(schedules)
  }, [schedules])

  const handleStatusChange = (flightId: number, newStatus: string) => {
    if (!hasWritePermission) {
      toast.error('You do not have permission to update flight status')
      return
    }

    toast.custom((t) => (
      <div className="fixed left-1/2 top-1/3 z-50 -translate-x-1/2 rounded-lg bg-white shadow-lg p-6 min-w-[280px] flex flex-col items-center">
        <div className="font-medium mb-2">Change status to <span className={getStatusBadgeColor(newStatus) + ' px-2 py-1 rounded'}>{newStatus}</span>?</div>
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            onClick={async () => {
              toast.dismiss(t)
              setStatusUpdating(prev => ({ ...prev, [flightId]: true }))
              try {
                // Mock API call - in real app this would call your API
                await new Promise(resolve => setTimeout(resolve, 1000))
                toast.success('Status updated')
                // Update local state for immediate UI feedback
                setLocalSchedules(prev => prev.map(s => s.flight_id === flightId ? { ...s, status: newStatus } : s))
                             } catch {
                 toast.error('Failed to update status')
               } finally {
                setStatusUpdating(prev => ({ ...prev, [flightId]: false }))
              }
            }}
            disabled={statusUpdating[flightId]}
          >Confirm</Button>
          <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>Cancel</Button>
        </div>
      </div>
    ), { duration: 10000, position: 'top-center' })
  }

  const handleFileUpload = async (file: File) => {
    if (!hasUploadPermission) {
      toast.error('You do not have permission to upload flight schedules')
      return
    }

    try {
      setIsUploading(true)
      // Mock upload - in real app this would call your API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Add mock data to simulate upload
      const newSchedule: FlightSchedule = {
        flight_id: schedules.length + 1,
        event_id: eventId,
        first_name: "New",
        last_name: "Passenger",
        flight_number: "FL" + Math.floor(Math.random() * 1000),
        arrival_time: new Date().toISOString(),
        property_name: "New Hotel",
        vehicle_standby_arrival_time: new Date().toISOString(),
        departure_time: new Date(Date.now() + 86400000).toISOString(),
        vehicle_standby_departure_time: new Date(Date.now() + 86400000).toISOString(),
        status: "pending",
        created_at: new Date().toISOString()
      }
      
      setSchedules(prev => [...prev, newSchedule])
      toast.success('Flight schedule uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload flight schedule')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = async () => {
    if (!hasDownloadPermission) {
      toast.error('You do not have permission to download flight schedules')
      return
    }

    try {
      // Mock download - in real app this would call your API
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Flight schedule downloaded successfully')
    } catch {
      toast.error('Failed to download flight schedule')
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const formatDateTime = (dateTime: Date | string) => {
    const date = new Date(dateTime)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Check if user has read permission
  if (!hasReadPermission) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-4">
          You do not have permission to view flight schedules.
        </p>
        <p className="text-sm text-gray-500">
          Please contact your administrator to request access.
        </p>
      </div>
    )
  }

  // Ensure schedules is always an array
  const safeSchedules = Array.isArray(schedules) ? schedules : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Flight Schedules</h1>
          <p className="text-gray-600 mt-2">
            Manage flight schedules and passenger information
          </p>
        </div>
        <div className="flex gap-2">
          {hasDownloadPermission && safeSchedules.length > 0 && (
            <Button onClick={handleDownload} variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Download Schedule
            </Button>
          )}
        </div>
      </div>

      {/* Upload Section */}
      {hasUploadPermission && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FileSpreadsheet className="h-5 w-5" />
              Upload Flight Schedule
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Upload an Excel file with flight schedule information. The file should contain columns for First Name, Last Name, Flight Number, Arrival Date, Arrival Time, Property Name, Vehicle Standby, Departure Date, Departure Time, and Vehicle Standby.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                {isUploading ? 'Uploading...' : 'Upload Excel File'}
              </h3>
              <p className="text-gray-600 mb-4 text-xs sm:text-sm">
                Drag and drop your Excel file here, or click to browse
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="mb-2 w-full sm:w-auto"
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </Button>
              <p className="text-xs text-gray-500">
                Supports .xlsx and .xls files up to 10MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {safeSchedules.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 my-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{safeSchedules.length}</p>
                  <p className="text-sm text-gray-600">Total Passengers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(safeSchedules.map(s => s.flight_number)).size}
                  </p>
                  <p className="text-sm text-gray-600">Unique Flights</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(safeSchedules.map(s => s.property_name)).size}
                  </p>
                  <p className="text-sm text-gray-600">Properties</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(safeSchedules.map(s => new Date(s.arrival_time).toDateString())).size}
                  </p>
                  <p className="text-sm text-gray-600">Travel Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Flight Schedules List */}
      {safeSchedules.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Flight Schedules
            </CardTitle>
            <CardDescription>
              {safeSchedules.length} passenger{safeSchedules.length !== 1 ? 's' : ''} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {localSchedules.map((schedule) => (
                <div key={schedule.flight_id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">
                          {schedule.first_name} {schedule.last_name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {schedule.flight_number}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Arrival</p>
                          <p className="font-medium">{formatDateTime(schedule.arrival_time)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Departure</p>
                          <p className="font-medium">{formatDateTime(schedule.departure_time)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Property</p>
                          <p className="font-medium">{schedule.property_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status</p>
                          <Badge className={getStatusBadgeColor(schedule.status)}>
                            {schedule.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {hasWritePermission && (
                      <div className="flex items-center gap-2">
                        <Select
                          value={schedule.status}
                          onValueChange={(value) => handleStatusChange(schedule.flight_id, value)}
                          disabled={statusUpdating[schedule.flight_id]}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Plane className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Flight Schedules</h3>
            <p className="text-gray-600 mb-4">
              No flight schedules have been uploaded yet.
            </p>
            {hasUploadPermission && (
              <p className="text-sm text-gray-500">
                Upload an Excel file to get started.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 