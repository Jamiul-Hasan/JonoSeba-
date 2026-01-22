import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApplicationDetail, useUpdateApplicationStatus } from '@/hooks/useApplications'
import { Application, ApplicationStatus } from '@/types'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useToast } from '@/components/ui/use-toast'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  MessageSquare,
  FileText,
  Calendar,
  User,
  Phone,
  MapPin,
} from 'lucide-react'

const APPLICATION_TYPE_LABELS: Record<string, string> = {
  BIRTH_CERTIFICATE: 'জন্ম সার্টিফিকেট',
  DEATH_CERTIFICATE: 'মৃত্যু সার্টিফিকেট',
  LAND_MUTATION: 'ভূমি পরিবর্তন',
  NATIONALITY_CERTIFICATE: 'জাতীয়তা সার্টিফিকেট',
  VGF_VGD: 'ভিজিএফ/ভিজিডি',
  OLD_AGE_ALLOWANCE: 'বয়স্ক ভাতা',
  WIDOW_ALLOWANCE: 'বিধবা ভাতা',
  DISABILITY_ALLOWANCE: 'প্রতিবন্ধী ভাতা',
}

const STATUS_COLORS: Record<ApplicationStatus, { bg: string; text: string; label: string }> = {
  [ApplicationStatus.PENDING]: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'অপেক্ষমাণ' },
  [ApplicationStatus.IN_REVIEW]: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'পর্যালোচনায়' },
  [ApplicationStatus.APPROVED]: { bg: 'bg-green-100', text: 'text-green-800', label: 'অনুমোদিত' },
  [ApplicationStatus.REJECTED]: { bg: 'bg-red-100', text: 'text-red-800', label: 'প্রত্যাখ্যাত' },
}

