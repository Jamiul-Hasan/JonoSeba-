import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Layouts
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppLayout } from '@/layouts/AppLayout'

// Pages - Auth
import { Login } from '@/pages/auth/Login'
import { Register } from '@/pages/auth/Register'
import { ForgotPassword } from '@/pages/auth/ForgotPassword'

// Pages - Public
import { Landing } from '@/pages/Landing'
import { NotFound } from '@/pages/NotFound'
import { Unauthorized } from '@/pages/Unauthorized'

// Pages - Citizen
import { CitizenDashboard } from '@/pages/citizen/Dashboard'
import { ServicesList as Services } from '@/pages/citizen/Services'
import { Applications } from '@/pages/citizen/Applications'
import { ApplicationDetail } from '@/pages/citizen/ApplicationDetail'
import { NewApplication } from '@/pages/citizen/NewApplication'
import { Complaints } from '@/pages/citizen/Complaints'
import NewComplaint from '@/pages/citizen/NewComplaint'
import { Notifications } from '@/pages/citizen/Notifications'
import { Profile } from '@/pages/citizen/Profile'

// Pages - Officer
import { OfficerDashboard } from '@/pages/officer/Dashboard'
import { ApplicationReview } from '@/pages/officer/ApplicationReview'
import { AssignedTasks } from '@/pages/officer/AssignedTasks'
import { TaskDetails } from '@/pages/officer/TaskDetails'

// Pages - Admin
import { AdminDashboard } from '@/pages/admin/Dashboard'
import { ManageUsers } from '@/pages/admin/ManageUsers'
import { ManageServices } from '@/pages/admin/ManageServices'
import { Reports } from '@/pages/admin/Reports'

// Components
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { RoleGuard } from '@/components/RoleGuard'

export function AppRoutes() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" /> : <Register />}
      />
      <Route
        path="/forgot-password"
        element={isAuthenticated ? <Navigate to="/" /> : <ForgotPassword />}
      />

      {/* Protected Routes - Citizen */}
      <Route
        path="/citizen/*"
        element={
          <ProtectedRoute>
            <RoleGuard requiredRoles={['CITIZEN']}>
              <AppLayout>
                <Routes>
                  <Route path="dashboard" element={<CitizenDashboard />} />
                  <Route path="services" element={<Services />} />
                  <Route path="applications" element={<Applications />} />
                  <Route path="applications/:id" element={<ApplicationDetail />} />
                  <Route path="applications/new" element={<NewApplication />} />
                  <Route path="complaints" element={<Complaints />} />
                  <Route path="complaints/new" element={<NewComplaint />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="*" element={<Navigate to="/citizen/dashboard" />} />
                </Routes>
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Officer */}
      <Route
        path="/officer/*"
        element={
          <ProtectedRoute>
            <RoleGuard requiredRoles={['FIELD_WORKER', 'OFFICER']}>
              <AppLayout>
                <Routes>
                  <Route path="dashboard" element={<OfficerDashboard />} />
                  <Route path="applications/:id/review" element={<ApplicationReview />} />
                  <Route path="tasks" element={<AssignedTasks />} />
                  <Route path="tasks/:id" element={<TaskDetails />} />
                  <Route path="*" element={<Navigate to="/officer/dashboard" />} />
                </Routes>
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <RoleGuard requiredRoles={['ADMIN']}>
              <AppLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="services" element={<ManageServices />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" />} />
                </Routes>
              </AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Default redirect for authenticated users */}
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <Navigate to={`/${user?.role.toLowerCase() || 'citizen'}/dashboard`} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  )
}
