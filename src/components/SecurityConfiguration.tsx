import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Info,
  Key,
  Clock,
  Lock,
  Eye,
  Server
} from 'lucide-react';
import { toast } from 'sonner';

interface SecuritySettings {
  twoFactorRequired: boolean;
  sessionTimeout: number;
  passwordMinLength: number;
  passwordRequireSpecialChars: boolean;
  rateLimitEnabled: boolean;
  rateLimitRequests: number;
  rateLimitWindow: number;
  auditLoggingEnabled: boolean;
  failedLoginLockout: boolean;
  failedLoginAttempts: number;
  ipWhitelisting: boolean;
  allowedIPs: string[];
}

export const SecurityConfiguration: React.FC = () => {
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorRequired: false,
    sessionTimeout: 1440, // 24 hours in minutes
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    rateLimitEnabled: true,
    rateLimitRequests: 100,
    rateLimitWindow: 60, // minutes
    auditLoggingEnabled: true,
    failedLoginLockout: true,
    failedLoginAttempts: 5,
    ipWhitelisting: false,
    allowedIPs: []
  });

  const [newIP, setNewIP] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Here you would save the settings to your backend
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Security settings saved successfully');
    } catch (error) {
      toast.error('Failed to save security settings');
    } finally {
      setIsSaving(false);
    }
  };

  const addIPAddress = () => {
    if (newIP && !settings.allowedIPs.includes(newIP)) {
      setSettings(prev => ({
        ...prev,
        allowedIPs: [...prev.allowedIPs, newIP]
      }));
      setNewIP('');
    }
  };

  const removeIPAddress = (ip: string) => {
    setSettings(prev => ({
      ...prev,
      allowedIPs: prev.allowedIPs.filter(addr => addr !== ip)
    }));
  };

  const updateSetting = (key: keyof SecuritySettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Authentication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Authentication Security
          </CardTitle>
          <CardDescription>
            Configure authentication and password requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="2fa-required" className="text-base">
                Require Two-Factor Authentication
              </Label>
              <p className="text-sm text-muted-foreground">
                Force all users to enable 2FA for their accounts
              </p>
            </div>
            <Switch
              id="2fa-required"
              checked={settings.twoFactorRequired}
              onCheckedChange={(checked) => updateSetting('twoFactorRequired', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value) || 1440)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-length">Minimum Password Length</Label>
              <Input
                id="password-length"
                type="number"
                min="6"
                max="32"
                value={settings.passwordMinLength}
                onChange={(e) => updateSetting('passwordMinLength', parseInt(e.target.value) || 8)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="special-chars" className="text-base">
                Require Special Characters
              </Label>
              <p className="text-sm text-muted-foreground">
                Passwords must contain special characters (!@#$%^&*)
              </p>
            </div>
            <Switch
              id="special-chars"
              checked={settings.passwordRequireSpecialChars}
              onCheckedChange={(checked) => updateSetting('passwordRequireSpecialChars', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Access Control
          </CardTitle>
          <CardDescription>
            Manage rate limiting and access restrictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="rate-limiting" className="text-base">
                Enable Rate Limiting
              </Label>
              <p className="text-sm text-muted-foreground">
                Limit the number of requests per user to prevent abuse
              </p>
            </div>
            <Switch
              id="rate-limiting"
              checked={settings.rateLimitEnabled}
              onCheckedChange={(checked) => updateSetting('rateLimitEnabled', checked)}
            />
          </div>

          {settings.rateLimitEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
              <div className="space-y-2">
                <Label htmlFor="rate-requests">Max Requests</Label>
                <Input
                  id="rate-requests"
                  type="number"
                  value={settings.rateLimitRequests}
                  onChange={(e) => updateSetting('rateLimitRequests', parseInt(e.target.value) || 100)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate-window">Time Window (minutes)</Label>
                <Input
                  id="rate-window"
                  type="number"
                  value={settings.rateLimitWindow}
                  onChange={(e) => updateSetting('rateLimitWindow', parseInt(e.target.value) || 60)}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="failed-login-lockout" className="text-base">
                Failed Login Lockout
              </Label>
              <p className="text-sm text-muted-foreground">
                Temporarily lock accounts after multiple failed login attempts
              </p>
            </div>
            <Switch
              id="failed-login-lockout"
              checked={settings.failedLoginLockout}
              onCheckedChange={(checked) => updateSetting('failedLoginLockout', checked)}
            />
          </div>

          {settings.failedLoginLockout && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="failed-attempts">Max Failed Attempts</Label>
              <Input
                id="failed-attempts"
                type="number"
                min="3"
                max="10"
                value={settings.failedLoginAttempts}
                onChange={(e) => updateSetting('failedLoginAttempts', parseInt(e.target.value) || 5)}
                className="w-32"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* IP Whitelisting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            IP Access Control
          </CardTitle>
          <CardDescription>
            Restrict access to specific IP addresses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ip-whitelisting" className="text-base">
                Enable IP Whitelisting
              </Label>
              <p className="text-sm text-muted-foreground">
                Only allow access from specified IP addresses
              </p>
            </div>
            <Switch
              id="ip-whitelisting"
              checked={settings.ipWhitelisting}
              onCheckedChange={(checked) => updateSetting('ipWhitelisting', checked)}
            />
          </div>

          {settings.ipWhitelisting && (
            <div className="ml-6 space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> Enabling IP whitelisting will block access from all other IP addresses. 
                  Make sure to add your current IP before saving.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Input
                  placeholder="Enter IP address (e.g., 192.168.1.1)"
                  value={newIP}
                  onChange={(e) => setNewIP(e.target.value)}
                />
                <Button onClick={addIPAddress} variant="outline">
                  Add IP
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Allowed IP Addresses</Label>
                {settings.allowedIPs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No IP addresses configured</p>
                ) : (
                  <div className="space-y-2">
                    {settings.allowedIPs.map((ip, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="font-mono text-sm">{ip}</span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => removeIPAddress(ip)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monitoring & Logging */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Monitoring & Logging
          </CardTitle>
          <CardDescription>
            Configure security monitoring and audit logging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="audit-logging" className="text-base">
                Enable Audit Logging
              </Label>
              <p className="text-sm text-muted-foreground">
                Log all user actions and system events for security auditing
              </p>
            </div>
            <Switch
              id="audit-logging"
              checked={settings.auditLoggingEnabled}
              onCheckedChange={(checked) => updateSetting('auditLoggingEnabled', checked)}
            />
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Audit logs include login attempts, data access, administrative actions, and system changes. 
              These logs are essential for compliance and security investigations.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Security Settings'}
        </Button>
      </div>
    </div>
  );
};