'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { DataParser, ParsingSchemas, ParsingResult } from '@/lib/data-parser'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'

interface ParsedDataItem {
  id: string
  result: ParsingResult
  fileName: string
  timestamp: Date
}

export default function DataParserComponent() {
  const [selectedSchema, setSelectedSchema] = useState<keyof typeof ParsingSchemas>('Event')
  const [parsedData, setParsedData] = useState<ParsedDataItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showRawData, setShowRawData] = useState(false)
  const [parserConfig, setParserConfig] = useState({
    continueOnError: false,
    maxErrors: 10,
    timeout: 30000,
    batchSize: 100
  })

  const parser = new DataParser(parserConfig)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true)
    setProgress(0)
    
    const newParsedData: ParsedDataItem[] = []
    
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i]
      const fileContent = await file.text()
      
      try {
        let result: ParsingResult
        
        // Detect file format and parse accordingly
        if (file.name.endsWith('.csv')) {
          const results = await parser.parseCSV(fileContent, selectedSchema, {
            source: file.name,
            hasHeader: true
          })
          result = results[0] || { 
            success: false, 
            errors: ['No data parsed'], 
            warnings: [], 
            metadata: { 
              parsingTime: 0, 
              sourceFormat: 'csv', 
              parserVersion: '1.0.0', 
              confidence: 0 
            } 
          }
        } else if (file.name.endsWith('.json')) {
          result = await parser.parseJSON(fileContent, selectedSchema, {
            source: file.name
          })
        } else if (file.name.endsWith('.xml')) {
          result = await parser.parseXML(fileContent, selectedSchema, {
            source: file.name
          })
        } else {
          // Try to auto-detect format
          result = await parser.parseData(fileContent, selectedSchema, {
            source: file.name,
            rawData: fileContent
          })
        }
        
        newParsedData.push({
          id: `${file.name}-${Date.now()}`,
          result,
          fileName: file.name,
          timestamp: new Date()
        })
        
        setProgress(((i + 1) / acceptedFiles.length) * 100)
        
      } catch (error) {
        const errorResult: ParsingResult = {
          success: false,
          data: undefined,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          warnings: [],
          metadata: {
            parsingTime: 0,
            sourceFormat: 'unknown',
            parserVersion: '1.0.0',
            confidence: 0
          }
        }
        
        newParsedData.push({
          id: `${file.name}-${Date.now()}`,
          result: errorResult,
          fileName: file.name,
          timestamp: new Date()
        })
      }
    }
    
    setParsedData(prev => [...newParsedData, ...prev])
    setIsProcessing(false)
    setProgress(0)
  }, [selectedSchema, parser])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/xml': ['.xml'],
      'text/plain': ['.txt']
    },
    multiple: true
  })

  const clearAllData = () => {
    setParsedData([])
  }

  const removeItem = (id: string) => {
    setParsedData(prev => prev.filter(item => item.id !== id))
  }

  const downloadResults = () => {
    const dataStr = JSON.stringify(parsedData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `parsed-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getSchemaInfo = () => {
    try {
      return parser.getSchemaInfo(selectedSchema)
    } catch {
      return null
    }
  }

  const schemaInfo = getSchemaInfo()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Data Parser</h1>
        <p className="text-muted-foreground">
          Upload and parse data files using predefined schemas
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload & Parse</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Schema</CardTitle>
              <CardDescription>
                Choose the appropriate schema for your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedSchema} onValueChange={(value: keyof typeof ParsingSchemas) => setSelectedSchema(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a schema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Passenger">Passenger</SelectItem>
                  <SelectItem value="Vehicle">Vehicle</SelectItem>
                  <SelectItem value="Driver">Driver</SelectItem>
                  <SelectItem value="TransportSchedule">Transport Schedule</SelectItem>
                  <SelectItem value="FlightSchedule">Flight Schedule</SelectItem>
                  <SelectItem value="Task">Task</SelectItem>
                  <SelectItem value="Document">Document</SelectItem>
                  <SelectItem value="Visa">Visa</SelectItem>
                  <SelectItem value="AAD">AAD</SelectItem>
                  <SelectItem value="StaffStatistics">Staff Statistics</SelectItem>
                  <SelectItem value="TransportReport">Transport Report</SelectItem>
                  <SelectItem value="VAPP">VAPP</SelectItem>
                  <SelectItem value="ShuttleSystem">Shuttle System</SelectItem>
                </SelectContent>
              </Select>

              {schemaInfo && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Schema Information</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Fields:</strong> {schemaInfo.fields.length}</p>
                    <p><strong>Required:</strong> {schemaInfo.requiredFields.length}</p>
                    <div className="mt-2">
                      <p className="font-medium">Required Fields:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {schemaInfo.requiredFields.map(field => (
                          <Badge key={field} variant="secondary" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Drag and drop files or click to browse. Supports CSV, JSON, and XML formats.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                {isDragActive ? (
                  <p className="text-primary font-medium">Drop the files here...</p>
                ) : (
                  <div>
                    <p className="text-lg font-medium mb-2">Drop files here, or click to select</p>
                    <p className="text-sm text-muted-foreground">
                      Supports CSV, JSON, XML, and text files
                    </p>
                  </div>
                )}
              </div>

              {isProcessing && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing files...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Parsing Results</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRawData(!showRawData)}
                size="sm"
              >
                {showRawData ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showRawData ? 'Hide' : 'Show'} Raw Data
              </Button>
              <Button
                variant="outline"
                onClick={downloadResults}
                size="sm"
                disabled={parsedData.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Results
              </Button>
              <Button
                variant="outline"
                onClick={clearAllData}
                size="sm"
                disabled={parsedData.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {parsedData.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No files have been parsed yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload some files to see parsing results here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {parsedData.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {item.fileName}
                          {item.result.success ? (
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Success
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Parsed at {item.timestamp.toLocaleString()}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Metadata */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Format:</span>
                        <p className="text-muted-foreground">{item.result.metadata.sourceFormat}</p>
                      </div>
                      <div>
                        <span className="font-medium">Time:</span>
                        <p className="text-muted-foreground">{item.result.metadata.parsingTime}ms</p>
                      </div>
                      <div>
                        <span className="font-medium">Confidence:</span>
                        <p className="text-muted-foreground">
                          {Math.round(item.result.metadata.confidence * 100)}%
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Version:</span>
                        <p className="text-muted-foreground">{item.result.metadata.parserVersion}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Errors and Warnings */}
                    {item.result.errors.length > 0 && (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Errors ({item.result.errors.length}):</strong>
                          <ul className="mt-2 space-y-1">
                            {item.result.errors.map((error, index) => (
                              <li key={index} className="text-sm">• {error}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {item.result.warnings.length > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Warnings ({item.result.warnings.length}):</strong>
                          <ul className="mt-2 space-y-1">
                            {item.result.warnings.map((warning, index) => (
                              <li key={index} className="text-sm">• {warning}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Parsed Data */}
                    {item.result.success && item.result.data && (
                      <div>
                        <h4 className="font-semibold mb-2">Parsed Data:</h4>
                        <div className="bg-muted p-4 rounded-lg">
                          <pre className="text-sm overflow-x-auto">
                            {JSON.stringify(item.result.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Raw Data */}
                    {showRawData && (
                      <div>
                        <h4 className="font-semibold mb-2">Raw Data:</h4>
                        <div className="bg-muted p-4 rounded-lg">
                          <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                            {item.result.metadata.sourceFormat === 'csv' 
                              ? item.result.metadata.rawData 
                              : JSON.stringify(item.result.metadata.rawData, null, 2)
                            }
                          </pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parser Configuration</CardTitle>
              <CardDescription>
                Configure parsing behavior and error handling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Continue on Error</label>
                  <Select
                    value={parserConfig.continueOnError.toString()}
                    onValueChange={(value) => 
                      setParserConfig(prev => ({ ...prev, continueOnError: value === 'true' }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Errors</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={parserConfig.maxErrors}
                    onChange={(e) => 
                      setParserConfig(prev => ({ ...prev, maxErrors: parseInt(e.target.value) }))
                    }
                    className="w-full px-3 py-2 border border-input rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Timeout (ms)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={parserConfig.timeout}
                    onChange={(e) => 
                      setParserConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) }))
                    }
                    className="w-full px-3 py-2 border border-input rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Batch Size</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={parserConfig.batchSize}
                    onChange={(e) => 
                      setParserConfig(prev => ({ ...prev, batchSize: parseInt(e.target.value) }))
                    }
                    className="w-full px-3 py-2 border border-input rounded-md"
                  />
                </div>
              </div>

              <Separator />

              <div className="text-sm text-muted-foreground">
                <p><strong>Note:</strong> Changes to configuration will apply to new parsing operations.</p>
                <p>Current configuration: {JSON.stringify(parserConfig, null, 2)}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
