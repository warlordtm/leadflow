'use client'

import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NavBar from '@/components/nav-bar'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'

const settingsLinks = [
  { href: '/settings/profile', label: 'Profile', desc: 'Manage your personal information' },
  { href: '/settings/account', label: 'Account', desc: 'Password, security, and notifications' },
  { href: '/settings/appearance', label: 'Appearance', desc: 'Theme and display preferences' },
]

export default function SettingsLayout({ children }: { children?: ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    const path = pathname.split('/').pop()
    if (path && settingsLinks.some(l => l.href.endsWith(path))) {
      setActiveTab(path)
    }
  }, [pathname])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('appearance-settings')
      if (stored) {
        const settings = JSON.parse(stored)
        if (settings.theme && typeof document !== 'undefined') {
          const root = document.documentElement
          if (settings.theme === 'dark') {
            root.classList.add('dark')
            root.classList.remove('light')
          } else if (settings.theme === 'light') {
            root.classList.add('light')
            root.classList.remove('dark')
          } else {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            root.classList.toggle('dark', isDark)
            root.classList.toggle('light', !isDark)
          }
        }
        if (settings.density && typeof document !== 'undefined') {
          const root = document.documentElement
          root.classList.remove('density-compact', 'density-comfortable', 'density-spacious')
          root.classList.add(`density-${settings.density}`)
        }
        if (settings.language) {
          document.documentElement.lang = settings.language
        }
      }
    }
  }, [])

  useEffect(() => {
    if (!session?.user) {
      // Redirect handled by middleware
    }
  }, [session])

  return (
    <div className="min-h-screen bg-background pb-12">
      <NavBar />
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
          Settings
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
                    {link.label}
                    <span className="text-xs text-gray-500">{link.desc}</span>
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
