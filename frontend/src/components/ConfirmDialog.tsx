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

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
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
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'নিশ্চিত করুন',
  cancelText = 'বাতিল',
  onConfirm,
  variant = 'destructive',
  icon,
  loading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
            {cancelText}
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
            {loading ? 'অপেক্ষা করুন...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
