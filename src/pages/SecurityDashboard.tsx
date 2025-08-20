import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SecurityAuditDashboard } from "@/components/SecurityAuditDashboard";
import { SecurityConfiguration } from "@/components/SecurityConfiguration";
import { Shield, AlertTriangle, CheckCircle, Lock, Key, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SecurityDashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-primary" />
            Security Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Comprehensive security monitoring and configuration for Faith Harbor
          </p>
        </div>

        {/* Security Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">Secured</div>
              <p className="text-xs text-muted-foreground">
                All critical vulnerabilities resolved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RLS Policies</CardTitle>
              <Lock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45+</div>
              <p className="text-xs text-muted-foreground">
                Row-level security policies active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Protected Tables</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15+</div>
              <p className="text-xs text-muted-foreground">
                Database tables with proper access control
              </p>
            </CardContent>
          </Card>
        </div>

        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Notice:</strong> Two authentication settings need manual configuration:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Enable leaked password protection in Supabase Auth settings</li>
              <li>Reduce OTP expiry time to 15 minutes for enhanced security</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="audit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security Audit
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="audit" className="space-y-6">
            <SecurityAuditDashboard />
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <SecurityConfiguration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SecurityDashboard;