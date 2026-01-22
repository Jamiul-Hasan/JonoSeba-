import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'
import { PageHeader } from '@/components/PageHeader'
import { SkeletonCard, SkeletonTable } from '@/components/SkeletonLoaders'
import { EmptyState } from '@/components/EmptyState'
import { AlertCircle, FileText, MessageSquare, TrendingUp } from 'lucide-react'

export function Reports() {
  const {
    isLoading,
    totalApplications,
    totalComplaints,
    applicationsByStatus,
    complaintsByStatus,
    trendData,
  } = useAnalytics()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="বিশ্লেষণ ও রিপোর্ট"
          subtitle="সিস্টেম পরিসংখ্যান এবং প্রবণতা"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 animate-pulse"
            />
          ))}
        </div>
        <SkeletonTable rows={3} columns={2} />
      </div>
    )
  }

  const hasData = totalApplications > 0 || totalComplaints > 0

  if (!hasData) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="বিশ্লেষণ ও রিপোর্ট"
          subtitle="সিস্টেম পরিসংখ্যান এবং প্রবণতা"
        />
        <EmptyState
          icon="BarChart3"
          title="কোনো ডেটা নেই"
          description="বিশ্লেষণ প্রদর্শনের জন্য এখনও পর্যাপ্ত ডেটা নেই।"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="বিশ্লেষণ ও রিপোর্ট"
        subtitle="সিস্টেম পরিসংখ্যান এবং প্রবণতা"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<FileText className="h-6 w-6" />}
          title="মোট আবেদন"
          value={totalApplications}
          color="blue"
        />
        <SummaryCard
          icon={<MessageSquare className="h-6 w-6" />}
          title="মোট অভিযোগ"
          value={totalComplaints}
          color="purple"
        />
        <SummaryCard
          icon={<TrendingUp className="h-6 w-6" />}
          title="অনুমোদিত আবেদন"
          value={applicationsByStatus.find((s) => s.label === 'অনুমোদিত')?.count || 0}
          color="green"
        />
        <SummaryCard
          icon={<AlertCircle className="h-6 w-6" />}
          title="সমাধান করা অভিযোগ"
          value={complaintsByStatus.find((s) => s.label === 'সমাধান করা')?.count || 0}
          color="emerald"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by Status */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
            আবেদনের অবস্থা বিতরণ
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={applicationsByStatus}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {applicationsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Complaints by Status */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
            অভিযোগের অবস্থা বিতরণ
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complaintsByStatus} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: 'currentColor' }} angle={-45} height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8">
                {complaintsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          গত ৭ দিনের প্রবণতা
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="#3B82F6"
              name="আবেদন"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="complaints"
              stroke="#8B5CF6"
              name="অভিযোগ"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Details */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
            আবেদন পরিসংখ্যান
          </h3>
          <div className="space-y-3">
            {applicationsByStatus.map((status) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {status.count}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ({Math.round((status.count / totalApplications) * 100) || 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complaint Status Details */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
            অভিযোগ পরিসংখ্যান
          </h3>
          <div className="space-y-3">
            {complaintsByStatus.map((status) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {status.count}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ({Math.round((status.count / totalComplaints) * 100) || 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode
  title: string
  value: number
  color: 'blue' | 'purple' | 'green' | 'emerald'
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    purple:
      'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    green:
      'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    emerald:
      'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  }

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 rounded-lg bg-white dark:bg-slate-800">{icon}</div>
      </div>
      <h3 className="text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}
