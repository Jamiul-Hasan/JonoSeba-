import { Complaint, ReportStatus } from '@/types'
import { Button } from '@/components/ui/button'
import { X, Download, Calendar, MapPin, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

const STATUS_COLORS: Record<ReportStatus, { bg: string; text: string; label: string }> = {
  [ReportStatus.PENDING]: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'অপেক্ষমাণ' },
  [ReportStatus.ASSIGNED]: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'নির্ধারিত' },
  [ReportStatus.IN_PROGRESS]: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'প্রক্রিয়াধীন' },
  [ReportStatus.RESOLVED]: { bg: 'bg-green-100', text: 'text-green-800', label: 'সমাধান হয়েছে' },
  [ReportStatus.CLOSED]: { bg: 'bg-slate-100', text: 'text-slate-800', label: 'বন্ধ' },
}

interface ComplaintDetailModalProps {
  complaint: Complaint
  isOpen: boolean
  onClose: () => void
}

export function ComplaintDetailModal({ complaint, isOpen, onClose }: ComplaintDetailModalProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      title: 'কপি হয়েছে',
      description: 'আইডি ক্লিপবোর্ডে কপি হয়েছে',
      variant: 'success',
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const statusConfig = STATUS_COLORS[complaint.status]

  // Parse timeline from status history if available
  const getStatusTimeline = () => {
    const timeline = [
      {
        status: ReportStatus.PENDING,
        date: complaint.reportedAt,
        label: 'জমা দেওয়া হয়েছে',
        description: 'আপনার অভিযোগ সফলভাবে জমা দেওয়া হয়েছে',
      },
    ]

    if (complaint.status !== ReportStatus.PENDING) {
      timeline.push({
        status: complaint.status,
        date: complaint.updatedAt,
        label: statusConfig.label,
        description: `অভিযোগের অবস্থা ${statusConfig.label}-এ পরিবর্তিত হয়েছে`,
      })
    }

    if (complaint.resolvedAt) {
      timeline.push({
        status: ReportStatus.RESOLVED,
        date: complaint.resolvedAt,
        label: 'সমাধান হয়েছে',
        description: 'আপনার অভিযোগ সমাধান হয়েছে',
      })
    }

    return timeline
  }

  const timeline = getStatusTimeline()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white dark:bg-slate-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-800 z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                {complaint.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Panel */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                অভিযোগ আইডি
              </p>
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {complaint.id}
                </p>
                <button
                  onClick={() => copyToClipboard(complaint.id)}
                  className="p-1 text-slate-600 hover:bg-white rounded dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                জমা দেওয়ার তারিখ
              </p>
              <p className="font-semibold text-slate-900 dark:text-slate-50">
                {new Date(complaint.reportedAt).toLocaleDateString('bn-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {complaint.location && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900 col-span-2">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  অবস্থান
                </p>
                <p className="text-sm text-slate-900 dark:text-slate-50">{complaint.location}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
              বিবরণ
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {complaint.description}
            </p>
          </div>

          {/* Attachments */}
          {complaint.photos && complaint.photos.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
                সংযুক্ত ফাইলসমূহ ({complaint.photos.length})
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {complaint.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-medium text-slate-900 dark:text-slate-50">
                        {photo.split('/').pop() || `ছবি ${idx + 1}`}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">ছবি</p>
                    </div>
                    <a
                      href={photo}
                      download
                      className="p-1 text-blue-600 hover:bg-white rounded dark:text-blue-400 dark:hover:bg-slate-800"
                      title="ডাউনলোড করুন"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">
              অভিযোগের ইতিহাস
            </h3>
            <div className="space-y-4">
              {timeline.map((event, idx) => (
                <div key={idx} className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-4 w-4 rounded-full border-2 border-white dark:border-slate-950 ${
                        STATUS_COLORS[event.status].bg
                      }`}
                    />
                    {idx !== timeline.length - 1 && (
                      <div className="h-12 w-0.5 bg-slate-200 dark:bg-slate-700" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {event.label}
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      {new Date(event.date).toLocaleDateString('bn-BD', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {complaint.notes && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                মন্তব্য
              </h3>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {complaint.notes}
                </p>
              </div>
            </div>
          )}

          {/* Assigned Officer */}
          {complaint.assignedTo && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                নির্ধারিত কর্মকর্তা
              </h3>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {complaint.assignedTo}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              বন্ধ করুন
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
