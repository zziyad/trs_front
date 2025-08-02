'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'

interface TransportReport {
  id: number
  name: string
  surname: string
  email: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  tasks_completed: string
  meetings_attended: string
  issues_encountered: string
  pending_tasks: string
  support_notes: string
  created_at: string
}

export default function TransportReportsPage() {
  const [reports] = useState<TransportReport[]>([
    {
      id: 1,
      name: "John",
      surname: "Doe",
      email: "john.doe@example.com",
      date: "2024-07-15",
      status: "approved",
      tasks_completed: "Airport pickup, hotel transfer, conference transport",
      meetings_attended: "Morning briefing, afternoon debrief",
      issues_encountered: "Minor traffic delay on airport route",
      pending_tasks: "Follow up on vehicle maintenance",
      support_notes: "All passengers arrived safely and on time",
      created_at: "2024-07-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Jane",
      surname: "Smith",
      email: "jane.smith@example.com",
      date: "2024-07-16",
      status: "pending",
      tasks_completed: "VIP transport, airport drop-off",
      meetings_attended: "Security briefing, route planning",
      issues_encountered: "Weather conditions affected schedule",
      pending_tasks: "Coordinate with security team",
      support_notes: "VIP transport completed successfully",
      created_at: "2024-07-16T14:20:00Z"
    },
    {
      id: 3,
      name: "Mike",
      surname: "Johnson",
      email: "mike.johnson@example.com",
      date: "2024-07-17",
      status: "rejected",
      tasks_completed: "Regular shuttle service",
      meetings_attended: "Daily operations meeting",
      issues_encountered: "Vehicle breakdown, backup required",
      pending_tasks: "Vehicle inspection and repair",
      support_notes: "Service delayed due to mechanical issues",
      created_at: "2024-07-17T09:15:00Z"
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<TransportReport | null>(null)

  // Filter reports based on search term and status
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.tasks_completed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.meetings_attended.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.issues_encountered.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.pending_tasks.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.support_notes.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || report.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      case 'pending':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleViewReport = (report: TransportReport) => {
    setSelectedReport(report)
    setIsViewDialogOpen(true)
  }

  const handleCreateReport = () => {
    setIsCreateDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transport Reports</h1>
          <p className="text-muted-foreground">
            Submit new reports and view existing ones for this event
          </p>
        </div>
        <Button onClick={handleCreateReport}>
          <Plus className="mr-2 h-4 w-4" />
          Create Report
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {report.name} {report.surname}
                    </CardTitle>
                    <CardDescription>
                      {report.email} • {formatDate(report.date)}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(report.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewReport(report)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Tasks Completed:</p>
                  <p className="mt-1">{report.tasks_completed}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Meetings Attended:</p>
                  <p className="mt-1">{report.meetings_attended}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Issues Encountered:</p>
                  <p className="mt-1">{report.issues_encountered}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Pending Tasks:</p>
                  <p className="mt-1">{report.pending_tasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Report Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Transport Report</DialogTitle>
            <DialogDescription>
              Submit a new transport report for this event
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">First Name</Label>
                <Input id="name" placeholder="Enter first name" />
              </div>
              <div>
                <Label htmlFor="surname">Last Name</Label>
                <Input id="surname" placeholder="Enter last name" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email" />
            </div>
            <div>
              <Label htmlFor="tasks">Tasks Completed</Label>
              <Textarea id="tasks" placeholder="Describe tasks completed" />
            </div>
            <div>
              <Label htmlFor="meetings">Meetings Attended</Label>
              <Textarea id="meetings" placeholder="List meetings attended" />
            </div>
            <div>
              <Label htmlFor="issues">Issues Encountered</Label>
              <Textarea id="issues" placeholder="Describe any issues" />
            </div>
            <div>
              <Label htmlFor="pending">Pending Tasks</Label>
              <Textarea id="pending" placeholder="List pending tasks" />
            </div>
            <div>
              <Label htmlFor="notes">Support Notes</Label>
              <Textarea id="notes" placeholder="Additional notes" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast.success('Report created successfully!')
                setIsCreateDialogOpen(false)
              }}>
                Create Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Report Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transport Report Details</DialogTitle>
            <DialogDescription>
              View complete report information
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="text-sm font-medium">{selectedReport.name} {selectedReport.surname}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm font-medium">{selectedReport.email}</p>
                </div>
              </div>
              <div>
                <Label>Date</Label>
                <p className="text-sm font-medium">{formatDate(selectedReport.date)}</p>
              </div>
              <div>
                <Label>Status</Label>
                <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
              </div>
              <div>
                <Label>Tasks Completed</Label>
                <p className="text-sm mt-1">{selectedReport.tasks_completed}</p>
              </div>
              <div>
                <Label>Meetings Attended</Label>
                <p className="text-sm mt-1">{selectedReport.meetings_attended}</p>
              </div>
              <div>
                <Label>Issues Encountered</Label>
                <p className="text-sm mt-1">{selectedReport.issues_encountered}</p>
              </div>
              <div>
                <Label>Pending Tasks</Label>
                <p className="text-sm mt-1">{selectedReport.pending_tasks}</p>
              </div>
              <div>
                <Label>Support Notes</Label>
                <p className="text-sm mt-1">{selectedReport.support_notes}</p>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 