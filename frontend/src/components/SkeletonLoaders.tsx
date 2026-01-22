import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonCardProps {
  className?: string
  showHeader?: boolean
  showFooter?: boolean
  lines?: number
}

export function SkeletonCard({
  className,
  showHeader = true,
  showFooter = false,
  lines = 3,
}: SkeletonCardProps) {
  return (
    <div
      className={cn('rounded-lg border border-border bg-card p-6 space-y-4', className)}
      aria-busy="true"
      aria-label="লোড হচ্ছে"
    >
      {/* Header */}
      {showHeader && (
        <div className="space-y-3">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}

      {/* Content Lines */}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              'h-4',
              i === lines - 1 ? 'w-4/5' : 'w-full'
            )}
          />
        ))}
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="mt-6 flex gap-3 pt-4">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      )}
    </div>
  )
}

interface SkeletonTableProps {
  rows?: number
  columns?: number
  className?: string
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: SkeletonTableProps) {
  return (
    <div
      className={cn('rounded-lg border border-border bg-card overflow-hidden', className)}
      aria-busy="true"
      aria-label="টেবিল লোড হচ্ছে"
    >
      {/* Table Header */}
      <div className="bg-muted border-b border-border">
        <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-20" />
          ))}
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4 p-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                className={cn(
                  'h-4',
                  colIndex === 0 ? 'w-24' : 'w-full'
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

interface SkeletonGridProps {
  items?: number
  className?: string
}

export function SkeletonGrid({
  items = 6,
  className,
}: SkeletonGridProps) {
  return (
    <div
      className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}
      aria-busy="true"
      aria-label="গ্রিড লোড হচ্ছে"
    >
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonCard key={i} lines={2} />
      ))}
    </div>
  )
}

interface SkeletonFormProps {
  fields?: number
  className?: string
}

export function SkeletonForm({
  fields = 4,
  className,
}: SkeletonFormProps) {
  return (
    <div
      className={cn('space-y-6 p-6 bg-card rounded-lg border border-border', className)}
      aria-busy="true"
      aria-label="ফর্ম লোড হচ্ছে"
    >
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

interface SkeletonHeaderProps {
  className?: string
}

export function SkeletonHeader({
  className,
}: SkeletonHeaderProps) {
  return (
    <div
      className={cn('space-y-3 mb-8', className)}
      aria-busy="true"
      aria-label="শিরোনাম লোড হচ্ছে"
    >
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}
