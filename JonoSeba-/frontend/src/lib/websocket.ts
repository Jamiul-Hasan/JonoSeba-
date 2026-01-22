export interface WebSocketMessage {
  type: string
  payload?: any
  timestamp?: number
}

export interface WebSocketClient {
  connect(url: string, token: string): Promise<void>
  disconnect(): void
  send(message: WebSocketMessage): void
  onMessage(callback: (message: WebSocketMessage) => void): () => void
  onConnect(callback: () => void): () => void
  onDisconnect(callback: () => void): () => void
  onError(callback: (error: Event | Error) => void): () => void
  reconnect(): Promise<void>
}

class WebSocketClientImpl implements WebSocketClient {
  private ws: WebSocket | null = null
  private url: string = ''
  private token: string = ''
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000
  private messageCallbacks: Array<(message: WebSocketMessage) => void> = []
  private connectCallbacks: Array<() => void> = []
  private disconnectCallbacks: Array<() => void> = []
  private errorCallbacks: Array<(error: Event | Error) => void> = []

  async connect(url: string, token: string): Promise<void> {
    this.url = url
    this.token = token
    this.reconnectAttempts = 0
    return this.doConnect()
  }

  private doConnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const connectUrl = `${this.url}?token=${this.token}`
        this.ws = new WebSocket(connectUrl)

        this.ws.onopen = () => {
          console.log('[WebSocket] Connected')
          this.reconnectAttempts = 0
          this.connectCallbacks.forEach((cb) => cb())
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage
            this.messageCallbacks.forEach((cb) => cb(message))
          } catch (error) {
            console.error('[WebSocket] Failed to parse message:', error)
          }
        }

        this.ws.onerror = (event) => {
          console.error('[WebSocket] Error:', event)
          this.errorCallbacks.forEach((cb) => cb(event))
          reject(event)
        }

        this.ws.onclose = () => {
          console.log('[WebSocket] Disconnected')
          this.disconnectCallbacks.forEach((cb) => cb())
          
          // Attempt reconnection
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
            console.log(`[WebSocket] Attempting reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)
            setTimeout(() => this.doConnect().catch(console.error), delay)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('[WebSocket] Not connected, cannot send message:', message)
    }
  }

  onMessage(callback: (message: WebSocketMessage) => void): () => void {
    this.messageCallbacks.push(callback)
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter((cb) => cb !== callback)
    }
  }

  onConnect(callback: () => void): () => void {
    this.connectCallbacks.push(callback)
    return () => {
      this.connectCallbacks = this.connectCallbacks.filter((cb) => cb !== callback)
    }
  }

  onDisconnect(callback: () => void): () => void {
    this.disconnectCallbacks.push(callback)
    return () => {
      this.disconnectCallbacks = this.disconnectCallbacks.filter((cb) => cb !== callback)
    }
  }

  onError(callback: (error: Event | Error) => void): () => void {
    this.errorCallbacks.push(callback)
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter((cb) => cb !== callback)
    }
  }

  async reconnect(): Promise<void> {
    this.disconnect()
    return this.doConnect()
  }
}

// Singleton instance
let wsClientInstance: WebSocketClientImpl | null = null

export function getWebSocketClient(): WebSocketClientImpl {
  if (!wsClientInstance) {
    wsClientInstance = new WebSocketClientImpl()
  }
  return wsClientInstance
}
