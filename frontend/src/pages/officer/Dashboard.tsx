import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApplicationsList } from '@/hooks/useApplications'
import { useServices } from '@/hooks/useServices'
import { Application, ApplicationStatus, ApplicationType } from '@/types'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/StatusBadge'
import { SkeletonTable } from '@/components/SkeletonLoaders'
import { EmptyState } from '@/components/EmptyState'
import { DataTable, ColumnDef } from '@/components/DataTable'
import {
  Calendar,
  CheckCircle,
  Clock,
  Search,
  X,
  Eye,
  Zap,
  BarChart3,
  AlertCircle,
} from 'lucide-react'

const APPLICATION_TYPE_LABELS: Record<ApplicationType, string> = {
  [ApplicationType.BIRTH_CERTIFICATE]: 'জন্ম সার্টিফিকেট',
  [ApplicationType.DEATH_CERTIFICATE]: 'মৃত্যু সার্টিফিকেট',
  [ApplicationType.LAND_MUTATION]: 'ভূমি পরিবর্তন',
  [ApplicationType.NATIONALITY_CERTIFICATE]: 'জাতীয়তা সার্টিফিকেট',
  [ApplicationType.VGF_VGD]: 'ভিজিএফ/ভিজিডি',
  [ApplicationType.OLD_AGE_ALLOWANCE]: 'বয়স্ক ভাতা',
  [ApplicationType.WIDOW_ALLOWANCE]: 'বিধবা ভাতা',
  [ApplicationType.DISABILITY_ALLOWANCE]: 'প্রতিবন্ধী ভাতা',
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: 'অপেক্ষমাণ',
  [ApplicationStatus.IN_REVIEW]: 'পর্যালোচনায়',
  [ApplicationStatus.APPROVED]: 'অনুমোদিত',
  [ApplicationStatus.REJECTED]: 'প্রত্যাখ্যাত',
}

