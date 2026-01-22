import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronLeft, ChevronRight, Check, FileUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { PageHeader } from '@/components/PageHeader'
import { useServices } from '@/hooks/useServices'
import { useCreateApplication } from '@/hooks/useApplications'
import { Service } from '@/types'
import { useAuthStore } from '@/store/authStore'

// Mock services as fallback
const defaultServices: Service[] = [
  {
    id: 'service-1',
    name: 'জন্ম নিবন্ধন',
    category: 'vital-records',
    description: 'জন্মের তথ্য সংরক্ষণ এবং সার্টিফিকেট প্রদান',
    processingTime: '৭ দিন',
    fee: 0,
    active: true,
    createdAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'service-2',
    name: 'জমি মিউটেশন',
    category: 'land',
    description: 'জমির মালিকানা পরিবর্তন সংক্রান্ত সেবা',
    processingTime: '১৫ দিন',
    fee: 500,
    active: true,
    createdAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'service-3',
    name: 'রাস্তা মেরামত',
    category: 'infrastructure',
    description: 'রাস্তা এবং অবকাঠামো মেরামত সেবা',
    processingTime: '১০ দিন',
    fee: 0,
    active: true,
    createdAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'service-4',
    name: 'বিদ্যুৎ সংযোগ',
    category: 'utilities',
    description: 'বিদ্যুৎ সংযোগ এবং বিচ্ছিন্নকরণ',
    processingTime: '৫ দিন',
    fee: 200,
    active: true,
    createdAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'service-5',
    name: 'স্বাস্থ্য সেবা',
    category: 'health',
    description: 'স্বাস্থ্য পরীক্ষা এবং প্রত্যয়পত্র',
    processingTime: '৩ দিন',
    fee: 100,
    active: true,
    createdAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'service-6',
    name: 'শিক্ষা সেবা',
    category: 'education',
    description: 'শিক্ষা সংক্রান্ত প্রত্যয়পত্র এবং তথ্য',
    processingTime: '৫ দিন',
    fee: 150,
    active: true,
    createdAt: new Date('2025-01-01').toISOString(),
  },
]

// ==================== Validation Schemas ====================

const personalInfoSchema = z.object({
  applicantName: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষর হতে হবে'),
  email: z.string().email('বৈধ ইমেইল প্রবেশ করুন'),
  phone: z.string().regex(/^(?:\+88)?01[3-9]\d{8}$/, 'বৈধ ফোন নম্বর প্রবেশ করুন'),
  address: z.string().min(5, 'ঠিকানা কমপক্ষে ৫ অক্ষর হতে হবে'),
})

const serviceDetailsSchema = z.object({
  applicationType: z.string().min(1, 'সেবার ধরণ নির্বাচন করুন'),
  details: z.string().optional(),
})

const documentsSchema = z.object({
  documents: z.array(z.instanceof(File))
    .min(1, 'কমপক্ষে একটি নথি আপলোড করুন')
    .refine(
      files => files.every(f => f.size <= 5 * 1024 * 1024),
      'প্রতিটি ফাইল ৫MB এর কম হতে হবে'
    )
    .refine(
      files => files.every(f => 
        ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(f.type)
      ),
      'শুধুমাত্র PDF, JPG, PNG, DOC, DOCX ফাইল সমর্থিত'
    ),
})

const fullSchema = personalInfoSchema.merge(serviceDetailsSchema).merge(documentsSchema)

type ApplicationFormData = z.infer<typeof fullSchema>

interface DocumentFile {
  file: File
  preview: string
  id: string
}

// ==================== Step 1: Personal Info ====================

