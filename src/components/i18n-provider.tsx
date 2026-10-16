'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getTranslation, locales, defaultLocale, type Locale } from '@/lib/i18n'

type TranslationContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function I18nProvider({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = currentLocale
      document.documentElement.dir = locales[currentLocale]?.direction || 'ltr'

      const stored = localStorage.getItem('appearance-settings')
      if (stored) {
        try {
          const settings = JSON.parse(stored)
          if (settings.language && settings.language !== currentLocale) {
            setCurrentLocale(settings.language as Locale)
          }
        } catch {
          // ignore
        }
      }
    }
  }, [currentLocale])

  const setLocale = useCallback((newLocale: Locale) => {
    setCurrentLocale(newLocale)
    if (typeof window !== 'undefined') {
      document.documentElement.lang = newLocale
      document.documentElement.dir = locales[newLocale]?.direction || 'ltr'

      const stored = localStorage.getItem('appearance-settings')
      if (stored) {
        try {
          const settings = JSON.parse(stored)
          localStorage.setItem(
            'appearance-settings',
            JSON.stringify({ ...settings, language: newLocale })
          )
        } catch {
          localStorage.setItem('appearance-settings', JSON.stringify({ language: newLocale }))
        }
      }
    }
  }, [])

  const t = useCallback(
    (key: string) => getTranslation(currentLocale, key),
    [currentLocale]
  )

  return (
    <TranslationContext.Provider value={{ locale: currentLocale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslations() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslations must be used within an I18nProvider')
  }
  return context.t
}

export function useLocale() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useLocale must be used within an I18nProvider')
  }
  return context
}
