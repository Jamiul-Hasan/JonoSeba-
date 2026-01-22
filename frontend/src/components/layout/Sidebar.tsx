import { Link, useLocation } from 'react-router-dom'
import { 
  Home, FileText, AlertCircle, Bell, User, 
  ChevronLeft, Users, Settings, BarChart3,
  ClipboardList, Wrench, ShoppingBag
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

// Role-based navigation items
const citizenNav = [
  { name: 'ড্যাশবোর্ড', href: '/citizen/dashboard', icon: Home },
  { name: 'সেবা', href: '/citizen/services', icon: ShoppingBag },
  { name: 'আবেদন', href: '/citizen/applications', icon: FileText },
  { name: 'অভিযোগ', href: '/citizen/complaints', icon: AlertCircle },
  { name: 'বিজ্ঞপ্তি', href: '/citizen/notifications', icon: Bell },
  { name: 'প্রোফাইল', href: '/citizen/profile', icon: User },
]

const officerNav = [
  { name: 'ড্যাশবোর্ড', href: '/officer/dashboard', icon: Home },
  { name: 'নিয়োগকৃত কাজ', href: '/officer/tasks', icon: ClipboardList },
  { name: 'বিজ্ঞপ্তি', href: '/officer/notifications', icon: Bell },
  { name: 'প্রোফাইল', href: '/officer/profile', icon: User },
]

const adminNav = [
  { name: 'ড্যাশবোর্ড', href: '/admin/dashboard', icon: Home },
  { name: 'ব্যবহারকারী', href: '/admin/users', icon: Users },
  { name: 'সেবা পরিচালনা', href: '/admin/services', icon: Wrench },
  { name: 'রিপোর্ট', href: '/admin/reports', icon: BarChart3 },
  { name: 'বিজ্ঞপ্তি', href: '/admin/notifications', icon: Bell },
  { name: 'প্রোফাইল', href: '/admin/profile', icon: User },
]

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const location = useLocation()
  
  // Determine role from current path
  const currentRole = location.pathname.startsWith('/admin') 
    ? 'admin' 
    : location.pathname.startsWith('/officer')
    ? 'officer'
    : 'citizen'

  const navigation = currentRole === 'admin' 
    ? adminNav 
    : currentRole === 'officer'
    ? officerNav
    : citizenNav

  const roleLabels = {
    citizen: 'নাগরিক',
    officer: 'ফিল্ড ওয়ার্কার',
    admin: 'অ্যাডমিন'
  }

  return (
    <div 
      className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300",
        collapsed ? "lg:w-20" : "lg:w-64"
      )}
    >
      <div className="flex flex-col flex-grow border-r border-border bg-card overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 border-b border-border">
          {!collapsed && (
            <h1 className="text-2xl font-bold text-primary">জনসেবা</h1>
          )}
          {collapsed && (
            <h1 className="text-2xl font-bold text-primary mx-auto">জ</h1>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft 
              className={cn(
                "h-5 w-5 transition-transform",
                collapsed && "rotate-180"
              )} 
            />
          </button>
        </div>

        {/* Role Badge */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-border">
            <div className="px-3 py-2 bg-primary/10 rounded-md">
              <p className="text-xs font-medium text-primary">
                {roleLabels[currentRole]}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1" role="navigation">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/citizen/dashboard' && 
               item.href !== '/officer/dashboard' && 
               item.href !== '/admin/dashboard' && 
               location.pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    'flex-shrink-0 h-5 w-5',
                    collapsed ? 'mx-auto' : 'mr-3',
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-border p-4">
          {!collapsed && (
            <div className="text-xs text-muted-foreground text-center">
              <p>© ২০২৬ সরকার</p>
              <p className="mt-1">বাংলাদেশ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
