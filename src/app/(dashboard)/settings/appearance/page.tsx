'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { logger } from '@/lib/logger'
import { useTranslations } from '@/components/i18n-provider'

interface Settings {
  theme: 'light' | 'dark' | 'system'
  density: 'compact' | 'comfortable' | 'spacious'
  dateFormat: string
  timeFormat: string
  language: string
}

const applyTheme = (theme: Settings['theme']) => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
    root.classList.remove('light')
  } else if (theme === 'light') {
    root.classList.add('light')
    root.classList.remove('dark')
  } else {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', isDark)
    root.classList.toggle('light', !isDark)
  }
}

const applyDensity = (density: Settings['density']) => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.remove('density-compact', 'density-comfortable', 'density-spacious')
  root.classList.add(`density-${density}`)
}

const applyLanguage = (language: string) => {
  if (typeof document === 'undefined') return
  document.documentElement.lang = language
}

export default function AppearanceSettingsPage() {
  const t = useTranslations()
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    density: 'comfortable',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
    language: 'en',
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('appearance-settings')
      if (stored) {
        setSettings(JSON.parse(stored))
      }
    }
  }, [])

  const saveSettings = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('appearance-settings', JSON.stringify(settings))
      applyTheme(settings.theme)
      applyDensity(settings.density)
      applyLanguage(settings.language)
    }
    setSaved(true)
    logger.info('Appearance settings saved', { settings: JSON.stringify(settings) })
    setTimeout(() => setSaved(false), 2000)
  }, [settings])

  const handleThemeChange = (theme: Settings['theme']) => {
    setSettings(s => ({ ...s, theme }))
    applyTheme(theme)
    localStorage.setItem('appearance-settings', JSON.stringify({ ...settings, theme }))
    localStorage.setItem('theme', theme)
  }

  const handleSettingChange = (key: keyof Settings, value: string) => {
    setSettings(s => ({ ...s, [key]: value }))
    if (key === 'density') {
      applyDensity(value as Settings['density'])
    }
    if (key === 'language') {
      applyLanguage(value)
    }
    localStorage.setItem('appearance-settings', JSON.stringify({ ...settings, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.appearance')}</CardTitle>
          <CardDescription>{t('settings.themeDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">{t('settings.theme')}</Label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) => handleThemeChange(e.target.value as Settings['theme'])}
              className="w-48 rounded-md border border-border px-2 py-1 text-sm"
            >
              <option value="light">{t('dates.light')}</option>
              <option value="dark">{t('dates.dark')}</option>
              <option value="system">{t('dates.system')}</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="density">{t('settings.density')}</Label>
            <select
              id="density"
              value={settings.density}
              onChange={(e) => handleSettingChange('density', e.target.value)}
              className="w-48 rounded-md border border-border px-2 py-1 text-sm"
            >
              <option value="compact">{t('dates.compact')}</option>
              <option value="comfortable">{t('dates.comfortable')}</option>
              <option value="spacious">{t('dates.spacious')}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.dateFormat')}</CardTitle>
          <CardDescription>{t('common.simpleSecureCRM')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date-format">{t('settings.dateFormat')}</Label>
            <select
              id="date-format"
              value={settings.dateFormat}
              onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
              className="w-48 rounded-md border border-border px-2 py-1 text-sm"
            >
              <option value="MM/dd/yyyy">{t('dates.MM/dd/yyyy')}</option>
              <option value="dd/MM/yyyy">{t('dates.dd/MM/yyyy')}</option>
              <option value="yyyy-MM-dd">{t('dates.yyyy-MM-dd')}</option>
              <option value="MMM dd, yyyy">{t('dates.MMM dd, yyyy')}</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-format">{t('settings.timeFormat')}</Label>
            <select
              id="time-format"
              value={settings.timeFormat}
              onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
              className="w-48 rounded-md border border-border px-2 py-1 text-sm"
            >
              <option value="12h">{t('dates.12h')}</option>
              <option value="24h">{t('dates.24h')}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.language')}</CardTitle>
          <CardDescription>{t('settings.languageDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="language">{t('settings.language')}</Label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-48 rounded-md border border-border px-2 py-1 text-sm"
            >
              <option value="en">{t('dates.english')}</option>
              <option value="es">{t('dates.spanish')}</option>
              <option value="fr">{t('dates.french')}</option>
              <option value="de">{t('dates.german')}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {saved && <span className="text-green-600 text-sm mr-4">{t('settings.savedSuccessfully')}</span>}
        <Button onClick={saveSettings}>
          {t('settings.savePreferences')}
        </Button>
      </div>
    </div>
  )
}
