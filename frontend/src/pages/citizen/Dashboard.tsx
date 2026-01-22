import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, AlertCircle, FileText, CheckCircle, Clock, XCircle, ArrowRight, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { SkeletonCard, SkeletonTable } from '@/components/SkeletonLoaders'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/EmptyState'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useApplicationsList } from '@/hooks/useApplications'
import { ApplicationStatus } from '@/types'

interface DashboardStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: 'blue' | 'yellow' | 'green' | 'red'
  loading?: boolean
}

function StatCard({
  title,
  value,
  icon,
  color,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return <SkeletonCard lines={2} showHeader={false} />
  }

  const colorClasses = {
    blue: 'bg-blue-100/60 text-blue-700 border-blue-200/60',
    yellow: 'bg-yellow-100/60 text-yellow-700 border-yellow-200/60',
    green: 'bg-green-100/60 text-green-700 border-green-200/60',
    red: 'bg-red-100/60 text-red-700 border-red-200/60',
  }

  return (
    <Card className="relative overflow-hidden rounded-2xl bg-white/85 backdrop-blur-sm border border-slate-200/70 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 group">
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-${color}-400/40 via-${color}-500/60 to-${color}-400/40 group-hover:from-${color}-400/70 group-hover:via-${color}-500/90 group-hover:to-${color}-400/70 transition-all duration-500`} />
      
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b from-${color}-50/30 to-transparent pointer-events-none`} />
      
      {/* Inner ring */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/50 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 p-6 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]} border`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

export function CitizenDashboard() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 5

  // Fetch applications
  const { data: applicationsData, isLoading: applicationsLoading } = useApplicationsList({
    page,
    size: pageSize,
  })

  const applications = applicationsData?.data || []

  // Calculate stats
  const stats: DashboardStats = {
    total: applicationsData?.total || 0,
    pending: applications.filter(
      app => app.status === ApplicationStatus.PENDING
    ).length,
    approved: applications.filter(
      app => app.status === ApplicationStatus.APPROVED
    ).length,
    rejected: applications.filter(
      app => app.status === ApplicationStatus.REJECTED
    ).length,
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="আমার ড্যাশবোর্ড"
        description="আপনার সেবা আবেদনগুলি এবং অভিযোগের সারসংক্ষেপ"
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={() => navigate('/citizen/applications/new')}
          size="lg"
          className="flex items-center justify-center gap-2 h-12 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          নতুন সেবা আবেদন
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/citizen/complaints/new')}
          className="flex items-center justify-center gap-2 h-12 rounded-lg font-semibold bg-white/80 backdrop-blur-sm border-slate-300 text-slate-900 hover:bg-white"
        >
          <AlertCircle className="h-5 w-5" />
          অভিযোগ জমা দিন
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="মোট আবেদন"
          value={stats.total}
          icon={<FileText className="w-6 h-6" />}
          color="blue"
          loading={applicationsLoading}
        />
        <StatCard
          title="অপেক্ষমাণ"
          value={stats.pending}
          icon={<Clock className="w-6 h-6" />}
          color="yellow"
          loading={applicationsLoading}
        />
        <StatCard
          title="অনুমোদিত"
          value={stats.approved}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
          loading={applicationsLoading}
        />
        <StatCard
          title="প্রত্যাখ্যাত"
          value={stats.rejected}
          icon={<XCircle className="w-6 h-6" />}
          color="red"
          loading={applicationsLoading}
        />
      </div>

      {/* Recent Applications Section */}
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              সাম্প্রতিক আবেদনসমূহ
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              আপনার সর্বশেষ জমা দেওয়া আবেদনগুলি
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/citizen/applications')}
            className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            সব দেখুন <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {applicationsLoading ? (
          <SkeletonTable rows={5} columns={4} />
        ) : applications.length === 0 ? (
          <EmptyState
            title="কোনো আবেদন নেই"
            description="এখনও কোনো সেবা আবেদন জমা দেননি। নতুন আবেদন তৈরি করতে নীচের বোতামটি ক্লিক করুন।"
            action={{
              label: 'নতুন আবেদন তৈরি করুন',
              onClick: () => navigate('/citizen/applications/new'),
            }}
          />
        ) : (
          <Card className="relative overflow-hidden rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all duration-500">
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400/40 via-green-500/60 to-green-400/40" />
            
            {/* Table wrapper */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-slate-200/50">
                    <TableHead className="font-semibold text-slate-900">আবেদনের ধরণ</TableHead>
                    <TableHead className="font-semibold text-slate-900">অবস্থা</TableHead>
                    <TableHead className="font-semibold text-slate-900">তারিখ</TableHead>
                    <TableHead className="text-right font-semibold text-slate-900">ক্রিয়া</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {applications.map((app, idx) => (
                    <TableRow
                      key={app.id}
                      className={`border-slate-200/50 hover:bg-green-50/40 transition-colors duration-200 cursor-pointer ${
                        idx !== applications.length - 1 ? 'border-b' : ''
                      }`}
                      onClick={() => navigate(`/citizen/applications/${app.id}`)}
                    >
                      <TableCell className="font-semibold text-slate-900">{app.type}</TableCell>
                      <TableCell>
                        <StatusBadge status={app.status} type="application" />
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(app.createdAt).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/citizen/applications/${app.id}`)
                          }}
                          className="gap-1.5 text-green-600 hover:text-green-700 hover:bg-green-50/60"
                        >
                          বিস্তারিত
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {/* Pagination Info */}
        {applicationsData && applicationsData.total > pageSize && (
          <div className="text-center text-sm text-slate-600 py-2">
            {applicationsData.total} টি আবেদনের মধ্যে {Math.min(pageSize, applications.length)} টি দেখাচ্ছে
          </div>
        )}
      </div>

      {/* Quick Tips Section */}
      <Card className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50/80 to-emerald-50/40 border border-green-200/60 shadow-sm">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400/40 via-green-500/60 to-green-400/40" />
        
        {/* Inner ring */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/50 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 p-6 md:p-8">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-lg">
            <span className="text-2xl">💡</span>
            দ্রুত পরামর্শ
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="font-semibold text-green-900">আপনার আবেদন দেখুন</p>
              <p className="text-sm text-slate-700">আপনার আবেদনের অবস্থা যেকোনো সময় পরীক্ষা করতে পারেন</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-green-900">সমস্যা রিপোর্ট করুন</p>
              <p className="text-sm text-slate-700">সেবা সম্পর্কিত যেকোনো সমস্যার জন্য অভিযোগ জমা দিন</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-green-900">সময়সীমা জানুন</p>
              <p className="text-sm text-slate-700">সাধারণত ৫ কর্মদিবসের মধ্যে আবেদন প্রক্রিয়া সম্পন্ন</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
