import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProblemType } from '@/types'
import { useCreateComplaint } from '@/hooks/useComplaints'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/PageHeader'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import {
  Form,
  FormControl,
  FormDescription,
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
import { AlertCircle, FileUp, X, Eye } from 'lucide-react'

// Problem type labels in Bengali
const PROBLEM_TYPE_LABELS: Record<ProblemType, string> = {
  [ProblemType.ROAD_DAMAGE]: 'রাস্তার ক্ষতি',
  [ProblemType.WATER_SUPPLY]: 'জল সরবরাহ সমস্যা',
  [ProblemType.GARBAGE]: 'ময়লা ব্যবস্থাপনা',
  [ProblemType.STREET_LIGHT]: 'রাস্তার আলো',
  [ProblemType.DRAINAGE]: 'ড্রেনেজ সমস্যা',
  [ProblemType.OTHER]: 'অন্যান্য',
}

// Validation schema
const newComplaintSchema = z.object({
  category: z.enum(Object.values(ProblemType) as [string, ...string[]], {
    errorMap: () => ({ message: 'দয়া করে একটি বিভাগ নির্বাচন করুন' }),
  }),
  title: z
    .string()
    .min(5, 'শিরোনাম কমপক্ষে ৫ অক্ষরের হতে হবে')
    .max(100, 'শিরোনাম ১০০ অক্ষরের বেশি হতে পারে না'),
  description: z
    .string()
    .min(20, 'বিবরণ কমপক্ষে ২০ অক্ষরের হতে হবে')
    .max(1000, 'বিবরণ ১০০০ অক্ষরের বেশি হতে পারে না'),
  location: z.string().optional(),
})

type NewComplaintFormData = z.infer<typeof newComplaintSchema>

interface Document {
  file: File
  preview?: string
  id: string
}

export default function NewComplaint() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const createComplaintMutation = useCreateComplaint()
  const [attachments, setAttachments] = useState<Document[]>([])
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)

  const form = useForm<NewComplaintFormData>({
    resolver: zodResolver(newComplaintSchema),
    defaultValues: {
      category: undefined,
      title: '',
      description: '',
      location: '',
    },
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 5 * 1024 * 1024 // 5MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validation
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'অবৈধ ফাইল',
          description: 'দয়া করে PDF, JPG, PNG, বা Word ফাইল নির্বাচন করুন',
          variant: 'destructive',
        })
        continue
      }

      if (file.size > maxSize) {
        toast({
          title: 'ফাইল খুব বড়',
          description: 'ফাইল সাইজ ৫ এমবির বেশি হতে পারে না',
          variant: 'destructive',
        })
        continue
      }

      // Create document object
      const doc: Document = {
        file,
        id: Math.random().toString(36).substr(2, 9),
      }

      // Add preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setAttachments((prev: Document[]) =>
            prev.map((d: Document) => (d.id === doc.id ? { ...d, preview: reader.result as string } : d))
          )
        }
        reader.readAsDataURL(file)
      }

      setAttachments((prev: Document[]) => [...prev, doc])

      toast({
        title: 'সফল',
        description: `${file.name} যোগ করা হয়েছে`,
        variant: 'success',
      })
    }

    // Reset input
    e.target.value = ''
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev: Document[]) => prev.filter((doc: Document) => doc.id !== id))
  }

  const onSubmit = async (data: NewComplaintFormData) => {
    if (attachments.length === 0) {
      toast({
        title: 'প্রয়োজনীয় ফাইল',
        description: 'দয়া করে কমপক্ষে একটি সংযুক্তি যোগ করুন',
        variant: 'destructive',
      })
      return
    }

    // Create FormData
    const formData = new FormData()
    formData.append('problemType', data.category)
    formData.append('title', data.title)
    formData.append('description', data.description)
    if (data.location) {
      formData.append('location', data.location)
    }

    // Add attachments
    attachments.forEach((doc: Document) => {
      formData.append('photos', doc.file)
    })

    // Submit
    createComplaintMutation.mutate(formData, {
      onSuccess: (response: any) => {
        // Redirect to complaints list after 1.5 seconds
        setTimeout(() => {
          navigate('/citizen/complaints')
        }, 1500)
      },
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="নতুন অভিযোগ জমা দিন"
        description="কোনো সমস্যা রিপোর্ট করুন এবং আমরা দ্রুত সমাধানে কাজ করব"
      />

      <div className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    সমস্যার বিভাগ <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="একটি বিভাগ নির্বাচন করুন" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(PROBLEM_TYPE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    শিরোনাম <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="সমস্যার সংক্ষিপ্ত শিরোনাম লিখুন"
                      className="rounded-md border-slate-200 dark:border-slate-700"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
                    ন্যূনতম ৫ অক্ষর
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    বিবরণ <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="সমস্যার বিস্তারিত বিবরণ লিখুন"
                      className="min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder-slate-500 shadow-sm transition-colors hover:border-slate-300 focus-visible:border-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:placeholder-slate-400 dark:hover:border-slate-600 dark:focus-visible:ring-offset-slate-950"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
                    ন্যূনতম ২০ অক্ষর, সর্বোচ্চ ১০০০ অক্ষর
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location (optional) */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    স্থান
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="সমস্যার অবস্থান (ঐচ্ছিক)"
                      className="rounded-md border-slate-200 dark:border-slate-700"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
                    উদাহরণ: গুলশান এলাকা, রোড ১২
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Attachments */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  সংযুক্তি <span className="text-destructive">*</span>
                </FormLabel>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {attachments.length} / কমপক্ষে 1
                </span>
              </div>

              <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-600 dark:bg-slate-900">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <FileUp className="h-8 w-8 text-slate-400" />
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      ফাইল নির্বাচন করুন
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      PDF, JPG, PNG, Word (সর্বোচ্চ ৫ এমবি)
                    </p>
                  </div>
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    সংযুক্ত ফাইল:
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {attachments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-xs font-medium text-slate-900 dark:text-slate-50">
                            {doc.file.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {(doc.file.size / 1024 / 1024).toFixed(2)} এমবি
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {doc.preview && (
                            <button
                              type="button"
                              onClick={() => setPreviewDocument(doc)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded dark:text-blue-400 dark:hover:bg-blue-950"
                              title="Preview"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeAttachment(doc.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded dark:text-red-400 dark:hover:bg-red-950"
                            title="Remove"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Info Alert */}
            <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700 dark:text-blue-200">
                <p className="font-medium mb-1">গুরুত্বপূর্ণ:</p>
                <p>সমস্যার স্পষ্ট ছবি প্রদান করলে দ্রুত সমাধান হবে। আপনার অভিযোগ আমাদের কাছে গুরুত্বপূর্ণ।</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={createComplaintMutation.isPending}
              >
                বাতিল করুন
              </Button>
              <Button
                type="submit"
                disabled={createComplaintMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {createComplaintMutation.isPending ? 'জমা দেওয়া হচ্ছে...' : 'অভিযোগ জমা দিন'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Preview Modal */}
      {previewDocument && previewDocument.preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setPreviewDocument(null)}
        >
          <div
            className="relative max-h-[80vh] max-w-2xl overflow-auto rounded-lg bg-white dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewDocument(null)}
              className="absolute top-2 right-2 p-2 text-slate-600 hover:bg-slate-100 rounded dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
            <img src={previewDocument.preview} alt="Preview" className="w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  )
}
