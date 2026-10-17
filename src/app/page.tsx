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

      <header className="fixed top-0 left-0 right-0 border-b border-gray-100/50 dark:border-gray-800/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-50 shadow-sm">
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
        <section className="mx-auto max-w-5xl px-6 pt-28 pb-32 text-center">
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
            <Link href="#features"><Button variant="outline" size="lg" className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">Learn More</Button></Link>
          </div>
        </section>

         <section
          id="stats"
          className="relative mx-auto max-w-6xl px-6 py-24 overflow-hidden"
        >
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-gray-50/50 dark:from-gray-800/50 dark:to-transparent" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center px-4 py-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-md"
              >
                <div className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                  {stat.value}
                </div>
                <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="features"
          className="mx-auto max-w-6xl px-6 py-32"
        >
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              Everything you need to close more deals
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Built with care for the people who turn conversations into clients.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`group relative p-8 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:-translate-y-2 feature-card opacity-0 translate-y-8 ${i === 0 ? 'animate-in' : ''}`}
                data-feature={feature.title}
              >
                <FeatureIcon title={feature.title} />
                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
                  {feature.description}
                </p>
                <div className="mt-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary/5 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className="relative mx-auto max-w-6xl px-6 py-32 overflow-hidden"
        >
          <div className="mb-16 text-center relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-inner">
                How it Works
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              From first contact to closed deal
            </h2>
            <div className="mt-4 w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto" />
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Capture leads, schedule follow-ups, and never let an opportunity go cold.
            </p>
          </div>

          <div className="relative mx-auto max-w-5xl">
            {/* Vertical connector line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-200 dark:bg-gray-800 -z-10 hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="relative p-8 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 step-card opacity-0 translate-y-8 max-w-md mx-auto"
                  data-step={i + 1}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-primary bg-white dark:bg-gray-900 text-primary shadow-lg step-number">
                      {i + 1}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="demo"
          className="mx-auto max-w-6xl px-6 py-32"
        >
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-2xl">
            <div className="absolute inset-0 bg-grid-gray-200/40 dark:bg-grid-gray-800/40 [mask-image:linear-gradient(to_bottom,white_0%,transparent_100%)]" />
            <div className="relative flex h-[420px] items-center justify-center p-4">
              <div className="z-10 text-center max-w-lg">
                <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary/5">
                  <svg
                    className="h-12 w-12 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.106 11.854c0 3-3 3-3 3s2.994.994 3 3 3 3 3-3 3-3 3-3 0 0 0 0 3-3 3-3-2.995-3-3-3 0-3-3 0-3-3-3s0-3 0-3-2.995 0-3 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-2xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-3xl">
                  Ready to stop losing leads?
                </h3>
                <p className="mb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
                  Join 500+ freelancers who never miss a follow-up.
                </p>
                <Link href="/register">
                  <Button size="lg" className="shadow-lg shadow-primary/20">
                    Get Started in 30 Seconds
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              LeadFlow CRM. Built for people who follow through.
            </p>
            <div className="flex gap-6">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-primary dark:hover:text-primary"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-primary dark:hover:text-primary"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const observer = new IntersectionObserver(
                (entries) => {
                  entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                      entry.target.classList.add('animate-in');
                    }
                  });
                },
                { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
              );
              document.querySelectorAll('.step-card, .feature-card').forEach((el) => observer.observe(el));
            })();
          `,
        }}
      />
    </div>
  )
}

