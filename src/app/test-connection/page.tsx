'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'
import { config } from '@/lib/config'

export default function TestConnectionPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...')
  const [backendUrl, setBackendUrl] = useState<string>('')
  const [testResult, setTestResult] = useState<string>('')

  useEffect(() => {
    // Get the backend URL from centralized config
    const url = config.backend.getUrl()
    setBackendUrl(url)
    
    // Test WebSocket connection
    const testConnection = async () => {
      try {
        if (config.development.debug) {
          console.log('Testing connection to:', url)
        }
        const socket = new WebSocket(url)
        
        socket.addEventListener('open', () => {
          setConnectionStatus('✅ Connected successfully!')
          setTestResult('WebSocket connection is working')
          socket.close()
        })
        
        socket.addEventListener('error', (error) => {
          setConnectionStatus('❌ Connection failed')
          setTestResult(`Error: ${error.toString()}`)
        })
        
        socket.addEventListener('close', () => {
          if (config.development.debug) {
            console.log('Test connection closed')
          }
        })
        
        // Timeout after 5 seconds
        setTimeout(() => {
          if (socket.readyState === WebSocket.CONNECTING) {
            setConnectionStatus('⏰ Connection timeout')
            setTestResult('Connection timed out after 5 seconds')
            socket.close()
          }
        }, 5000)
        
      } catch (error) {
        setConnectionStatus('❌ Connection failed')
        setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
    
    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Container className="max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Connection Test</CardTitle>
            <CardDescription>
              Testing connection to backend server
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Backend URL:</strong>
              <p className="text-sm text-muted-foreground font-mono">{backendUrl}</p>
            </div>
            
            <div>
              <strong>Status:</strong>
              <p className="text-sm">{connectionStatus}</p>
            </div>
            
            {testResult && (
              <div>
                <strong>Result:</strong>
                <p className="text-sm text-muted-foreground">{testResult}</p>
              </div>
            )}
            
            <div className="pt-4">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Test Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
} 