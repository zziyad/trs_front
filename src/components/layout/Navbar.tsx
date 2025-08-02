'use client'

import React, { useState } from 'react'
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

interface UserSession {
  user_id: number
  username: string
  email: string
  is_active: boolean
  permissions: string[]
}

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
  const [userSession] = useState<UserSession | null>({
    user_id: 1,
    username: "Demo User",
    email: "demo@example.com",
    is_active: true,
    permissions: ["read", "write"]
  })

  const handleLogout = () => {
    // Mock logout - in real app would call API
    router.push('/login')
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
          {userSession && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <UserCircle className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline-block">{userSession.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{userSession.username}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {userSession.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfile}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                {userSession.permissions.includes('admin') && (
                  <DropdownMenuItem onClick={handleAdminPanel}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
} 