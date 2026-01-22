import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ServiceCard } from '@/components/ServiceCard'
import { HeroCarousel } from '@/components/HeroCarousel'
import {
  Menu,
  X,
  Globe,
  FileText,
  Shield,
  Zap,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  BarChart3,
  ArrowRight,
  UserPlus,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function Landing() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState<'EN' | 'BN'>('EN')
  const [isScrolled, setIsScrolled] = useState(false)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    )

    Object.values(sectionsRef.current).forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'BN' : 'EN')
  }

  const navLinks = [
    { label: language === 'EN' ? 'Services' : 'সেবা', href: '#services' },
    { label: language === 'EN' ? 'How it Works' : 'কীভাবে কাজ করে', href: '#how-it-works' },
    { label: language === 'EN' ? 'Reports' : 'রিপোর্ট', href: '#reports' },
    { label: language === 'EN' ? 'FAQ' : 'সাধারণ প্রশ্ন', href: '#faq' },
  ]

  // Hero carousel images
  const heroCarouselImages = [
    {
      src: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Bangladesh_National_Parliament_House.jpg',
      caption: 'জাতীয় সংসদ ভবন',
    },
    {
      src: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/National_Martyrs%E2%80%99_Memorial_08.jpg',
      caption: 'জাতীয় স্মৃতিসৌধ',
    },
    {
      src: 'https://flagcdn.com/w2560/bd.png',
      caption: 'বাংলাদেশের পতাকা',
    },
  ]

  // Service data
  const services = [
    {
      id: 1,
      icon: <FileText className="w-5 h-5" />,
      title: language === 'EN' ? 'Birth Certificate' : 'জন্ম সার্টিফিকেট',
      description: language === 'EN' ? 'Apply and track your birth certificate application' : 'জন্ম সার্টিফিকেটের আবেদন করুন',
      imageUrl: 'https://images.unsplash.com/photo-1508034944108-cba919dfb023?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
      variant: 'birth' as const,
      href: '/citizen/applications',
      badgeText: language === 'EN' ? 'Popular' : 'জনপ্রিয়',
      meta: {
        processingTime: language === 'EN' ? '3-5 days' : '৩-৫ দিন',
        fee: language === 'EN' ? 'Free' : 'বিনামূল্যে',
      },
    },
    {
      id: 2,
      icon: <Shield className="w-5 h-5" />,
      title: language === 'EN' ? 'NID Support' : 'জাতীয় পরিচয়পত্র সহায়তা',
      description: language === 'EN' ? 'National ID card assistance and updates' : 'জাতীয় পরিচয়পত্র সেবা',
      imageUrl: 'https://images.unsplash.com/photo-1676970132913-e3db8e8493c3?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
      variant: 'nid' as const,
      href: '/citizen/applications',
      badgeText: language === 'EN' ? 'Online' : 'অনলাইন',
      meta: {
        processingTime: language === 'EN' ? '7-10 days' : '৭-১০ দিন',
        fee: language === 'EN' ? '৳200' : '২০০ টাকা',
      },
    },
    {
      id: 3,
      icon: <MapPin className="w-5 h-5" />,
      title: language === 'EN' ? 'Land Services' : 'ভূমি সেবা',
      description: language === 'EN' ? 'Land registration and verification' : 'ভূমি নিবন্ধন ও যাচাইকরণ',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Firingi_Bazar_Land_Office_%2801%29.jpg',
      variant: 'land' as const,
      href: '/citizen/applications',
      meta: {
        processingTime: language === 'EN' ? '15-30 days' : '১৫-৩০ দিন',
        fee: language === 'EN' ? 'Varies' : 'পরিবর্তনশীল',
      },
    },
    {
      id: 4,
      icon: <AlertCircle className="w-5 h-5" />,
      title: language === 'EN' ? 'Health Support' : 'স্বাস্থ্য সহায়তা',
      description: language === 'EN' ? 'Health certificates and medical support' : 'স্বাস্থ্য সেবা এবং সনদপত্র',
      imageUrl: 'https://images.unsplash.com/photo-1694938171742-8d9d015daa22?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
      variant: 'health' as const,
      href: '/citizen/applications',
      badgeText: language === 'EN' ? 'New' : 'নতুন',
      meta: {
        processingTime: language === 'EN' ? '1-2 days' : '১-২ দিন',
        fee: language === 'EN' ? 'Free' : 'বিনামূল্যে',
      },
    },
    {
      id: 5,
      icon: <Users className="w-5 h-5" />,
      title: language === 'EN' ? 'Education' : 'শিক্ষা সেবা',
      description: language === 'EN' ? 'Educational support and certificates' : 'শিক্ষা সনদপত্র এবং সহায়তা',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Curzon_Hall_-_Northern_Facade_-_University_of_Dhaka_-_Dhaka_2015-05-31_1992.JPG',
      variant: 'education' as const,
      href: '/citizen/applications',
      meta: {
        processingTime: language === 'EN' ? '5-7 days' : '৫-৭ দিন',
        fee: language === 'EN' ? '৳100' : '১০০ টাকা',
      },
    },
    {
      id: 6,
      icon: <Zap className="w-5 h-5" />,
      title: language === 'EN' ? 'Other Services' : 'অন্যান্য সেবা',
      description: language === 'EN' ? 'Additional government services' : 'অন্যান্য সরকারি সেবা',
      imageUrl: 'https://images.unsplash.com/photo-1694343906708-e0d2306b5802?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
      variant: 'other' as const,
      href: '/citizen/applications',
      meta: {
        processingTime: language === 'EN' ? 'Varies' : 'পরিবর্তনশীল',
      },
    },
  ]

  // How it works steps
  const steps = [
    {
      num: 1,
      title: language === 'EN' ? 'Sign Up & Verify' : 'নিবন্ধন করুন',
      description: language === 'EN' ? 'Create your account and verify your identity' : 'আপনার অ্যাকাউন্ট তৈরি করুন এবং যাচাই করুন',
    },
    {
      num: 2,
      title: language === 'EN' ? 'Apply for Services' : 'সেবার জন্য আবেদন করুন',
      description: language === 'EN' ? 'Submit your application with required documents' : 'প্রয়োজনীয় নথি সহ আবেদন জমা দিন',
    },
    {
      num: 3,
      title: language === 'EN' ? 'Track & Receive' : 'ট্র্যাক করুন ও পান',
      description: language === 'EN' ? 'Monitor progress and receive your result' : 'অগ্রগতি পর্যবেক্ষণ করুন এবং ফলাফল পান',
    },
  ]

  // Why JonoSeba features
  const features = [
    {
      icon: BarChart3,
      title: language === 'EN' ? 'Real-time Tracking' : 'রিয়েল-টাইম ট্র্যাকিং',
      description: language === 'EN' ? 'Monitor your application status 24/7' : 'আপনার আবেদনের অবস্থা সর্বদা পর্যবেক্ষণ করুন',
    },
    {
      icon: Shield,
      title: language === 'EN' ? 'Secure & Transparent' : 'নিরাপদ ও স্বচ্ছ',
      description: language === 'EN' ? 'Bank-level security with full transparency' : 'ব্যাংক-স্তরের নিরাপত্তা সহ',
    },
    {
      icon: Clock,
      title: language === 'EN' ? 'Fast Processing' : 'দ্রুত প্রক্রিয়াকরণ',
      description: language === 'EN' ? 'Get results in days, not weeks' : 'দ্রুত এবং দক্ষ সেবা প্রদান',
    },
    {
      icon: Users,
      title: language === 'EN' ? 'Multi-role Support' : 'বহুভূমিকা সহায়তা',
      description: language === 'EN' ? 'Separate portals for citizens and officers' : 'নাগরিক ও কর্মচারীদের জন্য আলাদা পোর্টাল',
    },
  ]

  // Latest updates/announcements
  const announcements = [
    {
      date: '2024-01-15',
      title: language === 'EN' ? 'New Birth Certificate Process' : 'নতুন জন্ম সার্টিফিকেট প্রক্রিয়া',
      description: language === 'EN' ? 'Streamlined birth certificate application now available online.' : 'অনলাইনে জন্ম সার্টিফিকেটের জন্য আবেদন করুন।',
      status: 'new',
    },
    {
      date: '2024-01-10',
      title: language === 'EN' ? 'System Maintenance Update' : 'সিস্টেম রক্ষণাবেক্ষণ আপডেট',
      description: language === 'EN' ? 'Planned maintenance scheduled for better performance.' : 'উন্নত কর্মক্ষমতার জন্য সিস্টেম আপডেট।',
      status: 'maintenance',
    },
    {
      date: '2024-01-05',
      title: language === 'EN' ? 'Mobile App Launch' : 'মোবাইল অ্যাপ চালু',
      description: language === 'EN' ? 'JonoSeba mobile app now available on iOS and Android.' : 'জনসেবা মোবাইল অ্যাপ এখন পাওয়া যাচ্ছে।',
      status: 'feature',
    },
  ]

  // FAQ items
  const faqItems = [
    {
      question: language === 'EN' ? 'How do I create an account?' : 'আমি কীভাবে একটি অ্যাকাউন্ট তৈরি করব?',
      answer: language === 'EN' ? 'Click the Register button, fill in your details, verify your email, and you\'re all set!' : 'রেজিস্টার বোতামে ক্লিক করুন, আপনার বিবরণ পূরণ করুন এবং আপনার ইমেল যাচাই করুন।',
    },
    {
      question: language === 'EN' ? 'Is my data secure?' : 'আমার ডেটা কি সুরক্ষিত?',
      answer: language === 'EN' ? 'Yes, we use bank-level encryption and comply with all government data protection regulations.' : 'হাঁ, আমরা ব্যাংক-স্তরের এনক্রিপশন ব্যবহার করি।',
    },
    {
      question: language === 'EN' ? 'How long does processing take?' : 'প্রক্রিয়াকরণ কতক্ষণ সময় লাগে?',
      answer: language === 'EN' ? 'Most applications are processed within 3-5 business days. You can track status in real-time.' : 'বেশিরভাগ আবেদন ৩-৫ কর্মদিবসে প্রক্রিয়া করা হয়।',
    },
    {
      question: language === 'EN' ? 'Can I edit my application?' : 'আমি কি আমার আবেদন সম্পাদনা করতে পারি?',
      answer: language === 'EN' ? 'Yes, you can edit your application until it\'s approved by the officer.' : 'হাঁ, অফিসার অনুমোদন করার আগে পর্যন্ত আপনি সম্পাদনা করতে পারেন।',
    },
    {
      question: language === 'EN' ? 'What should I do if I face an issue?' : 'যদি আমি কোনো সমস্যার সম্মুখীন হই তাহলে কী করব?',
      answer: language === 'EN' ? 'Contact our support team via email, phone, or use the "Report Issue" feature in the dashboard.' : 'আমাদের সহায়তা দলের সাথে যোগাযোগ করুন অথবা "সমস্যা রিপোর্ট করুন" ফিচার ব্যবহার করুন।',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ===== HEADER ===== */}
      <header
        className={`sticky top-0 z-50 bg-background transition-all duration-300 ${
          isScrolled ? 'border-b border-border shadow-sm' : 'border-b border-border/50'
        }`}
        role="banner"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-2 py-1"
              aria-label="JonoSeba - Home"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
              </div>
              <div className="hidden sm:flex flex-col min-w-0">
                <span className="text-sm sm:text-base font-bold text-foreground leading-tight">জনসেবা</span>
                <span className="text-xs text-muted-foreground">JonoSeba</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                aria-label={`Switch language to ${language === 'EN' ? 'Bengali' : 'English'}`}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg border border-border hover:bg-muted hover:border-primary/50 transition-colors text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{language}</span>
              </button>

              {/* Auth Buttons */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex text-xs sm:text-sm font-medium"
                aria-label="Login to JonoSeba"
              >
                {language === 'EN' ? 'Login' : 'লগইন'}
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/register')}
                className="text-xs sm:text-sm font-medium"
                aria-label="Create a new account"
              >
                {language === 'EN' ? 'Register' : 'নিবন্ধন'}
              </Button>

              {/* Mobile Menu Toggle */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMenuOpen}
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <SheetContent side="right" className="w-64">
                  <SheetHeader>
                    <SheetTitle>{language === 'EN' ? 'Menu' : 'মেনু'}</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2 mt-8" aria-label="Mobile navigation">
                    {navLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    ))}
                    <Separator className="my-3" />
                    <Button
                      variant="outline"
                      className="w-full justify-center"
                      onClick={() => {
                        navigate('/login')
                        setIsMenuOpen(false)
                      }}
                    >
                      {language === 'EN' ? 'Login' : 'লগইন'}
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        {/* Bangladesh-themed Abstract Background */}
        <div className="absolute inset-0" aria-hidden="true">
          {/* Radial gradient base (green theme) */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50/40 to-white" />
          
          {/* Subtle red circle (Bangladesh flag reference) */}
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-500/8 rounded-full blur-3xl" />
          
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* 2-Column Grid Layout */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* LEFT: Text Content */}
            <div className="max-w-2xl animate-fade-in-up">
              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight tracking-tight">
                {language === 'EN'
                  ? 'জনসেবা — Your Gateway to Government Services'
                  : 'জনসেবা — সরকারি সেবার প্রবেশদ্বার'}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-700 mb-8 sm:mb-10 leading-relaxed">
                {language === 'EN'
                  ? 'Fast, transparent, and secure access to essential government services. Apply, track, and complete your applications online with ease.'
                  : 'দ্রুত, স্বচ্ছ এবং নিরাপদ সরকারি সেবা। অনলাইনে আবেদন করুন এবং ট্র্যাক করুন সহজেই।'}
              </p>

              {/* Trust Chips */}
              <div className="flex flex-wrap gap-4 mb-8 sm:mb-10">
                {[
                  { icon: Shield, label: language === 'EN' ? 'Secure' : 'নিরাপদ' },
                  { icon: CheckCircle, label: language === 'EN' ? 'Transparent' : 'স্বচ্ছ' },
                  { icon: Zap, label: language === 'EN' ? 'Fast' : 'দ্রুত' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm text-slate-900 font-semibold text-sm"
                  >
                    <item.icon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/citizen/applications')}
                  className="font-semibold h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl transition-all"
                  aria-label="Apply for government services"
                >
                  {language === 'EN' ? 'Apply for Services' : 'সেবার জন্য আবেদন করুন'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/citizen/complaints')}
                  className="font-semibold h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm border-slate-300 text-slate-900 hover:bg-white"
                  aria-label="Report an issue or complaint"
                >
                  {language === 'EN' ? 'Report an Issue' : 'সমস্যা রিপোর্ট করুন'}
                </Button>
              </div>
            </div>

            {/* RIGHT: Carousel Card */}
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <HeroCarousel images={heroCarouselImages} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== KEY SERVICES SECTION ===== */}
      <section 
        ref={(el) => (sectionsRef.current['services'] = el)}
        id="services" 
        className="py-16 sm:py-20 lg:py-28 bg-background"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-14 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
              {language === 'EN' ? 'Our Services' : 'আমাদের সেবা'}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {language === 'EN'
                ? 'Access a comprehensive range of government services online, all in one place'
                : 'সরকারি সেবার একটি বিস্তৃত পরিসর অনলাইনে পান, একটি প্ল্যাটফর্মে'}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                href={service.href}
                imageUrl={service.imageUrl}
                variant={service.variant}
                icon={service.icon}
                badgeText={service.badgeText}
                meta={service.meta}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section 
        ref={(el) => (sectionsRef.current['how-it-works'] = el)}
        id="how-it-works" 
        className="relative py-16 sm:py-20 lg:py-28 overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/60 via-muted/40 to-background">
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-14 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
              {language === 'EN' ? 'How It Works' : 'কীভাবে কাজ করে'}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {language === 'EN'
                ? 'Three simple steps to access the services you need'
                : 'তিনটি সহজ ধাপে প্রয়োজনীয় সেবা পান'}
            </p>
          </div>

          {/* Premium Timeline Steps */}
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6 relative">
            {/* Horizontal Connector Line - Desktop Only */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-green-200 via-green-400 to-green-200 z-0" />

            {steps.map((step, index) => {
              const stepIcons = [
                { icon: <UserPlus className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
                { icon: <FileText className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
                { icon: <CheckCircle className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
              ]
              const { icon, color } = stepIcons[index]

              return (
                <li
                  key={index}
                  className={`relative group ${visibleSections.has('how-it-works') ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Card Container */}
                  <div className="relative h-full">
                    {/* Step Number Badge - Positioned above card on desktop */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10 hidden md:flex">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold text-lg shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        {step.num}
                      </div>
                    </div>

                    {/* Mobile Step Number - Left side */}
                    <div className="md:hidden absolute -left-16 top-6 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                      {step.num}
                    </div>

                    {/* Card */}
                    <Card className="relative overflow-hidden h-full bg-white/85 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                      {/* Content */}
                      <div className="p-6 sm:p-8 flex flex-col h-full">
                        {/* Icon Badge */}
                        <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          {icon}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                          {step.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5 flex-grow">
                          {step.description}
                        </p>

                        {/* Estimated Time */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 pt-4 border-t border-slate-100">
                          <Clock className="w-4 h-4" />
                          <span>
                            {index === 0
                              ? language === 'EN'
                                ? '2-3 minutes'
                                : '২-৩ মিনিট'
                              : index === 1
                              ? language === 'EN'
                                ? '5-10 minutes'
                                : '৫-১০ মিনিট'
                              : language === 'EN'
                              ? '1-3 business days'
                              : '১-৩ কার্যদিবস'}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* ===== WHY JONOSEBA SECTION ===== */}
      <section 
        ref={(el) => (sectionsRef.current['features'] = el)}
        id="features"
        className="py-16 sm:py-20 lg:py-28 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.4
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-14 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
              {language === 'EN' ? 'Why Choose JonoSeba' : 'জনসেবা কেন বেছে নেবেন'}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {language === 'EN'
                ? 'Built with transparency and citizen convenience at its core'
                : 'নাগরিকদের সুবিধা এবং স্বচ্ছতার সাথে তৈরি'}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon
              return (
                <Card
                  key={index}
                  className={`group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-green-400/60 transition-all duration-500 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${visibleSections.has('features') ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  role="article"
                  aria-label={feature.title}
                  tabIndex={0}
                >
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400/40 via-green-500/60 to-green-400/40 group-hover:from-green-400/70 group-hover:via-green-500/90 group-hover:to-green-400/70 transition-all duration-500" />
                  
                  {/* Subtle top gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-green-50/30 to-transparent pointer-events-none" />
                  
                  {/* Inner highlight ring */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-white/50 pointer-events-none" />
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="pt-6 px-6">
                      {/* Icon Badge */}
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 relative">
                        {/* Badge background with gradient */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-100/80 to-green-50/60 border border-green-200/60 group-hover:border-green-300/80 transition-all duration-500" />
                        {/* Badge shadow */}
                        <div className="absolute inset-0 rounded-2xl shadow-sm group-hover:shadow-md transition-all duration-500" />
                        {/* Hover glow */}
                        <div className="absolute inset-0 rounded-2xl bg-green-400/0 group-hover:bg-green-400/12 transition-all duration-500" />
                        {/* Icon */}
                        <FeatureIcon className="w-8 h-8 text-green-600 group-hover:text-green-700 group-hover:scale-110 transition-all duration-500 relative z-10" strokeWidth={1.8} />
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-900 text-center group-hover:text-green-700 transition-colors duration-500 tracking-tight leading-snug">
                        {feature.title}
                      </h3>
                    </div>

                    {/* Divider */}
                    <div className="my-4 mx-6 h-px bg-gradient-to-r from-transparent via-slate-200/40 to-transparent group-hover:via-green-200/60 transition-all duration-500" />
                    
                    {/* Description */}
                    <div className="px-6 pb-6 flex-grow">
                      <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-500">{feature.description}</p>
                    </div>
                  </div>

                  {/* Bottom shine effect on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== LATEST UPDATES SECTION ===== */}
      <section 
        ref={(el) => (sectionsRef.current['announcements'] = el)}
        id="announcements"
        className="relative py-16 sm:py-20 lg:py-28 overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted/40 to-background">
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="mb-12 sm:mb-14 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
              {language === 'EN' ? 'Latest Updates' : 'সর্বশেষ আপডেট'}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {language === 'EN'
                ? 'Stay informed with our latest news, updates, and announcements'
                : 'সর্বশেষ খবর এবং ঘোষণা সম্পর্কে অবগত থাকুন'}
            </p>
          </div>

          {/* Announcements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-6 lg:gap-8">
            {announcements.map((announcement, index) => (
              <Card
                key={index}
                className={`group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-green-400/60 transition-all duration-500 flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${visibleSections.has('announcements') ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
                role="article"
                aria-label={`${announcement.title} - ${announcement.date}`}
                tabIndex={0}
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400/40 via-green-500/60 to-green-400/40 group-hover:from-green-400/70 group-hover:via-green-500/90 group-hover:to-green-400/70 transition-all duration-500" />
                
                {/* Subtle top gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-green-50/30 to-transparent pointer-events-none" />
                
                {/* Inner highlight ring */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/50 pointer-events-none" />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  <div className="pt-6 px-6">
                    {/* Status Badge */}
                    <div className="inline-flex mb-4">
                      <span className="inline-flex text-xs font-bold text-green-700 bg-gradient-to-r from-green-100/80 to-green-50/60 px-3.5 py-1.5 rounded-full uppercase tracking-widest border border-green-200/60 group-hover:border-green-300/80 group-hover:from-green-100 group-hover:to-green-50 transition-all duration-500 shadow-sm group-hover:shadow-md">
                        {announcement.status === 'new' && (language === 'EN' ? '🆕 New' : '🆕 নতুন')}
                        {announcement.status === 'maintenance' && (language === 'EN' ? '🔧 Update' : '🔧 আপডেট')}
                        {announcement.status === 'feature' && (language === 'EN' ? '✨ Feature' : '✨ বৈশিষ্ট্য')}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-green-700 transition-colors duration-500 line-clamp-2 tracking-tight leading-snug mb-2">
                      {announcement.title}
                    </h3>
                    
                    {/* Date */}
                    <p className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors duration-500 font-medium">
                      {new Date(announcement.date).toLocaleDateString(language === 'EN' ? 'en-US' : 'bn-BD', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="my-4 mx-6 h-px bg-gradient-to-r from-transparent via-slate-200/40 to-transparent group-hover:via-green-200/60 transition-all duration-500" />
                  
                  {/* Description */}
                  <div className="px-6 pb-6 flex-grow">
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 group-hover:text-slate-700 transition-colors duration-500">{announcement.description}</p>
                  </div>
                </div>

                {/* Bottom shine effect on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section 
        ref={(el) => (sectionsRef.current['faq'] = el)}
        id="faq"
        className="py-16 sm:py-20 lg:py-28 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.015'%3E%3Ccircle cx='25' cy='25' r='15'/%3E%3Ccircle cx='75' cy='25' r='15'/%3E%3Ccircle cx='25' cy='75' r='15'/%3E%3Ccircle cx='75' cy='75' r='15'/%3E%3Ccircle cx='50' cy='50' r='20'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-14 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
              {language === 'EN' ? 'Frequently Asked Questions' : 'সাধারণ প্রশ্ন'}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {language === 'EN'
                ? 'Find answers to common questions about JonoSeba services'
                : 'জনসেবা সম্পর্কে সাধারণ প্রশ্নের উত্তর খুঁজুন'}
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className={`max-w-3xl mx-auto ${visibleSections.has('faq') ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border rounded-lg px-6 py-4 bg-card/90 backdrop-blur-sm hover:bg-card/95 hover:shadow-md transition-all duration-200 data-[state=open]:bg-card/95 data-[state=open]:shadow-md"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-0">
                    <span className="text-sm sm:text-base font-semibold text-foreground text-left">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm sm:text-base text-muted-foreground pt-4 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-950 text-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12">
            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <span className="font-bold text-lg text-slate-50">জনসেবা</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {language === 'EN'
                  ? 'A government-backed digital platform providing seamless access to essential services.'
                  : 'সরকার দ্বারা সমর্থিত ডিজিটাল প্ল্যাটফর্ম যা অপরিহার্য সেবায় নির্বিঘ্ন অ্যাক্সেস প্রদান করে।'}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-slate-50 mb-5 text-sm uppercase tracking-wide">
                {language === 'EN' ? 'Quick Links' : 'দ্রুত লিঙ্ক'}
              </h4>
              <ul className="space-y-3 text-sm text-slate-400">
                {[
                  { label: language === 'EN' ? 'Services' : 'সেবা', href: '#services' },
                  { label: language === 'EN' ? 'How it Works' : 'কীভাবে কাজ করে', href: '#how-it-works' },
                  { label: language === 'EN' ? 'FAQ' : 'সাধারণ প্রশ্ন', href: '#faq' },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:text-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-slate-50 mb-5 text-sm uppercase tracking-wide">
                {language === 'EN' ? 'Contact Us' : 'যোগাযোগ করুন'}
              </h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
                  <a href="tel:16123" className="hover:text-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-1">
                    16123
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                  <a href="mailto:support@jonoseba.gov.bd" className="hover:text-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-1 truncate">
                    support@jonoseba.gov.bd
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-4 h-4 flex-shrink-0 text-primary" />
                  <span>24/7 {language === 'EN' ? 'Support' : 'সহায়তা'}</span>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-bold text-slate-50 mb-5 text-sm uppercase tracking-wide">
                {language === 'EN' ? 'Follow Us' : 'আমাদের অনুসরণ করুন'}
              </h4>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, label: 'Facebook', href: '#' },
                  { icon: Twitter, label: 'Twitter', href: '#' },
                  { icon: Linkedin, label: 'LinkedIn', href: '#' },
                ].map((social) => {
                  const SocialIcon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={`Follow us on ${social.label}`}
                      className="w-10 h-10 bg-slate-800 hover:bg-primary text-slate-50 rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-950"
                    >
                      <SocialIcon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          <Separator className="bg-slate-800 mb-8" />

          {/* Footer Bottom */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>© 2024 জনসেবা (JonoSeba). {language === 'EN' ? 'All rights reserved.' : 'সর্বাধিকার সংরক্ষিত।'}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1">
                {language === 'EN' ? 'Privacy Policy' : 'গোপনীয়তা নীতি'}
              </a>
              <a href="#" className="hover:text-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1">
                {language === 'EN' ? 'Terms of Service' : 'সেবার শর্তাবলী'}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
