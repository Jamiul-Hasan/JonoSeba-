import axios, { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
const MOCK_API = import.meta.env.VITE_MOCK_API === 'true'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth on unauthorized
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==================== Auth API ====================
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) =>
    api.post('/auth/register', data),
  logout: () =>
    api.post('/auth/logout'),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
}

// ==================== Services API ====================
export const servicesApi = {
  list: (params?: any) =>
    api.get('/services', { params }),
  detail: (id: string) =>
    api.get(`/services/${id}`),
  create: (data: any) =>
    api.post('/services', data),
  update: (id: string, data: any) =>
    api.put(`/services/${id}`, data),
  delete: (id: string) =>
    api.delete(`/services/${id}`),
}

// ==================== Applications API ====================
export const applicationsApi = {
  list: (params?: any) =>
    api.get('/applications', { params }),
  detail: (id: string) =>
    api.get(`/applications/${id}`),
  create: (data: any) =>
    api.post('/applications', data),
  updateStatus: (id: string, data: any) =>
    api.put(`/applications/${id}/status`, data),
}

// ==================== Complaints API ====================
export const complaintsApi = {
  list: (params?: any) =>
    api.get('/complaints', { params }),
  detail: (id: string) =>
    api.get(`/complaints/${id}`),
  create: (data: any) =>
    api.post('/complaints', data),
  updateStatus: (id: string, data: any) =>
    api.put(`/complaints/${id}/status`, data),
}

// ==================== Users API ====================
export const usersApi = {
  list: (params?: any) =>
    api.get('/users', { params }),
  detail: (id: string) =>
    api.get(`/users/${id}`),
  updateRole: (id: string, data: any) =>
    api.put(`/users/${id}/role`, data),
  updateStatus: (id: string, data: any) =>
    api.put(`/users/${id}/status`, data),
}

// ==================== Notifications API ====================
export const notificationsApi = {
  list: (params?: any) =>
    api.get('/notifications', { params }),
  markRead: (id: string) =>
    api.put(`/notifications/${id}/read`),
  markAllRead: () =>
    api.put('/notifications/mark-all-read'),
  delete: (id: string) =>
    api.delete(`/notifications/${id}`),
}

// ==================== Analytics API ====================
export const analyticsApi = {
  getDashboard: (params?: any) =>
    api.get('/analytics/dashboard', { params }),
  getApplicationStats: (params?: any) =>
    api.get('/analytics/applications', { params }),
  getComplaintStats: (params?: any) =>
    api.get('/analytics/complaints', { params }),
}

export default api
