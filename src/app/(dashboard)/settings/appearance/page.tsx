'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { logger } from '@/lib/logger'

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
    // system preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', isDark)
    root.classList.toggle('light', !isDark)
  }
}

export default function AppearanceSettingsPage() {
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
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose how the app looks and feels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Color Theme</Label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) => handleThemeChange(e.target.value as Settings['theme'])}
              className="w-48 rounded-md border border-border px-2 py-1 text-sm"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="density">Density</Label>
            <select
              id="density"
              value={settings.density}
              onChange={(e) => handleSettingChange('density', e.target.value)}
              className="w-48 rounded-md border border-border px-2 py-1 text-sm"
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Date & Time Format</CardTitle>
          <CardDescription>Configure how dates and times are displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date-format">Date Format</Label>
            <select
              id="date-format"
              value={settings.dateFormat}
              onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
              className="w-48 rounded-md border border-border px-2 py-1 text-sm"
            >
              <option value="MM/dd/yyyy">MM/DD/YYYY</option>
              <option value="dd/MM/yyyy">DD/MM/YYYY</option>
              <option value="yyyy-MM-dd">YYYY-MM-DD</option>
              <option value="MMM dd, yyyy">MMM DD, YYYY</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-format">Time Format</Label>
            <select
              id="time-format"
              value={settings.timeFormat}
              onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
              className="w-48 rounded-md border border-border px-2 py-1 text-sm"
            >
              <option value="12h">12-hour (e.g. 2:30 PM)</option>
              <option value="24h">24-hour (e.g. 14:30)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <CardDescription>Set your preferred language</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-48 rounded-md border border-border px-2 py-1 text-sm"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {saved && <span className="text-green-600 text-sm mr-4">Saved successfully!</span>}
        <Button onClick={saveSettings}>
          Save Preferences
        </Button>
      </div>
    </div>
  )
}
