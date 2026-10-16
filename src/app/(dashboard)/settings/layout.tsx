'use client'

import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NavBar from '@/components/nav-bar'
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
    <div className="min-h-screen bg-background pb-12">
      <NavBar />
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
          {t('settings.title')}
        </h1>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <nav className="space-y-1">
              {settingsLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex flex-col gap-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    {t(link.labelKey)}
                    <span className="text-xs text-gray-500">{t(link.descKey)}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="col-span-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
