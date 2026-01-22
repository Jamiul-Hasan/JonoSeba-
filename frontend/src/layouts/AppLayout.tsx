import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      {/* Main Content */}
      <div 
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        {/* Header */}
        <Header onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
