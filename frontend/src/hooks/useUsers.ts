import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/lib/api'
import { queryKeys } from '@/lib/queryClient'
import { useToast } from '@/components/ui/use-toast'
import type { User, UpdateUserStatusDto, UpdateUserRoleDto, PaginatedResponse } from '@/types'

// ==================== Query Hooks ====================

interface UseUsersListParams {
  page?: number
  size?: number
  search?: string
  role?: string
}

export function useUsersList(params?: UseUsersListParams) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersApi.list(params),
    enabled: true,
  })
}

export function useUserDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersApi.detail(id),
    enabled: !!id,
  })
}

// ==================== Mutation Hooks ====================

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserStatusDto }) =>
      usersApi.updateStatus(id, data),
    onSuccess: (data, variables) => {
      // Invalidate the specific user detail
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) })

      // Invalidate all user lists
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })

      toast({
        title: 'সাফল্য',
        description: `ব্যবহারকারী ${data.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'} হয়েছে`,
        variant: 'default',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'ব্যর্থতা',
        description: error.response?.data?.message || 'অবস্থা আপডেট করতে ব্যর্থ হয়েছে',
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRoleDto }) =>
      usersApi.updateRole(id, data),
    onSuccess: (data, variables) => {
      // Invalidate the specific user detail
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) })

      // Invalidate all user lists
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })

      toast({
        title: 'সাফল্য',
        description: 'ব্যবহারকারীর ভূমিকা আপডেট হয়েছে',
        variant: 'default',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'ব্যর্থতা',
        description: error.response?.data?.message || 'ভূমিকা আপডেট করতে ব্যর্থ হয়েছে',
        variant: 'destructive',
      })
    },
  })
}
