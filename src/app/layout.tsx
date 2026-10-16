import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SessionProvider from '@/components/providers/session-provider'
import SettingsInitializer from '@/components/settings-initializer'
import { I18nProvider } from '@/components/i18n-provider'
import { defaultLocale } from '@/lib/i18n'

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
    <html lang={defaultLocale} dir="ltr">
      <body className={inter.className} suppressHydrationWarning={true}>
        <SessionProvider>
          <SettingsInitializer>
            <I18nProvider locale={defaultLocale}>{children}</I18nProvider>
          </SettingsInitializer>
        </SessionProvider>
      </body>
    </html>
  )
}
