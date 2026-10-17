'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import LogoutButton from '@/components/logout-button'
import { useSession } from 'next-auth/react'
import { useTranslations } from '@/components/i18n-provider'
import { useState } from 'react'

const links = [
  { href: '/dashboard', labelKey: 'nav.dashboard' },
  { href: '/leads', labelKey: 'nav.leads' },
  { href: '/follow-ups', labelKey: 'nav.followUps' },
  { href: '/settings/profile', labelKey: 'nav.settings' },
]

export default function NavBar() {
  const t = useTranslations()
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = (session?.user as { role: string } | undefined)?.role === 'ADMIN'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="mb-8 border-b border-border-subtle bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
              LeadFlow
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'text-primary'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    {t(link.labelKey)}
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 right-0 h-0.5 w-full rounded-full bg-primary" />
                    )}
                  </Link>
                )
              })}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={cn(
                    'relative text-sm font-medium transition-all duration-200',
                    pathname === '/admin'
                      ? 'text-primary'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  {t('nav.admin')}
                  {pathname === '/admin' && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 w-full rounded-full bg-primary" />
                  )}
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <LogoutButton />
          </div>
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
          <nav className="md:hidden pb-4 border-t border-gray-100 dark:border-gray-800 pt-4 flex flex-col gap-2">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  {t(link.labelKey)}
                </Link>
              )
            })}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'py-2 text-sm font-medium transition-colors',
                  pathname === '/admin'
                    ? 'text-primary'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                {t('nav.admin')}
              </Link>
            )}
            <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
              <LogoutButton />
            </div>
          </nav>
        )}
      </div>
    </nav>
  )
}
