import { useEffect, useRef, useCallback, useState } from 'react'
import { getWebSocketClient, WebSocketMessage } from '@/lib/websocket'

/**
 * Hook to use WebSocket client in components
 */
export function useWebSocket() {
  const wsRef = useRef(getWebSocketClient())
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const ws = wsRef.current

    // Subscribe to connect/disconnect events
    const unsubscribeConnect = ws.onConnect(() => {
      setIsConnected(true)
    })

    const unsubscribeDisconnect = ws.onDisconnect(() => {
      setIsConnected(false)
    })

    return () => {
      unsubscribeConnect()
      unsubscribeDisconnect()
    }
  }, [])

  const connect = useCallback(async (url?: string, token?: string) => {
    const ws = wsRef.current
    try {
      const wsUrl = url || import.meta.env.VITE_WS_URL
      const wsToken = token || localStorage.getItem('authToken') || ''

      if (!wsUrl) {
        throw new Error('WebSocket URL not provided')
      }

      await ws.connect(wsUrl, wsToken)
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      throw error
    }
  }, [])

  const disconnect = useCallback(() => {
    wsRef.current.disconnect()
  }, [])

  const send = useCallback((message: WebSocketMessage) => {
    wsRef.current.send(message)
  }, [])

  const onMessage = useCallback((callback: (message: WebSocketMessage) => void) => {
    return wsRef.current.onMessage(callback)
  }, [])

  const onError = useCallback((callback: (error: Event | Error) => void) => {
    return wsRef.current.onError(callback)
  }, [])

  const reconnect = useCallback(async () => {
    return wsRef.current.reconnect()
  }, [])

  return {
    isConnected,
    connect,
    disconnect,
    send,
    onMessage,
    onError,
    reconnect,
    client: wsRef.current,
  }
}

/**
 * Hook to subscribe to specific message types
 */
export function useWebSocketMessage(
  messageType: string,
  callback: (message: WebSocketMessage) => void,
  enabled: boolean = true
) {
  const ws = useRef(getWebSocketClient())

  useEffect(() => {
    if (!enabled) return

    const unsubscribe = ws.current.onMessage((message: WebSocketMessage) => {
      if (message.type === messageType) {
        callback(message)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [messageType, callback, enabled])
}

/**
 * Hook to handle WebSocket connection lifecycle
 */
export function useWebSocketEffect(
  onConnect?: () => void,
  onDisconnect?: () => void,
  onMessage?: (message: WebSocketMessage) => void,
  onError?: (error: Event | Error) => void
) {
  const ws = useRef(getWebSocketClient())

  useEffect(() => {
    const unsubscribes: Array<() => void> = []

    if (onConnect) {
      unsubscribes.push(ws.current.onConnect(onConnect))
    }

    if (onDisconnect) {
      unsubscribes.push(ws.current.onDisconnect(onDisconnect))
    }

    if (onMessage) {
      unsubscribes.push(ws.current.onMessage(onMessage))
    }

    if (onError) {
      unsubscribes.push(ws.current.onError(onError))
    }

    return () => {
      unsubscribes.forEach((unsub) => unsub())
    }
  }, [onConnect, onDisconnect, onMessage, onError])

  return ws.current
}
