'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { removeClientAuthToken } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, LogIn, X } from 'lucide-react'

interface SessionExpiredModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SessionExpiredModal({ isOpen, onClose }: SessionExpiredModalProps) {
  const router = useRouter()
  const { logout } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleLoginAgain = async () => {
    setIsRedirecting(true)
    console.log('Session expired modal: Log In Again clicked')
    
    try {
      // Clear everything manually
      removeClientAuthToken()
      console.log('Token removed manually')
      
      // Force redirect to login
      console.log('Redirecting to login page...')
      window.location.href = '/login'
    } catch (error) {
      console.error('Error during redirect:', error)
      // Fallback redirect
      window.location.href = '/login'
    }
  }

  const handleDismiss = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md p-4">
        <Card className="border-2 border-destructive/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl text-destructive">Session Expired</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your session has expired. Please log in again to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              For security reasons, you have been automatically logged out due to inactivity.
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleLoginAgain} 
                disabled={isRedirecting}
                className="flex-1"
              >
                <LogIn className="mr-2 h-4 w-4" />
                {isRedirecting ? 'Redirecting...' : 'Log In Again'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDismiss}
                disabled={isRedirecting}
                size="icon"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 