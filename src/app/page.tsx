import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import HeroSection from '@/components/landing/hero-wrapper'
import FeatureIcon3D from '@/components/landing/feature-icon'

const features = [
  {
    title: 'Capture Every Lead',
    description:
      'Never lose a lead again. Capture contact details from any source: WhatsApp, Instagram, email signatures, phone calls, in seconds.',
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
    screenshotLabel: 'Lead Capture',
  },
  {
    title: 'Schedule Follow-ups',
    description: 'Set reminders for every lead so you never forget to follow up. Get notified before deals go cold.',
    screenshotLabel: 'Follow-up Scheduler',
  },
  {
    title: 'Track Every Interaction',
    description: 'Log calls, emails, and meetings. View a full activity history for each lead.',
    screenshotLabel: 'Activity History',
  },
  {
    title: 'Move Through Pipeline',
    description: 'Update lead status from New to Contacted to Won. Watch your conversion rate grow.',
    screenshotLabel: 'Status Pipeline',
  },
  {
    title: 'Close More Deals',
    description: 'See your pipeline at a glance with the dashboard. Never lose a lead again.',
    screenshotLabel: 'Dashboard',
  },
]

function stepScreenshot(index: number) {
  const screens = [
    (
      <div className="absolute inset-0 p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-600 rounded" />
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-800" />
            <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-800" />
            <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-800" />
          </div>
        </div>
        <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3" />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="col-span-2 h-8 bg-gray-200 dark:bg-gray-600 rounded" />
          <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded" />
          <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded" />
        </div>
      </div>
    ),
    (
      <div className="absolute inset-0 p-4 flex flex-col gap-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4" />
        <div className="mt-2 flex gap-2">
          <div className="flex-1 h-20 bg-gray-200 dark:bg-gray-600 rounded" />
          <div className="flex-1 h-20 bg-gray-200 dark:bg-gray-600 rounded" />
        </div>
        <div className="mt-2 flex gap-2">
          <div className="flex-1 h-20 bg-gray-200 dark:bg-gray-600 rounded" />
          <div className="flex-1 h-20 bg-gray-200 dark:bg-gray-600 rounded" />
        </div>
      </div>
    ),
    (
      <div className="absolute inset-0 p-4 flex flex-col gap-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3" />
        <div className="mt-2 space-y-2">
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4" />
              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4" />
              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    ),
    (
      <div className="absolute inset-0 p-4 flex flex-col gap-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
        <div className="mt-2 grid grid-cols-4 gap-2 h-24">
          {[0, 1, 2, 3].map((col) => (
            <div key={col} className="bg-gray-200 dark:bg-gray-600 rounded" />
          ))}
        </div>
      </div>
    ),
    (
      <div className="absolute inset-0 p-4 flex flex-col gap-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div className="col-span-2 h-24 bg-gray-200 dark:bg-gray-600 rounded" />
          <div className="h-12 bg-gray-200 dark:bg-gray-600 rounded" />
          <div className="h-12 bg-gray-200 dark:bg-gray-600 rounded" />
        </div>
      </div>
    ),
  ]

  return screens[index]
}

const stats = [
  { value: '10x', label: 'More follow-ups completed' },
  { value: '99%', label: 'Uptime guarantee' },
  { value: '500+', label: 'leads followed up' },
]

export default async function LandingPage() {
  const session = await auth()

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased">
      <div className="absolute inset-0 -z-10 h-[600px] w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute -left-4 -top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-accent/15 to-primary/15 blur-3xl" />
        <HeroSection />
      </div>

      <header className="border-b border-gray-100/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              LeadFlow
            </Link>
            <nav className="flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
              >
                Features
              </Link>
              <Link
                href="#stats"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
              >
                Results
              </Link>
              <Link
                href="#demo"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
              >
                Demo
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
              >
                How it Works
              </Link>
              {session?.user ? (
                <Link href="/dashboard">
                  <Button variant="primary" size="sm" className="shadow-md">
                    Open Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
                  >
                    Login
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm" className="shadow-md">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pt-28 pb-20 text-center">
          <div className="mb-8">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-inner">
              Built for freelancers. Designed for humans.
            </span>
          </div>
          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-6xl">
            Never lose a lead because you forgot to follow up.
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            LeadFlow is a simple, secure CRM for solopreneurs and small teams.
            Capture leads, schedule follow-ups, and close more deals.
            No complexity of enterprise software.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="#how-it-works">
              <Button size="lg" className="shadow-lg">
                How it Works
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="shadow-sm">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        <section
          id="stats"
          className="relative mx-auto max-w-6xl px-6 py-16"
        >
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gray-50/50 dark:bg-gray-800/50 to-transparent" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="features"
          className="mx-auto max-w-6xl px-6 py-16 sm:py-24"
        >
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Everything you need to close more deals
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Built with care for the people who turn conversations into clients.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-8 shadow-sm transition-all duration-250 ease-emphasized hover:-translate-y-1 hover:shadow-md"
              >
                <div className="absolute -top-2 -right-2 -z-10 h-24 w-24 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 blur-2xl group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-500" />
                <FeatureIcon3D title={feature.title} />
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className="mx-auto max-w-6xl px-6 py-24"
        >
          <div className="mb-16 text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-inner mb-6 block">
              How LeadFlow Works
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              From first contact to closed deal
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Capture leads, schedule follow-ups, and never let an opportunity go cold.
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="relative p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 step-card opacity-0 translate-y-8 max-w-md"
                  data-step={i + 1}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-primary shadow-lg step-number transition-all duration-300 group-hover:scale-110`}>
                      {i + 1}
                    </span>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{step.description}</p>
                  <div className="relative h-56 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 step-screenshot">
                    {stepScreenshot(i)}
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-gray-900/90 dark:from-gray-900/90 to-transparent">
                      <span className="text-xs font-medium text-white">{step.screenshotLabel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <Link href="/register">
              <Button size="lg" className="shadow-lg">
                Get Started Today
              </Button>
            </Link>
          </div>
        </section>

        <section
          id="demo"
          className="mx-auto max-w-6xl px-6 py-16 sm:py-24"
        >
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-2xl">
            <div className="absolute inset-0 bg-grid-gray-200/40 dark:bg-grid-gray-800/40 [mask-image:linear-gradient(to_bottom,white_0%,transparent_100%)]" />
            <div className="relative flex h-[420px] items-center justify-center">
              <div className="z-10 text-center">
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
                <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Ready to stop losing leads?
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Join 500+ freelancers who never miss a follow-up.
                </p>
                <Link href="/register">
                  <Button size="lg" className="shadow-lg">
                    Get Started in 30 Seconds
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              LeadFlow CRM. Built for people who follow through.
            </p>
            <div className="flex gap-6">
              <Link
                href="/login"
                className="text-sm text-gray-600 dark:text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm text-gray-600 dark:text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
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
              document.querySelectorAll('.step-card').forEach((el) => observer.observe(el));
            })();
          `,
        }}
      />
    </div>
  )
}
