import enMessages from '@/messages/en'
import esMessages from '@/messages/es'
import frMessages from '@/messages/fr'
import deMessages from '@/messages/de'

export type Locale = 'en' | 'es' | 'fr' | 'de'

export const locales: Record<Locale, { name: string; code: string; direction: 'ltr' | 'rtl' }> = {
  en: { name: 'English', code: 'en', direction: 'ltr' },
  es: { name: 'Español', code: 'es', direction: 'ltr' },
  fr: { name: 'Français', code: 'fr', direction: 'ltr' },
  de: { name: 'Deutsch', code: 'de', direction: 'ltr' },
}

export const defaultLocale: Locale = 'en'

const messages: Record<Locale, Record<string, unknown>> = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
}

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.')
  let value: any = messages[locale]

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      let fallback: any = messages['en']
      for (const fk of keys) {
        if (fallback && typeof fallback === 'object' && fk in fallback) {
          fallback = fallback[fk]
        } else {
          return key
        }
      }
      return fallback
    }
  }

  return typeof value === 'string' ? value : key
}
