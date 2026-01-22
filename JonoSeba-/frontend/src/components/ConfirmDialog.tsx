import { ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AlertTriangle, Trash2, Info } from 'lucide-react'

export type ConfirmDialogVariant = 'destructive' | 'warning' | 'info'

export interface ConfirmDialogProps {
  open?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  title: string
  description: string
  confirmText?: string
  confirmLabel?: string
  cancelText?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  variant?: ConfirmDialogVariant
  icon?: ReactNode
  loading?: boolean
}

const variantConfig = {
  destructive: {
    icon: Trash2,
    iconColor: 'text-destructive',
    buttonVariant: 'destructive' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-warning',
    buttonVariant: 'default' as const,
  },
  info: {
    icon: Info,
    iconColor: 'text-info',
    buttonVariant: 'default' as const,
  },
}

export function ConfirmDialog({
  open = false,
  isOpen,
  onOpenChange,
  onClose,
  title,
  description,
  confirmText,
  confirmLabel,
  cancelText,
  cancelLabel,
  onConfirm,
  onCancel,
  variant = 'destructive',
  icon,
  loading = false,
}: ConfirmDialogProps) {
  const isDialogOpen = open || isOpen || false
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && onCancel) {
      onCancel()
    }
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
    if (!newOpen && onClose) {
      onClose()
    }
  }
  const finalConfirmText = confirmText || confirmLabel || 'নিশ্চিত করুন'
  const finalCancelText = cancelText || cancelLabel || 'বাতিল'
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = async () => {
    await onConfirm()
    handleOpenChange(false)
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="gap-6">
        <AlertDialogHeader className="gap-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                variant === 'destructive'
                  ? 'bg-destructive/10'
                  : variant === 'warning'
                  ? 'bg-warning/10'
                  : 'bg-info/10'
              }`}
              aria-hidden="true"
            >
              {icon || <Icon className={`h-6 w-6 ${config.iconColor}`} />}
            </div>

            {/* Content */}
            <div className="flex-1">
              <AlertDialogTitle className="text-left text-xl">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left mt-3">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel
            disabled={loading}
            className="focus:ring-2 focus:ring-primary focus:ring-offset-0"
          >
            {finalCancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={`focus:ring-2 focus:ring-offset-0 ${
              variant === 'destructive'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive'
                : 'focus:ring-primary'
            }`}
          >
            {loading ? 'অপেক্ষা করুন...' : finalConfirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
