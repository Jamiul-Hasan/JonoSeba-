import { useState, useMemo } from 'react'
import { useUsersList, useUpdateUserStatus, useUpdateUserRole } from '@/hooks/useUsers'
import { User, UserRole } from '@/types'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SkeletonTable } from '@/components/SkeletonLoaders'
import { EmptyState } from '@/components/EmptyState'
import { DataTable, ColumnDef } from '@/components/DataTable'
import {
  Search,
  X,
  UserCheck,
  UserX,
  Shield,
  CheckCircle,
} from 'lucide-react'

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.CITIZEN]: 'নাগরিক',
  [UserRole.FIELD_WORKER]: 'ফিল্ড ওয়ার্কার',
  [UserRole.ADMIN]: 'প্রশাসক',
}

const STATUS_COLORS = {
  active: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
  inactive: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    icon: <UserX className="h-4 w-4" />,
  },
}

export function ManageUsers() {
  const { data: usersData = { content: [], pageInfo: { total: 0 } }, isLoading, isError } = useUsersList()
  const users = Array.isArray(usersData.content) ? usersData.content : []
  const updateStatusMutation = useUpdateUserStatus()
  const updateRoleMutation = useUpdateUserRole()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const [showDisableDialog, setShowDisableDialog] = useState<string | null>(null)
  const [showRoleDialog, setShowRoleDialog] = useState<{ userId: string; currentRole: UserRole } | null>(null)
  const [newRole, setNewRole] = useState<UserRole | ''>('')

  const pageSize = 10

  // Filter users
  const filtered = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchTerm === '' ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)

      const matchesRole = !selectedRole || user.role === selectedRole

      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, selectedRole])

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Get unique roles
  const roleOptions = Array.from(new Set(users.map((u) => u.role))) as UserRole[]

  const columns: ColumnDef<User>[] = [
    {
      key: 'name',
      header: 'নাম',
      width: '150px',
      render: (value: any) => <span className="font-medium text-sm">{value}</span>,
      searchable: true,
    },
    {
      key: 'email',
      header: 'ইমেইল',
      width: '180px',
      render: (value: any) => <span className="text-sm text-slate-600 dark:text-slate-400">{value}</span>,
      searchable: true,
    },
    {
      key: 'phone',
      header: 'ফোন নম্বর',
      width: '130px',
      render: (value: any) => <span className="text-sm">{value}</span>,
      searchable: true,
    },
    {
      key: 'role',
      header: 'ভূমিকা',
      width: '110px',
      render: (value: any) => (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          <Shield className="h-3 w-3" />
          {ROLE_LABELS[value as UserRole]}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'অবস্থা',
      width: '100px',
      render: (value: any) => {
        const isActive = value ?? true
        const config = isActive ? STATUS_COLORS.active : STATUS_COLORS.inactive
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.icon}
            {isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
          </span>
        )
      },
    },
  ]

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedRole(undefined)
    setCurrentPage(1)
  }

  const handleDisableUser = async (userId: string, isCurrentlyActive: boolean) => {
    await updateStatusMutation.mutateAsync({
      id: userId,
      data: { isActive: !isCurrentlyActive },
    })
    setShowDisableDialog(null)
  }

  const handleChangeRole = async (userId: string) => {
    if (!newRole) return
    await updateRoleMutation.mutateAsync({
      id: userId,
      data: { role: newRole as UserRole },
    })
    setShowRoleDialog(null)
    setNewRole('')
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="ব্যবহারকারী পরিচালনা" subtitle="সমস্ত ব্যবহারকারী দেখুন এবং পরিচালনা করুন" />
        <div className="h-12 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 animate-pulse" />
        <SkeletonTable rows={5} columns={5} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="ব্যবহারকারী পরিচালনা" subtitle="সমস্ত ব্যবহারকারী দেখুন এবং পরিচালনা করুন" />
        <EmptyState
          icon="AlertCircle"
          title="সমস্যা হয়েছে"
          description="ব্যবহারকারীদের লোড করতে ব্যর্থ। দয়া করে পুনরায় চেষ্টা করুন।"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="ব্যবহারকারী পরিচালনা" description="সমস্ত ব্যবহারকারী দেখুন এবং পরিচালনা করুন" />

      {/* Filters Section */}
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="নাম, ইমেইল বা ফোন নম্বর দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>

        {/* Role Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">ভূমিকা:</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!selectedRole ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedRole(undefined)
                setCurrentPage(1)
              }}
              className="h-8"
            >
              সব
            </Button>
            {roleOptions.map((role) => (
              <Button
                key={role}
                variant={selectedRole === role ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedRole(role)
                  setCurrentPage(1)
                }}
                className="h-8"
              >
                {ROLE_LABELS[role]}
              </Button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedRole) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
            <X className="h-3 w-3 mr-1" />
            ফিল্টার পরিষ্কার করুন
          </Button>
        )}
      </div>

      {/* Users List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="Users"
          title="কোনো ব্যবহারকারী নেই"
          description={
            searchTerm || selectedRole ? 'আপনার ফিল্টার শর্তের সাথে মিলে এমন কোনো ব্যবহারকারী পাওয়া যায়নি।' : 'এখনও কোনো ব্যবহারকারী নেই।'
          }
        />
      ) : (
        <>
          <DataTable<User>
            columns={columns}
            data={paginatedData}
            onRowClick={() => {}}
            rowActions={[
              {
                label: 'ভূমিকা পরিবর্তন',
                icon: Shield,
                onClick: (user) => {
                  setShowRoleDialog({ userId: user.id, currentRole: user.role })
                  setNewRole('')
                },
              },
              {
                label: (user) => (user.isActive ?? true) ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন',
                icon: (user) => ((user.isActive ?? true) ? UserX : UserCheck),
                onClick: (user) => setShowDisableDialog(user.id),
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
              মোট {filtered.length} ব্যবহারকারীর মধ্যে {(currentPage - 1) * pageSize + 1} থেকে{' '}
              {Math.min(currentPage * pageSize, filtered.length)} দেখাচ্ছে
            </div>
          )}
        </>
      )}

      {/* Disable/Enable Dialog */}
      {showDisableDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white dark:bg-slate-950">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                ব্যবহারকারী নিষ্ক্রিয় করুন?
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                এই ব্যবহারকারীকে নিষ্ক্রিয় করা হলে, তারা সিস্টেমে অ্যাক্সেস করতে পারবেন না। এটি কি নিশ্চিত?
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => {
                    const user = paginatedData.find((u) => u.id === showDisableDialog)
                    if (user) {
                      handleDisableUser(showDisableDialog, user.isActive ?? true)
                    }
                  }}
                  disabled={updateStatusMutation.isPending}
                  variant="destructive"
                  className="flex-1"
                >
                  {updateStatusMutation.isPending ? 'প্রক্রিয়াধীন...' : 'নিষ্ক্রিয় করুন'}
                </Button>
                <Button
                  onClick={() => setShowDisableDialog(null)}
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

      {/* Change Role Dialog */}
      {showRoleDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white dark:bg-slate-950">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">ভূমিকা পরিবর্তন করুন</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
                  নতুন ভূমিকা <span className="text-destructive">*</span>
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 text-sm"
                >
                  <option value="">ভূমিকা নির্বাচন করুন</option>
                  {Object.values(UserRole).map((role) => (
                    <option key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                বর্তমান ভূমিকা: <span className="font-medium">{ROLE_LABELS[showRoleDialog.currentRole]}</span>
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleChangeRole(showRoleDialog.userId)}
                  disabled={updateRoleMutation.isPending || !newRole}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {updateRoleMutation.isPending ? 'পরিবর্তন হচ্ছে...' : 'ভূমিকা পরিবর্তন করুন'}
                </Button>
                <Button
                  onClick={() => {
                    setShowRoleDialog(null)
                    setNewRole('')
                  }}
                  disabled={updateRoleMutation.isPending}
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
