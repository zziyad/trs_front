'use strict'

import { config } from './config'

interface TransportMethods {
  http: (url: string) => (structure: any) => Promise<any>
  ws: (url: string) => (structure: any) => Promise<any>
}

const transport: TransportMethods = {} as TransportMethods

let callId = 1

transport.http = (url: string) => (structure: any) => {
  const api: any = {}
  const services = Object.keys(structure)
  for (const name of services) {
    api[name] = {}
    const service = structure[name]
    const methods = Object.keys(service)
    for (const methodName of methods) {
      api[name][methodName] = (...args: any[]) =>
        new Promise((resolve, reject) => {
          const id = callId++
          const method = name + '/' + methodName
          const packet = { type: 'call', id, method, args }
          fetch(url + '/api', {
            method: 'POST',
            headers: { ...config.api.headers },
            body: JSON.stringify(packet),
          }).then((res) => {
            if (res.status === 200) resolve(res.json())
            else reject(new Error(`Status Code: ${res.status}`))
          })
        })
    }
  }
  return Promise.resolve(api)
}

transport.ws = (url: string) => (structure: any) => {
  if (config.development.debug) {
    console.log('Creating WebSocket connection to:', url)
  }
  const socket = new WebSocket(url)
  const api: any = {}
  const services = Object.keys(structure)
  
  // Add connection event listeners for debugging
  socket.addEventListener('open', () => {
    if (config.development.debug) {
      console.log('WebSocket connection established')
    }
  })
  
  socket.addEventListener('error', (error) => {
    console.error('WebSocket connection error:', error)
  })
  
  socket.addEventListener('close', (event) => {
    if (config.development.debug) {
      console.log('WebSocket connection closed:', event.code, event.reason)
    }
  })
  
  for (const name of services) {
    api[name] = {}
    const service = structure[name]
    const methods = Object.keys(service)
    for (const methodName of methods) {
      api[name][methodName] = (...args: any[]) =>
        new Promise((resolve, reject) => {
          const id = callId++
          const method = name + '/' + methodName
          const packet = { type: 'call', id, method, args }
          
          if (config.development.debug) {
            console.log('Sending WebSocket packet:', packet)
          }
          
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(packet))
            socket.onmessage = (event) => {
              const data = JSON.parse(event.data)
              if (config.development.debug) {
                console.log('Received WebSocket response:', data)
              }
              resolve(data)
            }
          } else {
            console.error('WebSocket is not open. State:', socket.readyState)
            reject(new Error('WebSocket connection is not open'))
          }
        })
    }
  }
  return new Promise((resolve, reject) => {
    socket.addEventListener('open', () => resolve(api))
    socket.addEventListener('error', (error) => reject(error))
  })
}

const scaffold = (url: string) => {
  const protocol = url.startsWith('ws:') ? 'ws' : 'http'
  return transport[protocol](url)
}

export { scaffold } 