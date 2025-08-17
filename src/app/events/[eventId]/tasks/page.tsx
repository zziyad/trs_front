'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader, StatsGrid } from '@/components/layout'
import { CheckSquare, Plus, Clock, CheckCircle, AlertTriangle, ArrowUpDown, Calendar } from 'lucide-react'
import { toast } from 'sonner'

interface Task {
  id: string
  eventId: string
  name: string
  description: string
  deadline: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  status: 'active' | 'completed'
  createdBy: string
  createdAt: string
}

export default function EventTasksPage() {
  const params = useParams()
  const eventId = params.eventId as string
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [sortByPriority, setSortByPriority] = useState(false)
  const [sortByDate, setSortByDate] = useState(false)
  
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'eventId' | 'status' | 'createdBy' | 'createdAt'>>({
    name: '',
    description: '',
    deadline: '',
    priority: 'medium'
  })

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      eventId: eventId,
      name: 'Call Accountant',
      description: 'Ask for tax deadlines',
      deadline: '2025-05-20T17:00:00',
      priority: 'high',
      status: 'active',
      createdBy: 'Current User',
      createdAt: '2025-01-15T10:00:00Z'
    },
    {
      id: '2',
      eventId: eventId,
      name: 'Review Budget',
      description: 'Check event budget allocation',
      deadline: '2025-05-25T18:00:00',
      priority: 'urgent',
      status: 'active',
      createdBy: 'Current User',
      createdAt: '2025-01-14T14:00:00Z'
    },
    {
      id: '3',
      eventId: eventId,
      name: 'Confirm Venue',
      description: 'Finalize venue booking details',
      deadline: '2025-05-30T16:00:00',
      priority: 'medium',
      status: 'completed',
      createdBy: 'Current User',
      createdAt: '2025-01-13T09:00:00Z'
    }
  ])

  // Calculate statistics
  const totalTasks = tasks.length
  const activeTasks = tasks.filter(task => task.status === 'active').length
  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const urgentTasks = tasks.filter(task => task.priority === 'urgent' && task.status === 'active').length

  const taskStats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      description: 'All tasks',
      icon: CheckSquare
    },
    {
      title: 'Active',
      value: activeTasks,
      description: 'Unresolved tasks',
      icon: Clock
    },
    {
      title: 'Completed',
      value: completedTasks,
      description: 'Resolved tasks',
      icon: CheckCircle
    },
    {
      title: 'Urgent',
      value: urgentTasks,
      description: 'High priority',
      icon: AlertTriangle
    }
  ]

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'deadline', 'priority']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }

    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...formData, deadline: formData.deadline }
          : task
      )
      setTasks(updatedTasks)
      toast.success('Task updated successfully!')
      setIsEditModalOpen(false)
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        eventId: eventId,
        ...formData,
        status: 'active',
        createdBy: 'Current User',
        createdAt: new Date().toISOString()
      }
      setTasks(prev => [newTask, ...prev])
      toast.success('Task created successfully!')
      setIsCreateModalOpen(false)
    }

    // Reset form
    setFormData({
      name: '',
      description: '',
      deadline: '',
      priority: 'medium'
    })
    setEditingTask(null)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      name: task.name,
      description: task.description,
      deadline: task.deadline,
      priority: task.priority
    })
    setIsEditModalOpen(true)
  }

  const handleStatusToggle = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'active' ? 'completed' : 'active' }
        : task
    ))
  }

  const handleDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  // Filter and sort tasks
  const getFilteredTasks = (tab: string) => {
    let filtered = tasks

    switch (tab) {
      case 'today':
        filtered = tasks.filter(task => task.status === 'active')
        break
      case 'priority':
        filtered = tasks.filter(task => task.status === 'active')
        if (sortByPriority) {
          filtered = [...filtered].sort((a, b) => {
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          })
        }
        break
      case 'calendar':
        filtered = tasks.filter(task => task.status === 'active')
        if (sortByDate) {
          filtered = [...filtered].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        }
        break
      case 'own':
        filtered = tasks.filter(task => task.createdBy === 'Current User')
        break
      case 'all':
        filtered = tasks
        break
    }

    return filtered
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date() && new Date(deadline).toDateString() !== new Date().toDateString()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Task Management"
        description="Manage and organize tasks for this event efficiently"
        actions={
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Fill in all required information for the new task
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Task Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Call Accountant"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Task Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="e.g., Ask for tax deadlines"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deadline">Deadline Time *</Label>
                      <Input
                        id="deadline"
                        type="datetime-local"
                        value={formData.deadline}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="priority">Priority *</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Create Task
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateModalOpen(false)}
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
      
      <StatsGrid items={taskStats} />
      
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="priority" onClick={() => setSortByPriority(!sortByPriority)}>
            <div className="flex items-center gap-2">
              Priority
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </TabsTrigger>
          <TabsTrigger value="calendar" onClick={() => setSortByDate(!sortByDate)}>
            <div className="flex items-center gap-2">
              Calendar
              <Calendar className="h-4 w-4" />
            </div>
          </TabsTrigger>
          <TabsTrigger value="own">Own</TabsTrigger>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Active Tasks</CardTitle>
              <CardDescription>Unresolved tasks for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredTasks('today').map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{task.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        {isOverdue(task.deadline) && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Overdue
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Deadline: {formatDate(task.deadline)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(task)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusToggle(task.id)}
                      >
                        Complete
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="priority" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Priority Sorted Tasks</CardTitle>
              <CardDescription>Active tasks sorted by priority</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredTasks('priority').map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{task.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Deadline: {formatDate(task.deadline)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(task)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusToggle(task.id)}
                      >
                        Complete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Date Sorted Tasks</CardTitle>
              <CardDescription>Active tasks sorted by deadline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredTasks('calendar').map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{task.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Deadline: {formatDate(task.deadline)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(task)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusToggle(task.id)}
                      >
                        Complete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="own" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
              <CardDescription>Tasks created by current user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredTasks('own').map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{task.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Deadline: {formatDate(task.deadline)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(task)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusToggle(task.id)}
                      >
                        {task.status === 'active' ? 'Complete' : 'Reactivate'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>All tasks including resolved and unresolved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredTasks('all').map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{task.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Deadline: {formatDate(task.deadline)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(task)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusToggle(task.id)}
                      >
                        {task.status === 'active' ? 'Complete' : 'Reactivate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Task Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task information
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Task Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Task Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-deadline">Deadline Time *</Label>
                  <Input
                    id="edit-deadline"
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-priority">Priority *</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Update Task
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
