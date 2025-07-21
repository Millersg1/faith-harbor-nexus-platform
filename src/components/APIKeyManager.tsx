import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, EyeOff, Plus, Edit, Key } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface APIKey {
  id: string;
  service_name: string;
  service_label: string;
  is_active: boolean;
  created_at: string;
}

const SUPPORTED_SERVICES = [
  { value: 'openai', label: 'OpenAI', description: 'ChatGPT, GPT-4, DALL-E' },
  { value: 'stripe', label: 'Stripe', description: 'Payment processing' },
  { value: 'twilio', label: 'Twilio', description: 'SMS & Voice calls' },
  { value: 'sendgrid', label: 'SendGrid', description: 'Email delivery' },
  { value: 'resend', label: 'Resend', description: 'Email API' },
  { value: 'elevenlabs', label: 'ElevenLabs', description: 'Voice synthesis' },
  { value: 'google_maps', label: 'Google Maps', description: 'Maps & Geolocation' },
  { value: 'mailchimp', label: 'Mailchimp', description: 'Email marketing' },
  { value: 'zapier', label: 'Zapier', description: 'Automation' },
  { value: 'hubspot', label: 'HubSpot', description: 'CRM' },
  { value: 'salesforce', label: 'Salesforce', description: 'CRM' },
];

export function APIKeyManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKeys, setAPIKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<APIKey | null>(null);
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({});
  const [hasSubscription, setHasSubscription] = useState(false);

  // Form state
  const [serviceName, setServiceName] = useState('');
  const [serviceLabel, setServiceLabel] = useState('');
  const [apiKey, setAPIKey] = useState('');

  useEffect(() => {
    if (user) {
      checkSubscription();
      loadAPIKeys();
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('id, status')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking subscription:', error);
        return;
      }

      setHasSubscription(!!data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const loadAPIKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('id, service_name, service_label, is_active, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading API keys:', error);
        toast({
          title: "Error",
          description: "Failed to load API keys",
          variant: "destructive",
        });
        return;
      }

      setAPIKeys(data || []);
    } catch (error) {
      console.error('Error loading API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAPIKey = async () => {
    if (!serviceName || !apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please select a service and enter an API key",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simple encryption - in production, this should be done server-side
      const encryptedKey = btoa(apiKey);

      if (editingKey) {
        const { error } = await supabase
          .from('user_api_keys')
          .update({
            service_label: serviceLabel || serviceName,
            api_key_encrypted: encryptedKey,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingKey.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "API key updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('user_api_keys')
          .insert({
            user_id: user?.id,
            service_name: serviceName,
            service_label: serviceLabel || serviceName,
            api_key_encrypted: encryptedKey,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "API key added successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadAPIKeys();
    } catch (error: any) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save API key",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAPIKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "API key deleted successfully",
      });

      loadAPIKeys();
    } catch (error: any) {
      console.error('Error deleting API key:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setServiceName('');
    setServiceLabel('');
    setAPIKey('');
    setEditingKey(null);
  };

  const openEditDialog = (key: APIKey) => {
    setEditingKey(key);
    setServiceName(key.service_name);
    setServiceLabel(key.service_label || '');
    setAPIKey(''); // Don't pre-fill for security
    setIsDialogOpen(true);
  };

  const getServiceInfo = (serviceName: string) => {
    return SUPPORTED_SERVICES.find(service => service.value === serviceName);
  };

  if (!hasSubscription) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">API Key Management</h3>
          <p className="text-muted-foreground mb-4">
            Manage your own API keys for various services. This feature is available for Business and Church plan subscribers.
          </p>
          <Badge variant="secondary">Professional & Enterprise Plans Only</Badge>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p>Loading API keys...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Key Management
            </CardTitle>
            <CardDescription>
              Securely store and manage your API keys for various services
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add API Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingKey ? 'Edit API Key' : 'Add New API Key'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
                  <Select
                    value={serviceName}
                    onValueChange={setServiceName}
                    disabled={!!editingKey}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_SERVICES.map((service) => (
                        <SelectItem key={service.value} value={service.value}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{service.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {service.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="label">Custom Label (Optional)</Label>
                  <Input
                    id="label"
                    value={serviceLabel}
                    onChange={(e) => setServiceLabel(e.target.value)}
                    placeholder="e.g., Production API, Development Key"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apikey">API Key</Label>
                  <div className="relative">
                    <Input
                      id="apikey"
                      type={showKey[serviceName] ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setAPIKey(e.target.value)}
                      placeholder="Enter your API key"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowKey(prev => ({ ...prev, [serviceName]: !prev[serviceName] }))}
                    >
                      {showKey[serviceName] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveAPIKey}>
                    {editingKey ? 'Update' : 'Save'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {apiKeys.length === 0 ? (
          <div className="text-center py-8">
            <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No API keys configured yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first API key to start integrating with external services
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => {
              const serviceInfo = getServiceInfo(key.service_name);
              return (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">
                        {key.service_label || serviceInfo?.label || key.service_name}
                      </h4>
                      <Badge variant={key.is_active ? "default" : "secondary"}>
                        {key.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {serviceInfo?.description || `${key.service_name} API`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Added {new Date(key.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(key)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this API key? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteAPIKey(key.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}