// ==================== Enums ====================

export enum UserRole {
  CITIZEN = 'CITIZEN',
  FIELD_WORKER = 'FIELD_WORKER',
  ADMIN = 'ADMIN',
}

export enum ApplicationType {
  BIRTH_CERTIFICATE = 'BIRTH_CERTIFICATE',
  DEATH_CERTIFICATE = 'DEATH_CERTIFICATE',
  LAND_MUTATION = 'LAND_MUTATION',
  NATIONALITY_CERTIFICATE = 'NATIONALITY_CERTIFICATE',
  VGF_VGD = 'VGF_VGD',
  OLD_AGE_ALLOWANCE = 'OLD_AGE_ALLOWANCE',
  WIDOW_ALLOWANCE = 'WIDOW_ALLOWANCE',
  DISABILITY_ALLOWANCE = 'DISABILITY_ALLOWANCE',
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ProblemType {
  ROAD_DAMAGE = 'ROAD_DAMAGE',
  WATER_SUPPLY = 'WATER_SUPPLY',
  GARBAGE = 'GARBAGE',
  STREET_LIGHT = 'STREET_LIGHT',
  DRAINAGE = 'DRAINAGE',
  OTHER = 'OTHER',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum NotificationType {
  APPLICATION_UPDATE = 'APPLICATION_UPDATE',
  COMPLAINT_UPDATE = 'COMPLAINT_UPDATE',
  SYSTEM = 'SYSTEM',
  REMINDER = 'REMINDER',
}

// ==================== User DTOs ====================

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  isActive?: boolean
  createdAt: string
  updatedAt?: string
}

export interface CreateUserDto {
  name: string
  email: string
  phone: string
  password: string
  role?: UserRole
}

export interface UpdateUserDto {
  name?: string
  email?: string
  phone?: string
  role?: UserRole
}

export interface UpdateUserStatusDto {
  isActive: boolean
}

export interface UpdateUserRoleDto {
  role: UserRole
}

// ==================== Service DTOs ====================

export interface Service {
  id: string
  name: string
  description: string
  category: string
  requiredDocuments?: string[]
  processingTime?: string
  fee?: number
  active: boolean
  createdAt: string
  updatedAt?: string
}

export interface CreateServiceDto {
  name: string
  description: string
  category: string
  requiredDocuments?: string[]
  processingTime?: string
  fee?: number
}

export interface UpdateServiceDto {
  name?: string
  description?: string
  category?: string
  requiredDocuments?: string[]
  processingTime?: string
  fee?: number
  active?: boolean
}

// ==================== Application DTOs ====================

export interface Application {
  id: string
  applicationType: ApplicationType
  applicantName: string
  phone: string
  email?: string
  address: string
  details?: string
  status: ApplicationStatus
  submittedBy: string
  assignedTo?: string
  submittedAt: string
  updatedAt: string
  remarks?: string
  statusHistory?: ApplicationStatusHistory[]
}

export interface ApplicationStatusHistory {
  id: string
  applicationId: string
  status: ApplicationStatus
  remarks?: string
  changedBy: string
  changedAt: string
}

export interface CreateApplicationDto {
  applicationType: ApplicationType | string
  applicantName: string
  phone: string
  email?: string
  address: string
  details?: string
}

export interface UpdateApplicationStatusDto {
  status: ApplicationStatus | string
  remarks?: string
}

export interface ApplicationListFilters {
  status?: ApplicationStatus
  applicationType?: ApplicationType
  fromDate?: string
  toDate?: string
  search?: string
}

// ==================== Complaint DTOs ====================

export interface Complaint {
  id: string
  problemType: ProblemType
  title: string
  description: string
  location?: string
  photos?: string[]
  status: ReportStatus
  reportedBy: string
  assignedTo?: string
  reportedAt: string
  updatedAt: string
  resolvedAt?: string
  notes?: string
}

export interface CreateComplaintDto {
  problemType: ProblemType | string
  title: string
  description: string
  location?: string
  photos?: string[]
}

export interface UpdateComplaintStatusDto {
  status: ReportStatus | string
  notes?: string
}

export interface ComplaintListFilters {
  status?: ReportStatus
  problemType?: ProblemType
  fromDate?: string
  toDate?: string
  search?: string
}

// ==================== Notification DTOs ====================

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  relatedEntityId?: string
  relatedEntityType?: string
  createdAt: string
}

export interface CreateNotificationDto {
  userId: string
  type: NotificationType
  title: string
  message: string
  relatedEntityId?: string
  relatedEntityType?: string
}

export interface MarkNotificationReadDto {
  notificationIds: string[]
}

// ==================== Pagination DTOs ====================

export interface PaginationParams {
  page?: number
  size?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PageInfo {
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface PaginatedResponse<T> {
  content: T[]
  pageInfo: PageInfo
}

// ==================== Auth DTOs ====================

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  phone: string
  password: string
  role?: UserRole
  address?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

// ==================== Dashboard DTOs ====================

export interface DashboardStats {
  totalApplications: number
  pendingApplications: number
  approvedApplications: number
  rejectedApplications: number
  totalComplaints: number
  pendingComplaints: number
  resolvedComplaints: number
  activeUsers: number
}

export interface RecentActivity {
  id: string
  type: 'APPLICATION' | 'COMPLAINT' | 'USER'
  title: string
  description: string
  timestamp: string
  status: string
}

// ==================== Common Response Types ====================

export interface ApiError {
  message: string
  statusCode: number
  timestamp: string
  path?: string
  errors?: Record<string, string[]>
}

export interface ApiSuccess<T = any> {
  success: true
  data: T
  message?: string
}
