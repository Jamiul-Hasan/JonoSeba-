import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'
import { bn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

/**
 * Format time difference for display
 */
function formatTimeAgo(date: string): string {
  const now = new Date()
  const notifDate = new Date(date)
  const diffMs = now.getTime() - notifDate.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'এখনই'
  if (diffMins < 60) return `${diffMins} মিনিট আগে`
  if (diffHours < 24) return `${diffHours} ঘন্টা আগে`
  if (diffDays < 7) return `${diffDays} দিন আগে`
  
  return notifDate.toLocaleDateString('bn-BD')
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { items, unreadCount, markRead } = useNotifications()
  const navigate = useNavigate()

  // Get latest 5 notifications
  const latestNotifications = items.slice(0, 5)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleNotificationClick = (notificationId: string, read: boolean) => {
    if (!read) {
      markRead(notificationId)
    }
  }

  const handleViewAll = () => {
    setIsOpen(false)
    navigate('/citizen/notifications')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label={bn('বিজ্ঞপ্তি')}
      >
        <Bell size={20} />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full min-w-6">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {bn('বিজ্ঞপ্তি')}
            </h3>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {latestNotifications.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {latestNotifications.map((notification) => (
                  <li
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id, notification.read)}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      !notification.read
                        ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1.5" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center">
                <Bell
                  size={32}
                  className="mx-auto mb-2 text-gray-400 dark:text-gray-600"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {bn('কোন বিজ্ঞপ্তি নেই')}
                </p>
              </div>
            )}
          </div>

          {/* Footer - View All Button */}
          {latestNotifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleViewAll}
                className="w-full px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
              >
                {bn('সব দেখুন')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
