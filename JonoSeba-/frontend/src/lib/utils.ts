import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Bengali number formatter (0-9 to ০-৯)
 */
export function bn(text: string | number | null | undefined): string {
  if (text === null || text === undefined) return ''
  
  const str = String(text)
  const bengaliNumbers: { [key: string]: string } = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
  }
  
  return str.replace(/\d/g, (digit) => bengaliNumbers[digit] || digit)
}

/**
 * Format date to readable Bengali string
 */
export function formatDateBengali(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর',
  ]
  
  const day = d.getDate()
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  
  return `${bn(day)} ${month} ${bn(year)}`
}

/**
 * Format date to time ago (e.g., "২ ঘণ্টা আগে")
 */
export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  if (seconds < 60) return 'এখনই'
  if (seconds < 3600) return `${bn(Math.floor(seconds / 60))} মিনিট আগে`
  if (seconds < 86400) return `${bn(Math.floor(seconds / 3600))} ঘণ্টা আগে`
  if (seconds < 604800) return `${bn(Math.floor(seconds / 86400))} দিন আগে`
  
  return formatDateBengali(d)
}

/**
 * Sleep utility for testing/delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Check if user has role
 */
export function hasRole(userRole: string, requiredRole: string | string[]): boolean {
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole)
  }
  return userRole === requiredRole
}
