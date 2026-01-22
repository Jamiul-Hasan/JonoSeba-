import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { Loader2, ArrowLeft } from 'lucide-react'

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
import { useToast } from '@/components/ui/use-toast'

const forgotPasswordSchema = z.object({
  email: z.string().email('সঠিক ইমেইল ঠিকানা লিখুন'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPassword() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'রিসেট লিংক পাঠানো হয়েছে',
        description: 'যদি এই ইমেইল আমাদের সিস্টেমে থাকে, আপনি একটি পাসওয়ার্ড রিসেট লিংক পাবেন',
        variant: 'default',
      })
      
      setIsLoading(false)
      form.reset()
      
      // Optional: redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    }, 1500)
  }

  return (
    <div className="p-6 md:p-8">
      <button
        onClick={() => navigate('/login')}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1 -ml-1"
        disabled={isLoading}
      >
        <ArrowLeft className="h-4 w-4" />
        লগইন পেজে ফিরে যান
      </button>

      <h2 className="text-2xl font-bold text-center mb-2">পাসওয়ার্ড রিসেট</h2>
      <p className="text-muted-foreground text-sm text-center mb-6">
        আপনার রেজিস্টার করা ইমেইল দিন, আমরা পাসওয়ার্ড রিসেট লিংক পাঠাব
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                পাঠানো হচ্ছে...
              </>
            ) : (
              'রিসেট লিংক পাঠান'
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">পাসওয়ার্ড মনে আছে? </span>
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
