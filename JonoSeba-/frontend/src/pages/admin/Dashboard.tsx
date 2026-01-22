import { useMemo } from 'react'
import { useApplicationsList } from '@/hooks/useApplications'
import { useComplaintsList } from '@/hooks/useComplaints'
import { useUsersList } from '@/hooks/useUsers'
import { useServices } from '@/hooks/useServices'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/card'
import {
  FileText,
  MessageSquare,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  trend?: number
  description?: string
}

function StatCard({ title, value, icon, color, trend, description }: StatCardProps) {
  const bgMap = {
    blue: 'bg-blue-50 dark:bg-blue-950/30',
    green: 'bg-green-50 dark:bg-green-950/30',
    yellow: 'bg-yellow-50 dark:bg-yellow-950/30',
    red: 'bg-red-50 dark:bg-red-950/30',
    purple: 'bg-purple-50 dark:bg-purple-950/30',
  }



  const accentMap = {
    blue: 'bg-gradient-to-r from-blue-400 to-blue-500',
    green: 'bg-gradient-to-r from-green-400 to-green-500',
    yellow: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
    red: 'bg-gradient-to-r from-red-400 to-red-500',
    purple: 'bg-gradient-to-r from-purple-400 to-purple-500',
  }

  return (
    <Card className={`${bgMap[color]} border-0 p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</p>
          {trend !== undefined && (
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
          {description && <p className="text-xs text-slate-500 mt-2">{description}</p>}
        </div>
        <div className={`${accentMap[color]} p-3 rounded-lg text-white shadow-md`}>{icon}</div>
      </div>
    </Card>
  )
}

export function AdminDashboard() {
  const { data: applicationsData = { content: [] } } = useApplicationsList()
  const { data: complaintsData = [] } = useComplaintsList()
  const { data: usersData = { content: [] } } = useUsersList()
  const { data: servicesData = { content: [] } } = useServices()

  const applications = Array.isArray(applicationsData.content) ? applicationsData.content : []
  const complaints = Array.isArray(complaintsData) ? complaintsData : []
  const users = Array.isArray(usersData.content) ? usersData.content : []
  const services = Array.isArray(servicesData.content) ? servicesData.content : []

  const stats = useMemo(() => {
    const total = applications.length
    const pending = applications.filter((a: any) => a.status === 'PENDING').length
    const approved = applications.filter((a: any) => a.status === 'APPROVED').length
    const rejected = applications.filter((a: any) => a.status === 'REJECTED').length

    return { total, pending, approved, rejected }
  }, [applications])

  const recentApplications = applications.slice(0, 5)
  const recentComplaints = complaints.slice(0, 5)

  return (
    <div className="space-y-8">
      <PageHeader
        title="অ্যাডমিন ড্যাশবোর্ড"
        subtitle="সিস্টেম পরিসংখ্যান এবং ব্যবস্থাপনা"
      />

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="মোট আবেদন"
          value={stats.total}
          icon={<FileText className="h-6 w-6" />}
          color="blue"
          description="সকল আবেদন"
        />
        <StatCard
          title="অপেক্ষমাণ"
          value={stats.pending}
          icon={<Clock className="h-6 w-6" />}
          color="yellow"
          description="পর্যালোচনার অপেক্ষায়"
        />
        <StatCard
          title="অনুমোদিত"
          value={stats.approved}
          icon={<CheckCircle className="h-6 w-6" />}
          color="green"
          description="সফলভাবে অনুমোদিত"
        />
        <StatCard
          title="প্রত্যাখ্যাত"
          value={stats.rejected}
          icon={<XCircle className="h-6 w-6" />}
          color="red"
          description="প্রত্যাখ্যাত আবেদন"
        />
        <StatCard
          title="সক্রিয় ব্যবহারকারী"
          value={users.length}
          icon={<Users className="h-6 w-6" />}
          color="purple"
          description={`${users.filter((u: any) => u.role === 'CITIZEN').length} নাগরিক`}
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="মোট অভিযোগ"
          value={complaints.length}
          icon={<MessageSquare className="h-6 w-6" />}
          color="blue"
          description="সকল অভিযোগ"
        />
        <StatCard
          title="সক্রিয় সেবা"
          value={services.length}
          icon={<TrendingUp className="h-6 w-6" />}
          color="green"
          description="নাগরিক সেবা"
        />
        <StatCard
          title="সম্পূর্ণতার হার"
          value={`${applications.length > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%`}
          icon={<AlertCircle className="h-6 w-6" />}
          color="purple"
          description="অনুমোদন হার"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              সাম্প্রতিক আবেদন
            </h3>
            <Link
              to="/admin/manage-applications"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              সব দেখুন →
            </Link>
          </div>
          {recentApplications.length > 0 ? (
            <div className="space-y-3">
              {recentApplications.map((app: any) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{app.applicantName}</p>
                    <p className="text-xs text-slate-500">{app.serviceId}</p>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      app.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : app.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {app.status === 'PENDING'
                      ? 'অপেক্ষমাণ'
                      : app.status === 'APPROVED'
                        ? 'অনুমোদিত'
                        : 'প্রত্যাখ্যাত'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">কোনো আবেদন নেই</p>
          )}
        </Card>

        {/* Recent Complaints */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-red-600" />
              সাম্প্রতিক অভিযোগ
            </h3>
            <Link
              to="/citizen/complaints"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              সব দেখুন →
            </Link>
          </div>
          {recentComplaints.length > 0 ? (
            <div className="space-y-3">
              {recentComplaints.map((complaint: any) => (
                <div
                  key={complaint.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{complaint.title}</p>
                    <p className="text-xs text-slate-500">দ্বারা: {complaint.complainantName}</p>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      complaint.status === 'OPEN'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}
                  >
                    {complaint.status === 'OPEN' ? 'খোলা' : 'বন্ধ'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">কোনো অভিযোগ নেই</p>
          )}
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">দ্রুত লিংক</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to="/admin/manage-services"
            className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 hover:shadow-md transition-shadow text-center"
          >
            <p className="font-medium text-sm text-blue-900 dark:text-blue-300">সেবা পরিচালনা</p>
          </Link>
          <Link
            to="/admin/manage-users"
            className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 hover:shadow-md transition-shadow text-center"
          >
            <p className="font-medium text-sm text-green-900 dark:text-green-300">ব্যবহারকারী পরিচালনা</p>
          </Link>
          <Link
            to="/admin/reports"
            className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 hover:shadow-md transition-shadow text-center"
          >
            <p className="font-medium text-sm text-purple-900 dark:text-purple-300">রিপোর্ট</p>
          </Link>
          <Link
            to="/citizen/applications"
            className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 hover:shadow-md transition-shadow text-center"
          >
            <p className="font-medium text-sm text-orange-900 dark:text-orange-300">আবেদন ট্র্যাক করুন</p>
          </Link>
        </div>
      </Card>
    </div>
  )
}
