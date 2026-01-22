import { Menu, ChevronRight, User, Settings, LogOut, Moon, Sun } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { MobileSidebar } from './MobileSidebar'
import { NotificationBell } from '@/components/NotificationBell'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()
  const { user } = useAuthStore()
  const [darkMode, setDarkMode] = useState(false)

  // Get first letter of user's name for avatar
  const avatarLetter = user?.name?.charAt(0).toUpperCase() || 'N'

  // Get role label in Bengali
  const getRoleLabelBn = (role?: string): string => {
    const roleMap: Record<string, string> = {
      CITIZEN: 'নাগরিক',
      FIELD_WORKER: 'ফিল্ড ওয়ার্কার',
      ADMIN: 'প্রশাসক',
    }
    return roleMap[role || 'CITIZEN'] || 'ব্যবহারকারী'
  }

  // Generate breadcrumbs from path
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`
    const label = segment.charAt(0).toUpperCase() + segment.slice(1)
    
    // Bengali labels mapping
    const labelMap: Record<string, string> = {
      citizen: 'নাগরিক',
      officer: 'ফিল্ড ওয়ার্কার',
      admin: 'অ্যাডমিন',
      dashboard: 'ড্যাশবোর্ড',
      applications: 'আবেদন',
      complaints: 'অভিযোগ',
      notifications: 'বিজ্ঞপ্তি',
      profile: 'প্রোফাইল',
      users: 'ব্যবহারকারী',
      services: 'সেবা',
      reports: 'রিপোর্ট',
      tasks: 'কাজ',
      new: 'নতুন'
    }

    return {
      label: labelMap[segment] || label,
      path,
      isLast: index === pathSegments.length - 1
    }
  })

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <MobileSidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop Collapse Button */}
      <button
        onClick={onMenuClick}
        className="hidden lg:block p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="hidden md:flex items-center flex-1 overflow-x-auto">
        <ol className="flex items-center space-x-2">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
              )}
              {crumb.isLast ? (
                <span className="text-sm font-medium text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:underline"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex-1 md:hidden" />

      {/* Notifications Bell */}
      <NotificationBell />

      {/* Theme Toggle */}
      <button
        onClick={toggleDarkMode}
        className="p-2 text-muted-foreground hover:text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="flex items-center gap-2 rounded-md p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="User menu"
          >
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              {avatarLetter}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">{user?.name || 'ব্যবহারকারী'}</p>
              <p className="text-xs text-muted-foreground">{getRoleLabelBn(user?.role)}</p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user?.name || 'ব্যবহারকারী'}</p>
              <p className="text-xs text-muted-foreground">{user?.id || 'user@example.com'}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/citizen/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              প্রোফাইল
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/citizen/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              সেটিংস
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/login" className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              লগ আউট
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export { NotificationBell }
