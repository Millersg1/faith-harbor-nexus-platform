import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CreateGriefSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSessionCreated: () => void;
}

export function CreateGriefSessionDialog({ open, onOpenChange, onSessionCreated }: CreateGriefSessionDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    session_type: "",
    session_date: null as Date | null,
    session_time: "10:00",
    duration_minutes: 60,
    location: "",
    max_participants: 12,
    registration_required: true,
    cost: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const sessionTypes = [
    { value: "support_group", label: "Support Group" },
    { value: "individual_counseling", label: "Individual Counseling" },
    { value: "workshop", label: "Workshop" },
    { value: "retreat", label: "Retreat" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.session_type || !formData.session_date) {
      toast({
        title: "Error",
        description: "Please fill in the required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      // Combine date and time
      const [hours, minutes] = formData.session_time.split(':').map(Number);
      const sessionDateTime = new Date(formData.session_date);
      sessionDateTime.setHours(hours, minutes, 0, 0);
      
      const { error } = await supabase
        .from('grief_support_sessions')
        .insert({
          title: formData.title,
          description: formData.description || null,
          session_type: formData.session_type,
          facilitator_id: userData.user?.id || null,
          session_date: sessionDateTime.toISOString(),
          duration_minutes: formData.duration_minutes,
          location: formData.location || null,
          max_participants: formData.max_participants > 0 ? formData.max_participants : null,
          registration_required: formData.registration_required,
          cost: formData.cost * 100, // Convert to cents
          status: 'scheduled'
        });

      if (error) throw error;

      // Reset form
      setFormData({
        title: "",
        description: "",
        session_type: "",
        session_date: null,
        session_time: "10:00",
        duration_minutes: 60,
        location: "",
        max_participants: 12,
        registration_required: true,
        cost: 0
      });

      onSessionCreated();
    } catch (error) {
      console.error('Error creating grief session:', error);
      toast({
        title: "Error",
        description: "Failed to create grief support session",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Grief Support Session</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Session Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Weekly Grief Support Group"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Session Type *</Label>
              <Select 
                value={formData.session_type} 
                onValueChange={(value) => setFormData({ ...formData, session_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  {sessionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this session will cover and who it's for..."
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Session Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.session_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.session_date ? format(formData.session_date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.session_date || undefined}
                    onSelect={(date) => setFormData({ ...formData, session_date: date || null })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={new Date().getFullYear()}
                    toYear={new Date().getFullYear() + 2}
                    className="pointer-events-auto p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session_time">Time</Label>
              <Input
                id="session_time"
                type="time"
                value={formData.session_time}
                onChange={(e) => setFormData({ ...formData, session_time: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })}
                min="15"
                max="480"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Church Fellowship Hall"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_participants">Max Participants</Label>
              <Input
                id="max_participants"
                type="number"
                value={formData.max_participants}
                onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 0 })}
                min="0"
                placeholder="0 for unlimited"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cost">Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                min="0"
                placeholder="0.00 for free"
              />
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="registration_required"
                checked={formData.registration_required}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, registration_required: checked as boolean })
                }
              />
              <Label htmlFor="registration_required">Registration Required</Label>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Schedule Session"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}