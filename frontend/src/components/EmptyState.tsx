import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: LucideIcon | ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
      aria-labelledby="empty-state-title"
    >
      {/* Icon */}
      {icon && (
        <div className="mb-6 rounded-full bg-muted p-4" aria-label="আইকন">
          {typeof icon === 'function' ? (
            <>
              {icon({ className: 'h-8 w-8 text-muted-foreground', 'aria-hidden': 'true' })}
            </>
          ) : (
            icon
          )}
        </div>
      )}

      {/* Title */}
      <h2 id="empty-state-title" className="text-xl font-semibold text-foreground mb-3">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-8">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <Button
          onClick={action.onClick}
          className="focus:ring-2 focus:ring-primary focus:ring-offset-0"
        >
          {action.label}
        </Button>
      )}
    </section>
  )
}
