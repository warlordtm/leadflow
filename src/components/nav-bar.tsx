'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import LogoutButton from '@/components/logout-button'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/leads', label: 'Leads' },
  { href: '/follow-ups', label: 'Follow-ups' },
  { href: '/settings/profile', label: 'Settings' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="mb-8 border-b border-border-subtle bg-white/80 backdrop-blur-sm">
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
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 w-full rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}
          </div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  )
}
