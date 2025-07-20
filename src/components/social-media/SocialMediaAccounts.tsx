import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SocialAccount {
  id: string;
  platform: string;
  account_name: string;
  account_handle: string;
  is_connected: boolean;
  last_sync_at: string | null;
}

export const SocialMediaAccounts = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const platformIcons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
    tiktok: () => <div className="w-5 h-5 bg-foreground rounded"></div>
  };

  const platformColors = {
    facebook: "bg-blue-600",
    twitter: "bg-sky-500",
    instagram: "bg-gradient-to-r from-purple-600 to-pink-600",
    linkedin: "bg-blue-700",
    youtube: "bg-red-600",
    tiktok: "bg-black"
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_media_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: "Error",
        description: "Failed to load social media accounts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const connectAccount = async (platform: string) => {
    // In a real implementation, this would redirect to OAuth flow
    toast({
      title: "Connect Account",
      description: `Redirecting to ${platform} authorization...`,
    });
  };

  const toggleConnection = async (accountId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('social_media_accounts')
        .update({ is_connected: !currentStatus })
        .eq('id', accountId);

      if (error) throw error;
      
      await fetchAccounts();
      toast({
        title: "Success",
        description: `Account ${!currentStatus ? 'connected' : 'disconnected'} successfully`,
      });
    } catch (error) {
      console.error('Error updating account:', error);
      toast({
        title: "Error",
        description: "Failed to update account status",
        variant: "destructive"
      });
    }
  };

  const availablePlatforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok'];
  const connectedPlatforms = accounts.map(account => account.platform);
  const unconnectedPlatforms = availablePlatforms.filter(platform => 
    !connectedPlatforms.includes(platform)
  );

  if (loading) {
    return <div className="text-center py-8">Loading accounts...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Manage your connected social media accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No accounts connected yet. Connect your first social media account below.
            </p>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => {
                const Icon = platformIcons[account.platform as keyof typeof platformIcons];
                const colorClass = platformColors[account.platform as keyof typeof platformColors];
                
                return (
                  <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium capitalize">{account.platform}</h3>
                        <p className="text-sm text-muted-foreground">
                          @{account.account_handle} • {account.account_name}
                        </p>
                        {account.last_sync_at && (
                          <p className="text-xs text-muted-foreground">
                            Last sync: {new Date(account.last_sync_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={account.is_connected ? "default" : "secondary"}>
                        {account.is_connected ? "Connected" : "Disconnected"}
                      </Badge>
                      <Switch
                        checked={account.is_connected}
                        onCheckedChange={() => toggleConnection(account.id, account.is_connected)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Platforms */}
      {unconnectedPlatforms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Platforms</CardTitle>
            <CardDescription>
              Connect additional social media platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unconnectedPlatforms.map((platform) => {
                const Icon = platformIcons[platform as keyof typeof platformIcons];
                const colorClass = platformColors[platform as keyof typeof platformColors];
                
                return (
                  <div key={platform} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-medium capitalize">{platform}</h3>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => connectAccount(platform)}
                    >
                      Connect
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};