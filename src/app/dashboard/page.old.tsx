// 'use client'

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Container } from '@/components/layout/Container'
// import { Plane, LogOut, User, Clock } from 'lucide-react'
// import { useAuth } from '@/contexts/AuthContext'
// import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
// // import { useState, useEffect } from 'react'

// // interface SessionAnalytics {
// //   totalSessions: number
// //   activeSessions: number
// //   redisSessions: number
// //   memorySessions: number
// //   totalActive: number
// //   uptime: number
// //   lastUpdated: string
// // }

// export default function DashboardPage() {
//   const { user, logout } = useAuth()
//   console.log('user', user)
//   // const [analytics, setAnalytics] = useState<SessionAnalytics | null>(null)
//   // const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false)

//   const handleLogout = async () => {
//     try {
//       await logout()
//     } catch (error) {
//       console.error('Logout failed:', error)
//     }
//   }

//   // const fetchAnalytics = async () => {
//   //   try {
//   //     setIsLoadingAnalytics(true)
//   //     const response = await fetch('/api/auth/analytics', {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify({}),
//   //     })
      
//   //     if (!response.ok) {
//   //       throw new Error(`HTTP error! status: ${response.status}`)
//   //     }
      
//   //     const data = await response.json()
//   //     console.log('Analytics response:', data)
      
//   //     if (data.result && data.result.status === 'fulfilled') {
//   //       setAnalytics(data.result.response)
//   //     } else {
//   //       console.error('Analytics failed:', data)
//   //     }
//   //   } catch (error) {
//   //     console.error('Failed to fetch analytics:', error)
//   //   } finally {
//   //     setIsLoadingAnalytics(false)
//   //   }
//   // }

//   // useEffect(() => {
//   //   fetchAnalytics()
//   //   // Refresh analytics every 30 seconds
//   //   const interval = setInterval(fetchAnalytics, 30000)
//   //   return () => clearInterval(interval)
//   // }, [])

//   // const formatUptime = (seconds: number) => {
//   //   const hours = Math.floor(seconds / 3600)
//   //   const minutes = Math.floor((seconds % 3600) / 60)
//   //   return `${hours}h ${minutes}m`
//   // }

//   return (
//     <ProtectedRoute>
//       <div className="min-h-screen bg-background">
//         <Container className="py-8">
//           <div className="flex justify-between items-center mb-8">
//             <div className="flex items-center space-x-3">
//               <Plane className="h-8 w-8 text-primary" />
//               <h1 className="text-3xl font-bold">Transport Reporting System</h1>
//             </div>
//             <Button onClick={handleLogout} variant="outline">
//               <LogOut className="h-4 w-4 mr-2" />
//               Logout
//             </Button>
//           </div>

//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <User className="h-5 w-5 mr-2" />
//                   User Profile
//                 </CardTitle>
//                 <CardDescription>Your account information</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   <div>
//                     <span className="font-medium">Email:</span>
//                     <p className="text-sm text-muted-foreground">{user?.email}</p>
//                   </div>
//                   {user?.username && (
//                     <div>
//                       <span className="font-medium">Username:</span>
//                       <p className="text-sm text-muted-foreground">{user.username}</p>
//                     </div>
//                   )}
//                   <div>
//                     <span className="font-medium">Role:</span>
//                     <p className="text-sm text-muted-foreground">
//                       {user?.isAdmin ? 'Administrator' : 'User'}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Activity className="h-5 w-5 mr-2" />
//                   Session Analytics
//                 </CardTitle>
//                 <CardDescription>System session information</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {isLoadingAnalytics ? (
//                   <div className="animate-pulse space-y-2">
//                     <div className="h-4 bg-gray-200 rounded"></div>
//                     <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                     <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                   </div>
//                 ) : analytics ? (
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span>Active Sessions:</span>
//                       <span className="font-medium">{analytics.totalActive}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Redis Sessions:</span>
//                       <span className="text-sm text-muted-foreground">{analytics.redisSessions}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Memory Sessions:</span>
//                       <span className="text-sm text-muted-foreground">{analytics.memorySessions}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Server Uptime:</span>
//                       <span className="text-sm text-muted-foreground">{formatUptime(analytics.uptime)}</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-sm text-muted-foreground">Failed to load analytics</p>
//                 )}
//               </CardContent>
//             </Card> */}

//             <Card>
//               <CardHeader>
//                 <CardTitle>Quick Actions</CardTitle>
//                 <CardDescription>Common tasks and shortcuts</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   <Button className="w-full" variant="outline">
//                     View Events
//                   </Button>
//                   <Button className="w-full" variant="outline">
//                     Create Report
//                   </Button>
//                   <Button className="w-full" variant="outline">
//                     Manage Passengers
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Clock className="h-5 w-5 mr-2" />
//                   System Status
//                 </CardTitle>
//                 <CardDescription>Current system information</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span>Status:</span>
//                     <span className="text-green-600">Online</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Last Login:</span>
//                     <span className="text-sm text-muted-foreground">Just now</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Session ID:</span>
//                     <span className="text-xs text-muted-foreground font-mono">
//                       {user?.sessionId || 'N/A'}
//                     </span>
//                   </div>
//                   {/* {analytics && (
//                     <div className="flex justify-between">
//                       <span>Last Updated:</span>
//                       <span className="text-xs text-muted-foreground">
//                         {new Date(analytics.lastUpdated).toLocaleTimeString()}
//                       </span>
//                     </div>
//                   )} */}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </Container>
//       </div>
//     </ProtectedRoute>
//   )
// } 
