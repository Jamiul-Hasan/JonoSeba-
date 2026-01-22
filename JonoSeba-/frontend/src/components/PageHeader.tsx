import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn('mb-8', className)}>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
        {/* Title & Subtitle */}
        <div className="space-y-2 flex-1">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {(subtitle || description) && (
            <p className="text-base text-muted-foreground">
              {subtitle || description}
            </p>
          )}
        </div>

        {/* Actions Slot */}
        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
