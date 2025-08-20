import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, UserPlus, Eye, BarChart3 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AnalyticsUserManager = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const createAnalyticsUser = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address for the analytics test user.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("You must be logged in to create users");
      }

      const { data, error } = await supabase.functions.invoke('create-analytics-user', {
        body: { email: email.trim() },
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`
        }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      toast({
        title: "Success!",
        description: "Analytics test user created successfully.",
      });
      
      // Clear the email field
      setEmail("");

    } catch (error: any) {
      console.error("Error creating analytics user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create analytics user",
        variant: "destructive"
      });
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Analytics Test User Manager
        </CardTitle>
        <CardDescription>
          Create a limited-access test user with read-only analytics permissions. 
          No access to sensitive PII or payment data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Permissions Overview */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Analytics Viewer Permissions
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li className="flex items-center gap-2">
              <BarChart3 className="h-3 w-3" />
              Read-only access to SEO analytics
            </li>
            <li className="flex items-center gap-2">
              <BarChart3 className="h-3 w-3" />
              View user activity logs (operational data only)
            </li>
            <li className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-red-600" />
              <span className="text-red-700">No access to donations or donor PII</span>
            </li>
            <li className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-red-600" />
              <span className="text-red-700">No access to payment processors</span>
            </li>
          </ul>
        </div>

        {/* User Creation Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="analytics.tester@faithharborministryplatform.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button 
            onClick={createAnalyticsUser} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating User..." : "Create Analytics Test User"}
          </Button>
        </div>

        {/* Results Display */}
        {result && (
          <div className="space-y-3">
            {result.success ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="space-y-2">
                    <p className="font-medium">{result.message}</p>
                    <div className="bg-white p-3 rounded border">
                      <p className="font-medium text-gray-900">Login Credentials:</p>
                      <p><strong>Email:</strong> {result.credentials?.email}</p>
                      <p><strong>Password:</strong> {result.credentials?.password}</p>
                      <p className="text-sm text-orange-600 mt-2">
                        ⚠️ {result.credentials?.note}
                      </p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {result.error || "Failed to create analytics user"}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Security Notice */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Notice:</strong> This function requires admin privileges and creates users 
            with limited "analytics_viewer" role access only. The generated password should be changed 
            after first login.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default AnalyticsUserManager;