import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Calendar, MapPin, DollarSign, Users } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  end_date: string;
  location: string;
  max_capacity: number;
  cost: number;
  registrations?: { id: string }[];
}

interface EventRegistrationDialogProps {
  event: Event;
  onRegistrationComplete: () => void;
  disabled: boolean;
}

export const EventRegistrationDialog = ({ 
  event, 
  onRegistrationComplete, 
  disabled 
}: EventRegistrationDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    attendee_name: user?.user_metadata?.full_name || user?.email || "",
    attendee_email: user?.email || "",
    attendee_phone: "",
    number_of_guests: 0,
    special_requests: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    dietary_restrictions: "",
    accessibility_needs: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'number_of_guests' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: event.id,
          user_id: user.id,
          ...formData,
          payment_status: event.cost > 0 ? 'pending' : 'free',
          registration_data: {
            total_attendees: 1 + formData.number_of_guests,
            registration_source: 'web_portal'
          }
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already registered",
            description: "You're already registered for this event",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Registration successful!",
          description: event.cost > 0 
            ? "You've been registered. Payment instructions will be sent to your email."
            : "You've been registered for the event",
        });
        setIsOpen(false);
        onRegistrationComplete();
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="w-full">
          <UserPlus className="h-4 w-4 mr-2" />
          Register
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Register for {event.title}
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              {format(new Date(event.event_date), 'PPP p')}
              {event.end_date && ` - ${format(new Date(event.end_date), 'p')}`}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              {event.location}
            </div>
            {event.cost > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4" />
                ${(event.cost / 100).toFixed(2)} per person
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              {event.registrations?.length || 0} / {event.max_capacity} registered
            </div>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="attendee_name">Full Name *</Label>
              <Input
                id="attendee_name"
                name="attendee_name"
                value={formData.attendee_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendee_email">Email Address *</Label>
              <Input
                id="attendee_email"
                name="attendee_email"
                type="email"
                value={formData.attendee_email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="attendee_phone">Phone Number</Label>
              <Input
                id="attendee_phone"
                name="attendee_phone"
                type="tel"
                value={formData.attendee_phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number_of_guests">Number of Guests</Label>
              <Input
                id="number_of_guests"
                name="number_of_guests"
                type="number"
                min="0"
                max="10"
                value={formData.number_of_guests}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
              <Input
                id="emergency_contact_name"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
              <Input
                id="emergency_contact_phone"
                name="emergency_contact_phone"
                type="tel"
                value={formData.emergency_contact_phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
            <Input
              id="dietary_restrictions"
              name="dietary_restrictions"
              placeholder="e.g., vegetarian, gluten-free, allergies"
              value={formData.dietary_restrictions}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessibility_needs">Accessibility Needs</Label>
            <Input
              id="accessibility_needs"
              name="accessibility_needs"
              placeholder="e.g., wheelchair access, hearing assistance"
              value={formData.accessibility_needs}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_requests">Special Requests or Comments</Label>
            <Textarea
              id="special_requests"
              name="special_requests"
              placeholder="Any additional information or requests..."
              value={formData.special_requests}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          {event.cost > 0 && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-medium text-amber-800 mb-2">Payment Information</h4>
              <p className="text-sm text-amber-700">
                Total cost: ${((event.cost * (1 + formData.number_of_guests)) / 100).toFixed(2)} 
                {formData.number_of_guests > 0 && (
                  <span> ({1 + formData.number_of_guests} attendees)</span>
                )}
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Payment instructions will be sent to your email after registration.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Complete Registration"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};