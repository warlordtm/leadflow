'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import LogoutButton from '@/components/logout-button'
import { useSession } from 'next-auth/react'
import { useTranslations } from '@/components/i18n-provider'

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

  return (
    <nav className="mb-8 border-b border-border-subtle bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-6xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
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
          <LogoutButton />
        </div>
      </div>
    </nav>
  )
}
