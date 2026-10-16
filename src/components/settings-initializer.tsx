'use client'

import { useEffect } from 'react'

export default function SettingsInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('appearance-settings')
      if (stored) {
        try {
          const settings = JSON.parse(stored)

          // Apply theme
          if (settings.theme) {
            const root = document.documentElement
            if (settings.theme === 'dark') {
              root.classList.add('dark')
              root.classList.remove('light')
            } else if (settings.theme === 'light') {
              root.classList.add('light')
              root.classList.remove('dark')
            } else if (settings.theme === 'system') {
              const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
              root.classList.toggle('dark', isDark)
              root.classList.toggle('light', !isDark)
            }
          }

          // Apply density
          if (settings.density) {
            const root = document.documentElement
            root.classList.remove('density-compact', 'density-comfortable', 'density-spacious')
            root.classList.add(`density-${settings.density}`)
          }
        } catch (e) {
          console.error('Failed to load appearance settings:', e)
        }
      }

      // Also check for standalone theme preference
      const theme = localStorage.getItem('theme')
      if (theme && !stored) {
        const root = document.documentElement
        root.classList.toggle('dark', theme === 'dark')
        root.classList.toggle('light', theme !== 'dark')
      }
    }
  }, [])

  return <>{children}</>
}
