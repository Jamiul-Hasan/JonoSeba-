import { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export interface RoleGuardProps {
  allowedRoles?: Array<'CITIZEN' | 'FIELD_WORKER' | 'OFFICER' | 'ADMIN'>
  requiredRoles?: string[]
  children?: ReactNode
}

export function RoleGuard({ allowedRoles, requiredRoles, children }: RoleGuardProps) {
  const { user } = useAuthStore()
  const roles = allowedRoles || requiredRoles || []

  if (!user || !roles.includes(user.role as any)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
