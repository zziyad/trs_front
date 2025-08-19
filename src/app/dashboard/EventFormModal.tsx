'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'

interface Event {
  id: string
  name: string
  description: string
  guestNumber: number
  venue: string
  fleet: number
  country: string
  hotels: string[]
  destinations: string[]
  vapp: number
  startDate: string
  endDate: string
  status: 'planning' | 'active' | 'completed' | 'cancelled'
  organizer: string
  createdAt: string
  updatedAt: string
}

interface EventFormModalProps {
  mode: 'create' | 'edit'
  event?: Event
  onSubmit: (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void
  onClose: () => void
  onEventCreated?: (eventId: string) => void
}

export default function EventFormModal({ mode, event, onSubmit, onClose, onEventCreated }: EventFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    guestNumber: 10000,
    venue: '',
    fleet: 100,
    country: '',
    hotels: [''],
    destinations: [''],
    vapp: 1000,
    startDate: '',
    endDate: '',
    status: 'planning' as Event['status'],
    organizer: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (event && mode === 'edit') {
      setFormData({
        name: event.name,
        description: event.description,
        guestNumber: event.guestNumber,
        venue: event.venue,
        fleet: event.fleet,
        country: event.country,
        hotels: event.hotels.length > 0 ? event.hotels : [''],
        destinations: event.destinations.length > 0 ? event.destinations : [''],
        vapp: event.vapp,
        startDate: event.startDate,
        endDate: event.endDate,
        status: event.status,
        organizer: event.organizer
      })
    }
  }, [event, mode])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required'
    }

    if (formData.guestNumber < 1 || formData.guestNumber > 1000000) {
      newErrors.guestNumber = 'Guest number must be between 1 and 1,000,000'
    }

    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue is required'
    }

    if (formData.venue.length > 150) {
      newErrors.venue = 'Venue must be 150 characters or less'
    }

    if (formData.fleet < 1 || formData.fleet > 1000) {
      newErrors.fleet = 'Fleet size must be between 1 and 1,000'
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    }

    if (formData.vapp < 1 || formData.vapp > 10000) {
      newErrors.vapp = 'VAPP must be between 1 and 10,000'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date'
    }

    if (!formData.organizer.trim()) {
      newErrors.organizer = 'Organizer is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const eventData = {
      ...formData,
      hotels: formData.hotels.filter(hotel => hotel.trim() !== ''),
      destinations: formData.destinations.filter(dest => dest.trim() !== '')
    }

    onSubmit(eventData)
    
    // If this is a create operation and we have the callback, trigger redirect
    if (mode === 'create' && onEventCreated) {
      // Generate a temporary ID for redirect (will be replaced by actual ID from parent)
      const tempId = Date.now().toString()
      onEventCreated(tempId)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string | number | Event['status']) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addHotel = () => {
    setFormData(prev => ({ ...prev, hotels: [...prev.hotels, ''] }))
  }

  const removeHotel = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      hotels: prev.hotels.filter((_, i) => i !== index) 
    }))
  }

  const updateHotel = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      hotels: prev.hotels.map((hotel, i) => i === index ? value : hotel)
    }))
  }

  const addDestination = () => {
    setFormData(prev => ({ ...prev, destinations: [...prev.destinations, ''] }))
  }

  const removeDestination = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      destinations: prev.destinations.filter((_, i) => i !== index) 
    }))
  }

  const updateDestination = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.map((dest, i) => i === index ? value : dest)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter event name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizer">Organizer *</Label>
            <Input
              id="organizer"
              value={formData.organizer}
              onChange={(e) => handleInputChange('organizer', e.target.value)}
              placeholder="Enter organizer name"
              className={errors.organizer ? 'border-red-500' : ''}
            />
            {errors.organizer && <p className="text-sm text-red-500">{errors.organizer}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Event Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the event"
            rows={3}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
        </div>

        {/* Capacity & Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="guestNumber">Guest Number *</Label>
            <Input
              id="guestNumber"
              type="number"
              min="1"
              max="1000000"
              value={formData.guestNumber}
              onChange={(e) => handleInputChange('guestNumber', parseInt(e.target.value) || 0)}
              placeholder="10000"
              className={errors.guestNumber ? 'border-red-500' : ''}
            />
            <p className="text-xs text-muted-foreground">Max: 1,000,000</p>
            {errors.guestNumber && <p className="text-sm text-red-500">{errors.guestNumber}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fleet">Fleet Size *</Label>
            <Input
              id="fleet"
              type="number"
              min="1"
              max="1000"
              value={formData.fleet}
              onChange={(e) => handleInputChange('fleet', parseInt(e.target.value) || 0)}
              placeholder="100"
              className={errors.fleet ? 'border-red-500' : ''}
            />
            <p className="text-xs text-muted-foreground">Max: 1,000</p>
            {errors.fleet && <p className="text-sm text-red-500">{errors.fleet}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vapp">VAPP *</Label>
            <Input
              id="vapp"
              type="number"
              min="1"
              max="10000"
              value={formData.vapp}
              onChange={(e) => handleInputChange('vapp', parseInt(e.target.value) || 0)}
              placeholder="1000"
              className={errors.vapp ? 'border-red-500' : ''}
            />
            <p className="text-xs text-muted-foreground">Max: 10,000</p>
            {errors.vapp && <p className="text-sm text-red-500">{errors.vapp}</p>}
          </div>
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="venue">Venue *</Label>
            <Input
              id="venue"
              value={formData.venue}
              onChange={(e) => handleInputChange('venue', e.target.value)}
              placeholder="Enter venue name"
              maxLength={150}
              className={errors.venue ? 'border-red-500' : ''}
            />
            <p className="text-xs text-muted-foreground">
              {formData.venue.length}/150 characters
            </p>
            {errors.venue && <p className="text-sm text-red-500">{errors.venue}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="Enter country"
              className={errors.country ? 'border-red-500' : ''}
            />
            {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
          </div>
        </div>

        {/* Hotels */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Hotels</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addHotel}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Hotel
            </Button>
          </div>
          
          <div className="space-y-3">
            {formData.hotels.map((hotel, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={hotel}
                  onChange={(e) => updateHotel(index, e.target.value)}
                  placeholder={`Hotel ${index + 1}`}
                  className="flex-1"
                />
                {formData.hotels.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeHotel(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Destinations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Destinations</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDestination}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Destination
            </Button>
          </div>
          
          <div className="space-y-3">
            {formData.destinations.map((destination, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={destination}
                  onChange={(e) => updateDestination(index, e.target.value)}
                  placeholder={`Destination ${index + 1}`}
                  className="flex-1"
                />
                {formData.destinations.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeDestination(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dates & Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className={errors.startDate ? 'border-red-500' : ''}
            />
            {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date *</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className={errors.endDate ? 'border-red-500' : ''}
            />
            {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: Event['status']) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            {mode === 'create' ? 'Cancel' : 'Cancel Edit'}
          </Button>
          <Button type="submit">
            {mode === 'create' ? 'Create Event' : 'Update Event'}
          </Button>
        </div>
      </form>
  )
}
