import { useMutation, useQuery } from '@tanstack/react-query'
import { complaintsApi } from '@/lib/api'
import { CreateComplaintDto } from '@/types'
import { queryKeys } from '@/lib/queryClient'
import { useToast } from '@/components/ui/use-toast'

export function useComplaintsList(enabled = true) {
  return useQuery({
    queryKey: queryKeys.complaints.list(),
    queryFn: () => complaintsApi.list(),
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}

export function useComplaintDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.complaints.detail(id),
    queryFn: () => complaintsApi.detail(id),
    staleTime: 10 * 60 * 1000,
  })
}

export function useCreateComplaint() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: FormData | CreateComplaintDto) => complaintsApi.create(data),
    onSuccess: (data) => {
      toast({
        title: 'সফল',
        description: `অভিযোগটি সফলভাবে জমা দেওয়া হয়েছে। অভিযোগ আইডি: ${data.id}`,
        variant: 'success',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'ত্রুটি',
        description: error?.response?.data?.message || 'অভিযোগ জমা দিতে ব্যর্থ হয়েছে',
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateComplaintStatus() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      complaintsApi.updateStatus(id, data),
    onSuccess: () => {
      toast({
        title: 'সফল',
        description: 'অভিযোগের স্থিতি আপডেট করা হয়েছে',
        variant: 'success',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'ত্রুটি',
        description: error?.response?.data?.message || 'স্থিতি আপডেট করতে ব্যর্থ',
        variant: 'destructive',
      })
    },
  })
}

export function useAssignComplaint() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, workerId }: { id: string; workerId: string }) =>
      complaintsApi.assign(id, workerId),
    onSuccess: () => {
      toast({
        title: 'বরাদ্দ সম্পন্ন',
        description: 'অভিযোগটি ফিল্ড ওয়ার্কারকে বরাদ্দ করা হয়েছে',
        variant: 'success',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'ত্রুটি',
        description: error?.response?.data?.message || 'বরাদ্দ করতে ব্যর্থ',
        variant: 'destructive',
      })
    },
  })
}
