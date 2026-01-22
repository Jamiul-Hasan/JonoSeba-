import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { notificationsApi } from '@/lib/api'
import type { Notification } from '@/types'

export interface NotificationStore {
  // State
  items: Notification[]
  unreadCount: number

  // Actions
  addNotification: (notification: Notification) => void
  markRead: (id: string) => void
  markAllRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  setNotifications: (notifications: Notification[]) => void

  // Async actions
  syncFromServer: () => Promise<void>
  markReadOnServer: (id: string) => Promise<void>
  markAllReadOnServer: () => Promise<void>
}

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    persist(
      (set: any, get: any) => ({
        // Initial state
        items: [],
        unreadCount: 0,

        // Add notification
        addNotification: (notification: Notification) => {
          set((state: any) => ({
            items: [notification, ...state.items],
            unreadCount: state.unreadCount + 1,
          }))
        },

        // Mark single notification as read
        markRead: (id: string) => {
          set((state: any) => {
            const items = state.items.map((item: any) =>
              item.id === id ? { ...item, read: true } : item
            )
            const unreadCount = items.filter((item: any) => !item.read).length
            return { items, unreadCount }
          })
        },

        // Mark all notifications as read
        markAllRead: () => {
          set((state: any) => ({
            items: state.items.map((item: any) => ({ ...item, read: true })),
            unreadCount: 0,
          }))
        },

        // Remove notification
        removeNotification: (id: string) => {
          set((state: any) => {
            const items = state.items.filter((item: any) => item.id !== id)
            const unreadCount = items.filter((item: any) => !item.read).length
            return { items, unreadCount }
          })
        },

        // Clear all notifications
        clearAll: () => {
          set({
            items: [],
            unreadCount: 0,
          })
        },

        // Set notifications (for syncing)
        setNotifications: (notifications: Notification[]) => {
          const unreadCount = notifications.filter((item: any) => !item.read).length
          set({
            items: notifications,
            unreadCount,
          })
        },

        // Sync notifications from server
        syncFromServer: async () => {
          try {
            const notifications = await notificationsApi.list()
            get().setNotifications(notifications)
            console.log('[NotificationStore] Synced with server')
          } catch (error) {
            console.error('[NotificationStore] Failed to sync:', error)
            throw error
          }
        },

        // Mark notification as read on server
        markReadOnServer: async (id: string) => {
          try {
            await notificationsApi.markRead(id)
            get().markRead(id)
            console.log('[NotificationStore] Marked as read:', id)
          } catch (error) {
            console.error('[NotificationStore] Failed to mark read:', error)
            throw error
          }
        },

        // Mark all as read on server
        markAllReadOnServer: async () => {
          try {
            await notificationsApi.markAllRead()
            get().markAllRead()
            console.log('[NotificationStore] All marked as read')
          } catch (error) {
            console.error('[NotificationStore] Failed to mark all read:', error)
            throw error
          }
        },
      }),
      {
        name: 'notification-store',
        // Only persist items and unreadCount
        partialize: (state: any) => ({
          items: state.items,
          unreadCount: state.unreadCount,
        }),
      }
    )
  )
)

/**
 * Initialize notification store on app start (after login)
 */
export async function initializeNotificationStore(): Promise<void> {
  try {
    await useNotificationStore.getState().syncFromServer()
  } catch (error) {
    console.error('Failed to initialize notification store:', error)
    // Don't throw - allow app to continue without notifications
  }
}

/**
 * Get unread notifications
 */
export function getUnreadNotifications(): Notification[] {
  return useNotificationStore.getState().items.filter((item: any) => !item.read)
}

/**
 * Get notification by ID
 */
export function getNotificationById(id: string): Notification | undefined {
  return useNotificationStore.getState().items.find((item: any) => item.id === id)
}

/**
 * Get notifications by type
 */
export function getNotificationsByType(type: string): Notification[] {
  return useNotificationStore.getState().items.filter((item: any) => item.type === type)
}
