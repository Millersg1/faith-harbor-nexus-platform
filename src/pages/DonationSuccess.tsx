import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Heart, Home } from "lucide-react";

const DonationSuccess = () => {
  const [searchParams] = useSearchParams();
  const [donationDetails, setDonationDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      verifyDonation();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const verifyDonation = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-donation', {
        body: { sessionId }
      });

      if (error) throw error;
      setDonationDetails(data);
    } catch (error) {
      console.error('Error verifying donation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verifying your donation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">Donation Successful!</CardTitle>
          <CardDescription>
            Thank you for your generous contribution to Faith Harbor
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {donationDetails && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span>${(donationDetails.amount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className="capitalize text-green-600">{donationDetails.status}</span>
              </div>
            </div>
          )}
          
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Heart className="h-5 w-5" />
              <span className="text-sm">Your generosity makes a difference</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              You will receive a confirmation email shortly with your donation receipt.
            </p>
            
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link to="/donate">Make Another Donation</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationSuccess;