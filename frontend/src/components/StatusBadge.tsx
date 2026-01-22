import { Badge } from '@/components/ui/badge'
import type { ApplicationStatus, ReportStatus } from '@/types'

interface StatusBadgeProps {
  status: ApplicationStatus | ReportStatus | string
  className?: string
}

// Application status mapping
const applicationStatusMap: Record<
  ApplicationStatus,
  { label: string; variant: 'success' | 'warning' | 'destructive' | 'info' | 'default' }
> = {
  PENDING: { label: 'অপেক্ষমাণ', variant: 'warning' },
  IN_REVIEW: { label: 'পর্যালোচনায়', variant: 'info' },
  APPROVED: { label: 'অনুমোদিত', variant: 'success' },
  REJECTED: { label: 'প্রত্যাখ্যাত', variant: 'destructive' },
}

// Complaint/Report status mapping
const reportStatusMap: Record<
  ReportStatus,
  { label: string; variant: 'success' | 'warning' | 'destructive' | 'info' | 'default' }
> = {
  PENDING: { label: 'অপেক্ষমাণ', variant: 'warning' },
  ASSIGNED: { label: 'নিয়োগকৃত', variant: 'info' },
  IN_PROGRESS: { label: 'প্রক্রিয়াধীন', variant: 'info' },
  RESOLVED: { label: 'সমাধান হয়েছে', variant: 'success' },
  CLOSED: { label: 'বন্ধ', variant: 'default' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Try to find in application status map first
  const applicationStatus = applicationStatusMap[status as ApplicationStatus]
  if (applicationStatus) {
    return (
      <Badge
        variant={applicationStatus.variant}
        className={className}
        role="status"
        aria-label={`অবস্থা: ${applicationStatus.label}`}
      >
        {applicationStatus.label}
      </Badge>
    )
  }

  // Try report status map
  const reportStatus = reportStatusMap[status as ReportStatus]
  if (reportStatus) {
    return (
      <Badge
        variant={reportStatus.variant}
        className={className}
        role="status"
        aria-label={`অবস্থা: ${reportStatus.label}`}
      >
        {reportStatus.label}
      </Badge>
    )
  }

  // Fallback for unknown status
  return (
    <Badge
      variant="default"
      className={className}
      role="status"
      aria-label={`অবস্থা: ${status}`}
    >
      {status}
    </Badge>
  )
}
