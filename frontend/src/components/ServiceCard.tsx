import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Clock, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Variant = 'birth' | 'nid' | 'land' | 'health' | 'education' | 'other'

interface ServiceCardProps {
  title: string
  description: string
  href: string
  imageUrl: string
  variant: Variant
  icon: ReactNode
  badgeText?: string
  meta?: {
    processingTime?: string
    fee?: string
  }
}

const variantConfig: Record<Variant, { color: string; tint: string; iconBg: string }> = {
  birth: { color: 'text-blue-600', tint: 'bg-blue-500/5', iconBg: 'bg-blue-100 text-blue-600' },
  nid: { color: 'text-green-600', tint: 'bg-green-500/5', iconBg: 'bg-green-100 text-green-600' },
  land: { color: 'text-amber-600', tint: 'bg-amber-500/5', iconBg: 'bg-amber-100 text-amber-600' },
  health: { color: 'text-red-600', tint: 'bg-red-500/5', iconBg: 'bg-red-100 text-red-600' },
  education: { color: 'text-purple-600', tint: 'bg-purple-500/5', iconBg: 'bg-purple-100 text-purple-600' },
  other: { color: 'text-cyan-600', tint: 'bg-cyan-500/5', iconBg: 'bg-cyan-100 text-cyan-600' },
}

export function ServiceCard({
  title,
  description,
  href,
  imageUrl,
  variant,
  icon,
  badgeText,
  meta,
}: ServiceCardProps) {
  const config = variantConfig[variant]

  return (
    <Link to={href} className="group block h-full">
      <Card className="h-full flex flex-col overflow-hidden rounded-2xl border border-border/60 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-500">
        {/* Image Header */}
        <div className="relative h-44 overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/10" />
          <div className={`absolute inset-0 ${config.tint}`} />
          
          {/* Badge - Top Left */}
          {badgeText && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/95 text-foreground hover:bg-white shadow-md backdrop-blur-sm">
                {badgeText}
              </Badge>
            </div>
          )}
          
          {/* Icon Chip - Top Right */}
          <div className="absolute top-3 right-3">
            <div className={`w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center shadow-lg backdrop-blur-sm`}>
              {icon}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col p-5">
          {/* Title & Description */}
          <div className="mb-4">
            <h3 className={`text-lg font-semibold mb-2 line-clamp-1 ${config.color}`}>
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Meta Info */}
          {meta && (meta.processingTime || meta.fee) && (
            <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
              {meta.processingTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{meta.processingTime}</span>
                </div>
              )}
              {meta.fee && (
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{meta.fee}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-auto flex items-center gap-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              Apply Now
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // Handle details view
              }}
            >
              Details
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}
