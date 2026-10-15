'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { logger } from '@/lib/logger'

export default function AccountSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    try {
      // Simulate save
      await new Promise(r => setTimeout(r, 500))
      setSaved(true)
      logger.info('Account settings saved')
    } catch (e) {
      logger.error('Failed to save settings', { error: String(e) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password & Security</CardTitle>
          <CardDescription>Update your password and security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive email notifications for new leads and follow-ups</p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <p className="text-sm text-gray-500">Receive SMS for urgent follow-ups</p>
            </div>
            <Switch id="sms-notifications" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
            </div>
            <Switch id="push-notifications" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
          <CardDescription>Manage your active sessions and login activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Session</p>
              <p className="text-sm text-gray-500">Logged in from this browser</p>
            </div>
            <Button variant="outline" size="sm">Active</Button>
          </div>
          <div>
            <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-700 mb-1.5">
              Session timeout
            </label>
            <select
              id="session-timeout"
              defaultValue="30"
              className="w-48 rounded-md border border-border px-2 py-1 text-sm"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="480">8 hours</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {saved && <span className="text-green-600 text-sm mr-4">Saved successfully!</span>}
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
