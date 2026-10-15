'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { logger } from '@/lib/logger'

export default function AppearanceSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    theme: 'light',
    density: 'comfortable',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('appearance-settings')
      if (stored) {
        setSettings(JSON.parse(stored))
      }
    }
  }, [])

  const saveSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('appearance-settings', JSON.stringify(settings))
    }
    setSaved(true)
    logger.info('Appearance settings saved', settings)
    setTimeout(() => setSaved(false), 2000)
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
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
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
              onChange={(e) => setSettings({ ...settings, density: e.target.value })}
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
              onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
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
              onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value })}
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
              defaultValue="en"
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
