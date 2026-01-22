import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { DataTable, ColumnDef, RowAction } from '@/components/DataTable'
import { SkeletonTable } from '@/components/SkeletonLoaders'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/EmptyState'
import { useApplicationsList } from '@/hooks/useApplications'
import { Application, ApplicationStatus } from '@/types'
import { useAuthStore } from '@/store/authStore'

const applicationColumns: ColumnDef<Application>[] = [
  {
    key: 'id',
    header: 'ট্র্যাকিং আইডি',
    width: '120px',
    searchable: true,
    render: (value) => (
      <span className="font-mono text-sm font-medium">{value}</span>
    ),
  },
  {
    key: 'applicationType',
    header: 'সেবার ধরণ',
    searchable: true,
    render: (value) => (
      <span className="text-sm">{value}</span>
    ),
  },
  {
    key: 'status',
    header: 'অবস্থা',
    width: '140px',
    render: (value) => (
      <StatusBadge status={value as ApplicationStatus} type="application" />
    ),
  },
  {
    key: 'submittedAt',
    header: 'জমা দেওয়ার তারিখ',
    width: '140px',
    render: (value) => {
      try {
        const date = new Date(value as string)
        return (
          <span className="text-sm text-muted-foreground">
            {date.toLocaleDateString('bn-BD', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        )
      } catch {
        return <span className="text-sm">-</span>
      }
    },
  },
  {
    key: 'applicantName',
    header: 'আবেদনকারীর নাম',
    searchable: true,
    render: (value) => <span className="text-sm">{value}</span>,
  },
]

const rowActions: RowAction<Application>[] = [
  {
    label: 'বিস্তারিত দেখুন',
    onClick: (app) => {
      // This will be handled by onRowClick
    },
  },
]

export function Applications() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null)

  const pageSize = 10

  // Fetch applications with filters (for current user only)
  const { data: applicationsData, isLoading, error } = useApplicationsList({
    page,
    size: pageSize,
    status: selectedStatus || undefined,
    userId: user?.id, // Pass current user ID
  })

  const applications = applicationsData?.content || []
  const pageInfo = applicationsData?.pageInfo

  // Client-side search filtering
  const filteredApplications = useMemo(() => {
    if (!search) return applications

    const searchLower = search.toLowerCase()
    return applications.filter(app =>
      app.id.toLowerCase().includes(searchLower) ||
      app.applicationType.toLowerCase().includes(searchLower)
    )
  }, [applications, search])

  const handleRowClick = (app: Application) => {
    navigate(`/citizen/applications/${app.id}`)
  }

  const uniqueStatuses = useMemo(() => {
    const statuses = applications.map(app => app.status)
    return Array.from(new Set(statuses)) as ApplicationStatus[]
  }, [applications])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <PageHeader
          title="আমার আবেদনসমূহ"
          description="আপনার সমস্ত সেবা আবেদনের তালিকা এবং অবস্থা"
        />
        <Button
          onClick={() => navigate('/citizen/applications/new')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          নতুন আবেদন
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Status Filter */}
        {uniqueStatuses.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus(null)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedStatus === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              সব
            </button>
            {uniqueStatuses.map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedStatus === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <StatusBadge status={status} type="application" />
              </button>
            ))}
          </div>
        )}

        {/* Clear Filters */}
        {(search || selectedStatus) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch('')
              setSelectedStatus(null)
            }}
            className="text-xs"
          >
            ছাড় করুন
          </Button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">ত্রুটি</h3>
              <p className="text-sm text-destructive/80 mt-1">
                আবেদনসমূহ লোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে পৃষ্ঠা রিফ্রেশ করুন।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      {isLoading ? (
        <SkeletonTable rows={5} columns={5} />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          title="কোনো আবেদন নেই"
          description={
            search || selectedStatus
              ? 'আপনার অনুসন্ধানের সাথে মেলে এমন কোনো আবেদন নেই।'
              : 'এখনও কোনো সেবা আবেদন জমা দেননি। নতুন আবেদন তৈরি করতে নীচের বোতামটি ক্লিক করুন।'
          }
          action={
            !search && !selectedStatus
              ? {
                  label: 'নতুন আবেদন তৈরি করুন',
                  onClick: () => navigate('/citizen/applications/new'),
                }
              : undefined
          }
        />
      ) : (
        <DataTable<Application>
          columns={applicationColumns}
          data={filteredApplications}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="ট্র্যাকিং আইডি বা সেবা খুঁজুন..."
          rowActions={rowActions}
          onRowClick={handleRowClick}
          currentPage={page}
          onPageChange={setPage}
          pageSize={pageSize}
          totalItems={pageInfo?.totalElements}
          emptyMessage="কোনো আবেদন পাওয়া যায়নি"
        />
      )}

      {/* No Results After Filtering */}
      {!isLoading && !error && applications.length === 0 && !search && !selectedStatus && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">কোনো আবেদন নেই</p>
          <Button onClick={() => navigate('/citizen/applications/new')}>
            প্রথম আবেদন তৈরি করুন
          </Button>
        </div>
      )}
    </div>
  )
}
