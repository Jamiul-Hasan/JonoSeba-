import { Link, useNavigate } from 'react-router-dom'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { authApi } from '@/lib/api'
import { UserRole } from '@/types'

const roleConfig = {
  [UserRole.CITIZEN]: { label: 'নাগরিক', icon: User },
  [UserRole.FIELD_WORKER]: { label: 'ক্ষেত্র কর্মচারী', icon: Briefcase },
  [UserRole.ADMIN]: { label: 'প্রশাসক', icon: Shield },
}

const registerSchema = z.object({
  role: z.enum(['CITIZEN', 'FIELD_WORKER', 'ADMIN'], {
    errorMap: () => ({ message: 'ভূমিকা নির্বাচন করুন' }),
  }),
  fullName: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে'),
  email: z.string().email('সঠিক ইমেইল ঠিকানা লিখুন'),
  phone: z.string().min(10, 'সঠিক ফোন নম্বর লিখুন'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'পাসওয়ার্ড মিলছে না',
  path: ['confirmPassword'],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function Register() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'CITIZEN',
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      const response = await authApi.register({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role as UserRole,
      })

      // Show success message
      toast({
        title: 'রেজিস্ট্রেশন সফল হয়েছে',
        description: `${response.user.name}, আপনি এখন লগইন করতে পারেন`,
        variant: 'default',
      })

      // Redirect to login
      navigate('/login', { replace: true })
    } catch (error: any) {
      toast({
        title: 'রেজিস্ট্রেশন ব্যর্থ হয়েছে',
        description: error.response?.data?.message || 'কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-2xl font-bold text-center mb-2">রেজিস্টার করুন</h2>
      <p className="text-center text-sm text-muted-foreground mb-6">আপনার ভূমিকা নির্বাচন করুন এবং সাইন আপ করুন</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Role Selection */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>আপনার ভূমিকা</FormLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="ভূমিকা নির্বাচন করুন" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(roleConfig).map(([role, config]) => {
                      const Icon = config.icon
                      return (
                        <SelectItem key={role} value={role}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{config.label}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name Field */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>পূর্ণ নাম</FormLabel>
                <FormControl>
                  <Input
                    placeholder="আপনার নাম লিখুন"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
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

          {/* Phone Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ফোন নম্বর</FormLabel>
                <FormControl>
                  <Input
                    placeholder="01XXXXXXXXX"
                    type="tel"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
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

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>পাসওয়ার্ড নিশ্চিত করুন</FormLabel>
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

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                রেজিস্টার হচ্ছে...
              </>
            ) : (
              'রেজিস্টার করুন'
            )}
          </Button>
        </form>
      </Form>

      {/* Demo Info Box */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">ডেমো অ্যাকাউন্ট:</p>
        <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
          <p><strong>নাগরিক:</strong> nasir@example.com / password</p>
          <p><strong>ক্ষেত্র কর্মচারী:</strong> rahim@example.com / password</p>
          <p><strong>প্রশাসক:</strong> karim@example.com / password</p>
        </div>
      </div>

      {/* Login Link */}
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">ইতিমধ্যে একটি অ্যাকাউন্ট আছে? </span>
        <Link
          to="/login"
          className="text-primary hover:underline font-medium"
          tabIndex={isLoading ? -1 : 0}
        >
          লগইন করুন
        </Link>
      </div>
    </div>
  )
}
