import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, Lock, Key, Eye, EyeOff, AlertTriangle, CheckCircle, XCircle, Users, Database, Cloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SecurityCenter = () => {
  const [securityScore, setSecurityScore] = useState(87);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const { toast } = useToast();

  const securityAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Unusual Login Activity',
      description: 'Multiple login attempts from unknown location',
      timestamp: '2 hours ago',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'info',
      title: 'SSL Certificate Renewed',
      description: 'Your SSL certificate has been automatically renewed',
      timestamp: '1 day ago',
      severity: 'low'
    },
    {
      id: 3,
      type: 'success',
      title: 'Security Scan Completed',
      description: 'No vulnerabilities detected in latest scan',
      timestamp: '3 days ago',
      severity: 'low'
    }
  ];

  const securitySettings = [
    {
      category: 'Authentication',
      settings: [
        { name: 'Two-Factor Authentication', status: 'enabled', critical: true },
        { name: 'Password Policy', status: 'strong', critical: true },
        { name: 'Session Timeout', status: 'configured', critical: false },
        { name: 'Account Lockout', status: 'enabled', critical: true }
      ]
    },
    {
      category: 'Data Protection',
      settings: [
        { name: 'Database Encryption', status: 'enabled', critical: true },
        { name: 'Backup Encryption', status: 'enabled', critical: true },
        { name: 'Data Retention Policy', status: 'configured', critical: false },
        { name: 'PII Protection', status: 'enabled', critical: true }
      ]
    },
    {
      category: 'Infrastructure',
      settings: [
        { name: 'SSL/TLS Certificate', status: 'valid', critical: true },
        { name: 'Firewall Rules', status: 'active', critical: true },
        { name: 'DDoS Protection', status: 'enabled', critical: false },
        { name: 'Monitoring Alerts', status: 'active', critical: false }
      ]
    }
  ];

  const complianceStandards = [
    {
      name: 'CCPA',
      status: 'compliant',
      description: 'California Consumer Privacy Act',
      lastReview: '2024-01-15'
    },
    {
      name: 'GDPR',
      status: 'compliant',
      description: 'General Data Protection Regulation',
      lastReview: '2024-01-10'
    },
    {
      name: 'SOC 2',
      status: 'pending',
      description: 'Service Organization Control 2',
      lastReview: '2023-12-01'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <Shield className="h-4 w-4 text-blue-500" />;
      default: return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enabled':
      case 'active':
      case 'valid':
      case 'strong':
      case 'configured':
      case 'compliant':
        return 'text-green-600';
      case 'pending':
      case 'warning':
        return 'text-yellow-600';
      case 'disabled':
      case 'expired':
      case 'weak':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const runSecurityScan = () => {
    toast({
      title: "Security Scan Started",
      description: "Running comprehensive security analysis...",
    });
    
    // Simulate scan
    setTimeout(() => {
      toast({
        title: "Security Scan Complete",
        description: "No new vulnerabilities found. Security score: 87%",
      });
    }, 3000);
  };

  const handleGenerateApiKey = () => {
    const newKey = 'fh_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    toast({
      title: "API Key Generated",
      description: "New API key created successfully. Store it securely.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Security Center</h1>
            <p className="text-muted-foreground">Protect your church data and systems</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{securityScore}%</div>
            <div className="text-sm text-muted-foreground">Security Score</div>
          </div>
          <Button onClick={runSecurityScan}>
            <Shield className="h-4 w-4 mr-2" />
            Run Scan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <div className="font-semibold">{alert.title}</div>
                        <div className="text-sm text-muted-foreground">{alert.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">{alert.timestamp}</div>
                      </div>
                    </div>
                    <Badge variant={alert.severity === 'medium' ? 'destructive' : 'secondary'}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {securitySettings.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {category.category === 'Authentication' && <Key className="h-5 w-5" />}
                  {category.category === 'Data Protection' && <Database className="h-5 w-5" />}
                  {category.category === 'Infrastructure' && <Cloud className="h-5 w-5" />}
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {setting.critical && <Lock className="h-4 w-4 text-red-500" />}
                        <span className="font-medium">{setting.name}</span>
                      </div>
                      <span className={`font-semibold ${getStatusColor(setting.status)}`}>
                        {setting.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Access Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-sm text-muted-foreground">Admin Users</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">45</div>
                    <div className="text-sm text-muted-foreground">Staff Members</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">1,234</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Recent Access Changes</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>John Smith granted Admin access</span>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>Sarah Johnson role updated to Staff</span>
                      <span className="text-sm text-muted-foreground">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {complianceStandards.map((standard, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{standard.name}</div>
                      <Badge variant={standard.status === 'compliant' ? 'default' : 'secondary'}>
                        {standard.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {standard.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last Review: {standard.lastReview}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys Management
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKeys(!showApiKeys)}
                  >
                    {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showApiKeys ? 'Hide' : 'Show'} Keys
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm">Generate New Key</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Generate New API Key</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will create a new API key for your application. Store it securely as it won't be shown again.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleGenerateApiKey}>
                          Generate Key
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">Production API Key</div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="font-mono text-sm bg-muted p-2 rounded">
                    {showApiKeys ? 'fh_prod_1234567890abcdef' : '••••••••••••••••••••••••••••••••'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Created: Jan 15, 2024 • Last used: 2 hours ago
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">Development API Key</div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="font-mono text-sm bg-muted p-2 rounded">
                    {showApiKeys ? 'fh_dev_abcdef1234567890' : '••••••••••••••••••••••••••••••••'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Created: Dec 10, 2023 • Last used: 1 day ago
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityCenter;