import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationsApi } from '@/lib/api'
import { queryKeys } from '@/lib/queryClient'
import { useToast } from '@/components/ui/use-toast'
import type { Application, CreateApplicationDto, UpdateApplicationStatusDto, ApplicationListFilters, PaginatedResponse } from '@/types'

// ==================== Query Hooks ====================

interface UseApplicationsListParams extends ApplicationListFilters {
  page?: number
  size?: number
}

export function useApplicationsList(params?: UseApplicationsListParams) {
  return useQuery({
    queryKey: queryKeys.applications.list(params),
    queryFn: () => applicationsApi.list(params),
    enabled: true,
  })
}

export function useApplicationDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.applications.detail(id),
    queryFn: () => applicationsApi.detail(id),
    enabled: !!id,
  })
}

// ==================== Mutation Hooks ====================

export function useCreateApplication() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateApplicationDto) => applicationsApi.create(data),
    onSuccess: (data) => {
      // Invalidate applications list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.lists() })
      
      toast({
        title: 'আবেদন সফল হয়েছে',
        description: `আপনার আবেদন সফলভাবে জমা হয়েছে। আবেদন নং: ${data.id}`,
        variant: 'default',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'আবেদন ব্যর্থ হয়েছে',
        description: error.response?.data?.message || 'কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন',
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateApplicationStatusDto }) => 
      applicationsApi.updateStatus(id, data),
    onSuccess: (data, variables) => {
      // Invalidate the specific application detail
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.detail(variables.id) })
      
      // Invalidate all application lists
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.lists() })
      
      toast({
        title: 'স্থিতি আপডেট হয়েছে',
        description: 'আবেদনের স্থিতি সফলভাবে আপডেট হয়েছে',
        variant: 'default',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'আপডেট ব্যর্থ হয়েছে',
        description: error.response?.data?.message || 'স্থিতি আপডেট করতে ব্যর্থ হয়েছে',
        variant: 'destructive',
      })
    },
  })
}
