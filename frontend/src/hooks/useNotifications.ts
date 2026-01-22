import { useCallback } from 'react'
import { useNotificationStore, initializeNotificationStore, getUnreadNotifications } from '@/store/notificationStore'
import { useToast } from '@/components/ui/use-toast'
import type { Notification } from '@/types'
import type { NotificationStore } from '@/store/notificationStore'

/**
 * Hook to use notification store in components
 */
export function useNotifications() {
  const items = useNotificationStore((state: NotificationStore) => state.items)
  const unreadCount = useNotificationStore((state: NotificationStore) => state.unreadCount)
  const addNotification = useNotificationStore((state: NotificationStore) => state.addNotification)
  const markRead = useNotificationStore((state: NotificationStore) => state.markRead)
  const markAllRead = useNotificationStore((state: NotificationStore) => state.markAllRead)
  const removeNotification = useNotificationStore((state: NotificationStore) => state.removeNotification)
  const clearAll = useNotificationStore((state: NotificationStore) => state.clearAll)
  const markReadOnServer = useNotificationStore((state: NotificationStore) => state.markReadOnServer)
  const markAllReadOnServer = useNotificationStore((state: NotificationStore) => state.markAllReadOnServer)
  const { toast } = useToast()

  const handleAddNotification = useCallback(
    (notification: Notification) => {
      addNotification(notification)

      // Show toast for visual feedback
      toast({
        title: notification.title,
        description: notification.message,
        variant: 'default',
      })
    },
    [addNotification, toast]
  )

  const handleMarkRead = useCallback(
    async (id: string) => {
      try {
        markRead(id)
        // Optionally sync with server
        await markReadOnServer(id)
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
        // Revert optimistic update on error
        markRead(id) // This will toggle it back if needed
      }
    },
    [markRead, markReadOnServer]
  )

  const handleMarkAllRead = useCallback(
    async () => {
      try {
        markAllRead()
        // Optionally sync with server
        await markAllReadOnServer()
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error)
      }
    },
    [markAllRead, markAllReadOnServer]
  )

  const getUnread = useCallback(() => {
    return getUnreadNotifications()
  }, [])

  return {
    items,
    unreadCount,
    addNotification: handleAddNotification,
    markRead: handleMarkRead,
    markAllRead: handleMarkAllRead,
    removeNotification,
    clearAll,
    getUnread,
  }
}

/**
 * Hook to initialize notifications from server
 * Call this after user logs in
 */
export function useInitializeNotifications() {
  return useCallback(async () => {
    try {
      await initializeNotificationStore()
    } catch (error) {
      console.error('Failed to initialize notifications:', error)
    }
  }, [])
}