export function ApplicationReview() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const { data: application, isLoading, isError } = useApplicationDetail(id || '')
  const updateStatusMutation = useUpdateApplicationStatus()

  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showMoreInfoDialog, setShowMoreInfoDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [moreInfoRequest, setMoreInfoRequest] = useState('')

  if (!id) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="আবেদন পর্যালোচনা"
          description="আবেদনের বিবরণ এবং নথি দেখুন"
        />
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
          <p className="text-sm text-red-800 dark:text-red-200">অবৈধ আবেদন আইডি। দয়া করে বৈধ আইডি সহ চেষ্টা করুন।</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            ফিরে যান
          </Button>
        </div>
        <div className="h-96 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 animate-pulse" />
      </div>
    )
  }

  if (isError || !application) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            ফিরে যান
          </Button>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-medium text-red-900 dark:text-red-50">লোডিং ব্যর্থ</p>
              <p className="text-sm text-red-800 dark:text-red-200">আবেদন লোড করতে ব্যর্থ। দয়া করে পুনরায় চেষ্টা করুন।</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const statusConfig = STATUS_COLORS[application.status]

  const handleApprove = async () => {
    await updateStatusMutation.mutateAsync(
      {
        id: application.id,
        data: {
          status: ApplicationStatus.APPROVED,
          notes: 'আবেদন অনুমোদিত হয়েছে।',
        },
      },
      {
        onSuccess: () => {
          toast({
            title: 'সফল',
            description: 'আবেদনটি অনুমোদিত হয়েছে।',
            variant: 'success',
          })
          setTimeout(() => navigate(-1), 1500)
        },
      }
    )
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast({
        title: 'প্রয়োজনীয় তথ্য',
        description: 'দয়া করে প্রত্যাখ্যানের কারণ প্রবেশ করুন।',
        variant: 'destructive',
      })
      return
    }

    await updateStatusMutation.mutateAsync(
      {
        id: application.id,
        data: {
          status: ApplicationStatus.REJECTED,
          notes: rejectReason,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: 'সফল',
            description: 'আবেদনটি প্রত্যাখ্যান করা হয়েছে।',
            variant: 'success',
          })
          setTimeout(() => navigate(-1), 1500)
        },
      }
    )
  }

  const handleRequestMoreInfo = async () => {
    if (!moreInfoRequest.trim()) {
      toast({
        title: 'প্রয়োজনীয় তথ্য',
        description: 'দয়া করে অনুরোধ করা তথ্য প্রবেশ করুন।',
        variant: 'destructive',
      })
      return
    }

    await updateStatusMutation.mutateAsync(
      {
        id: application.id,
        data: {
          status: ApplicationStatus.PENDING,
          notes: `আরও তথ্য প্রয়োজন: ${moreInfoRequest}`,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: 'সফল',
            description: 'আবেদনকারীকে আরও তথ্যের অনুরোধ পাঠানো হয়েছে।',
            variant: 'success',
          })
          setTimeout(() => navigate(-1), 1500)
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            ফিরে যান
          </Button>
          <PageHeader
            title="আবেদন পর্যালোচনা"
            description="আবেদনের বিবরণ এবং নথি দেখুন"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Application Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Header */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">
                  {APPLICATION_TYPE_LABELS[application.applicationType] || application.applicationType}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  আবেদন আইডি: <span className="font-mono">{application.id}</span>
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}
              >
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Applicant Information */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              আবেদনকারীর তথ্য
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem
                icon={<User className="h-5 w-5" />}
                label="নাম"
                value={application.applicantName}
              />
              <DetailItem
                icon={<Phone className="h-5 w-5" />}
                label="ফোন নম্বর"
                value={application.phone}
              />
              {application.email && (
                <DetailItem
                  icon={<FileText className="h-5 w-5" />}
                  label="ইমেইল"
                  value={application.email}
                />
              )}
              <DetailItem
                icon={<MapPin className="h-5 w-5" />}
                label="ঠিকানা"
                value={application.address}
              />
              <DetailItem
                icon={<Calendar className="h-5 w-5" />}
                label="জমা দেওয়ার তারিখ"
                value={new Date(application.submittedAt).toLocaleDateString('bn-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              />
            </div>
          </div>

          {/* Application Details */}
          {application.details && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                আবেদনের বিবরণ
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {application.details}
              </p>
            </div>
          )}

          {/* Remarks */}
          {application.remarks && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
                বিদ্যমান মন্তব্য
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {application.remarks}
              </p>
            </div>
          )}
        </div>

        {/* Right Side - Actions */}
        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              পদক্ষেপ নিন
            </h3>

            <div className="space-y-3">
              {/* Approve Button */}
              <Button
                onClick={handleApprove}
                disabled={updateStatusMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {updateStatusMutation.isPending ? 'প্রক্রিয়াধীন...' : 'অনুমোদন করুন'}
              </Button>

              {/* Request More Info Button */}
              <Button
                onClick={() => setShowMoreInfoDialog(true)}
                disabled={updateStatusMutation.isPending}
                variant="outline"
                className="w-full gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                আরও তথ্য অনুরোধ করুন
              </Button>

              {/* Reject Button */}
              <Button
                onClick={() => setShowRejectDialog(true)}
                disabled={updateStatusMutation.isPending}
                variant="destructive"
                className="w-full gap-2"
              >
                <XCircle className="h-4 w-4" />
                প্রত্যাখ্যান করুন
              </Button>
            </div>
          </div>

          {/* Status History (if available) */}
          {application.statusHistory && application.statusHistory.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                অবস্থা ইতিহাস
              </h3>
              <div className="space-y-3">
                {application.statusHistory.map((history, idx) => (
                  <div key={idx} className="text-xs">
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {STATUS_COLORS[history.status]?.label || history.status}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {new Date(history.changedAt).toLocaleDateString('bn-BD')}
                    </p>
                    {history.remarks && (
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{history.remarks}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white dark:bg-slate-950">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                আবেদন প্রত্যাখ্যান করুন
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
                  প্রত্যাখ্যানের কারণ <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="প্রত্যাখ্যানের বিস্তারিত কারণ লিখুন..."
                  className="w-full min-h-[120px] px-3 py-2 rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleReject}
                  disabled={updateStatusMutation.isPending}
                  variant="destructive"
                  className="flex-1"
                >
                  {updateStatusMutation.isPending ? 'প্রক্রিয়াধীন...' : 'প্রত্যাখ্যান করুন'}
                </Button>
                <Button
                  onClick={() => setShowRejectDialog(false)}
                  disabled={updateStatusMutation.isPending}
                  variant="outline"
                  className="flex-1"
                >
                  বাতিল করুন
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* More Info Dialog */}
      {showMoreInfoDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white dark:bg-slate-950">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                আরও তথ্য অনুরোধ করুন
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
                  প্রয়োজনীয় তথ্য <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={moreInfoRequest}
                  onChange={(e) => setMoreInfoRequest(e.target.value)}
                  placeholder="আবেদনকারীকে জানান কোন তথ্য আরও প্রয়োজন..."
                  className="w-full min-h-[120px] px-3 py-2 rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleRequestMoreInfo}
                  disabled={updateStatusMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {updateStatusMutation.isPending ? 'পাঠানো হচ্ছে...' : 'অনুরোধ পাঠান'}
                </Button>
                <Button
                  onClick={() => setShowMoreInfoDialog(false)}
                  disabled={updateStatusMutation.isPending}
                  variant="outline"
                  className="flex-1"
                >
                  বাতিল করুন
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1 text-slate-600 dark:text-slate-400">
        {icon}
        <p className="text-xs font-medium">{label}</p>
      </div>
      <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{value}</p>
    </div>
  )
}
