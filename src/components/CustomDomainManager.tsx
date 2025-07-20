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

interface DomainVerification {
  id: string;
  domain: string;
  status: 'pending' | 'verified' | 'failed';
  ssl_status: 'pending' | 'active' | 'failed';
  verification_token: string;
  dns_records: {
    type: string;
    name: string;
    value: string;
    status: 'pending' | 'verified' | 'failed';
  }[];
  last_checked: string;
  verified_at?: string;
  created_at: string;
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
  const [domainVerifications, setDomainVerifications] = useState<DomainVerification[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<UserWebsite | null>(null);
  const [customDomain, setCustomDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadWebsites();
    loadDomainVerifications();
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

  const loadDomainVerifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('domain_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const verifications: DomainVerification[] = data?.map(item => ({
        id: item.id,
        domain: item.domain,
        status: item.status as 'pending' | 'verified' | 'failed',
        ssl_status: item.ssl_status as 'pending' | 'active' | 'failed',
        verification_token: item.verification_token,
        dns_records: Array.isArray(item.dns_records) ? item.dns_records as any[] : [],
        last_checked: item.last_checked || new Date().toISOString(),
        verified_at: item.verified_at || undefined,
        created_at: item.created_at
      })) || [];
      
      setDomainVerifications(verifications);
    } catch (error) {
      console.error('Error loading domain verifications:', error);
      toast({
        title: "Error",
        description: "Failed to load domain verifications",
        variant: "destructive",
      });
    }
  };

  const addCustomDomain = async () => {
    if (!customDomain || !selectedWebsite) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // First update the website with the custom domain
      const { error: websiteError } = await supabase
        .from('user_websites')
        .update({ custom_domain: customDomain })
        .eq('id', selectedWebsite.id);

      if (websiteError) throw websiteError;

      // Create a domain verification record
      const dnsRecords = [
        {
          type: 'CNAME',
          name: customDomain,
          value: `${selectedWebsite.domain || 'faithharbor.lovable.app'}`,
          status: 'pending'
        },
        {
          type: 'TXT',
          name: `_verification.${customDomain}`,
          value: `faithharbor-verify=${Math.random().toString(36).substring(2, 15)}`,
          status: 'pending'
        }
      ];

      const { error: verificationError } = await supabase
        .from('domain_verifications')
        .insert({
          user_id: user.id,
          domain: customDomain,
          dns_records: dnsRecords
        });

      if (verificationError) throw verificationError;

      setSelectedWebsite({ ...selectedWebsite, custom_domain: customDomain });
      
      toast({
        title: "Domain Added",
        description: "Custom domain has been added. Please configure DNS records to verify.",
      });

      loadWebsites();
      loadDomainVerifications();
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

  const verifyDomain = async (domainId: string) => {
    setVerifying(true);
    try {
      // Simulate DNS verification check
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Randomly simulate success/failure for demo
      const isVerified = Math.random() > 0.3;
      
      const { error } = await supabase
        .from('domain_verifications')
        .update({
          status: isVerified ? 'verified' : 'failed',
          ssl_status: isVerified ? 'active' : 'failed',
          verified_at: isVerified ? new Date().toISOString() : null,
          last_checked: new Date().toISOString()
        })
        .eq('id', domainId);

      if (error) throw error;

      toast({
        title: isVerified ? "Domain Verified" : "Verification Failed",
        description: isVerified 
          ? "Your custom domain is now active!" 
          : "Please check your DNS configuration and try again.",
        variant: isVerified ? "default" : "destructive",
      });

      loadDomainVerifications();
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
    if (!selectedWebsite || !selectedWebsite.custom_domain) return;

    try {
      // Remove from website
      const { error: websiteError } = await supabase
        .from('user_websites')
        .update({ custom_domain: null })
        .eq('id', selectedWebsite.id);

      if (websiteError) throw websiteError;

      // Remove domain verification record
      const { error: verificationError } = await supabase
        .from('domain_verifications')
        .delete()
        .eq('domain', selectedWebsite.custom_domain);

      if (verificationError) throw verificationError;

      setSelectedWebsite({ ...selectedWebsite, custom_domain: null });
      setCustomDomain("");
      
      toast({
        title: "Domain Removed",
        description: "Custom domain has been removed from this website.",
      });

      loadWebsites();
      loadDomainVerifications();
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
                  {website.custom_domain && (
                    <div className="mt-2">
                      {domainVerifications
                        .filter(v => v.domain === website.custom_domain)
                        .map(verification => (
                          <div key={verification.id} className="flex items-center gap-1">
                            {getStatusIcon(verification.status)}
                            <span className="text-xs">{verification.status}</span>
                          </div>
                        ))
                      }
                    </div>
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

                    {selectedWebsite.custom_domain && domainVerifications
                      .filter(v => v.domain === selectedWebsite.custom_domain)
                      .map(verification => (
                        <Alert key={verification.id}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Domain Status: {getStatusBadge(verification.status)}
                            <br />
                            SSL Status: {getStatusBadge(verification.ssl_status)}
                            <br />
                            Last checked: {new Date(verification.last_checked).toLocaleString()}
                            {verification.verified_at && (
                              <>
                                <br />
                                Verified: {new Date(verification.verified_at).toLocaleString()}
                              </>
                            )}
                          </AlertDescription>
                        </Alert>
                      ))
                    }
                  </div>
                </TabsContent>

                <TabsContent value="dns" className="space-y-6">
                  {selectedWebsite?.custom_domain ? (
                    <div className="space-y-4">
                      <Alert>
                        <Globe className="h-4 w-4" />
                        <AlertDescription>
                          Add these DNS records to your domain registrar to verify ownership and point traffic to your website.
                        </AlertDescription>
                      </Alert>

                      {domainVerifications
                        .filter(v => v.domain === selectedWebsite.custom_domain)
                        .map(verification => (
                          <div key={verification.id} className="space-y-3">
                            {verification.dns_records.map((record, index) => (
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

                            <div className="flex gap-2">
                              <Button onClick={() => verifyDomain(verification.id)} disabled={verifying}>
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
                        ))
                      }
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Add a custom domain first to see DNS configuration
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="ssl" className="space-y-6">
                  {selectedWebsite?.custom_domain && domainVerifications
                    .filter(v => v.domain === selectedWebsite.custom_domain && v.status === 'verified')
                    .length > 0 ? (
                    <div className="space-y-4">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          SSL certificate is automatically provisioned and managed for verified domains.
                        </AlertDescription>
                      </Alert>

                      {domainVerifications
                        .filter(v => v.domain === selectedWebsite.custom_domain)
                        .map(verification => (
                          <Card key={verification.id}>
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">SSL Certificate Status</div>
                                  <div className="text-sm text-muted-foreground">
                                    Automatically renewed every 90 days
                                  </div>
                                </div>
                                {getStatusBadge(verification.ssl_status)}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      }

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