export function OfficerDashboard() {
  const navigate = useNavigate()
  const { data: applicationsResponse, isLoading, isError } = useApplicationsList()
  const { data: servicesResponse } = useServices()
  const applications = applicationsResponse?.content || []
  const services = servicesResponse?.content || servicesResponse || []
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | undefined>()
  const [selectedService, setSelectedService] = useState<string | undefined>()
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Calculate summary stats
  const stats = useMemo(() => {
    const pending = applications.filter((app) => app.status === ApplicationStatus.PENDING).length
    const inReviewToday = applications.filter(
      (app) =>
        app.status === ApplicationStatus.IN_REVIEW &&
        new Date(app.updatedAt).toDateString() === new Date().toDateString()
    ).length
    const approved = applications.filter(
      (app) => app.status === ApplicationStatus.APPROVED
    ).length
    const rejected = applications.filter(
      (app) => app.status === ApplicationStatus.REJECTED
    ).length

    return { pending, inReviewToday, approved, rejected, total: applications.length }
  }, [applications])

  const normalizeType = (app: Application) =>
    (app.applicationType || (app as any).serviceId || (app as any).type) as string

  const serviceNameMap = useMemo(() => {
    const map: Record<string, string> = {}
    services.forEach((s: any) => {
      map[s.id] = s.name
      map[s.name] = s.name
    })
    return map
  }, [services])

  const getServiceLabel = (type?: string) =>
    (type && (APPLICATION_TYPE_LABELS[type as ApplicationType] || serviceNameMap[type])) || type || 'অজানা'

  // Filter applications
  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const type = normalizeType(app)
      const label = (getServiceLabel(type) || '').toLowerCase()

      const matchesSearch =
        searchTerm === '' ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone?.includes(searchTerm) ||
        label.includes(searchTerm.toLowerCase())

      const matchesStatus = !selectedStatus || app.status === selectedStatus
      const matchesService = !selectedService || type === selectedService
      const appDate = new Date((app as any).submittedAt || (app as any).submittedDate || Date.now())
      const matchesDateFrom = !dateFrom || appDate >= new Date(dateFrom)
      const matchesDateTo = !dateTo || appDate <= new Date(dateTo)

      return (
        matchesSearch &&
        matchesStatus &&
        matchesService &&
        matchesDateFrom &&
        matchesDateTo
      )
    })
  }, [applications, searchTerm, selectedStatus, selectedService, dateFrom, dateTo])

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Get unique services and statuses
  const serviceOptions = Array.from(
    new Set(
      applications
        .map((a) => normalizeType(a))
        .filter(Boolean)
    )
  ) as string[]
  const statusOptions = Array.from(
    new Set(applications.map((a) => a.status))
  ) as ApplicationStatus[]

  const columns: ColumnDef<Application>[] = [
    {
      key: 'id',
      header: 'আবেদন আইডি',
      width: '110px',
      render: (value: any) => <span className="font-medium text-sm">{value}</span>,
      searchable: true,
    },
    {
      key: 'applicantName',
      header: 'আবেদনকারী',
      width: '150px',
      render: (value: any) => (
        <div>
          <p className="font-medium text-sm">{value}</p>
        </div>
      ),
      searchable: true,
    },
    {
      key: 'applicationType',
      header: 'সেবার ধরন',
      width: '140px',
      render: (value: any) => (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {APPLICATION_TYPE_LABELS[value as ApplicationType] || value}
        </span>
      ),
      searchable: true,
    },
    {
      key: 'status',
      header: 'অবস্থা',
      width: '110px',
      render: (value: any) => <StatusBadge type="application" status={value as ApplicationStatus} />,
    },
    {
      key: 'submittedAt',
      header: 'জমা দেওয়ার তারিখ',
      width: '130px',
      render: (value: any) => new Date(value as string).toLocaleDateString('bn-BD'),
    },
  ]

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedStatus(undefined)
    setSelectedService(undefined)
    setDateFrom('')
    setDateTo('')
    setCurrentPage(1)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="অফিসার ড্যাশবোর্ড"
          description="অপেক্ষমাণ আবেদন এবং পরিসংখ্যান দেখুন"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 animate-pulse"
            />
          ))}
        </div>
        <SkeletonTable rows={5} columns={5} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="অফিসার ড্যাশবোর্ড"
          description="অপেক্ষমাণ আবেদন এবং পরিসংখ্যান দেখুন"
        />
        <EmptyState
          icon="AlertCircle"
          title="সমস্যা হয়েছে"
          description="আবেদন লোড করতে ব্যর্থ। দয়া করে পুনরায় চেষ্টা করুন।"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="অফিসার ড্যাশবোর্ড"
        description="অপেক্ষমাণ আবেদন এবং পরিসংখ্যান দেখুন"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<Clock className="h-6 w-6" />}
          title="অপেক্ষমাণ আবেদন"
          value={stats.pending}
          color="blue"
          subtitle={`${stats.pending} টি আবেদন`}
        />
        <SummaryCard
          icon={<Zap className="h-6 w-6" />}
          title="আজ পর্যালোচনায়"
          value={stats.inReviewToday}
          color="yellow"
          subtitle={`${stats.inReviewToday} টি পর্যালোচনা`}
        />
        <SummaryCard
          icon={<CheckCircle className="h-6 w-6" />}
          title="অনুমোদিত আবেদন"
          value={stats.approved}
          color="green"
          subtitle={`${stats.approved} টি অনুমোদিত`}
        />
        <SummaryCard
          icon={<BarChart3 className="h-6 w-6" />}
          title="মোট আবেদন"
          value={stats.total}
          color="slate"
          subtitle={`${stats.total} টি সর্বমোট`}
        />
      </div>

      {/* Filters Section */}
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="আইডি, নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>

        {/* Status and Service Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              অবস্থা:
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedStatus ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedStatus(undefined)
                  setCurrentPage(1)
                }}
                className="h-8"
              >
                সব
              </Button>
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedStatus(status)
                    setCurrentPage(1)
                  }}
                  className="h-8"
                >
                  {STATUS_LABELS[status]}
                </Button>
              ))}
            </div>
          </div>

          {/* Service Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              সেবা:
            </label>
            <select
              value={selectedService || ''}
              onChange={(e) => {
                const value = e.target.value
                setSelectedService(value ? (value as ApplicationType) : undefined)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-1.5 text-sm rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="">সব সেবা</option>
              {serviceOptions.map((service) => (
                <option key={service} value={service}>
                  {getServiceLabel(service)}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              তারিখ পরিসীমা:
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value)
                  setCurrentPage(1)
                }}
                className="flex-1 px-3 py-1.5 text-sm rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                placeholder="থেকে"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value)
                  setCurrentPage(1)
                }}
                className="flex-1 px-3 py-1.5 text-sm rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                placeholder="পর্যন্ত"
              />
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedStatus || selectedService || dateFrom || dateTo) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            ফিল্টার পরিষ্কার করুন
          </Button>
        )}
      </div>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="FileText"
          title="কোনো আবেদন নেই"
          description={
            searchTerm || selectedStatus || selectedService || dateFrom || dateTo
              ? 'আপনার ফিল্টার শর্তের সাথে মিলে এমন কোনো আবেদন পাওয়া যায়নি।'
              : 'এই মুহূর্তে কোনো পর্যালোচনার জন্য অপেক্ষমাণ আবেদন নেই।'
          }
        />
      ) : (
        <>
          <DataTable<Application>
            columns={columns}
            data={paginatedData}
            onRowClick={() => {}}
            rowActions={[
              {
                label: 'দেখুন',
                icon: Eye,
                onClick: (row) => navigate(`/officer/applications/${row.id}/review`),
              },
              {
                label: 'পর্যালোচনা',
                icon: Zap,
                onClick: (row) => navigate(`/officer/applications/${row.id}/review`),
              },
            ]}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filtered.length}
          />

          {/* Pagination Info */}
          {filtered.length > 0 && (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              মোট {filtered.length} আবেদনের মধ্যে {(currentPage - 1) * pageSize + 1} থেকে{' '}
              {Math.min(currentPage * pageSize, filtered.length)} দেখাচ্ছে
            </div>
          )}
        </>
      )}
    </div>
  )
}

function SummaryCard({
  icon,
  title,
  value,
  color,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  value: number
  color: 'blue' | 'yellow' | 'green' | 'slate'
  subtitle: string
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    yellow:
      'bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    green:
      'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    slate:
      'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  }

  return (
    <div
      className={`rounded-lg border p-4 ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 rounded-lg bg-white dark:bg-slate-800">
          {icon}
        </div>
      </div>
      <h3 className="text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs opacity-75">{subtitle}</p>
    </div>
  )
}
