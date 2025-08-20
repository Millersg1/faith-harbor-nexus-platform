import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Key, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TwoFactorAuthProps {
  userId: string;
}

export const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ userId }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [setupData, setSetupData] = useState<{
    secret: string;
    qrCodeUrl: string;
    backupCodes: string[];
  } | null>(null);
  const [verificationToken, setVerificationToken] = useState('');
  const [copiedBackup, setCopiedBackup] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkTwoFactorStatus();
  }, [userId]);

  const checkTwoFactorStatus = async () => {
    try {
      const { data } = await supabase
        .from('user_two_factor')
        .select('is_enabled')
        .eq('user_id', userId)
        .single();
      
      setIsEnabled(data?.is_enabled || false);
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    }
  };

  const setupTwoFactor = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('two-factor-auth', {
        body: { action: 'setup' }
      });

      if (error) throw error;

      setSetupData(data);
      toast({
        title: "2FA Setup Started",
        description: "Scan the QR code with your authenticator app",
      });
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (!verificationToken || !setupData) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('two-factor-auth', {
        body: { action: 'verify', token: verificationToken }
      });

      if (error) throw error;

      setIsEnabled(true);
      setSetupData(null);
      setVerificationToken('');
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication is now active",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disableTwoFactor = async () => {
    if (!confirm('Are you sure you want to disable two-factor authentication?')) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('two-factor-auth', {
        body: { action: 'disable' }
      });

      if (error) throw error;

      setIsEnabled(false);
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled",
      });
    } catch (error) {
      toast({
        title: "Disable Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyBackupCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedBackup(code);
    setTimeout(() => setCopiedBackup(null), 2000);
    toast({
      title: "Copied",
      description: "Backup code copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Status</p>
            <p className="text-sm text-muted-foreground">
              {isEnabled ? 'Enabled and protecting your account' : 'Not enabled'}
            </p>
          </div>
          <Badge variant={isEnabled ? 'default' : 'secondary'}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>

        {!isEnabled && !setupData && (
          <div className="space-y-4">
            <Alert>
              <Key className="h-4 w-4" />
              <AlertDescription>
                Two-factor authentication adds an extra layer of security by requiring a code from your phone in addition to your password.
              </AlertDescription>
            </Alert>
            <Button onClick={setupTwoFactor} disabled={isLoading}>
              {isLoading ? 'Setting up...' : 'Enable Two-Factor Authentication'}
            </Button>
          </div>
        )}

        {setupData && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                1. Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                <br />
                2. Enter the 6-digit code from your app to verify setup
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Manual Entry Key (if QR code doesn't work)</Label>
              <div className="font-mono text-sm bg-muted p-2 rounded">
                {setupData.secret}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification-token">Verification Code</Label>
              <Input
                id="verification-token"
                placeholder="Enter 6-digit code"
                value={verificationToken}
                onChange={(e) => setVerificationToken(e.target.value)}
                maxLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label>Backup Codes (Save these in a secure location)</Label>
              <div className="grid grid-cols-2 gap-2">
                {setupData.backupCodes.map((code, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded text-sm font-mono">
                    <span>{code}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyBackupCode(code)}
                    >
                      {copiedBackup === code ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={verifyAndEnable} 
                disabled={!verificationToken || verificationToken.length !== 6 || isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify and Enable'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSetupData(null)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isEnabled && (
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your account is protected with two-factor authentication. You'll need to enter a code from your authenticator app when signing in.
              </AlertDescription>
            </Alert>
            <Button variant="destructive" onClick={disableTwoFactor} disabled={isLoading}>
              {isLoading ? 'Disabling...' : 'Disable Two-Factor Authentication'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};