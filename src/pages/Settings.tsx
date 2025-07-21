import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthenticatedNavigation from "@/components/AuthenticatedNavigation";
import { APIKeyManager } from "@/components/APIKeyManager";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Settings as SettingsIcon, 
  Palette, 
  Phone, 
  Mail, 
  Globe, 
  MessageSquare,
  Upload,
  Save,
  Eye,
  Smartphone,
  Shield,
  Key
} from "lucide-react";

interface BrandingSettings {
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  font_family?: string;
  custom_css?: string;
  organization_name?: string;
  tagline?: string;
  favicon_url?: string;
}

interface CommunicationSettings {
  twilio_account_sid?: string;
  twilio_auth_token?: string;
  twilio_phone_number?: string;
  smtp_host?: string;
  smtp_port?: string;
  smtp_username?: string;
  smtp_password?: string;
  email_from_address?: string;
  email_from_name?: string;
}

interface GeneralSettings {
  allow_public_registration?: boolean;
  require_email_verification?: boolean;
  enable_two_factor?: boolean;
  maintenance_mode?: boolean;
  analytics_enabled?: boolean;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
}

export default function Settings() {
  const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>({});
  const [commSettings, setCommSettings] = useState<CommunicationSettings>({});
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({});
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top when component loads
    window.scrollTo(0, 0);
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // In a real implementation, you'd load from your settings table
    // For now, we'll use localStorage as a demo
    const savedBranding = localStorage.getItem('branding_settings');
    const savedComm = localStorage.getItem('communication_settings');
    const savedGeneral = localStorage.getItem('general_settings');

    if (savedBranding) setBrandingSettings(JSON.parse(savedBranding));
    if (savedComm) setCommSettings(JSON.parse(savedComm));
    if (savedGeneral) setGeneralSettings(JSON.parse(savedGeneral));
  };

  const handleSaveBranding = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, save to Supabase
      localStorage.setItem('branding_settings', JSON.stringify(brandingSettings));
      
      toast({
        title: "Success",
        description: "Branding settings saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save branding settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCommunication = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('communication_settings', JSON.stringify(commSettings));
      
      toast({
        title: "Success",
        description: "Communication settings saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save communication settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGeneral = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('general_settings', JSON.stringify(generalSettings));
      
      toast({
        title: "Success",
        description: "General settings saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to save general settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Configure your Faith Harbor system</p>
            </div>
          </div>

          <Tabs defaultValue="branding" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="branding" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                White Label
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Communication
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email System
              </TabsTrigger>
              <TabsTrigger value="api-keys" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                General
              </TabsTrigger>
            </TabsList>

            {/* White Label Settings */}
            <TabsContent value="branding" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary" />
                        White Label & Branding
                      </CardTitle>
                      <CardDescription>
                        Customize the look and feel of your Faith Harbor system
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewMode(!previewMode)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {previewMode ? 'Edit' : 'Preview'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="org-name">Organization Name</Label>
                        <Input
                          id="org-name"
                          value={brandingSettings.organization_name || ''}
                          onChange={(e) => setBrandingSettings({...brandingSettings, organization_name: e.target.value})}
                          placeholder="Your Church Name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                          id="tagline"
                          value={brandingSettings.tagline || ''}
                          onChange={(e) => setBrandingSettings({...brandingSettings, tagline: e.target.value})}
                          placeholder="Your Church Motto"
                        />
                      </div>

                      <div>
                        <Label htmlFor="primary-color">Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="primary-color"
                            type="color"
                            value={brandingSettings.primary_color || '#3B82F6'}
                            onChange={(e) => setBrandingSettings({...brandingSettings, primary_color: e.target.value})}
                            className="w-20"
                          />
                          <Input
                            value={brandingSettings.primary_color || '#3B82F6'}
                            onChange={(e) => setBrandingSettings({...brandingSettings, primary_color: e.target.value})}
                            placeholder="#3B82F6"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="secondary-color">Secondary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="secondary-color"
                            type="color"
                            value={brandingSettings.secondary_color || '#6366F1'}
                            onChange={(e) => setBrandingSettings({...brandingSettings, secondary_color: e.target.value})}
                            className="w-20"
                          />
                          <Input
                            value={brandingSettings.secondary_color || '#6366F1'}
                            onChange={(e) => setBrandingSettings({...brandingSettings, secondary_color: e.target.value})}
                            placeholder="#6366F1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="logo-url">Logo URL</Label>
                        <div className="flex gap-2">
                          <Input
                            id="logo-url"
                            value={brandingSettings.logo_url || ''}
                            onChange={(e) => setBrandingSettings({...brandingSettings, logo_url: e.target.value})}
                            placeholder="https://example.com/logo.png"
                          />
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="favicon-url">Favicon URL</Label>
                        <div className="flex gap-2">
                          <Input
                            id="favicon-url"
                            value={brandingSettings.favicon_url || ''}
                            onChange={(e) => setBrandingSettings({...brandingSettings, favicon_url: e.target.value})}
                            placeholder="https://example.com/favicon.ico"
                          />
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="font-family">Font Family</Label>
                        <Input
                          id="font-family"
                          value={brandingSettings.font_family || ''}
                          onChange={(e) => setBrandingSettings({...brandingSettings, font_family: e.target.value})}
                          placeholder="Inter, system-ui, sans-serif"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="custom-css">Custom CSS</Label>
                    <Textarea
                      id="custom-css"
                      rows={6}
                      value={brandingSettings.custom_css || ''}
                      onChange={(e) => setBrandingSettings({...brandingSettings, custom_css: e.target.value})}
                      placeholder="/* Add your custom CSS here */"
                      className="font-mono text-sm"
                    />
                  </div>

                  <Button onClick={handleSaveBranding} disabled={isLoading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Branding Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Communication Settings */}
            <TabsContent value="communication" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Phone & SMS Setup (Twilio)
                  </CardTitle>
                  <CardDescription>
                    Configure Twilio for phone calls and SMS messaging
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="twilio-sid">Account SID</Label>
                    <Input
                      id="twilio-sid"
                      type="password"
                      value={commSettings.twilio_account_sid || ''}
                      onChange={(e) => setCommSettings({...commSettings, twilio_account_sid: e.target.value})}
                      placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                  </div>

                  <div>
                    <Label htmlFor="twilio-token">Auth Token</Label>
                    <Input
                      id="twilio-token"
                      type="password"
                      value={commSettings.twilio_auth_token || ''}
                      onChange={(e) => setCommSettings({...commSettings, twilio_auth_token: e.target.value})}
                      placeholder="Your Twilio Auth Token"
                    />
                  </div>

                  <div>
                    <Label htmlFor="twilio-phone">Phone Number</Label>
                    <Input
                      id="twilio-phone"
                      value={commSettings.twilio_phone_number || ''}
                      onChange={(e) => setCommSettings({...commSettings, twilio_phone_number: e.target.value})}
                      placeholder="+1234567890"
                    />
                  </div>

                  <Button onClick={handleSaveCommunication} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Communication Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Communication Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-semibold">Emergency Broadcast</div>
                      <div className="text-sm text-muted-foreground">Send urgent messages</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-semibold">Robo Calling</div>
                      <div className="text-sm text-muted-foreground">Automated phone calls</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-semibold">SMS Campaigns</div>
                      <div className="text-sm text-muted-foreground">Text message marketing</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-semibold">Voice Cloning</div>
                      <div className="text-sm text-muted-foreground">AI voice messages</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email System */}
            <TabsContent value="email" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Email Configuration (SMTP)
                  </CardTitle>
                  <CardDescription>
                    Configure your email server settings for transactional and marketing emails
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtp-host">SMTP Host</Label>
                      <Input
                        id="smtp-host"
                        value={commSettings.smtp_host || ''}
                        onChange={(e) => setCommSettings({...commSettings, smtp_host: e.target.value})}
                        placeholder="smtp.gmail.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="smtp-port">SMTP Port</Label>
                      <Input
                        id="smtp-port"
                        value={commSettings.smtp_port || ''}
                        onChange={(e) => setCommSettings({...commSettings, smtp_port: e.target.value})}
                        placeholder="587"
                      />
                    </div>

                    <div>
                      <Label htmlFor="smtp-username">Username</Label>
                      <Input
                        id="smtp-username"
                        value={commSettings.smtp_username || ''}
                        onChange={(e) => setCommSettings({...commSettings, smtp_username: e.target.value})}
                        placeholder="your-email@domain.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="smtp-password">Password</Label>
                      <Input
                        id="smtp-password"
                        type="password"
                        value={commSettings.smtp_password || ''}
                        onChange={(e) => setCommSettings({...commSettings, smtp_password: e.target.value})}
                        placeholder="Your email password"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email-from-address">From Email Address</Label>
                      <Input
                        id="email-from-address"
                        value={commSettings.email_from_address || ''}
                        onChange={(e) => setCommSettings({...commSettings, email_from_address: e.target.value})}
                        placeholder="noreply@yourchurch.org"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email-from-name">From Name</Label>
                      <Input
                        id="email-from-name"
                        value={commSettings.email_from_name || ''}
                        onChange={(e) => setCommSettings({...commSettings, email_from_name: e.target.value})}
                        placeholder="Your Church Name"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveCommunication} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Email Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Email Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-semibold">Email Marketing</div>
                      <div className="text-sm text-muted-foreground">Create newsletters & campaigns</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-semibold">Event Notifications</div>
                      <div className="text-sm text-muted-foreground">Automated event emails</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-semibold">Welcome Series</div>
                      <div className="text-sm text-muted-foreground">New member onboarding</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-semibold">Prayer Requests</div>
                      <div className="text-sm text-muted-foreground">Prayer email notifications</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Keys Settings */}
            <TabsContent value="api-keys" className="space-y-6">
              <APIKeyManager />
            </TabsContent>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    General Settings
                  </CardTitle>
                  <CardDescription>
                    Configure general system settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Public Registration</Label>
                        <p className="text-sm text-muted-foreground">Allow new users to register</p>
                      </div>
                      <Switch
                        checked={generalSettings.allow_public_registration || false}
                        onCheckedChange={(checked) => setGeneralSettings({...generalSettings, allow_public_registration: checked})}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Verification</Label>
                        <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                      </div>
                      <Switch
                        checked={generalSettings.require_email_verification || false}
                        onCheckedChange={(checked) => setGeneralSettings({...generalSettings, require_email_verification: checked})}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Enable 2FA for enhanced security</p>
                      </div>
                      <Switch
                        checked={generalSettings.enable_two_factor || false}
                        onCheckedChange={(checked) => setGeneralSettings({...generalSettings, enable_two_factor: checked})}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Analytics</Label>
                        <p className="text-sm text-muted-foreground">Enable usage analytics and tracking</p>
                      </div>
                      <Switch
                        checked={generalSettings.analytics_enabled || false}
                        onCheckedChange={(checked) => setGeneralSettings({...generalSettings, analytics_enabled: checked})}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-email">Contact Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={generalSettings.contact_email || ''}
                        onChange={(e) => setGeneralSettings({...generalSettings, contact_email: e.target.value})}
                        placeholder="info@yourchurch.org"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact-phone">Contact Phone</Label>
                      <Input
                        id="contact-phone"
                        value={generalSettings.contact_phone || ''}
                        onChange={(e) => setGeneralSettings({...generalSettings, contact_phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Church Address</Label>
                    <Textarea
                      id="address"
                      rows={3}
                      value={generalSettings.address || ''}
                      onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                      placeholder="123 Main Street&#10;Your City, State 12345&#10;United States"
                    />
                  </div>

                  <Button onClick={handleSaveGeneral} disabled={isLoading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save General Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}