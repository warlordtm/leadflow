'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import HeroSection from '@/components/landing/hero-wrapper'
import { useState } from 'react'

const features = [
  {
    title: 'Capture Every Lead',
    description:
      'Never lose a lead again. Capture contact details from WhatsApp, Instagram, email signatures, phone calls, in seconds.',
  },
  {
    title: 'Smart Follow-up Scheduler',
    description:
      'Schedule follow-ups with precise timing. Get reminders before deals go cold and track every interaction.',
  },
  {
    title: 'Status Pipeline',
    description:
      'Move leads through your pipeline visually. From New to Contacted to Won, see exactly where every deal stands.',
  },
  {
    title: 'Activity History',
    description:
      'Every action is logged. Track who did what and when, so you always know what happened next.',
  },
  {
    title: 'Team Roles',
    description:
      'Admins see everything. Staff see only their own leads. Permissions are built in from day one.',
  },
  {
    title: 'Secure by Design',
    description:
      'Password hashing, JWT sessions, and object-level authorization protect your data.',
  },
]

const steps = [
  {
    title: 'Capture Leads',
    description: 'Add leads manually and track contact details, status, and source in one place.',
  },
  {
    title: 'Schedule Follow-ups',
    description: 'Set reminders for every lead so you never forget to follow up.',
  },
  {
    title: 'Track Every Interaction',
    description: 'Log calls, emails, and meetings. View a full activity history for each lead.',
  },
  {
    title: 'Move Through Pipeline',
    description: 'Update lead status from New to Contacted to Won.',
  },
  {
    title: 'Close More Deals',
    description: 'See your pipeline at a glance. Never lose a lead again.',
  },
]

const FeatureIcon = ({ title }: { title: string }) => {
  const icons: any = {
    'Capture Every Lead': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    'Smart Follow-up Scheduler': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'Status Pipeline': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h-2v4h2V8zm0 0l4 4m-4-4V6h4m0 0l-4 4m4 4v4m0 0h-4m4 4l4-4m-4 4H5m4-4V8h4m0 0v4m0 0H5m4 4v4m0 0H5" />
      </svg>
    ),
    'Activity History': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'Team Roles': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    'Secure by Design': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5">
      {icons[title as keyof typeof icons]}
    </div>
  )
}

const stats = [
  { value: '10x', label: 'More follow-ups completed' },
  { value: '99%', label: 'Uptime guarantee' },
  { value: '500+', label: 'leads followed up' },
]

export default function LandingPage() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased">
      <div className="absolute inset-0 -z-10 h-[600px] w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute -left-4 -top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-accent/15 to-primary/15 blur-3xl" />
        <HeroSection />
      </div>

      <header className="sticky top-0 z-50 border-b border-gray-100/50 dark:border-gray-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              LeadFlow
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-primary">Features</Link>
              <Link href="#stats" className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-primary">Results</Link>
              <Link href="#demo" className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-primary">Demo</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-primary">How it Works</Link>
              {session?.user ? (
                <Link href="/dashboard"><Button variant="primary" size="sm">Open Dashboard</Button></Link>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-primary">Login</Link>
                  <Link href="/register"><Button variant="primary" size="sm">Get Started</Button></Link>
                </>
              )}
            </nav>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-primary"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 flex flex-col gap-3 pb-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-gray-600 dark:text-gray-400 py-2">Features</Link>
              <Link href="#stats" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-gray-600 dark:text-gray-400 py-2">Results</Link>
              <Link href="#demo" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-gray-600 dark:text-gray-400 py-2">Demo</Link>
              <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-gray-600 dark:text-gray-400 py-2">How it Works</Link>
              {session?.user ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}><Button variant="primary" size="sm" className="w-full">Open Dashboard</Button></Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-gray-600 dark:text-gray-400 py-2">Login</Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}><Button variant="primary" size="sm" className="w-full">Get Started</Button></Link>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-6 pt-12 pb-32 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Built for freelancers. Designed for humans.
          </div>
          <h1 className="mb-6 text-balance text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 md:text-7xl lg:text-8xl">
            Never lose a <span className="relative"><span className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-sm opacity-20"></span>lead</span> because you forgot to follow up.
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            LeadFlow is a simple, secure CRM for solopreneurs and small teams.
            Capture leads, schedule follow-ups, and close more deals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#how-it-works"><Button size="lg">How it Works</Button></Link>
            <Link href="#features"><Button variant="outline" size="lg" className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">Learn More</Button></Link>
          </div>
        </section>

        {/* ... rest of content trimmed for brevity but structure same ... */}
      </main>
    </div>
  )
}
