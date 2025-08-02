'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Edit, 
  Calendar, 
  User, 
  Eye, 
  Search,
  Filter
} from 'lucide-react'
import { toast } from 'sonner'

interface Document {
  id: number
  name: string
  file_name: string
  file_size: number
  file_type: string
  uploaded_by: string
  uploaded_at: string
  description: string
  category: 'transport' | 'safety' | 'operations' | 'compliance'
}

export default function DocumentsPage() {
  const [documents] = useState<Document[]>([
    {
      id: 1,
      name: "Transport Safety Guidelines",
      file_name: "transport_safety_guidelines.pdf",
      file_size: 2048576, // 2MB
      file_type: "application/pdf",
      uploaded_by: "John Smith",
      uploaded_at: "2024-07-15T10:30:00Z",
      description: "Comprehensive safety guidelines for transport operations",
      category: "safety"
    },
    {
      id: 2,
      name: "Vehicle Maintenance Schedule",
      file_name: "vehicle_maintenance_schedule.pdf",
      file_size: 1048576, // 1MB
      file_type: "application/pdf",
      uploaded_by: "Sarah Johnson",
      uploaded_at: "2024-07-15T14:20:00Z",
      description: "Monthly vehicle maintenance and inspection schedule",
      category: "operations"
    },
    {
      id: 3,
      name: "Driver Training Manual",
      file_name: "driver_training_manual.pdf",
      file_size: 5242880, // 5MB
      file_type: "application/pdf",
      uploaded_by: "Mike Davis",
      uploaded_at: "2024-07-16T09:15:00Z",
      description: "Complete driver training and certification manual",
      category: "transport"
    },
    {
      id: 4,
      name: "Compliance Checklist",
      file_name: "compliance_checklist.pdf",
      file_size: 512000, // 500KB
      file_type: "application/pdf",
      uploaded_by: "Lisa Wilson",
      uploaded_at: "2024-07-16T16:45:00Z",
      description: "Regulatory compliance checklist for transport operations",
      category: "compliance"
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Filter documents based on search term and category
  const filteredDocuments = documents.filter(document => {
    const matchesSearch = 
      document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.uploaded_by.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === 'all' || document.category.toLowerCase() === categoryFilter.toLowerCase()

    return matchesSearch && matchesCategory
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'transport':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'safety':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'operations':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'compliance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error('Please select a file')
      return
    }
    toast.success('Document uploaded successfully!')
    setIsUploadDialogOpen(false)
    setSelectedFile(null)
  }

  const handleDownload = (document: Document) => {
    toast.success(`Downloading ${document.name}...`)
  }

  const handleView = (document: Document) => {
    toast.success(`Opening ${document.name}...`)
  }

  const handleEdit = (document: Document) => {
    setSelectedDocument(document)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this document?')) {
      toast.success('Document deleted successfully!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage and organize event-related documents
          </p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">
              Uploaded documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(documents.reduce((sum, doc) => sum + doc.file_size, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined file size
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(documents.map(doc => doc.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Document categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {documents.filter(doc => {
                const uploadDate = new Date(doc.uploaded_at)
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return uploadDate > weekAgo
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="transport">Transport</SelectItem>
            <SelectItem value="safety">Safety</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{document.name}</CardTitle>
                    <CardDescription>
                      {document.description} • {formatDate(document.uploaded_at)}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(document.category)}>
                    {document.category.toUpperCase()}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(document)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(document)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(document)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(document.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">File:</span>
                  <span>{document.file_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Size:</span>
                  <span>{formatFileSize(document.file_size)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Uploaded by:</span>
                  <span>{document.uploaded_by}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Document Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document to the event
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="document_name">Document Name</Label>
              <Input id="document_name" placeholder="Enter document name" />
            </div>
            <div>
              <Label htmlFor="document_description">Description</Label>
              <Input id="document_description" placeholder="Enter document description" />
            </div>
            <div>
              <Label htmlFor="document_category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="document_file">File</Label>
              <Input
                id="document_file"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Only PDF files are allowed
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload}>
                Upload Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update document information
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_document_name">Document Name</Label>
                <Input id="edit_document_name" defaultValue={selectedDocument.name} />
              </div>
              <div>
                <Label htmlFor="edit_document_description">Description</Label>
                <Input id="edit_document_description" defaultValue={selectedDocument.description} />
              </div>
              <div>
                <Label htmlFor="edit_document_category">Category</Label>
                <Select defaultValue={selectedDocument.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success('Document updated successfully!')
                  setIsEditDialogOpen(false)
                }}>
                  Update Document
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 