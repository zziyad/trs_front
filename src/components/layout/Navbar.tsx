'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Plane,
  User,
  UserCircle,
  LogOut,
  ArrowLeft,
  Menu,
  Shield
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface NavbarProps {
  title?: string
  subtitle?: string
  showBackButton?: boolean
  backUrl?: string
  onBackClick?: () => void
  onMenuToggle?: () => void
  showMenuToggle?: boolean
}

export function Navbar({
  title = "Transport Reporting System",
  subtitle = "Airport Operations Management",
  showBackButton = false,
  backUrl,
  onBackClick,
  onMenuToggle,
  showMenuToggle = false
}: NavbarProps) {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      // logout() already handles navigation to login page
    } catch (error) {
      console.error('Logout failed:', error)
      // Fallback navigation if logout fails
      router.push('/login')
    }
  }

  const handleProfile = () => {
    router.push('/profile')
  }

  const handleAdminPanel = () => {
    router.push('/admin')
  }

  const handleBack = () => {
    if (onBackClick) {
      onBackClick()
    } else if (backUrl) {
      router.push(backUrl)
    } else {
      router.back()
    }
  }

  const handleLogoClick = () => {
    router.push('/dashboard')
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          {showMenuToggle && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuToggle}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Back Button */}
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}

          {/* Logo and Title */}
          <div className="flex items-center space-x-2" onClick={handleLogoClick}>
            <Plane className="h-6 w-6 text-primary" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold">{title}</h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* User Menu */}
        <div className="ml-auto flex items-center space-x-2">
          {isLoading ? (
            // Loading state
            <Button variant="ghost" size="sm" disabled>
              <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="hidden sm:inline-block">Loading...</span>
            </Button>
          ) : user ? (
            // Authenticated user
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <UserCircle className="h-6 w-6 mr-2" />
                  <span className="hidden sm:inline-block">{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.username}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfile}>
                  <User className="mr-2 h-5 w-5" />
                  <span>Profile</span>
                </DropdownMenuItem>
                {user.isAdmin && (
                  <DropdownMenuItem onClick={handleAdminPanel}>
                    <Shield className="mr-2 h-5 w-5" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-5 w-5" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Not authenticated
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/login')}
            >
              <UserCircle className="h-6 w-6 mr-2" />
              <span className="hidden sm:inline-block">Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
} 