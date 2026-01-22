import { useNavigate, useParams } from 'react-router-dom'
import { useComplaintDetail, useUpdateComplaintStatus } from '@/hooks/useComplaints'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { ReportStatus } from '@/types'
import { ArrowLeft } from 'lucide-react'

export function TaskDetails() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: complaint, isLoading, isError } = useComplaintDetail(id || '')
  const updateStatus = useUpdateComplaintStatus()

  const setStatus = (status: ReportStatus) => {
    if (!id) return
    updateStatus.mutate({ id, data: { status } })
  }

  if (isLoading || !complaint) {
    return (
      <div className="space-y-6">
        <PageHeader title="কাজের বিস্তারিত" subtitle="লোড হচ্ছে" />
        <div className="h-64 rounded-lg border border-border bg-card animate-pulse" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="কাজের বিস্তারিত" subtitle="ত্রুটি" />
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          তথ্য লোড করতে ব্যর্থ।
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          ফিরে যান
        </Button>
      </div>

      <PageHeader title="কাজের বিস্তারিত" subtitle={complaint.title} />

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">অবস্থান: {complaint.location || 'উল্লেখ নেই'}</p>
            <p className="text-sm text-muted-foreground">{complaint.description}</p>
          </div>
          <StatusBadge status={complaint.status as any} />
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setStatus(ReportStatus.IN_PROGRESS)}>কাজ শুরু করুন</Button>
          <Button onClick={() => setStatus(ReportStatus.RESOLVED)}>সমাধান হয়েছে</Button>
        </div>
      </div>
    </div>
  )
}
