export const locale = {
  name: 'English',
  code: 'en',
  direction: 'ltr' as const,
}

export const locales = {
  en: locale,
  es: { name: 'Español', code: 'es', direction: 'ltr' as const },
  fr: { name: 'Français', code: 'fr', direction: 'ltr' as const },
  de: { name: 'Deutsch', code: 'de', direction: 'ltr' as const },
}

export type Locale = keyof typeof locales

export const defaultLocale: Locale = 'en'

export const localePrefix = 'always'

export const pathnames = {
  '/': '/',
  '/login': '/login',
  '/register': '/register',
  '/dashboard': '/dashboard',
  '/admin': '/admin',
  '/follow-ups': '/follow-ups',
  '/leads': '/leads',
  '/leads/new': '/leads/new',
  '/leads/[id]': '/leads/[id]',
  '/settings': '/settings',
  '/settings/account': '/settings/account',
  '/settings/appearance': '/settings/appearance',
  '/settings/profile': '/settings/profile',
  '/api/dashboard': '/api/dashboard',
  '/api/follow-ups': '/api/follow-ups',
  '/api/follow-ups/[id]': '/api/follow-ups/[id]',
  '/api/leads': '/api/leads',
  '/api/leads/[id]': '/api/leads/[id]',
  '/api/admin/users': '/api/admin/users',
  '/api/admin/users/[id]': '/api/admin/users/[id]',
  '/api/auth/[...nextauth]': '/api/auth/[...nextauth]',
  '/api/register': '/api/register',
}
