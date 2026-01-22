import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface RoleGuardProps {
  allowedRoles: Array<'CITIZEN' | 'FIELD_WORKER' | 'OFFICER' | 'ADMIN'>
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { user } = useAuthStore()

  if (!user || !allowedRoles.includes(user.role as any)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
