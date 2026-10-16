'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { logger } from '@/lib/logger'
import { useTranslations } from '@/components/i18n-provider'

interface SessionData {
  id: string
  sessionToken: string
  expires: string
  userId: string
}

export default function AccountSettingsPage() {
  const t = useTranslations()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [sessionTimeout, setSessionTimeout] = useState('30')
  const [revoking, setRevoking] = useState<string | null>(null)

  useEffect(() => {
    const storedTimeout = localStorage.getItem('session-timeout')
    if (storedTimeout) {
      setSessionTimeout(storedTimeout)
    }
  }, [])

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/sessions')
      if (res.ok) {
        const data = await res.json()
        setSessions(data.sessions || [])
      }
    } catch (e) {
      logger.error('Failed to load sessions', { error: String(e) })
    }
  }, [])

  const revokeSession = async (sessionId: string) => {
    setRevoking(sessionId)
    try {
      const res = await fetch('/api/auth/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      if (res.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId))
        logger.info('Session revoked', { sessionId })
      }
    } catch (e) {
      logger.error('Failed to revoke session', { error: String(e) })
    } finally {
      setRevoking(null)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to change password')
      }

      setSaved(true)
      logger.info('Account settings saved')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (e) {
      logger.error('Failed to save settings', { error: String(e) })
      alert(e instanceof Error ? e.message : 'Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const handleTimeoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSessionTimeout(value)
    localStorage.setItem('session-timeout', value)
  }

  const getDeviceInfo = (session: SessionData) => {
    const token = session.sessionToken
    if (token.startsWith('eyJ')) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload?.device || 'Unknown Device'
      } catch {
        return 'Unknown Device'
      }
    }
    return 'Unknown Device'
  }

  const getLastActive = (session: SessionData) => {
    const token = session.sessionToken
    if (token.startsWith('eyJ')) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload?.iat ? new Date(payload.iat * 1000).toLocaleString() : 'Unknown'
      } catch {
        return 'Unknown'
      }
    }
    return 'Unknown'
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
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">{t('settings.newPassword')}</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t('settings.confirmNewPassword')}</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
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
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              defaultChecked
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-notifications">{t('settings.smsNotifications')}</Label>
              <p className="text-sm text-gray-500">{t('settings.smsNotificationsDesc') || 'Receive SMS for urgent follow-ups'}</p>
            </div>
            <Switch
              id="sms-notifications"
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">{t('settings.pushNotifications')}</Label>
              <p className="text-sm text-gray-500">{t('settings.pushNotificationsDesc') || 'Receive push notifications in your browser'}</p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
              defaultChecked
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.sessions')}</CardTitle>
          <CardDescription>{t('settings.sessionsDesc') || 'Manage your active sessions and login activity'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('settings.sessionTimeout') || 'Session timeout'}
            </label>
            <select
              id="session-timeout"
              value={sessionTimeout}
              onChange={handleTimeoutChange}
              className="w-48 rounded-md border border-border px-2 py-1 text-sm"
            >
              <option value="15">{t('settings.timeout15') || '15 minutes'}</option>
              <option value="30">{t('settings.timeout30') || '30 minutes'}</option>
              <option value="60">{t('settings.timeout1h') || '1 hour'}</option>
              <option value="120">{t('settings.timeout2h') || '2 hours'}</option>
              <option value="480">{t('settings.timeout8h') || '8 hours'}</option>
            </select>
          </div>

          <div className="mt-6 border-t pt-4">
            <p className="text-sm font-medium text-gray-900 mb-3">{t('settings.currentSession')}</p>
            {sessions.length === 0 ? (
              <p className="text-sm text-gray-500">No active sessions found.</p>
            ) : (
              <div className="space-y-2">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-900">{getDeviceInfo(s)}</p>
                        <p className="text-xs text-gray-500">{t('settings.lastActive')} {getLastActive(s)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          new Date(s.expires) > new Date()
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {new Date(s.expires) > new Date() ? t('settings.active') : t('settings.expired')}
                      </span>
                      <button
                        onClick={() => revokeSession(s.id)}
                        disabled={revoking === s.id}
                        className="text-xs text-red-600 hover:text-red-800 underline"
                      >
                        {revoking === s.id ? t('settings.revoking') : t('settings.revoke')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
