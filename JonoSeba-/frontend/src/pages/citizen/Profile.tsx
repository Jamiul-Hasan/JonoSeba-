import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/lib/api'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useToast } from '@/components/ui/use-toast'
import {
  User,
  Mail,
  Lock,
  LogOut,
  Bell,
  Shield,
  Smartphone,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react'
import { useState } from 'react'

const ROLE_LABELS: Record<string, string> = {
  CITIZEN: 'নাগরিক',
  OFFICER: 'অফিসার',
  ADMIN: 'প্রশাসক',
}

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  CITIZEN: { bg: 'bg-blue-100', text: 'text-blue-800' },
  OFFICER: { bg: 'bg-green-100', text: 'text-green-800' },
  ADMIN: { bg: 'bg-purple-100', text: 'text-purple-800' },
}

export function Profile() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, logout } = useAuthStore()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  if (!user) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="প্রোফাইল"
          description="আপনার অ্যাকাউন্ট তথ্য এবং সেটিংস পরিচালনা করুন"
        />
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm text-slate-600 dark:text-slate-400">লোডিং হচ্ছে...</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      // Call backend logout API (optional)
      await authApi.logout()
    } catch (error) {
      console.warn('Backend logout failed:', error)
    } finally {
      logout()
      toast({
        title: 'লগ আউট সফল',
        description: 'আপনি সফলভাবে লগ আউট করেছেন',
        variant: 'success',
      })
      navigate('/')
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const roleConfig = ROLE_COLORS[user.role] || ROLE_COLORS.CITIZEN

  return (
    <div className="space-y-6">
      <PageHeader
        title="প্রোফাইল"
        description="আপনার অ্যাকাউন্ট তথ্য এবং সেটিংস পরিচালনা করুন"
      />

      {/* User Info Card */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
          {/* Avatar */}
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
            {getInitials(user.name)}
          </div>

          {/* User Details */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">
              {user.name}
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${roleConfig.bg} ${roleConfig.text}`}
              >
                {ROLE_LABELS[user.role] || user.role}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              ইউজার আইডি: <span className="font-mono">{user.id}</span>
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
            >
              <Lock className="h-4 w-4 mr-2" />
              পাসওয়ার্ড
            </Button>
          </div>
        </div>

        {/* User Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InfoCard
            icon={<User className="h-5 w-5" />}
            label="পূর্ণনাম"
            value={user.name}
          />
          <InfoCard
            icon={<Shield className="h-5 w-5" />}
            label="ভূমিকা"
            value={ROLE_LABELS[user.role] || user.role}
          />
        </div>

        {/* Account Status */}
        <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
              অ্যাকাউন্ট সক্রিয়
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 ml-8">
            আপনার অ্যাকাউন্ট সম্পূর্ণরূপে যাচাইকৃত এবং সক্রিয়।
          </p>
        </div>
      </div>

      {/* Password Change Section */}
      {showPasswordChange && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
            পাসওয়ার্ড পরিবর্তন করুন
          </h3>

          <form className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
                বর্তমান পাসওয়ার্ড <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="আপনার বর্তমান পাসওয়ার্ড প্রবেश করুন"
                  className="w-full px-3 py-2 pr-10 rounded-md border border-slate-200 bg-white placeholder-slate-500 text-sm dark:border-slate-700 dark:bg-slate-900 dark:placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
                নতুন পাসওয়ার্ড <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="আপনার নতুন পাসওয়ার্ড প্রবেশ করুন"
                  className="w-full px-3 py-2 pr-10 rounded-md border border-slate-200 bg-white placeholder-slate-500 text-sm dark:border-slate-700 dark:bg-slate-900 dark:placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                কমপক্ষে ৮ অক্ষর, একটি বড় অক্ষর এবং একটি সংখ্যা ব্যবহার করুন
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
                পাসওয়ার্ড নিশ্চিত করুন <span className="text-destructive">*</span>
              </label>
              <input
                type="password"
                placeholder="নতুন পাসওয়ার্ড আবার প্রবেশ করুন"
                className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white placeholder-slate-500 text-sm dark:border-slate-700 dark:bg-slate-900 dark:placeholder-slate-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled
              >
                পাসওয়ার্ড আপডেট করুন
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordChange(false)}
              >
                বাতিল করুন
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Settings Section */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          নোটিফিকেশন সেটিংস
        </h3>

        <div className="space-y-4">
          <SettingItem
            icon={<Bell className="h-5 w-5" />}
            title="অ্যাপ্লিকেশন নোটিফিকেশন"
            description="নতুন আবেদন সম্পর্কে সূচনা পান"
            defaultChecked={true}
          />
          <SettingItem
            icon={<AlertCircle className="h-5 w-5" />}
            title="স্ট্যাটাস আপডেট"
            description="আপনার আবেদন অবস্থা পরিবর্তন হলে সতর্ক হন"
            defaultChecked={true}
          />
          <SettingItem
            icon={<Mail className="h-5 w-5" />}
            title="ইমেইল নোটিফিকেশন"
            description="গুরুত্বপূর্ণ আপডেটের জন্য ইমেইল পান"
            defaultChecked={true}
          />
          <SettingItem
            icon={<Smartphone className="h-5 w-5" />}
            title="এসএমএস নোটিফিকেশন"
            description="জরুরি বিজ্ঞপ্তির জন্য এসএমএস পান"
            defaultChecked={false}
          />
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            এই সেটিংসগুলি শীঘ্রই কার্যকর হবে।
          </p>
          <Button className="bg-green-600 hover:bg-green-700 text-white" disabled>
            সেটিংস সংরক্ষণ করুন
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-50">
            ঝুঁকিপূর্ণ জোন
          </h3>
        </div>

        <p className="text-sm text-red-800 dark:text-red-200 mb-4">
          এই অপারেশনগুলি আপনার অ্যাকাউন্টকে প্রভাবিত করতে পারে।
        </p>

        <Button
          variant="destructive"
          onClick={() => setShowLogoutDialog(true)}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          সব ডিভাইস থেকে লগ আউট করুন
        </Button>
      </div>

      {/* Logout Confirm Dialog */}
      {showLogoutDialog && (
        <ConfirmDialog
          title="লগ আউট করতে চান?"
          description="আপনি সফলভাবে লগ আউট হবেন এবং আবার লগইন করতে হবে।"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutDialog(false)}
          isOpen={showLogoutDialog}
          variant="destructive"
          confirmText="লগ আউট করুন"
          cancelText="বাতিল করুন"
        />
      )}
    </div>
  )
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-2 mb-2 text-slate-600 dark:text-slate-400">
        {icon}
        <p className="text-xs font-medium">{label}</p>
      </div>
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{value}</p>
    </div>
  )
}

function SettingItem({
  icon,
  title,
  description,
  defaultChecked,
}: {
  icon: React.ReactNode
  title: string
  description: string
  defaultChecked: boolean
}) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <div className="flex items-start justify-between py-4 border-b border-slate-200 dark:border-slate-700 last:border-0">
      <div className="flex items-start gap-3 flex-1">
        <div className="text-slate-600 dark:text-slate-400 mt-1">{icon}</div>
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{title}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-600 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-600"></div>
      </label>
    </div>
  )
}
