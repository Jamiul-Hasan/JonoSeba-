import { Link, useLocation } from 'react-router-dom'
import { 
  Home, FileText, AlertCircle, Bell, User, 
  Users, Settings, BarChart3, ClipboardList, Wrench
} from 'lucide-react'
import { cn } from '@/lib/utils'

const citizenNav = [
  { name: 'ড্যাশবোর্ড', href: '/citizen/dashboard', icon: Home },
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

export function MobileSidebar() {
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
    <div className="flex flex-col h-full bg-card">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">জনসেবা</h1>
      </div>

      {/* Role Badge */}
      <div className="px-4 py-3 border-b border-border">
        <div className="px-3 py-2 bg-primary/10 rounded-md">
          <p className="text-xs font-medium text-primary">
            {roleLabels[currentRole]}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
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
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-border p-4">
        <div className="text-xs text-muted-foreground text-center">
          <p>© ২০২৬ সরকার বাংলাদেশ</p>
        </div>
      </div>
    </div>
  )
}
