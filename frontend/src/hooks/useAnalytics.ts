import { useMemo } from 'react'
import { useApplicationsList } from '@/hooks/useApplications'
import { useComplaintsList } from '@/hooks/useComplaints'
import { ApplicationStatus, ReportStatus } from '@/types'

export interface ApplicationsStatusCount {
  status: ApplicationStatus
  count: number
  label: string
  color: string
}

export interface ComplaintsStatusCount {
  status: ReportStatus
  count: number
  label: string
  color: string
}

export interface TrendData {
  date: string
  applications: number
  complaints: number
}

export function useAnalytics() {
  const { data: applicationsData = { content: [] }, isLoading: appLoading } = useApplicationsList()
  const { data: complaintsData = [], isLoading: compLoading } = useComplaintsList()

  const applications = Array.isArray(applicationsData.content) ? applicationsData.content : []
  const complaints = Array.isArray(complaintsData) ? complaintsData : []

  const isLoading = appLoading || compLoading

  const stats = useMemo(() => {
    // Applications by status
    const appsByStatus = {
      [ApplicationStatus.PENDING]: applications.filter((a: any) => a.status === ApplicationStatus.PENDING).length,
      [ApplicationStatus.IN_REVIEW]: applications.filter((a: any) => a.status === ApplicationStatus.IN_REVIEW).length,
      [ApplicationStatus.APPROVED]: applications.filter((a: any) => a.status === ApplicationStatus.APPROVED).length,
      [ApplicationStatus.REJECTED]: applications.filter((a: any) => a.status === ApplicationStatus.REJECTED).length,
    }

    const applicationsByStatus: ApplicationsStatusCount[] = [
      {
        status: ApplicationStatus.PENDING,
        count: appsByStatus[ApplicationStatus.PENDING],
        label: 'অপেক্ষমাণ',
        color: '#FBBF24',
      },
      {
        status: ApplicationStatus.IN_REVIEW,
        count: appsByStatus[ApplicationStatus.IN_REVIEW],
        label: 'পর্যালোচনায়',
        color: '#60A5FA',
      },
      {
        status: ApplicationStatus.APPROVED,
        count: appsByStatus[ApplicationStatus.APPROVED],
        label: 'অনুমোদিত',
        color: '#34D399',
      },
      {
        status: ApplicationStatus.REJECTED,
        count: appsByStatus[ApplicationStatus.REJECTED],
        label: 'প্রত্যাখ্যাত',
        color: '#F87171',
      },
    ]

    // Complaints by status
    const compsByStatus = {
      [ReportStatus.PENDING]: complaints.filter((c: any) => c.status === ReportStatus.PENDING).length,
      [ReportStatus.ASSIGNED]: complaints.filter((c: any) => c.status === ReportStatus.ASSIGNED).length,
      [ReportStatus.IN_PROGRESS]: complaints.filter((c: any) => c.status === ReportStatus.IN_PROGRESS).length,
      [ReportStatus.RESOLVED]: complaints.filter((c: any) => c.status === ReportStatus.RESOLVED).length,
      [ReportStatus.CLOSED]: complaints.filter((c: any) => c.status === ReportStatus.CLOSED).length,
    }

    const complaintsByStatus: ComplaintsStatusCount[] = [
      {
        status: ReportStatus.PENDING,
        count: compsByStatus[ReportStatus.PENDING],
        label: 'অপেক্ষমাণ',
        color: '#FBBF24',
      },
      {
        status: ReportStatus.ASSIGNED,
        count: compsByStatus[ReportStatus.ASSIGNED],
        label: 'নির্ধারিত',
        color: '#8B5CF6',
      },
      {
        status: ReportStatus.IN_PROGRESS,
        count: compsByStatus[ReportStatus.IN_PROGRESS],
        label: 'চলমান',
        color: '#60A5FA',
      },
      {
        status: ReportStatus.RESOLVED,
        count: compsByStatus[ReportStatus.RESOLVED],
        label: 'সমাধান করা',
        color: '#34D399',
      },
      {
        status: ReportStatus.CLOSED,
        count: compsByStatus[ReportStatus.CLOSED],
        label: 'বন্ধ',
        color: '#9CA3AF',
      },
    ]

    // Generate trend data for last 7 days
    const trendData: TrendData[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const appCount = applications.filter((a: any) => {
        const appDate = a.submittedDate || a.submittedAt || a.createdAt || ''
        return String(appDate).startsWith(dateStr)
      }).length
      const compCount = complaints.filter((c: any) => {
        const compDate = c.createdAt || c.submittedDate || c.createdAt || ''
        return String(compDate).startsWith(dateStr)
      }).length

      trendData.push({
        date: date.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' }),
        applications: appCount,
        complaints: compCount,
      })
    }

    return {
      totalApplications: applications.length,
      totalComplaints: complaints.length,
      applicationsByStatus,
      complaintsByStatus,
      trendData,
    }
  }, [applications, complaints])

  return {
    ...stats,
    isLoading,
  }
}
