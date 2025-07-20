import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plug, Zap, Code, Webhook, Settings, Plus, Globe, Link, Database, Cloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  type: 'api' | 'webhook' | 'sync';
  icon: string;
  provider: string;
  lastSync?: string;
  dataFlow: 'inbound' | 'outbound' | 'bidirectional';
}

interface CustomAPI {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'active' | 'inactive';
  calls: number;
  lastUsed: string;
}

const IntegrationHub = () => {
  const [activeTab, setActiveTab] = useState("marketplace");
  const { toast } = useToast();

  const availableIntegrations: Integration[] = [
    {
      id: '1',
      name: 'Mailchimp',
      description: 'Sync member data and send email campaigns',
      category: 'Marketing',
      status: 'active',
      type: 'sync',
      icon: '📧',
      provider: 'Mailchimp',
      lastSync: '2 hours ago',
      dataFlow: 'bidirectional'
    },
    {
      id: '2',
      name: 'QuickBooks',
      description: 'Sync financial data and donations',
      category: 'Finance',
      status: 'active',
      type: 'sync',
      icon: '💰',
      provider: 'Intuit',
      lastSync: '1 day ago',
      dataFlow: 'outbound'
    },
    {
      id: '3',
      name: 'Zoom',
      description: 'Schedule and manage virtual meetings',
      category: 'Communication',
      status: 'inactive',
      type: 'api',
      icon: '📹',
      provider: 'Zoom',
      dataFlow: 'bidirectional'
    },
    {
      id: '4',
      name: 'Planning Center',
      description: 'Service planning and scheduling',
      category: 'Operations',
      status: 'pending',
      type: 'sync',
      icon: '📅',
      provider: 'Planning Center',
      dataFlow: 'bidirectional'
    },
    {
      id: '5',
      name: 'Constant Contact',
      description: 'Email marketing and automation',
      category: 'Marketing',
      status: 'inactive',
      type: 'sync',
      icon: '✉️',
      provider: 'Constant Contact',
      dataFlow: 'outbound'
    },
    {
      id: '6',
      name: 'Church Tools',
      description: 'Member management and small groups',
      category: 'Operations',
      status: 'inactive',
      type: 'sync',
      icon: '⛪',
      provider: 'Church Tools',
      dataFlow: 'bidirectional'
    }
  ];

  const customAPIs: CustomAPI[] = [
    {
      id: '1',
      name: 'Member Lookup',
      endpoint: '/api/members/search',
      method: 'GET',
      status: 'active',
      calls: 1247,
      lastUsed: '5 minutes ago'
    },
    {
      id: '2',
      name: 'Event Creation',
      endpoint: '/api/events/create',
      method: 'POST',
      status: 'active',
      calls: 89,
      lastUsed: '2 hours ago'
    },
    {
      id: '3',
      name: 'Donation Records',
      endpoint: '/api/donations/list',
      method: 'GET',
      status: 'active',
      calls: 567,
      lastUsed: '1 hour ago'
    }
  ];

  const webhooks = [
    {
      id: '1',
      name: 'New Member Notification',
      url: 'https://your-app.com/webhooks/new-member',
      events: ['member.created', 'member.updated'],
      status: 'active',
      lastTriggered: '3 hours ago'
    },
    {
      id: '2',
      name: 'Donation Processing',
      url: 'https://your-finance-system.com/donations',
      events: ['donation.completed'],
      status: 'active',
      lastTriggered: '1 hour ago'
    }
  ];

  const toggleIntegration = (integrationId: string) => {
    toast({
      title: "Integration Updated",
      description: "Integration status has been changed.",
    });
  };

  const testWebhook = (webhookId: string) => {
    toast({
      title: "Webhook Test Sent",
      description: "Test payload has been sent to the webhook endpoint.",
    });
  };

  const createCustomAPI = () => {
    toast({
      title: "API Endpoint Created",
      description: "New custom API endpoint has been created successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Plug className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Integration Hub</h1>
            <p className="text-muted-foreground">Connect with external services and manage APIs</p>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="custom-api">Custom APIs</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="data-sync">Data Sync</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableIntegrations.map((integration) => (
              <Card key={integration.id} className="hover-scale">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge variant="outline">{integration.category}</Badge>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(integration.status)}`}></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Provider:</span>
                      <span className="font-medium">{integration.provider}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Type:</span>
                      <span className="font-medium capitalize">{integration.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Data Flow:</span>
                      <span className="font-medium capitalize">{integration.dataFlow}</span>
                    </div>
                    {integration.lastSync && (
                      <div className="flex justify-between text-sm">
                        <span>Last Sync:</span>
                        <span className="font-medium">{integration.lastSync}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={integration.status === 'active' ? 'outline' : 'default'}
                      onClick={() => toggleIntegration(integration.id)}
                      className="flex-1"
                    >
                      {integration.status === 'active' ? 'Disconnect' : 'Connect'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom-api" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Custom API Endpoints</CardTitle>
                <Button size="sm" onClick={createCustomAPI}>
                  <Code className="h-4 w-4 mr-2" />
                  Create Endpoint
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customAPIs.map((api) => (
                  <div key={api.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge variant={getStatusVariant(api.status)}>{api.method}</Badge>
                      <div>
                        <div className="font-semibold">{api.name}</div>
                        <div className="text-sm text-muted-foreground font-mono">{api.endpoint}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{api.calls} calls</div>
                      <div className="text-sm text-muted-foreground">Last used: {api.lastUsed}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Include your API key in the Authorization header:
                  </p>
                  <code className="text-sm bg-background p-2 rounded">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Rate Limiting</h3>
                  <p className="text-sm text-muted-foreground">
                    API calls are limited to 1000 requests per hour per API key.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Webhook Management</CardTitle>
                <Button size="sm">
                  <Webhook className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold">{webhook.name}</div>
                      <Badge variant={getStatusVariant(webhook.status)}>{webhook.status}</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>URL:</span>
                        <span className="font-mono text-xs">{webhook.url}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Events:</span>
                        <span>{webhook.events.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Triggered:</span>
                        <span>{webhook.lastTriggered}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => testWebhook(webhook.id)}>
                        Test
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        Logs
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create New Webhook</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Webhook Name</label>
                <Input placeholder="Enter webhook name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Endpoint URL</label>
                <Input placeholder="https://your-app.com/webhook" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Events</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select events to subscribe to" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member.created">Member Created</SelectItem>
                    <SelectItem value="member.updated">Member Updated</SelectItem>
                    <SelectItem value="donation.completed">Donation Completed</SelectItem>
                    <SelectItem value="event.created">Event Created</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Create Webhook</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-sync" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sync Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Member Data</div>
                        <div className="text-sm text-muted-foreground">Last sync: 2 hours ago</div>
                      </div>
                    </div>
                    <Badge variant="default">Synced</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Cloud className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">Financial Records</div>
                        <div className="text-sm text-muted-foreground">Last sync: 1 day ago</div>
                      </div>
                    </div>
                    <Badge variant="default">Synced</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="font-medium">Event Calendar</div>
                        <div className="text-sm text-muted-foreground">Sync pending</div>
                      </div>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sync Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto-sync</div>
                    <div className="text-sm text-muted-foreground">Automatically sync data every hour</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Conflict resolution</div>
                    <div className="text-sm text-muted-foreground">Prioritize local changes</div>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sync frequency</label>
                  <Select defaultValue="hourly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Every hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Manual Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <Database className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-sm">Sync Members</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <Cloud className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-sm">Sync Finances</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <Globe className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-sm">Sync Events</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Debug mode</div>
                  <div className="text-sm text-muted-foreground">Enable detailed logging for integrations</div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Retry failed requests</div>
                  <div className="text-sm text-muted-foreground">Automatically retry failed API calls</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Request timeout (seconds)</label>
                <Input type="number" defaultValue="30" className="w-32" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max retry attempts</label>
                <Input type="number" defaultValue="3" className="w-32" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Production API Key</div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="font-mono text-sm bg-muted p-2 rounded">
                    fh_prod_••••••••••••••••••••••••••••••••
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Created: Jan 15, 2024 • Last used: 5 minutes ago
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  Generate New Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationHub;