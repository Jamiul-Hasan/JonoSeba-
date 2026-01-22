import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useComplaintsList, useAssignComplaint } from '@/hooks/useComplaints'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { SkeletonTable } from '@/components/SkeletonLoaders'
import { ReportStatus } from '@/types'
import { ClipboardList, AlertCircle } from 'lucide-react'

export function AssignedTasks() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { data: complaints = [], isLoading, isError } = useComplaintsList(true)
  const assignMutation = useAssignComplaint()

  const myTasks = useMemo(
    () => complaints.filter((c) => c.assignedTo === user?.id),
    [complaints, user?.id]
  )

  const assignFirstPending = () => {
    const pending = complaints.find((c) => c.status === ReportStatus.PENDING)
    if (pending && user?.id) {
      assignMutation.mutate({ id: pending.id, workerId: user.id })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="নিয়োগকৃত কাজ" subtitle="আপনার কাজের তালিকা" />
        <SkeletonTable rows={5} columns={4} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="নিয়োগকৃত কাজ" subtitle="আপনার কাজের তালিকা" />
        <EmptyState
          title="লোডিং ব্যর্থ"
          description="কাজের তালিকা লোড করতে ব্যর্থ।"
          icon={<AlertCircle className="h-10 w-10" />}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="নিয়োগকৃত কাজ" subtitle="আপনার কাজের তালিকা" />

      {myTasks.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-6">
          <EmptyState
            title="কোনো কাজ বরাদ্দ নেই"
            description="আপনার জন্য কোনো কাজ বরাদ্দ করা হয়নি।"
            icon={<ClipboardList className="h-10 w-10" />}
            action={{ label: 'ডেমো কাজ বরাদ্দ করুন', onClick: assignFirstPending }}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {myTasks.map((task) => (
            <div
              key={task.id}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-muted-foreground">{task.location || 'অবস্থান নেই'}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge type="complaint" status={task.status as any} />
                <Button variant="outline" onClick={() => navigate(`/officer/tasks/${task.id}`)}>
                  বিস্তারিত
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
