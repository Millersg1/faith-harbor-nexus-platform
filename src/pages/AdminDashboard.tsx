import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, BarChart3, Smartphone, Brain, Shield, Zap, Globe } from "lucide-react";
import AuthenticatedNavigation from "@/components/AuthenticatedNavigation";
import RealTimeAnalytics from "@/components/RealTimeAnalytics";
import AIInsights from "@/components/AIInsights";
import MobileAppPreview from "@/components/MobileAppPreview";
import TwilioFlexPanel from "@/components/TwilioFlexPanel";
import AIAssistant from "@/components/AIAssistant";
import SecurityCenter from "@/components/SecurityCenter";
import PerformanceOptimization from "@/components/PerformanceOptimization";
import WorkflowAutomation from "@/components/WorkflowAutomation";
import BusinessIntelligence from "@/components/BusinessIntelligence";
import MultiTenant from "@/components/MultiTenant";
import IntegrationHub from "@/components/IntegrationHub";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const systemMetrics = {
    uptime: "99.98%",
    activeUsers: 234,
    dataStorage: "2.3 GB",
    apiCalls: "1,245",
    lastBackup: "2 hours ago"
  };

  const securityAlerts = [
    { type: "info", message: "SSL certificate renewed successfully", time: "2 hours ago" },
    { type: "warning", message: "Unusual login pattern detected", time: "1 day ago" },
    { type: "success", message: "Security scan completed - no issues", time: "3 days ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavigation />
      
      <div className="container mx-auto p-6 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive platform management and insights</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-12">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Real-time</TabsTrigger>
            <TabsTrigger value="ai">AI Insights</TabsTrigger>
            <TabsTrigger value="assistant">AI Chat</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="business-intel">BI Dashboard</TabsTrigger>
            <TabsTrigger value="multi-tenant">Multi-Tenant</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
            <TabsTrigger value="communication">Twilio</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="hover-scale">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{systemMetrics.uptime}</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>

              <Card className="hover-scale">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{systemMetrics.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">Currently online</p>
                </CardContent>
              </Card>

              <Card className="hover-scale">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Data Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{systemMetrics.dataStorage}</div>
                  <p className="text-xs text-muted-foreground">Used storage</p>
                </CardContent>
              </Card>

              <Card className="hover-scale">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{systemMetrics.apiCalls}</div>
                  <p className="text-xs text-muted-foreground">Today</p>
                </CardContent>
              </Card>

              <Card className="hover-scale">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold text-orange-600">{systemMetrics.lastBackup}</div>
                  <p className="text-xs text-muted-foreground">Automated</p>
                </CardContent>
              </Card>
            </div>

            {/* Phase 8 Features Status */}
            <Card>
              <CardHeader>
                <CardTitle>Phase 8 Implementation Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-semibold">Advanced Analytics</div>
                      <div className="text-sm text-muted-foreground">Real-time insights</div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-semibold">AI/ML Features</div>
                      <div className="text-sm text-muted-foreground">Smart recommendations</div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-semibold">Mobile App</div>
                      <div className="text-sm text-muted-foreground">Native experience</div>
                    </div>
                    <Badge variant="secondary">Beta</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-semibold">Twilio Integration</div>
                      <div className="text-sm text-muted-foreground">Communication platform</div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Users className="h-6 w-6" />
                    <span>Manage Users</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Settings className="h-6 w-6" />
                    <span>System Settings</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Shield className="h-6 w-6" />
                    <span>Security Center</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <BarChart3 className="h-6 w-6" />
                    <span>View Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <RealTimeAnalytics />
          </TabsContent>

          <TabsContent value="ai">
            <AIInsights />
          </TabsContent>

          <TabsContent value="assistant">
            <AIAssistant />
          </TabsContent>

          <TabsContent value="workflows">
            <WorkflowAutomation />
          </TabsContent>

          <TabsContent value="business-intel">
            <BusinessIntelligence />
          </TabsContent>

          <TabsContent value="multi-tenant">
            <MultiTenant />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationHub />
          </TabsContent>

          <TabsContent value="mobile">
            <MobileAppPreview />
          </TabsContent>

          <TabsContent value="communication">
            <TwilioFlexPanel />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Total Users</h3>
                      <p className="text-sm text-muted-foreground">Registered members</p>
                    </div>
                    <Badge variant="outline">1,234</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Active This Month</h3>
                      <p className="text-sm text-muted-foreground">Logged in users</p>
                    </div>
                    <Badge variant="default">892</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">New Registrations</h3>
                      <p className="text-sm text-muted-foreground">This week</p>
                    </div>
                    <Badge variant="secondary">23</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecurityCenter />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceOptimization />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;