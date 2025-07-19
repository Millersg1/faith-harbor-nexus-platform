import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Heart, CreditCard, Repeat } from "lucide-react";

export const DonationForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [donationType, setDonationType] = useState<"one-time" | "recurring">("one-time");
  const [formData, setFormData] = useState({
    amount: "",
    customAmount: "",
    category: "general",
    donorName: user?.user_metadata?.full_name || "",
    donorEmail: user?.email || "",
    message: "",
    anonymous: false,
    frequency: "monthly"
  });

  const presetAmounts = [25, 50, 100, 250, 500];
  const categories = [
    { value: "general", label: "General Fund" },
    { value: "tithe", label: "Tithe" },
    { value: "missions", label: "Missions" },
    { value: "building-fund", label: "Building Fund" },
    { value: "youth", label: "Youth Ministry" },
    { value: "worship", label: "Worship Ministry" }
  ];

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toString(), customAmount: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.donorName || !formData.donorEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const finalAmount = formData.customAmount ? parseFloat(formData.customAmount) : parseFloat(formData.amount);
    if (!finalAmount || finalAmount < 1) {
      toast({
        title: "Error",
        description: "Please enter a valid donation amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-donation', {
        body: {
          amount: Math.round(finalAmount * 100), // Convert to cents
          donationType,
          category: formData.category,
          donorName: formData.donorName,
          donorEmail: formData.donorEmail,
          message: formData.message,
          anonymous: formData.anonymous,
          frequency: donationType === 'recurring' ? formData.frequency : null
        }
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Donation error:', error);
      toast({
        title: "Error",
        description: "Failed to process donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Make a Donation</CardTitle>
          <CardDescription>
            Your generosity helps us serve our community and spread God's love
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Donation Type */}
            <div className="space-y-3">
              <Label>Donation Type</Label>
              <RadioGroup value={donationType} onValueChange={(value: "one-time" | "recurring") => setDonationType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <Label htmlFor="one-time" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    One-time donation
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recurring" id="recurring" />
                  <Label htmlFor="recurring" className="flex items-center gap-2">
                    <Repeat className="h-4 w-4" />
                    Recurring donation
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Frequency for recurring donations */}
            {donationType === "recurring" && (
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Preset Amounts */}
            <div className="space-y-3">
              <Label>Donation Amount</Label>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={formData.amount === amount.toString() ? "default" : "outline"}
                    onClick={() => handleAmountSelect(amount)}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="customAmount">Custom Amount</Label>
              <Input
                id="customAmount"
                type="number"
                placeholder="Enter custom amount"
                value={formData.customAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, customAmount: e.target.value, amount: "" }))}
                min="1"
                step="0.01"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Donation Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Donor Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="donorName">Full Name *</Label>
                <Input
                  id="donorName"
                  value={formData.donorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donorEmail">Email Address *</Label>
                <Input
                  id="donorEmail"
                  type="email"
                  value={formData.donorEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, donorEmail: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Share a prayer request or message..."
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Anonymous Donation */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={formData.anonymous}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, anonymous: !!checked }))}
              />
              <Label htmlFor="anonymous">Make this donation anonymous</Label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Processing..." : `Donate $${formData.customAmount || formData.amount || "0"}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};