import { useState } from 'react'
import { Bell, Trash2, CheckCheck } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { bn } from '@/lib/utils'

type FilterType = 'all' | 'unread'

export function Notifications() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    notificationId?: string
    action?: 'delete' | 'clearAll'
  }>({ isOpen: false })

  const { items, unreadCount, markRead, removeNotification, clearAll } = useNotifications()

  // Filter notifications
  const filteredNotifications =
    filter === 'unread' ? items.filter((n: any) => !n.read) : items

  // Handlers
  const handleMarkAsRead = (id: string, isCurrentlyRead: boolean) => {
    if (!isCurrentlyRead) {
      markRead(id)
    }
  }

  const handleDeleteClick = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      notificationId: id,
      action: 'delete',
    })
  }

  const handleClearAllClick = () => {
    setConfirmDialog({
      isOpen: true,
      action: 'clearAll',
    })
  }

  const handleConfirmDelete = () => {
    if (confirmDialog.notificationId) {
      removeNotification(confirmDialog.notificationId)
    }
    setConfirmDialog({ isOpen: false })
  }

  const handleConfirmClearAll = () => {
    clearAll()
    setConfirmDialog({ isOpen: false })
  }

  // Format time ago
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PageHeader
        title={bn('বিজ্ঞপ্তি')}
        description={bn('আপনার সমস্ত আপডেট এবং বার্তা এখানে')}
      />

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 lg:px-8">
        {/* Filter and Actions */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {bn('সব')} ({items.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {bn('পড়া হয়নি')} ({unreadCount})
            </button>
          </div>

          {/* Action Buttons */}
          {items.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    items.forEach((n: any) => {
                      if (!n.read) markRead(n.id)
                    })
                  }}
                  className="gap-2"
                >
                  <CheckCheck size={16} />
                  {bn('সব পড়া চিহ্নিত করুন')}
                </Button>
              )}
              {items.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAllClick}
                  className="gap-2 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={16} />
                  {bn('সব মুছুন')}
                </Button>
              )}
            </div>
          )}
        </div>

        <Separator className="mb-6" />

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification: any) => (
              <div
                key={notification.id}
                className={`rounded-lg border transition-colors ${
                  !notification.read
                    ? 'border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-950/20'
                    : 'border-border bg-card hover:bg-muted'
                }`}
              >
                <div className="flex items-start gap-4 p-4">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 rounded-lg p-2 ${
                      !notification.read
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Bell size={20} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <Badge variant="default" className="ml-2 flex-shrink-0">
                          {bn('নতুন')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id, false)}
                        className="p-2 hover:bg-white/50 dark:hover:bg-black/20 rounded transition-colors"
                        title={bn('পড়া চিহ্নিত করুন')}
                      >
                        <CheckCheck size={16} className="text-blue-600 dark:text-blue-400" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(notification.id)}
                      className="p-2 hover:bg-white/50 dark:hover:bg-black/20 rounded transition-colors"
                      title={bn('মুছুন')}
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Bell}
            title={
              filter === 'unread' ? bn('কোন নতুন বিজ্ঞপ্তি নেই') : bn('কোন বিজ্ঞপ্তি নেই')
            }
            description={
              filter === 'unread'
                ? bn('আপনার সমস্ত বিজ্ঞপ্তি পড়া হয়েছে')
                : bn('আপনার কোন বিজ্ঞপ্তি নেই')
            }
          />
        )}
      </div>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={
          confirmDialog.action === 'delete' ? handleConfirmDelete : handleConfirmClearAll
        }
        title={
          confirmDialog.action === 'delete'
            ? bn('বিজ্ঞপ্তি মুছুন')
            : bn('সব বিজ্ঞপ্তি মুছুন')
        }
        description={
          confirmDialog.action === 'delete'
            ? bn('এই বিজ্ঞপ্তিটি মুছে ফেলতে চান?')
            : bn('সমস্ত বিজ্ঞপ্তি মুছে ফেলতে চান? এটি বাতিল করা যাবে না।')
        }
        variant="destructive"
        confirmLabel={bn('মুছুন')}
      />
    </div>
  )
}
