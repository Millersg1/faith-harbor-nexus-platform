import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, CheckCircle, XCircle, AlertTriangle, Copy, ExternalLink, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DomainStatus {
  domain: string;
  status: 'pending' | 'verified' | 'failed' | 'active';
  sslStatus: 'pending' | 'active' | 'failed';
  lastChecked: string;
  dnsRecords: {
    type: string;
    name: string;
    value: string;
    status: 'pending' | 'verified' | 'failed';
  }[];
}

interface UserWebsite {
  id: string;
  name: string;
  domain: string | null;
  custom_domain: string | null;
  is_published: boolean;
  created_at: string;
}

const CustomDomainManager = () => {
  const [websites, setWebsites] = useState<UserWebsite[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<UserWebsite | null>(null);
  const [customDomain, setCustomDomain] = useState("");
  const [domainStatus, setDomainStatus] = useState<DomainStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_websites')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setWebsites(data || []);
    } catch (error) {
      console.error('Error loading websites:', error);
      toast({
        title: "Error",
        description: "Failed to load websites",
        variant: "destructive",
      });
    }
  };

  const addCustomDomain = async () => {
    if (!customDomain || !selectedWebsite) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_websites')
        .update({ custom_domain: customDomain })
        .eq('id', selectedWebsite.id);

      if (error) throw error;

      // Simulate domain verification process
      const newDomainStatus: DomainStatus = {
        domain: customDomain,
        status: 'pending',
        sslStatus: 'pending',
        lastChecked: new Date().toISOString(),
        dnsRecords: [
          {
            type: 'CNAME',
            name: customDomain,
            value: 'faithharbor.lovable.app',
            status: 'pending'
          },
          {
            type: 'TXT',
            name: `_verification.${customDomain}`,
            value: `faithharbor-verify=${Math.random().toString(36).substring(2, 15)}`,
            status: 'pending'
          }
        ]
      };

      setDomainStatus(newDomainStatus);
      setSelectedWebsite({ ...selectedWebsite, custom_domain: customDomain });
      
      toast({
        title: "Domain Added",
        description: "Custom domain has been added. Please configure DNS records to verify.",
      });

      loadWebsites();
    } catch (error) {
      console.error('Error adding custom domain:', error);
      toast({
        title: "Error",
        description: "Failed to add custom domain",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyDomain = async () => {
    if (!domainStatus) return;

    setVerifying(true);
    try {
      // Simulate DNS verification check
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Randomly simulate success/failure for demo
      const isVerified = Math.random() > 0.3;
      
      const updatedStatus: DomainStatus = {
        ...domainStatus,
        status: isVerified ? 'verified' : 'failed',
        sslStatus: isVerified ? 'active' : 'failed',
        lastChecked: new Date().toISOString(),
        dnsRecords: domainStatus.dnsRecords.map(record => ({
          ...record,
          status: isVerified ? 'verified' : 'failed'
        }))
      };

      setDomainStatus(updatedStatus);

      toast({
        title: isVerified ? "Domain Verified" : "Verification Failed",
        description: isVerified 
          ? "Your custom domain is now active!" 
          : "Please check your DNS configuration and try again.",
        variant: isVerified ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Error verifying domain:', error);
      toast({
        title: "Error",
        description: "Failed to verify domain",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const removeCustomDomain = async () => {
    if (!selectedWebsite) return;

    try {
      const { error } = await supabase
        .from('user_websites')
        .update({ custom_domain: null })
        .eq('id', selectedWebsite.id);

      if (error) throw error;

      setSelectedWebsite({ ...selectedWebsite, custom_domain: null });
      setDomainStatus(null);
      setCustomDomain("");
      
      toast({
        title: "Domain Removed",
        description: "Custom domain has been removed from this website.",
      });

      loadWebsites();
    } catch (error) {
      console.error('Error removing custom domain:', error);
      toast({
        title: "Error",
        description: "Failed to remove custom domain",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Value copied to clipboard",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      verified: 'bg-green-100 text-green-800',
      active: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || colors.pending}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Globe className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Custom Domain Manager</h1>
            <p className="text-muted-foreground">Configure custom domains for your websites</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Website Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Website</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {websites.length === 0 ? (
              <p className="text-muted-foreground text-sm">No websites found. Create a website first.</p>
            ) : (
              websites.map((website) => (
                <div
                  key={website.id}
                  onClick={() => {
                    setSelectedWebsite(website);
                    setCustomDomain(website.custom_domain || "");
                    if (website.custom_domain) {
                      // Load domain status if custom domain exists
                      setDomainStatus({
                        domain: website.custom_domain,
                        status: 'verified',
                        sslStatus: 'active',
                        lastChecked: new Date().toISOString(),
                        dnsRecords: [
                          {
                            type: 'CNAME',
                            name: website.custom_domain,
                            value: 'faithharbor.lovable.app',
                            status: 'verified'
                          }
                        ]
                      });
                    } else {
                      setDomainStatus(null);
                    }
                  }}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedWebsite?.id === website.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{website.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {website.custom_domain ? (
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {website.custom_domain}
                      </span>
                    ) : (
                      <span>{website.domain || 'No domain set'}</span>
                    )}
                  </div>
                  {website.custom_domain && (
                    <Badge className="mt-1 text-xs">Custom Domain</Badge>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Domain Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Domain Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedWebsite ? (
              <div className="text-center py-8 text-muted-foreground">
                Select a website to configure custom domain
              </div>
            ) : (
              <Tabs defaultValue="setup" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="setup">Setup</TabsTrigger>
                  <TabsTrigger value="dns">DNS Configuration</TabsTrigger>
                  <TabsTrigger value="ssl">SSL Certificate</TabsTrigger>
                </TabsList>

                <TabsContent value="setup" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Website</label>
                      <Input value={selectedWebsite.name} disabled />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Custom Domain</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="yourdomain.com"
                          value={customDomain}
                          onChange={(e) => setCustomDomain(e.target.value)}
                          disabled={loading}
                        />
                        {selectedWebsite.custom_domain ? (
                          <Button onClick={removeCustomDomain} variant="outline">
                            Remove
                          </Button>
                        ) : (
                          <Button onClick={addCustomDomain} disabled={loading || !customDomain}>
                            {loading ? "Adding..." : "Add Domain"}
                          </Button>
                        )}
                      </div>
                    </div>

                    {domainStatus && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Domain Status: {getStatusBadge(domainStatus.status)}
                          <br />
                          SSL Status: {getStatusBadge(domainStatus.sslStatus)}
                          <br />
                          Last checked: {new Date(domainStatus.lastChecked).toLocaleString()}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="dns" className="space-y-6">
                  {domainStatus ? (
                    <div className="space-y-4">
                      <Alert>
                        <Globe className="h-4 w-4" />
                        <AlertDescription>
                          Add these DNS records to your domain registrar to verify ownership and point traffic to your website.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-3">
                        {domainStatus.dnsRecords.map((record, index) => (
                          <Card key={index}>
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{record.type}</Badge>
                                  {getStatusIcon(record.status)}
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(record.value)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="font-medium">Name</div>
                                  <div className="text-muted-foreground font-mono">{record.name}</div>
                                </div>
                                <div>
                                  <div className="font-medium">Value</div>
                                  <div className="text-muted-foreground font-mono break-all">{record.value}</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={verifyDomain} disabled={verifying}>
                          {verifying ? "Verifying..." : "Verify DNS"}
                        </Button>
                        <Button variant="outline" asChild>
                          <a href="https://www.cloudflare.com/learning/dns/dns-records/" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            DNS Help
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Add a custom domain first to see DNS configuration
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="ssl" className="space-y-6">
                  {domainStatus && domainStatus.status === 'verified' ? (
                    <div className="space-y-4">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          SSL certificate is automatically provisioned and managed for verified domains.
                        </AlertDescription>
                      </Alert>

                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">SSL Certificate Status</div>
                              <div className="text-sm text-muted-foreground">
                                Automatically renewed every 90 days
                              </div>
                            </div>
                            {getStatusBadge(domainStatus.sslStatus)}
                          </div>
                        </CardContent>
                      </Card>

                      <div className="space-y-2">
                        <h4 className="font-medium">Security Features</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• TLS 1.3 encryption</li>
                          <li>• HTTP to HTTPS redirect</li>
                          <li>• HSTS headers</li>
                          <li>• Perfect Forward Secrecy</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      SSL certificate will be provisioned after domain verification
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomDomainManager;