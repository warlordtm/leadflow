'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { logger } from '@/lib/logger'
import { useTranslations } from '@/components/i18n-provider'

export default function AccountSettingsPage() {
  const t = useTranslations()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    try {
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
          <CardTitle>{t('settings.password')}</CardTitle>
          <CardDescription>{t('settings.passwordDesc') || 'Update your password and security preferences'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">{t('settings.currentPassword')}</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">{t('settings.newPassword')}</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t('settings.confirmNewPassword')}</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.notifications')}</CardTitle>
          <CardDescription>{t('settings.notificationsDesc') || 'Configure how you receive notifications'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">{t('settings.emailNotifications')}</Label>
              <p className="text-sm text-gray-500">{t('settings.emailNotificationsDesc') || 'Receive email notifications for new leads and follow-ups'}</p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-notifications">{t('settings.smsNotifications')}</Label>
              <p className="text-sm text-gray-500">{t('settings.smsNotificationsDesc') || 'Receive SMS for urgent follow-ups'}</p>
            </div>
            <Switch id="sms-notifications" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">{t('settings.pushNotifications')}</Label>
              <p className="text-sm text-gray-500">{t('settings.pushNotificationsDesc') || 'Receive push notifications in your browser'}</p>
            </div>
            <Switch id="push-notifications" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.sessions')}</CardTitle>
          <CardDescription>{t('settings.sessionsDesc') || 'Manage your active sessions and login activity'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t('settings.currentSession')}</p>
              <p className="text-sm text-gray-500">{t('settings.loggedInFrom')}</p>
            </div>
            <Button variant="outline" size="sm">{t('common.active') || 'Active'}</Button>
          </div>
          <div>
            <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('settings.sessionTimeout') || 'Session timeout'}
            </label>
            <select
              id="session-timeout"
              defaultValue="30"
              className="w-48 rounded-md border border-border px-2 py-1 text-sm"
            >
              <option value="15">{t('settings.timeout15') || '15 minutes'}</option>
              <option value="30">{t('settings.timeout30') || '30 minutes'}</option>
              <option value="60">{t('settings.timeout1h') || '1 hour'}</option>
              <option value="120">{t('settings.timeout2h') || '2 hours'}</option>
              <option value="480">{t('settings.timeout8h') || '8 hours'}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {saved && <span className="text-green-600 text-sm mr-4">{t('settings.savedSuccessfully')}</span>}
        <Button onClick={handleSave} disabled={loading}>
          {loading ? t('settings.saving') || 'Saving...' : t('settings.saveChanges')}
        </Button>
      </div>
    </div>
  )
}
