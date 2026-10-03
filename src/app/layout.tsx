import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SessionProvider from '@/components/providers/session-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lead & Client Follow-Up CRM',
  description: 'Stop losing leads because you forgot to follow up.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
