import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { Loader2, User, Briefcase, Shield } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/lib/api'
import { UserRole } from '@/types'

const loginSchema = z.object({
  role: z.enum(['CITIZEN', 'FIELD_WORKER', 'ADMIN'], {
    errorMap: () => ({ message: 'ভূমিকা নির্বাচন করুন' }),
  }),
  email: z.string().email('সঠিক ইমেইল ঠিকানা লিখুন'),
  password: z.string().min(1, 'পাসওয়ার্ড লিখুন'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const roleConfig = {
  CITIZEN: { label: 'নাগরিক', icon: User },
  FIELD_WORKER: { label: 'ফিল্ড ওয়ার্কার', icon: Briefcase },
  ADMIN: { label: 'প্রশাসক', icon: Shield },
}

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const login = useAuthStore((state) => state.login)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'CITIZEN',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      })

      const authData = response.data.data
      const user = {
        id: authData.userId,
        name: authData.name,
        email: data.email,
        role: authData.role,
      }

      // Verify role matches
      if (user.role !== data.role) {
        toast({
          title: 'ভূমিকা মেলেনি',
          description: `এই ইমেইল একটি ${roleConfig[user.role as UserRole].label} অ্যাকাউন্টের জন্য নিবন্ধিত।`,
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      // Store auth data
      login(authData.token, user)

      // Show success message
      toast({
        title: 'সফলভাবে লগইন হয়েছে',
        description: `স্বাগতম, ${user.name}`,
        variant: 'default',
      })

      // Redirect based on role
      const from = location.state?.from?.pathname
      const roleRedirects: Record<string, string> = {
        CITIZEN: '/citizen/dashboard',
        OFFICER: '/officer/dashboard',
        FIELD_WORKER: '/officer/dashboard',
        ADMIN: '/admin/dashboard',
      }

      const redirectPath = from || roleRedirects[user.role] || '/citizen/dashboard'
      navigate(redirectPath, { replace: true })
    } catch (error: any) {
      toast({
        title: 'লগইন ব্যর্থ হয়েছে',
        description: error.response?.data?.message || 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">লগইন করুন</h2>
      <p className="text-center text-muted-foreground mb-6">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Role Selection */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>আপনি কে?</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="ভূমিকা নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CITIZEN">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          নাগরিক
                        </div>
                      </SelectItem>
                      <SelectItem value="FIELD_WORKER">
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2" />
                          ফিল্ড ওয়ার্কার
                        </div>
                      </SelectItem>
                      <SelectItem value="ADMIN">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2" />
                          প্রশাসক
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ইমেইল</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your@email.com"
                    type="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>পাসওয়ার্ড</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                লগইন হচ্ছে...
              </>
            ) : (
              'লগইন করুন'
            )}
          </Button>
        </form>
      </Form>

      {/* Demo Credentials */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg space-y-2">
        <p className="font-semibold text-sm">ডেমো লগইন তথ্য:</p>
        <div className="text-xs space-y-1">
          <p><strong>নাগরিক:</strong> nasir@example.com</p>
          <p><strong>ফিল্ড ওয়ার্কার:</strong> rahim@example.com</p>
          <p><strong>প্রশাসক:</strong> karim@example.com</p>
          <p className="text-muted-foreground">পাসওয়ার্ড: যেকোনো কিছু</p>
        </div>
      </div>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">নতুন ব্যবহারকারী? </span>
        <Link
          to="/register"
          className="text-primary hover:underline font-medium"
          tabIndex={isLoading ? -1 : 0}
        >
          রেজিস্টার করুন
        </Link>
      </div>
    </div>
  )
}
