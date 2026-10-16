'use client'

import { useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import NavBar from '@/components/nav-bar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname === '/') {
      router.replace('/dashboard')
    }
  }, [pathname, router])

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>
      <main className="pb-12">{children}</main>
    </div>
  )
}
