import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Download, FileIcon, Calendar } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/SkeletonLoaders'
import { StatusBadge } from '@/components/StatusBadge'
import { useApplicationDetail } from '@/hooks/useApplications'
import { useToast } from '@/components/ui/use-toast'

// ==================== Info Panel ====================

function InfoPanel({
  trackingId,
  service,
  submittedAt,
  status,
  loading = false,
}: {
  trackingId: string
  service: string
  submittedAt: string
  status: string
  loading?: boolean
}) {
  if (loading) {
    return <SkeletonCard lines={4} />
  }

  const submittedDate = new Date(submittedAt)

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tracking ID */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">ট্র্যাকিং আইডি</p>
          <div className="flex items-center gap-2">
            <p className="font-mono font-bold text-lg break-all">{trackingId}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(trackingId)
              }}
              className="text-primary hover:text-primary/80 text-sm ml-2"
              title="কপি করুন"
            >
              📋
            </button>
          </div>
        </div>

        {/* Service Type */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">সেবার ধরণ</p>
          <p className="font-medium text-base">{service}</p>
        </div>

        {/* Submitted Date */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">জমা দেওয়ার তারিখ</p>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">
              {submittedDate.toLocaleDateString('bn-BD', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {' '}
              <span className="text-xs text-muted-foreground">
                {submittedDate.toLocaleTimeString('bn-BD', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </p>
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">বর্তমান অবস্থা</p>
          <StatusBadge status={status} type="application" />
        </div>
      </div>
    </div>
  )
}

// ==================== Documents Section ====================

function DocumentsList({
  documents,
  loading = false,
}: {
  documents?: string[]
  loading?: boolean
}) {
  const { toast } = useToast()

  if (loading) {
    return <SkeletonCard lines={3} />
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/50 p-6 text-center">
        <FileIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">কোনো নথি আপলোড করা হয়নি</p>
      </div>
    )
  }

  const handleDownload = (docName: string) => {
    toast({
      title: 'ডাউনলোড শুরু হয়েছে',
      description: `${docName} ডাউনলোড হচ্ছে...`,
    })
    // In production, this would be: window.location.href = `/api/applications/${appId}/documents/${docName}`
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="font-semibold text-lg mb-4">আপলোড করা নথিসমূহ</h3>
      <div className="space-y-2">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                <FileIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{doc}</p>
                <p className="text-xs text-muted-foreground">নথি</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(doc)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">ডাউনলোড</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== Status Timeline ====================

interface TimelineEvent {
  status: string
  remarks?: string
  changedAt: string
  changedBy: string
}

function StatusTimeline({
  events,
  loading = false,
}: {
  events?: TimelineEvent[]
  loading?: boolean
}) {
  if (loading) {
    return <SkeletonCard lines={5} />
  }

  if (!events || events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/50 p-6 text-center">
        <p className="text-sm text-muted-foreground">কোনো অবস্থা পরিবর্তনের রেকর্ড নেই</p>
      </div>
    )
  }

  // Sort events by date, newest first for display but we'll show chronologically
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime()
  )

  const statusLabels: Record<string, string> = {
    PENDING: 'অপেক্ষমাণ',
    IN_REVIEW: 'পর্যালোচনায়',
    APPROVED: 'অনুমোদিত',
    REJECTED: 'প্রত্যাখ্যাত',
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-warning/10 border-warning/50',
    IN_REVIEW: 'bg-info/10 border-info/50',
    APPROVED: 'bg-success/10 border-success/50',
    REJECTED: 'bg-destructive/10 border-destructive/50',
  }

  const timelineColors: Record<string, string> = {
    PENDING: 'bg-warning',
    IN_REVIEW: 'bg-info',
    APPROVED: 'bg-success',
    REJECTED: 'bg-destructive',
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="font-semibold text-lg mb-6">অবস্থার ইতিহাস</h3>
      <div className="space-y-4">
        {sortedEvents.map((event, idx) => {
          const eventDate = new Date(event.changedAt)
          const statusLabel = statusLabels[event.status] || event.status

          return (
            <div key={idx} className="flex gap-4">
              {/* Timeline Dot and Line */}
              <div className="flex flex-col items-center">
                <div
                  className={`h-4 w-4 rounded-full ${timelineColors[event.status] || 'bg-muted'} flex-shrink-0`}
                />
                {idx < sortedEvents.length - 1 && (
                  <div className="w-0.5 h-16 bg-border mt-2 mb-2" />
                )}
              </div>

              {/* Event Content */}
              <div className="pb-4 flex-grow">
                <div className={`rounded-lg border p-4 ${statusColors[event.status] || 'bg-muted/50 border-border'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-sm">{statusLabel}</p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {eventDate.toLocaleDateString('bn-BD', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      {eventDate.toLocaleTimeString('bn-BD', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {event.remarks && (
                    <p className="text-sm mb-2">{event.remarks}</p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    পরিবর্তনকারী: {event.changedBy}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ==================== Notes Section ====================

function NotesSection({
  notes,
  loading = false,
}: {
  notes?: string
  loading?: boolean
}) {
  if (loading) {
    return <SkeletonCard lines={4} />
  }

  if (!notes) {
    return null
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="font-semibold text-lg mb-4">মন্তব্য/নোট</h3>
      <div className="bg-muted/50 rounded p-4 border border-border">
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{notes}</p>
      </div>
    </div>
  )
}

// ==================== Main Component ====================

export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: application, isLoading, error } = useApplicationDetail(id || '')

  if (!id) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/citizen/applications')}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          আমার আবেদনসমূহে ফিরুন
        </Button>

        <PageHeader
          title="আবেদন বিবরণ"
          description="আবেদনের সম্পূর্ণ বিবরণ দেখুন"
        />

        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-destructive">আবেদন খুঁজে পাওয়া যায়নি।</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/citizen/applications')}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          আমার আবেদনসমূহে ফিরুন
        </Button>

        <PageHeader
          title="আবেদন বিবরণ"
          description="আবেদনের সম্পূর্ণ বিবরণ দেখুন"
        />

        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-destructive font-medium mb-2">ত্রুটি</p>
          <p className="text-sm text-destructive/80">আবেদন লোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে পৃষ্ঠা রিফ্রেশ করুন বা ফিরে যান।</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/citizen/applications')}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        আমার আবেদনসমূহে ফিরুন
      </Button>

      {/* Page Header */}
      <PageHeader
        title="আবেদন বিবরণ"
        description={isLoading ? 'লোড হচ্ছে...' : application?.id || 'আবেদনের সম্পূর্ণ বিবরণ'}
      />

      {isLoading ? (
        <div className="space-y-6">
          <SkeletonCard lines={4} />
          <SkeletonCard lines={3} />
          <SkeletonCard lines={5} />
        </div>
      ) : application ? (
        <div className="space-y-6">
          {/* Info Panel */}
          <InfoPanel
            trackingId={application.id}
            service={application.applicationType}
            submittedAt={application.submittedAt}
            status={application.status}
          />

          {/* Applicant Information */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-lg mb-4">আবেদনকারীর তথ্য</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">সম্পূর্ণ নাম</p>
                <p className="font-medium">{application.applicantName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">ফোন নম্বর</p>
                <p className="font-medium">{application.phone}</p>
              </div>
              {application.email && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">ইমেইল</p>
                  <p className="font-medium">{application.email}</p>
                </div>
              )}
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground mb-1">ঠিকানা</p>
                <p className="font-medium">{application.address}</p>
              </div>
            </div>
          </div>

          {/* Application Details */}
          {application.details && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-lg mb-4">আবেদনের বিবরণ</h3>
              <p className="text-sm whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {application.details}
              </p>
            </div>
          )}

          {/* Documents */}
          <DocumentsList documents={application.applicationType ? [application.applicationType] : undefined} />

          {/* Notes */}
          {application.remarks && (
            <NotesSection notes={application.remarks} />
          )}

          {/* Status Timeline */}
          <StatusTimeline
            events={
              application.statusHistory
                ? application.statusHistory.map(h => ({
                    status: h.status,
                    remarks: h.remarks,
                    changedAt: h.changedAt,
                    changedBy: h.changedBy,
                  }))
                : undefined
            }
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => navigate('/citizen/applications')}
              className="flex-1"
            >
              ফিরে যান
            </Button>
            {application.status !== 'APPROVED' && (
              <Button className="flex-1">
                নতুন আবেদন করুন
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-muted-foreground">আবেদন খুঁজে পাওয়া যায়নি।</p>
          <Button
            variant="outline"
            onClick={() => navigate('/citizen/applications')}
            className="mt-4"
          >
            আবেদনসমূহে ফিরুন
          </Button>
        </div>
      )}
    </div>
  )
}