function Step1PersonalInfo({
  form,
  onNext,
}: {
  form: ReturnType<typeof useForm<ApplicationFormData>>
  onNext: () => void
}) {
  const handleNext = async () => {
    const valid = await form.trigger(['applicantName', 'email', 'phone', 'address'])
    if (valid) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">ব্যক্তিগত তথ্য</h2>
        <p className="text-muted-foreground mt-1">আপনার মৌলিক তথ্য প্রবেশ করুন</p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="applicantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>সম্পূর্ণ নাম *</FormLabel>
              <FormControl>
                <Input placeholder="আপনার সম্পূর্ণ নাম" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ইমেইল *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ফোন নম্বর *</FormLabel>
              <FormControl>
                <Input placeholder="+8801712345678" {...field} />
              </FormControl>
              <FormDescription>বাংলাদেশী ফোন নম্বর (01X XXXXXXXX)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ঠিকানা *</FormLabel>
              <FormControl>
                <Input placeholder="বিল্ডিং, রাস্তা, জেলা, বিভাগ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Button onClick={handleNext} className="w-full flex items-center gap-2">
        পরবর্তী
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

// ==================== Step 2: Service Details ====================

function Step2ServiceDetails({
  form,
  serviceId,
  onBack,
  onNext,
}: {
  form: ReturnType<typeof useForm<ApplicationFormData>>
  serviceId?: string
  onBack: () => void
  onNext: () => void
}) {
  const { data: servicesData } = useServices()
  const services = (servicesData as any)?.services || servicesData?.data || defaultServices || []
  const selectedServiceId = form.watch('applicationType')
  const selectedService = services.find((s: any) => s.id === selectedServiceId) as Service | undefined

  const handleNext = async () => {
    const valid = await form.trigger(['applicationType', 'details'])
    if (valid) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">সেবা বিবরণ</h2>
        <p className="text-muted-foreground mt-1">আপনার সেবা নির্বাচন করুন এবং বিবরণ প্রদান করুন</p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="applicationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>সেবা নির্বাচন করুন *</FormLabel>
              <FormControl>
                <select
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full h-11 px-3 py-2 rounded-lg border border-slate-200/70 bg-white/80 backdrop-blur-sm text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 transition-colors hover:border-slate-300"
                >
                  <option value="">-- সেবা নির্বাচন করুন --</option>
                  {services && services.length > 0 ? (
                    services.map((service: any) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>সেবা লোড হচ্ছে...</option>
                  )}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedService && (
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <h4 className="font-medium mb-2">{selectedService.name}</h4>
            <p className="text-sm text-muted-foreground mb-3">{selectedService.description}</p>
            <div className="grid gap-3 text-sm">
              {selectedService.processingTime && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">প্রক্রিয়াকরণ সময়:</span>
                  <span className="font-medium">{selectedService.processingTime}</span>
                </div>
              )}
              {selectedService.fee !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ফি:</span>
                  <span className="font-medium">
                    {selectedService.fee === 0 ? 'বিনামূল্যে' : `৳${selectedService.fee}`}
                  </span>
                </div>
              )}
              {selectedService.requiredDocuments && selectedService.requiredDocuments.length > 0 && (
                <div>
                  <span className="text-muted-foreground block mb-2">প্রয়োজনীয় নথিসমূহ:</span>
                  <ul className="space-y-1">
                    {selectedService.requiredDocuments.map((doc, idx) => (
                      <li key={idx} className="text-sm">• {doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>অতিরিক্ত বিবরণ</FormLabel>
              <FormControl>
                <textarea
                  placeholder="কোনো অতিরিক্ত তথ্য থাকলে এখানে লিখুন..."
                  className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 flex items-center justify-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          পূর্ববর্তী
        </Button>
        <Button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2">
          পরবর্তী
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ==================== Step 3: Document Upload ====================

function Step3DocumentUpload({
  form,
  documents,
  onAddDocuments,
  onRemoveDocument,
  onBack,
  onNext,
}: {
  form: ReturnType<typeof useForm<ApplicationFormData>>
  documents: DocumentFile[]
  onAddDocuments: (files: FileList) => void
  onRemoveDocument: (id: string) => void
  onBack: () => void
  onNext: () => void
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onAddDocuments(e.target.files)
    }
  }

  const handleNext = () => {
    if (documents.length === 0) {
      form.setError('documents', { message: 'কমপক্ষে একটি নথি আপলোড করুন' })
      return
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">নথি আপলোড করুন</h2>
        <p className="text-muted-foreground mt-1">প্রয়োজনীয় নথিসমূহ আপলোড করুন</p>
      </div>

      <div>
        <label className="block">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition">
            <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="font-medium mb-1">ফাইল আপলোড করুন</p>
            <p className="text-sm text-muted-foreground">
              PDF, JPG, PNG, DOC, DOCX (সর্বোচ্চ 5MB প্রতিটি)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </label>
      </div>

      {documents.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">আপলোড করা ফাইলসমূহ ({documents.length})</h3>
          <div className="space-y-2">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {doc.file.type.startsWith('image/') ? (
                    <img
                      src={doc.preview}
                      alt="preview"
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">
                        {doc.file.name.split('.').pop()?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{doc.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(doc.file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveDocument(doc.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  সরান
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {form.formState.errors.documents && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/50 text-sm text-destructive">
          {form.formState.errors.documents.message}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 flex items-center justify-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          পূর্ববর্তী
        </Button>
        <Button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2">
          পরবর্তী
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ==================== Step 4: Review & Submit ====================

function Step4ReviewSubmit({
  form,
  documents,
  onBack,
  onSubmit,
  isSubmitting,
}: {
  form: ReturnType<typeof useForm<ApplicationFormData>>
  documents: DocumentFile[]
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}) {
  const { data: servicesData } = useServices()
  const services = (servicesData as any)?.services || servicesData?.data || defaultServices || []
  const formData = form.getValues()
  const selectedService = services.find((s: any) => s.id === formData.applicationType)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">পর্যালোচনা করুন এবং জমা দিন</h2>
        <p className="text-muted-foreground mt-1">আপনার তথ্য নিশ্চিত করুন এবং জমা দিন</p>
      </div>

      <div className="space-y-4">
        {/* Personal Info */}
        <div className="rounded-lg border border-border p-4 bg-muted/50">
          <h3 className="font-semibold mb-3">ব্যক্তিগত তথ্য</h3>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">নাম:</span>
              <span className="font-medium">{formData.applicantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ইমেইল:</span>
              <span className="font-medium">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ফোন:</span>
              <span className="font-medium">{formData.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ঠিকানা:</span>
              <span className="font-medium text-right flex-1 ml-4">{formData.address}</span>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="rounded-lg border border-border p-4 bg-muted/50">
          <h3 className="font-semibold mb-3">সেবা বিবরণ</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">সেবা:</span>
              <span className="font-medium">{selectedService?.name}</span>
            </div>
            {formData.details && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">অতিরিক্ত বিবরণ:</span>
                <span className="font-medium text-right flex-1 ml-4">{formData.details}</span>
              </div>
            )}
          </div>
        </div>

        {/* Documents */}
        <div className="rounded-lg border border-border p-4 bg-muted/50">
          <h3 className="font-semibold mb-3">নথিসমূহ ({documents.length})</h3>
          <ul className="space-y-2 text-sm">
            {documents.map(doc => (
              <li key={doc.id} className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span className="truncate">{doc.file.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-info/10 border border-info/50 text-sm text-info">
        <p>
          আপনার আবেদন সফলভাবে জমা দিলে একটি ট্র্যাকিং আইডি পাবেন যা দিয়ে আপনি আপনার আবেদনের অবস্থা যেকোনো সময় জানতে পারবেন।
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          পূর্ববর্তী
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'জমা দিচ্ছি...' : 'জমা দিন'}
          <Check className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ==================== Success Screen ====================

function SuccessScreen({
  trackingId,
  applicantName,
}: {
  trackingId: string
  applicantName: string
}) {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
          <Check className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">আবেদন সফল!</h2>
        <p className="text-muted-foreground">
          আপনার আবেদন সফলভাবে জমা হয়েছে, {applicantName}
        </p>
      </div>

      <div className="rounded-lg border border-border bg-muted/50 p-6">
        <p className="text-sm text-muted-foreground mb-2">ট্র্যাকিং আইডি</p>
        <p className="text-2xl font-mono font-bold break-all">{trackingId}</p>
        <p className="text-xs text-muted-foreground mt-2">
          এই আইডি দিয়ে আপনার আবেদনের অবস্থা ট্র্যাক করতে পারবেন
        </p>
      </div>

      <div className="p-4 rounded-lg bg-info/10 border border-info/50 text-sm text-info space-y-2">
        <p className="font-medium">পরবর্তী পদক্ষেপ:</p>
        <ul className="space-y-1 ml-4">
          <li>• আমরা শীঘ্রই আপনার আবেদন পর্যালোচনা করব</li>
          <li>• অবস্থার আপডেট পেতে নিয়মিত চেক করুন</li>
          <li>• গুরুত্বপূর্ণ বিজ্ঞপ্তি ইমেইলের মাধ্যমে পাবেন</li>
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          onClick={() => navigate('/citizen/applications')}
          className="w-full"
        >
          আমার আবেদনসমূহ দেখুন
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/citizen/dashboard')}
          className="w-full"
        >
          ড্যাশবোর্ডে ফিরুন
        </Button>
      </div>
    </div>
  )
}

// ==================== Main Component ====================

export function NewApplication() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuthStore()
  const serviceId = searchParams.get('serviceId')

  const [step, setStep] = useState(1)
  const [documents, setDocuments] = useState<DocumentFile[]>([])
  const [successData, setSuccessData] = useState<{ trackingId: string; applicantName: string } | null>(null)

  const { mutate: createApplication, isPending } = useCreateApplication()

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      applicantName: '',
      email: '',
      phone: '',
      address: '',
      applicationType: serviceId || '',
      details: '',
      documents: [],
    },
  })

  const handleAddDocuments = (files: FileList) => {
    Array.from(files).forEach(file => {
      // Validate file
      const maxSize = 5 * 1024 * 1024 // 5MB
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

      if (file.size > maxSize) {
        toast({
          title: 'ফাইল খুবই বড়',
          description: `${file.name} ৫MB এর বেশি।`,
          variant: 'destructive',
        })
        return
      }

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'অসমর্থিত ফাইল ধরণ',
          description: `${file.name} সমর্থিত নয়।`,
          variant: 'destructive',
        })
        return
      }

      // Create preview for images
      const preview = file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : ''

      setDocuments(prev => [...prev, {
        file,
        preview,
        id: Math.random().toString(36),
      }])
    })
  }

  const handleRemoveDocument = (id: string) => {
    setDocuments(prev => {
      const doc = prev.find(d => d.id === id)
      if (doc?.preview) {
        URL.revokeObjectURL(doc.preview)
      }
      return prev.filter(d => d.id !== id)
    })
  }

  const handleSubmit = () => {
    if (!user?.id) {
      toast({
        title: 'লগইন প্রয়োজন',
        description: 'আবেদন জমা দিতে লগইন করুন',
        variant: 'destructive',
      })
      return
    }

    const formData = form.getValues()

    // Create FormData for multipart/form-data
    const submitData = new FormData()
    submitData.append('userId', user.id) // Add userId
    submitData.append('applicantName', formData.applicantName)
    submitData.append('email', formData.email)
    submitData.append('phone', formData.phone)
    submitData.append('address', formData.address)
    submitData.append('applicationType', formData.applicationType)
    if (formData.details) {
      submitData.append('details', formData.details)
    }

    // Add documents
    documents.forEach((doc) => {
      submitData.append(`documents`, doc.file)
    })

    createApplication(submitData as any, {
      onSuccess: (data) => {
        setSuccessData({
          trackingId: data.id,
          applicantName: formData.applicantName,
        })
        setStep(5)
      },
      onError: (error: any) => {
        toast({
          title: 'আবেদন ব্যর্থ',
          description: error.response?.data?.message || 'কিছু সমস্যা হয়েছে।',
          variant: 'destructive',
        })
      },
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="নতুন সেবা আবেদন"
        description="পদক্ষেপ অনুসরণ করে আপনার সেবা আবেদন জমা দিন"
      />

      {/* Progress Bar */}
      {step < 5 && (
        <div className="mb-8">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s < step
                    ? 'bg-success'
                    : s === step
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            ধাপ {step} এর ৪
          </p>
        </div>
      )}

      {/* Form Steps */}
      <Form {...form}>
        {step === 1 && (
          <Step1PersonalInfo
            form={form}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2ServiceDetails
            form={form}
            serviceId={serviceId || undefined}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <Step3DocumentUpload
            form={form}
            documents={documents}
            onAddDocuments={handleAddDocuments}
            onRemoveDocument={handleRemoveDocument}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <Step4ReviewSubmit
            form={form}
            documents={documents}
            onBack={() => setStep(3)}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
          />
        )}
      </Form>

      {step === 5 && successData && (
        <SuccessScreen
          trackingId={successData.trackingId}
          applicantName={successData.applicantName}
        />
      )}
    </div>
  )
}
