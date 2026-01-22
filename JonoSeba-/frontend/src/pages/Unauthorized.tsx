import { Link } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <ShieldAlert className="h-24 w-24 text-destructive mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">অননুমোদিত প্রবেশ</h1>
        <p className="text-muted-foreground mb-8">
          দুঃখিত, এই পেজটি অ্যাক্সেস করার অনুমতি আপনার নেই। অনুগ্রহ করে সঠিক অ্যাকাউন্ট দিয়ে লগইন করুন।
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            হোমপেজে ফিরে যান
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-md hover:opacity-90"
          >
            লগইন করুন
          </Link>
        </div>
      </div>
    </div>
  )
}
