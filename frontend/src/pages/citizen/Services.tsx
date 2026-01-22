import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { SkeletonCard } from '@/components/SkeletonLoaders'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/EmptyState'
import { useServices } from '@/hooks/useServices'
import { Service } from '@/types'
import { cn } from '@/lib/utils'

function ServiceCard({
  service,
  onApply,
}: {
  service: Service
  onApply: (serviceId: string) => void
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{service.name}</h3>
          {!service.active && (
            <Badge variant="secondary" className="whitespace-nowrap">
              বন্ধ
            </Badge>
          )}
        </div>
        <Badge variant="outline" className="text-xs">
          {service.category}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
        {service.description}
      </p>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm border-t border-border pt-4">
        {service.processingTime && (
          <div>
            <p className="text-xs text-muted-foreground">প্রক্রিয়াকরণ সময়</p>
            <p className="font-medium text-xs">{service.processingTime}</p>
          </div>
        )}
        {service.fee !== undefined && (
          <div>
            <p className="text-xs text-muted-foreground">ফি</p>
            <p className="font-medium text-xs">
              {service.fee === 0 ? 'বিনামূল্যে' : `৳${service.fee}`}
            </p>
          </div>
        )}
      </div>

      {/* Required Documents */}
      {service.requiredDocuments && service.requiredDocuments.length > 0 && (
        <div className="mb-4 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground mb-2">প্রয়োজনীয় নথিসমূহ</p>
          <ul className="space-y-1">
            {service.requiredDocuments.slice(0, 3).map((doc, idx) => (
              <li key={idx} className="text-xs text-foreground">
                • {doc}
              </li>
            ))}
            {service.requiredDocuments.length > 3 && (
              <li className="text-xs text-muted-foreground italic">
                +{service.requiredDocuments.length - 3} আরও
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Apply Button */}
      <Button
        onClick={() => onApply(service.id)}
        disabled={!service.active}
        className="w-full mt-auto"
      >
        আবেদন করুন
      </Button>
    </div>
  )
}

export function ServicesList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Fetch services with filters
  const { data: servicesData, isLoading } = useServices({
    search,
    category: selectedCategory || undefined,
  })

  const services = servicesData?.data || []
  const categories = useMemo(() => {
    return Array.from(new Set(services.map(s => s.category))).sort()
  }, [services])

  const handleApply = (serviceId: string) => {
    navigate(`/citizen/applications/new?serviceId=${serviceId}`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="সেবা তালিকা"
        description="সকল সেবা অন্বেষণ করুন এবং আবেদন করুন"
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="সেবা খুঁজুন..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={selectedCategory ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">বিভাগ</span>
              {selectedCategory && (
                <span className="text-xs bg-background/20 px-2 py-0.5 rounded-full ml-1">
                  {selectedCategory}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => setSelectedCategory(null)}
              className={!selectedCategory ? 'bg-muted' : ''}
            >
              সকল বিভাগ
            </DropdownMenuItem>
            {categories.length > 0 && <DropdownMenuSeparator />}
            {categories.map(category => (
              <DropdownMenuItem
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-muted' : ''}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {(search || selectedCategory) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch('')
              setSelectedCategory(null)
            }}
            className="text-xs"
          >
            ছাড় করুন
          </Button>
        )}
      </div>

      {/* Results Info */}
      {!isLoading && (
        <div className="text-sm text-muted-foreground">
          {services.length} টি সেবা পাওয়া গেছে
          {(search || selectedCategory) && (
            <span className="ml-2">
              ({search && `খোঁজ: "${search}"`}
              {search && selectedCategory && ', '}
              {selectedCategory && `বিভাগ: "${selectedCategory}"`})
            </span>
          )}
        </div>
      )}

      {/* Services Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} lines={5} />
          ))}
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          title="কোনো সেবা পাওয়া যায়নি"
          description={
            search || selectedCategory
              ? 'আপনার অনুসন্ধানের সাথে মেলে এমন কোনো সেবা নেই। আপনার ফিল্টার পরিবর্তন করে চেষ্টা করুন।'
              : 'কোনো সেবা উপলব্ধ নেই।'
          }
          icon={<AlertCircle className="h-12 w-12 text-muted-foreground" />}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onApply={handleApply}
            />
          ))}
        </div>
      )}

      {/* Results Count */}
      {!isLoading && services.length > 0 && (
        <div className="text-center text-sm text-muted-foreground border-t border-border pt-6">
          <p>মোট {services.length} টি সেবা প্রদর্শিত</p>
          {services.filter(s => !s.active).length > 0 && (
            <p className="text-xs mt-1">
              নোট: কিছু সেবা বর্তমানে উপলব্ধ নয়
            </p>
          )}
        </div>
      )}
    </div>
  )
}
