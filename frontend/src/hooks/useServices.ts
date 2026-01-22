import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { servicesApi } from '@/lib/api'
import { queryKeys } from '@/lib/queryClient'
import { useToast } from '@/components/ui/use-toast'
import type { PaginationParams, Service, CreateServiceDto, UpdateServiceDto } from '@/types'

interface UseServicesParams extends PaginationParams {
  category?: string
  search?: string
}

export function useServices(params?: UseServicesParams) {
  return useQuery({
    queryKey: queryKeys.services.list(params),
    queryFn: () => servicesApi.list(params),
    enabled: true,
  })
}

export function useServiceDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: () => servicesApi.detail(id),
    enabled: !!id,
  })
}

// ==================== Mutation Hooks ====================

export function useCreateService() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateServiceDto) => servicesApi.create(data),
    onSuccess: (data) => {
      // Invalidate services list
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() })

      toast({
        title: 'সাফল্য',
        description: `"${data.name}" সেবা যোগ করা হয়েছে`,
        variant: 'default',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'ব্যর্থতা',
        description: error.response?.data?.message || 'সেবা যোগ করতে ব্যর্থ হয়েছে',
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceDto }) =>
      servicesApi.update(id, data),
    onSuccess: (data, variables) => {
      // Invalidate specific service detail
      queryClient.invalidateQueries({ queryKey: queryKeys.services.detail(variables.id) })

      // Invalidate services list
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() })

      toast({
        title: 'সাফল্য',
        description: `"${data.name}" সেবা আপডেট হয়েছে`,
        variant: 'default',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'ব্যর্থতা',
        description: error.response?.data?.message || 'সেবা আপডেট করতে ব্যর্থ হয়েছে',
        variant: 'destructive',
      })
    },
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: string) => servicesApi.delete(id),
    onSuccess: () => {
      // Invalidate services list
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() })

      toast({
        title: 'সাফল্য',
        description: 'সেবা মুছে ফেলা হয়েছে',
        variant: 'default',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'ব্যর্থতা',
        description: error.response?.data?.message || 'সেবা মুছে ফেলতে ব্যর্থ হয়েছে',
        variant: 'destructive',
      })
    },
  })
}
