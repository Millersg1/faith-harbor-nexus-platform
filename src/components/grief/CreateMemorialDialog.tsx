import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CreateMemorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMemorialCreated: () => void;
}

export function CreateMemorialDialog({ open, onOpenChange, onMemorialCreated }: CreateMemorialDialogProps) {
  const [formData, setFormData] = useState({
    deceased_name: "",
    date_of_birth: null as Date | null,
    date_of_passing: null as Date | null,
    biography: "",
    photo_url: "",
    service_date: null as Date | null,
    service_location: "",
    family_contact_info: "",
    memorial_fund_info: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.deceased_name || !formData.date_of_passing) {
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
      
      const { error } = await supabase
        .from('memorials')
        .insert({
          deceased_name: formData.deceased_name,
          date_of_birth: formData.date_of_birth?.toISOString().split('T')[0] || null,
          date_of_passing: formData.date_of_passing.toISOString().split('T')[0],
          biography: formData.biography || null,
          photo_url: formData.photo_url || null,
          service_date: formData.service_date?.toISOString() || null,
          service_location: formData.service_location || null,
          family_contact_info: formData.family_contact_info || null,
          memorial_fund_info: formData.memorial_fund_info || null,
          created_by: userData.user?.id || null,
          status: 'active'
        });

      if (error) throw error;

      // Reset form
      setFormData({
        deceased_name: "",
        date_of_birth: null,
        date_of_passing: null,
        biography: "",
        photo_url: "",
        service_date: null,
        service_location: "",
        family_contact_info: "",
        memorial_fund_info: ""
      });

      onMemorialCreated();
    } catch (error) {
      console.error('Error creating memorial:', error);
      toast({
        title: "Error",
        description: "Failed to create memorial",
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
          <DialogTitle>Create Memorial</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deceased_name">Name *</Label>
              <Input
                id="deceased_name"
                value={formData.deceased_name}
                onChange={(e) => setFormData({ ...formData, deceased_name: e.target.value })}
                placeholder="Full name of the deceased"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date_of_birth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date_of_birth ? format(formData.date_of_birth, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date_of_birth || undefined}
                    onSelect={(date) => setFormData({ ...formData, date_of_birth: date || null })}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1920}
                    toYear={new Date().getFullYear()}
                    className="pointer-events-auto p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Date of Passing *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date_of_passing && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date_of_passing ? format(formData.date_of_passing, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date_of_passing || undefined}
                    onSelect={(date) => setFormData({ ...formData, date_of_passing: date || null })}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1920}
                    toYear={new Date().getFullYear()}
                    className="pointer-events-auto p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo_url">Photo URL</Label>
              <Input
                id="photo_url"
                value={formData.photo_url}
                onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                placeholder="Link to memorial photo"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="biography">Life Story & Biography</Label>
            <Textarea
              id="biography"
              value={formData.biography}
              onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
              placeholder="Share the life story, achievements, and memories of the departed..."
              rows={4}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Service Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.service_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.service_date ? format(formData.service_date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.service_date || undefined}
                    onSelect={(date) => setFormData({ ...formData, service_date: date || null })}
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
              <Label htmlFor="service_location">Service Location</Label>
              <Input
                id="service_location"
                value={formData.service_location}
                onChange={(e) => setFormData({ ...formData, service_location: e.target.value })}
                placeholder="Location of memorial service"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="family_contact_info">Family Contact Information</Label>
            <Textarea
              id="family_contact_info"
              value={formData.family_contact_info}
              onChange={(e) => setFormData({ ...formData, family_contact_info: e.target.value })}
              placeholder="Contact information for the family (phone, email, address for condolences)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="memorial_fund_info">Memorial Fund Information</Label>
            <Textarea
              id="memorial_fund_info"
              value={formData.memorial_fund_info}
              onChange={(e) => setFormData({ ...formData, memorial_fund_info: e.target.value })}
              placeholder="Information about memorial funds, charity donations, or other ways to honor their memory"
              rows={2}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Memorial"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}