import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  title: string;
  price_type: string;
  price_amount: number | null;
  hourly_rate: number | null;
  provider?: {
    business_name: string | null;
    user_id: string;
  } | null;
}

interface ServiceBookingDialogProps {
  service: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceBookingDialog({ service, open, onOpenChange }: ServiceBookingDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [customerNotes, setCustomerNotes] = useState("");
  const [bookingType, setBookingType] = useState("one_time");
  const [recurringFrequency, setRecurringFrequency] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const calculatePrice = () => {
    if (service.price_type === 'fixed' && service.price_amount) {
      return service.price_amount / 100;
    }
    if (service.price_type === 'hourly' && service.hourly_rate) {
      return (service.hourly_rate / 100) * (parseInt(duration) / 60);
    }
    return 0;
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select a date and time",
        variant: "destructive",
      });
      return;
    }

    if (bookingType === 'recurring' && !recurringFrequency) {
      toast({
        title: "Error", 
        description: "Please select recurring frequency",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const bookingDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      bookingDateTime.setHours(parseInt(hours), parseInt(minutes));

      const { data, error } = await supabase.functions.invoke('create-booking', {
        body: {
          serviceId: service.id,
          bookingDate: bookingDateTime.toISOString(),
          duration: parseInt(duration),
          customerNotes,
          bookingType,
          recurringFrequency: bookingType === 'recurring' ? recurringFrequency : null
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Booking request sent! The provider will review and approve your request.",
      });

      onOpenChange(false);
      
      // Reset form
      setSelectedDate(undefined);
      setSelectedTime("");
      setDuration("60");
      setCustomerNotes("");
      setBookingType("one_time");
      setRecurringFrequency("");

    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Book Service</DialogTitle>
          <DialogDescription>
            Request to book "{service.title}" with {service.provider?.business_name || 'service provider'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Booking Type */}
          <div>
            <Label htmlFor="booking-type">Booking Type</Label>
            <Select value={bookingType} onValueChange={setBookingType}>
              <SelectTrigger>
                <SelectValue placeholder="Select booking type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one_time">One-time Service</SelectItem>
                <SelectItem value="recurring">Recurring Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recurring Frequency */}
          {bookingType === 'recurring' && (
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date Selection */}
          <div>
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>

          {/* Duration */}
          {service.price_type === 'hourly' && (
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Price Display */}
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estimated Total</span>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-lg font-semibold">
                  ${calculatePrice().toFixed(2)}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              50% upfront (${(calculatePrice() * 0.5).toFixed(2)}), 50% on completion
            </p>
            <p className="text-xs text-muted-foreground">
              12% commission included
            </p>
          </div>

          {/* Customer Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements or notes for the provider..."
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Submitting..." : "Submit Booking Request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}