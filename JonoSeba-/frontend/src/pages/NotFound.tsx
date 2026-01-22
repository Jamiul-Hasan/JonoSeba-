import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">পেজ পাওয়া যায়নি</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          দুঃখিত, আপনি যে পেজটি খুঁজছেন সেটি বিদ্যমান নেই বা সরানো হয়েছে।
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:opacity-90"
        >
          <Home className="h-4 w-4" />
          হোমপেজে ফিরে যান
        </Link>
      </div>
    </div>
  )
}
