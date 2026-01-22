import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useServices, useCreateService, useUpdateService, useDeleteService } from '@/hooks/useServices'
import { Service } from '@/types'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SkeletonTable } from '@/components/SkeletonLoaders'
import { EmptyState } from '@/components/EmptyState'
import { DataTable, ColumnDef } from '@/components/DataTable'
import {
  Search,
  X,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
} from 'lucide-react'

// Form validation schema
const serviceFormSchema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষর হতে হবে').max(100),
  category: z.string().min(1, 'বিভাগ নির্বাচন করুন'),
  description: z.string().min(10, 'বিবরণ কমপক্ষে ১০ অক্ষর হতে হবে').max(500),
  processingTime: z.string().optional(),
  fee: z.coerce.number().min(0).optional(),
  active: z.boolean().default(true),
})

type ServiceFormData = z.infer<typeof serviceFormSchema>

const CATEGORIES = [
  'নথি ও সার্টিফিকেশন',
  'আর্থিক সহায়তা',
  'অনুমতি ও লাইসেন্স',
  'সম্পত্তি ও রেকর্ড',
  'অন্যান্য',
]

export function ManageServices() {
  const { data: servicesData = { content: [], pageInfo: { total: 0 } }, isLoading, isError } = useServices()
  const services = Array.isArray(servicesData.content) ? servicesData.content : []
  const createMutation = useCreateService()
  const updateMutation = useUpdateService()
  const deleteMutation = useDeleteService()

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDialog, setShowDialog] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null)

  const pageSize = 10

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      active: true,
    },
  })

  // Filter services
  const filtered = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        searchTerm === '' ||
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    })
  }, [services, searchTerm])

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const columns: ColumnDef<Service>[] = [
    {
      key: 'name',
      header: 'সেবার নাম',
      width: '180px',
      render: (value: any) => <span className="font-medium text-sm">{value}</span>,
      searchable: true,
    },
    {
      key: 'category',
      header: 'বিভাগ',
      width: '140px',
      render: (value: any) => <span className="text-sm text-slate-600 dark:text-slate-400">{value}</span>,
    },
    {
      key: 'processingTime',
      header: 'প্রক্রিয়াকরণ সময়',
      width: '120px',
      render: (value: any) => <span className="text-sm">{value || '-'}</span>,
    },
    {
      key: 'fee',
      header: 'ফি',
      width: '90px',
      render: (value: any) => (
        <span className="text-sm">
          {value ? `৳${value}` : '-'}
        </span>
      ),
    },
    {
      key: 'active',
      header: 'অবস্থা',
      width: '90px',
      render: (value: any) => {
        const isActive = value ?? true
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            <CheckCircle className="h-3 w-3" />
            {isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
          </span>
        )
      },
    },
  ]

  const handleOpenCreate = () => {
    setEditingService(null)
    reset({ active: true })
    setShowDialog(true)
  }

  const handleOpenEdit = (service: Service) => {
    setEditingService(service)
    reset({
      name: service.name,
      category: service.category,
      description: service.description,
      processingTime: service.processingTime,
      fee: service.fee,
      active: service.active ?? true,
    })
    setShowDialog(true)
  }

  const onSubmit = async (data: ServiceFormData) => {
    try {
      if (editingService) {
        await updateMutation.mutateAsync({
          id: editingService.id,
          data,
        })
      } else {
        await createMutation.mutateAsync(data)
      }
      setShowDialog(false)
      reset()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
    setShowDeleteDialog(null)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setCurrentPage(1)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader title="সেবা পরিচালনা" subtitle="সরকারি সেবা যোগ এবং পরিচালনা করুন" />
          <Button disabled className="gap-2">
            <Plus className="h-4 w-4" />
            নতুন সেবা
          </Button>
        </div>
        <div className="h-12 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 animate-pulse" />
        <SkeletonTable rows={5} columns={5} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="সেবা পরিচালনা" subtitle="সরকারি সেবা যোগ এবং পরিচালনা করুন" />
        <EmptyState
          icon="AlertCircle"
          title="সমস্যা হয়েছে"
          description="সেবা লোড করতে ব্যর্থ। দয়া করে পুনরায় চেষ্টা করুন।"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="সেবা পরিচালনা" subtitle="সরকারি সেবা যোগ এবং পরিচালনা করুন" />
        <Button onClick={handleOpenCreate} className="gap-2 bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4" />
          নতুন সেবা
        </Button>
      </div>

      {/* Search Section */}
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="সেবার নাম বা বিভাগ দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>

        {searchTerm && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
            <X className="h-3 w-3 mr-1" />
            ফিল্টার পরিষ্কার করুন
          </Button>
        )}
      </div>

      {/* Services List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="AlertCircle"
          title="কোনো সেবা নেই"
          description={
            searchTerm ? 'আপনার খোঁজের সাথে মিলে এমন কোনো সেবা পাওয়া যায়নি।' : 'এখনও কোনো সেবা যোগ করা হয়নি।'
          }
        />
      ) : (
        <>
          <DataTable<Service>
            columns={columns}
            data={paginatedData}
            onRowClick={() => {}}
            rowActions={[
              {
                label: 'সম্পাদনা',
                icon: Edit,
                onClick: (service) => handleOpenEdit(service),
              },
              {
                label: 'মুছুন',
                icon: Trash2,
                onClick: (service) => setShowDeleteDialog(service.id),
              },
            ]}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filtered.length}
          />

          {filtered.length > 0 && (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              মোট {filtered.length} সেবার মধ্যে {(currentPage - 1) * pageSize + 1} থেকে{' '}
              {Math.min(currentPage * pageSize, filtered.length)} দেখাচ্ছে
            </div>
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white dark:bg-slate-950">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900 sticky top-0">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {editingService ? 'সেবা সম্পাদনা করুন' : 'নতুন সেবা যোগ করুন'}
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-1">
                  সেবার নাম <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register('name')}
                  placeholder="যেমন: জন্ম সার্টিফিকেট"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-1">
                  বিভাগ <span className="text-destructive">*</span>
                </label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 text-sm"
                >
                  <option value="">বিভাগ নির্বাচন করুন</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-destructive mt-1">{errors.category.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-1">
                  বিবরণ <span className="text-destructive">*</span>
                </label>
                <textarea
                  {...register('description')}
                  placeholder="সেবা সম্পর্কে বিস্তারিত বিবরণ..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 text-sm resize-none"
                />
                {errors.description && (
                  <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Processing Time */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-1">
                  প্রক্রিয়াকরণ সময়
                </label>
                <Input
                  {...register('processingTime')}
                  placeholder="যেমন: ৭-১০ দিন"
                  className={errors.processingTime ? 'border-destructive' : ''}
                />
                {errors.processingTime && (
                  <p className="text-xs text-destructive mt-1">{errors.processingTime.message}</p>
                )}
              </div>

              {/* Fee */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-1">
                  ফি (টাকা)
                </label>
                <Input
                  {...register('fee')}
                  type="number"
                  placeholder="০"
                  className={errors.fee ? 'border-destructive' : ''}
                />
                {errors.fee && (
                  <p className="text-xs text-destructive mt-1">{errors.fee.message}</p>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register('active')}
                  className="h-4 w-4 rounded border-slate-200"
                />
                <label className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  সেবা সক্রিয় রাখুন
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'সংরক্ষণ হচ্ছে...'
                    : editingService
                      ? 'সম্পাদনা সংরক্ষণ করুন'
                      : 'সেবা যোগ করুন'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowDialog(false)
                    reset()
                  }}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  variant="outline"
                  className="flex-1"
                >
                  বাতিল করুন
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white dark:bg-slate-950">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                সেবা মুছুন?
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                এই সেবা মুছে ফেলা হবে এবং এটি পুনরুদ্ধার করা যাবে না। নিশ্চিত?
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleDelete(showDeleteDialog)}
                  disabled={deleteMutation.isPending}
                  variant="destructive"
                  className="flex-1"
                >
                  {deleteMutation.isPending ? 'মুছছে...' : 'হ্যাঁ, মুছুন'}
                </Button>
                <Button
                  onClick={() => setShowDeleteDialog(null)}
                  disabled={deleteMutation.isPending}
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
