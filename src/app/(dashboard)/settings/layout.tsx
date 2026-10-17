'use client'

import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useTranslations } from '@/components/i18n-provider'

const settingsLinks = [
  { href: '/settings/profile', labelKey: 'settings.profile', descKey: 'settings.managePersonalInfo' },
  { href: '/settings/account', labelKey: 'settings.account', descKey: 'settings.passwordDesc' },
  { href: '/settings/appearance', labelKey: 'settings.appearance', descKey: 'settings.themeDesc' },
]

export default function SettingsLayout({ children }: { children?: ReactNode }) {
  const t = useTranslations()
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 md:pt-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-6 md:mb-8">
          {t('settings.title')}
        </h1>

        <div className="grid grid-cols-12 gap-4 md:gap-8">
          <div className="col-span-12 md:col-span-3">
            <nav className="space-y-1">
              {settingsLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex flex-col gap-1 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    {t(link.labelKey)}
                    <span className="text-xs text-gray-500 hidden md:block">{t(link.descKey)}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="col-span-12 md:col-span-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
