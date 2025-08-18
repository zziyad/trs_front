'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, User, CreditCard, Globe, Phone, Camera } from 'lucide-react'

interface DriverFormData {
  fullName: string
  nationalID: string
  nationality: string
  phoneNumber: string
  photo: File | null
}

export default function FleetDriversPage() {
  const params = useParams()
  const eventId = params.eventId as string

  const [formData, setFormData] = useState<DriverFormData>({
    fullName: '',
    nationalID: '',
    nationality: '',
    phoneNumber: '',
    photo: null
  })

  const [errors, setErrors] = useState<Partial<DriverFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof DriverFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file && !file.type.startsWith('image/')) {
      alert('Please select an image file')
      event.target.value = ''
      return
    }
    setFormData(prev => ({ ...prev, photo: file }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<DriverFormData> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Driver name is required'
    }
    if (!formData.nationalID.trim()) {
      newErrors.nationalID = 'National ID is required'
    }
    if (!formData.nationality.trim()) {
      newErrors.nationality = 'Nationality is required'
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare data for console output
      const outputData = {
        fullName: formData.fullName.trim(),
        nationalID: formData.nationalID.trim(),
        nationality: formData.nationality.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        photo: formData.photo ? formData.photo.name : null
      }

      // Log the collected data to console
      console.log('Driver Form Data Submitted:', outputData)

      // Reset form after successful submission
      setFormData({
        fullName: '',
        nationalID: '',
        nationality: '',
        phoneNumber: '',
        photo: null
      })
      setErrors({})

      // Show success message
      alert('Driver information submitted successfully! Check console for data.')

    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error submitting form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver Management"
        description="Manage driver information, licenses, and assignments for this event"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Driver Information Form
          </CardTitle>
          <CardDescription>
            Fill in all required driver details. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Driver Name & Surname */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Driver Name & Surname *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter driver's full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* National ID */}
            <div className="space-y-2">
              <Label htmlFor="nationalID" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                National ID *
              </Label>
              <Input
                id="nationalID"
                type="text"
                placeholder="Enter national ID number"
                value={formData.nationalID}
                onChange={(e) => handleInputChange('nationalID', e.target.value)}
                className={errors.nationalID ? 'border-red-500' : ''}
              />
              {errors.nationalID && (
                <p className="text-sm text-red-500">{errors.nationalID}</p>
              )}
            </div>

            {/* Nationality */}
            <div className="space-y-2">
              <Label htmlFor="nationality" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Nationality *
              </Label>
              <Input
                id="nationality"
                type="text"
                placeholder="Enter nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                className={errors.nationality ? 'border-red-500' : ''}
              />
              {errors.nationality && (
                <p className="text-sm text-red-500">{errors.nationality}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter phone number (e.g., +994501234567)"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={errors.phoneNumber ? 'border-red-500' : ''}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="photo" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Photo (Optional)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {formData.photo && (
                  <span className="text-sm text-muted-foreground">
                    Selected: {formData.photo.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Accepted formats: JPG, PNG, GIF, WebP. Maximum size: 5MB.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Driver Information
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Fill in all required fields marked with *</p>
          <p>2. Optionally upload a driver photo (image files only)</p>
          <p>3. Click "Submit Driver Information" to save</p>
          <p>4. Check the browser console to see the submitted data</p>
          <p>5. The form will reset after successful submission</p>
        </CardContent>
      </Card>
    </div>
  )
}
