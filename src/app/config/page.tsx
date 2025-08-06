'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Container } from '@/components/layout/Container'
import { config } from '@/lib/config'
import { toast } from 'sonner'

export default function ConfigPage() {
  const [backendPort, setBackendPort] = useState(config.backend.port.toString())
  const [networkHost, setNetworkHost] = useState(config.backend.host.network)
  const [debugMode, setDebugMode] = useState(config.development.debug)
  const [sessionTimeout, setSessionTimeout] = useState((config.auth.sessionTimeout / 1000 / 60).toString())

  const handleSave = () => {
    // In a real app, you'd save this to localStorage or a config file
    // For now, we'll just show a toast
    toast.success('Configuration updated! (Note: Changes require app restart)')
    
    // Log the new configuration
    console.log('New configuration:', {
      backendPort: parseInt(backendPort),
      networkHost,
      debugMode,
      sessionTimeout: parseInt(sessionTimeout) * 60 * 1000
    })
  }

  const handleTestConnection = () => {
    const testUrl = `ws://${networkHost}:${backendPort}`
    console.log('Testing connection to:', testUrl)
    
    const socket = new WebSocket(testUrl)
    
    socket.addEventListener('open', () => {
      toast.success('Connection successful!')
      socket.close()
    })
    
    socket.addEventListener('error', () => {
      toast.error('Connection failed!')
    })
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Container className="max-w-2xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Configuration</h1>
            <p className="text-muted-foreground">
              Manage application settings and backend connections
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Backend Configuration</CardTitle>
              <CardDescription>
                Configure backend server connection settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backendPort">Backend Port</Label>
                  <Input
                    id="backendPort"
                    type="number"
                    value={backendPort}
                    onChange={(e) => setBackendPort(e.target.value)}
                    placeholder="8001"
                  />
                </div>
                <div>
                  <Label htmlFor="networkHost">Network Host</Label>
                  <Input
                    id="networkHost"
                    value={networkHost}
                    onChange={(e) => setNetworkHost(e.target.value)}
                    placeholder="10.101.46.112"
                  />
                </div>
              </div>
              
              <Button onClick={handleTestConnection} variant="outline">
                Test Connection
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication Settings</CardTitle>
              <CardDescription>
                Configure authentication and session settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  placeholder="30"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Development Settings</CardTitle>
              <CardDescription>
                Configure development and debugging options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="debugMode"
                  checked={debugMode}
                  onChange={(e) => setDebugMode(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="debugMode">Enable Debug Logging</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Configuration</CardTitle>
              <CardDescription>
                View the current configuration values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Backend URL (Local):</strong> ws://localhost:{backendPort}
                </div>
                <div>
                  <strong>Backend URL (Network):</strong> ws://{networkHost}:{backendPort}
                </div>
                <div>
                  <strong>Session Timeout:</strong> {sessionTimeout} minutes
                </div>
                <div>
                  <strong>Debug Mode:</strong> {debugMode ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="w-full md:w-auto">
              Save Configuration
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
} 