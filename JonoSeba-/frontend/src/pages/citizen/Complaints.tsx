import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, X } from 'lucide-react'
import { useComplaintsList } from '@/hooks/useComplaints'
import { Complaint, ReportStatus, ProblemType } from '@/types'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/StatusBadge'
import { SkeletonTable } from '@/components/SkeletonLoaders'
import { EmptyState } from '@/components/EmptyState'
import { DataTable, ColumnDef } from '@/components/DataTable'
import { ComplaintDetailModal } from './ComplaintDetail'

const PROBLEM_TYPE_LABELS: Record<ProblemType, string> = {
  [ProblemType.ROAD_DAMAGE]: 'রাস্তার ক্ষতি',
  [ProblemType.WATER_SUPPLY]: 'জল সরবরাহ সমস্যা',
  [ProblemType.GARBAGE]: 'ময়লা ব্যবস্থাপনা',
  [ProblemType.STREET_LIGHT]: 'রাস্তার আলো',
  [ProblemType.DRAINAGE]: 'ড্রেনেজ সমস্যা',
  [ProblemType.OTHER]: 'অন্যান্য',
}

const STATUS_LABELS: Record<ReportStatus, string> = {
  [ReportStatus.PENDING]: 'অপেক্ষমাণ',
  [ReportStatus.ASSIGNED]: 'নির্ধারিত',
  [ReportStatus.IN_PROGRESS]: 'প্রক্রিয়াধীন',
  [ReportStatus.RESOLVED]: 'সমাধান হয়েছে',
  [ReportStatus.CLOSED]: 'বন্ধ',
}

export function Complaints() {
  const navigate = useNavigate()
  const { data: complaints = [], isLoading, isError } = useComplaintsList()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const pageSize = 10

  // Filter and search
  const filtered = useMemo(() => {
    return complaints.filter((complaint: Complaint) => {
      const matchesSearch =
        searchTerm === '' ||
        complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        PROBLEM_TYPE_LABELS[complaint.problemType]
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      const matchesStatus = !selectedStatus || complaint.status === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [complaints, searchTerm, selectedStatus])

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Get unique statuses from data
  const statusOptions = Array.from(
    new Set(complaints.map((c) => c.status))
  ) as ReportStatus[]

  const columns: ColumnDef<Complaint>[] = [
    {
      key: 'id',
      header: 'অভিযোগ আইডি',
      width: '120px',
      render: (value) => <span className="font-medium">{value}</span>,
      searchable: true,
    },
    {
      key: 'problemType',
      header: 'সমস্যার ধরন',
      width: '150px',
      render: (value) => PROBLEM_TYPE_LABELS[value as ProblemType] || value,
      searchable: true,
    },
    {
      key: 'status',
      header: 'অবস্থা',
      width: '120px',
      render: (value) => <StatusBadge type="complaint" status={value as ReportStatus} />,
    },
    {
      key: 'reportedAt',
      header: 'তারিখ',
      width: '130px',
      render: (value) => new Date(value as string).toLocaleDateString('bn-BD'),
    },
    {
      key: 'title',
      header: 'শিরোনাম',
      width: 'auto',
      render: (value) => (
        <span className="text-sm text-slate-600 dark:text-slate-400 truncate">{value}</span>
      ),
      searchable: true,
    },
  ]

  const handleRowClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedStatus(undefined)
    setCurrentPage(1)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="আমার অভিযোগসমূহ"
          description="আপনার জমা দেওয়া অভিযোগ এবং তাদের অবস্থা দেখুন"
        />
        <SkeletonTable rows={5} columns={5} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="আমার অভিযোগসমূহ"
          description="আপনার জমা দেওয়া অভিযোগ এবং তাদের অবস্থা দেখুন"
        />
        <EmptyState
          icon="AlertCircle"
          title="সমস্যা হয়েছে"
          description="অভিযোগ লোড করতে ব্যর্থ। দয়া করে পুনরায় চেষ্টা করুন।"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="আমার অভিযোগসমূহ"
          description="আপনার জমা দেওয়া অভিযোগ এবং তাদের অবস্থা দেখুন"
        />
        <Button
          onClick={() => navigate('/citizen/complaints/new')}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          নতুন অভিযোগ
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="আইডি, শিরোনাম বা সমস্যার ধরন দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            অবস্থা অনুযায়ী ফিল্টার করুন:
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

        {/* Clear Filters */}
        {(searchTerm || selectedStatus) && (
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

      {/* Data Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="FileText"
          title="কোনো অভিযোগ নেই"
          description={
            searchTerm || selectedStatus
              ? 'আপনার ফিল্টার শর্তের সাথে মিলে এমন কোনো অভিযোগ পাওয়া যায়নি।'
              : 'আপনি এখনো কোনো অভিযোগ জমা দেননি। নতুন অভিযোগ জমা দিয়ে শুরু করুন।'
          }
          action={
            !searchTerm && !selectedStatus
              ? {
                  label: 'নতুন অভিযোগ জমা দিন',
                  onClick: () => navigate('/citizen/complaints/new'),
                }
              : undefined
          }
        />
      ) : (
        <>
          <DataTable<Complaint>
            columns={columns}
            data={paginatedData}
            onRowClick={handleRowClick}
            rowActions={[]}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filtered.length}
          />

          {/* Pagination Info */}
          {filtered.length > 0 && (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              মোট {filtered.length} অভিযোগের মধ্যে {(currentPage - 1) * pageSize + 1} থেকে{' '}
              {Math.min(currentPage * pageSize, filtered.length)} দেখাচ্ছে
            </div>
          )}
        </>
      )}

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  )
}
