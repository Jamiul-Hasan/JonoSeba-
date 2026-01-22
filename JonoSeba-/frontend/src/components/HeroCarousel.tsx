import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CarouselImage {
  src: string
  caption: string
}

interface HeroCarouselProps {
  images: CarouselImage[]
}

export function HeroCarousel({ images }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Detect reduced motion preference
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setPrefersReducedMotion(media.matches)
    handleChange()
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  // Auto-rotate carousel
  useEffect(() => {
    if (prefersReducedMotion || images.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [prefersReducedMotion, images.length])

  return (
    <Card className="relative overflow-hidden rounded-3xl border-2 border-border/60 shadow-xl hover:shadow-2xl transition-shadow duration-500">
      {/* Featured Badge */}
      <div className="absolute top-4 left-4 z-20">
        <Badge className="bg-white/95 text-foreground backdrop-blur-sm shadow-md px-3 py-1.5">
          বৈশিষ্ট্যযুক্ত
        </Badge>
      </div>

      {/* Carousel Images */}
      <div className="relative h-64 sm:h-72 lg:h-80 bg-muted">
        {images.map((image, idx) => (
          <div
            key={image.src}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              prefersReducedMotion
                ? idx === 0
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-full'
                : idx === currentIndex
                ? 'opacity-100 translate-x-0'
                : idx === (currentIndex - 1 + images.length) % images.length
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
          >
            <img
              src={image.src}
              alt={image.caption}
              className="w-full h-full object-cover"
            />
            {/* Bottom gradient overlay for caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <p className="text-white text-sm sm:text-base font-semibold drop-shadow-lg">
                {image.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-20 right-4 z-20 flex gap-1.5">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 w-1.5 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </Card>
  )
}
