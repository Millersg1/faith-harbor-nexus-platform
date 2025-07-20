import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Building2, Users, Settings, Globe, Database, Plus, Edit, Trash2, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Organization {
  id: string;
  name: string;
  type: 'church' | 'nonprofit' | 'ministry';
  status: 'active' | 'inactive' | 'trial';
  members: number;
  plan: 'basic' | 'premium' | 'enterprise';
  created: string;
  lastActive: string;
  domain?: string;
  customization: {
    logo?: string;
    primaryColor: string;
    theme: 'light' | 'dark' | 'auto';
  };
}

const MultiTenant = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [currentView, setCurrentView] = useState<'overview' | 'manage' | 'create'>('overview');
  const { toast } = useToast();

  const sampleOrganizations: Organization[] = [
    {
      id: '1',
      name: 'Faith Harbor Community Church',
      type: 'church',
      status: 'active',
      members: 1247,
      plan: 'enterprise',
      created: '2023-01-15',
      lastActive: '2024-01-19',
      domain: 'faithharbor.church',
      customization: {
        primaryColor: '#3B82F6',
        theme: 'light'
      }
    },
    {
      id: '2',
      name: 'Grace Community Fellowship',
      type: 'church',
      status: 'active',
      members: 856,
      plan: 'premium',
      created: '2023-03-22',
      lastActive: '2024-01-18',
      domain: 'gracecommunity.org',
      customization: {
        primaryColor: '#10B981',
        theme: 'light'
      }
    },
    {
      id: '3',
      name: 'Hope Ministries International',
      type: 'ministry',
      status: 'active',
      members: 342,
      plan: 'premium',
      created: '2023-06-10',
      lastActive: '2024-01-17',
      customization: {
        primaryColor: '#8B5CF6',
        theme: 'dark'
      }
    },
    {
      id: '4',
      name: 'New Life Baptist Church',
      type: 'church',
      status: 'trial',
      members: 123,
      plan: 'basic',
      created: '2024-01-01',
      lastActive: '2024-01-15',
      customization: {
        primaryColor: '#F59E0B',
        theme: 'auto'
      }
    }
  ];

  useEffect(() => {
    setOrganizations(sampleOrganizations);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'trial': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'enterprise': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'premium': return <Users className="h-4 w-4 text-blue-500" />;
      case 'basic': return <Building2 className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const createNewOrganization = () => {
    setCurrentView('create');
  };

  const switchToOrganization = (org: Organization) => {
    setSelectedOrg(org);
    toast({
      title: "Organization Switched",
      description: `Now managing ${org.name}`,
    });
  };

  const toggleOrgStatus = (orgId: string) => {
    setOrganizations(prev => prev.map(org => 
      org.id === orgId 
        ? { ...org, status: org.status === 'active' ? 'inactive' : 'active' as any }
        : org
    ));
  };

  const aggregateStats = {
    totalOrgs: organizations.length,
    activeOrgs: organizations.filter(o => o.status === 'active').length,
    totalMembers: organizations.reduce((sum, o) => sum + o.members, 0),
    trialOrgs: organizations.filter(o => o.status === 'trial').length
  };

  if (currentView === 'create') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create New Organization</h1>
          <Button variant="outline" onClick={() => setCurrentView('overview')}>
            Back to Overview
          </Button>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Organization Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Organization Name</label>
                <Input placeholder="Enter organization name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="church">Church</SelectItem>
                    <SelectItem value="ministry">Ministry</SelectItem>
                    <SelectItem value="nonprofit">Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plan</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Domain (Optional)</label>
                <Input placeholder="yourdomain.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Color</label>
              <div className="flex space-x-2">
                {['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'].map(color => (
                  <div
                    key={color}
                    className="w-8 h-8 rounded cursor-pointer border-2 border-gray-300"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button className="flex-1">Create Organization</Button>
              <Button variant="outline" onClick={() => setCurrentView('overview')}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Multi-Tenant Management</h1>
            <p className="text-muted-foreground">Manage multiple organizations from one platform</p>
          </div>
        </div>
        <Button onClick={createNewOrganization}>
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="analytics">Cross-Org Analytics</TabsTrigger>
          <TabsTrigger value="settings">Global Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Aggregate Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-scale">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{aggregateStats.totalOrgs}</div>
                <p className="text-xs text-muted-foreground">{aggregateStats.activeOrgs} active</p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{aggregateStats.totalMembers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across all organizations</p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Trial Organizations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{aggregateStats.trialOrgs}</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">98.7%</div>
                <p className="text-xs text-muted-foreground">Uptime this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span>Faith Harbor Community Church upgraded to Enterprise</span>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span>New Life Baptist Church started trial</span>
                  <span className="text-sm text-muted-foreground">1 day ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span>Grace Community Fellowship added 23 new members</span>
                  <span className="text-sm text-muted-foreground">3 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <Card key={org.id} className="hover-scale">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(org.status)}`}></div>
                      <CardTitle className="text-lg">{org.name}</CardTitle>
                    </div>
                    {getPlanIcon(org.plan)}
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">{org.type}</Badge>
                    <Badge variant={org.status === 'active' ? 'default' : org.status === 'trial' ? 'secondary' : 'destructive'}>
                      {org.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Members:</span>
                      <span className="font-medium">{org.members.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Plan:</span>
                      <span className="font-medium capitalize">{org.plan}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Active:</span>
                      <span className="font-medium">{org.lastActive}</span>
                    </div>
                    {org.domain && (
                      <div className="flex justify-between text-sm">
                        <span>Domain:</span>
                        <span className="font-medium">{org.domain}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => switchToOrganization(org)}
                      className="flex-1"
                    >
                      Switch To
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
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

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {organizations.map((org) => (
                    <div key={org.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{org.name}</div>
                        <div className="text-sm text-muted-foreground">{org.members} members</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {Math.floor(Math.random() * 30 + 70)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Health Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Enterprise</span>
                    <span className="font-bold">
                      {organizations.filter(o => o.plan === 'enterprise').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Premium</span>
                    <span className="font-bold">
                      {organizations.filter(o => o.plan === 'premium').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Basic</span>
                    <span className="font-bold">
                      {organizations.filter(o => o.plan === 'basic').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cross-Organization Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-blue-800">Average Growth Rate</div>
                  <div className="text-2xl font-bold text-blue-600">+12.5%</div>
                  <div className="text-sm text-blue-600">Across all organizations</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="font-semibold text-green-800">Retention Rate</div>
                  <div className="text-2xl font-bold text-green-600">94.2%</div>
                  <div className="text-sm text-green-600">Platform-wide average</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="font-semibold text-purple-800">Feature Adoption</div>
                  <div className="text-2xl font-bold text-purple-600">87%</div>
                  <div className="text-sm text-purple-600">Core features usage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Platform Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto-provisioning</div>
                  <div className="text-sm text-muted-foreground">Automatically set up new organizations</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Cross-org analytics</div>
                  <div className="text-sm text-muted-foreground">Share anonymized data across organizations</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Unified support</div>
                  <div className="text-sm text-muted-foreground">Centralized support ticket system</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Default trial period (days)</label>
                <Input type="number" defaultValue="30" className="w-32" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Platform maintenance window</label>
                <Select defaultValue="sunday-2am">
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday-2am">Sunday 2:00 AM</SelectItem>
                    <SelectItem value="saturday-3am">Saturday 3:00 AM</SelectItem>
                    <SelectItem value="custom">Custom Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiTenant;