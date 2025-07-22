import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Phone, PhoneCall, Loader2 } from 'lucide-react';

export const PhoneSystemTest = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('Hello, this is a test call from Faith Harbor Ministry Platform.');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testPhoneCall = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Making phone call to:', phoneNumber);
      
      const { data, error } = await supabase.functions.invoke('make-phone-call', {
        body: { 
          to: phoneNumber,
          message: message,
          voice: 'alice',
          language: 'en'
        }
      });

      console.log('Phone call response:', { data, error });

      if (error) {
        throw error;
      }

      toast({
        title: "Call Initiated Successfully!",
        description: `Call to ${phoneNumber} has been started. Call SID: ${data?.callSid}`,
      });

    } catch (error: any) {
      console.error('Phone call error:', error);
      toast({
        title: "Call Failed",
        description: error.message || "Failed to initiate phone call. Please check your Twilio configuration.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testRoboCall = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error", 
        description: "Please enter a phone number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Making robo call to:', phoneNumber);
      
      const { data, error } = await supabase.functions.invoke('robo-call', {
        body: {
          recipients: [phoneNumber],
          message: message,
          voice: 'alice',
          language: 'en'
        }
      });

      console.log('Robo call response:', { data, error });

      if (error) {
        throw error;
      }

      toast({
        title: "Robo Call Initiated!",
        description: `Robo call to ${phoneNumber} has been started successfully.`,
      });

    } catch (error: any) {
      console.error('Robo call error:', error);
      toast({
        title: "Robo Call Failed",
        description: error.message || "Failed to initiate robo call. Please check your Twilio configuration.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Phone System Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>
          <Input
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
          />
        </div>

        <div className="space-y-2">
          <Button 
            onClick={testPhoneCall}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <PhoneCall className="h-4 w-4 mr-2" />
            )}
            Test Manual Call
          </Button>

          <Button 
            onClick={testRoboCall}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Phone className="h-4 w-4 mr-2" />
            )}
            Test Robo Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};