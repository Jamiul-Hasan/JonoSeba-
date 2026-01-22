import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            JonoSeba
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-primary/80">
            জনসেবা
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-3">
            সহজ, স্বচ্ছ এবং দ্রুত সরকারি সেবা
          </p>
          <p className="text-muted-foreground text-xs md:text-sm">
            Easy, Transparent & Fast Government Services
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-card border border-border rounded-lg shadow-lg">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-1">
          <p className="text-xs text-muted-foreground">
            © ২০২৬ গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 Government of Bangladesh. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
