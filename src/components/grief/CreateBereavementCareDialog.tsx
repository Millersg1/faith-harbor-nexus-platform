import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CreateBereavementCareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCareCreated: () => void;
}

export function CreateBereavementCareDialog({ open, onOpenChange, onCareCreated }: CreateBereavementCareDialogProps) {
  const [formData, setFormData] = useState({
    memorial_id: "",
    care_type: "",
    description: "",
    scheduled_date: null as Date | null
  });
  const [memorials, setMemorials] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const careTypes = [
    { value: "pastoral_visit", label: "Pastoral Visit" },
    { value: "meal_train", label: "Meal Train" },
    { value: "transportation", label: "Transportation" },
    { value: "childcare", label: "Childcare" },
    { value: "other", label: "Other" }
  ];

  useEffect(() => {
    if (open) {
      fetchMemorials();
    }
  }, [open]);

  const fetchMemorials = async () => {
    try {
      const { data, error } = await supabase
        .from('memorials')
        .select('id, deceased_name')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemorials(data || []);
    } catch (error) {
      console.error('Error fetching memorials:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.memorial_id || !formData.care_type) {
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
        .from('bereavement_care')
        .insert({
          memorial_id: formData.memorial_id,
          care_coordinator_id: userData.user?.id || null,
          care_type: formData.care_type,
          description: formData.description || null,
          scheduled_date: formData.scheduled_date?.toISOString() || null,
          status: 'pending'
        });

      if (error) throw error;

      setFormData({
        memorial_id: "",
        care_type: "",
        description: "",
        scheduled_date: null
      });

      onCareCreated();
    } catch (error) {
      console.error('Error creating care item:', error);
      toast({
        title: "Error",
        description: "Failed to create bereavement care item",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Bereavement Care</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Memorial *</Label>
            <Select value={formData.memorial_id} onValueChange={(value) => setFormData({ ...formData, memorial_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select memorial" />
              </SelectTrigger>
              <SelectContent>
                {memorials.map((memorial) => (
                  <SelectItem key={memorial.id} value={memorial.id}>
                    {memorial.deceased_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Care Type *</Label>
            <Select value={formData.care_type} onValueChange={(value) => setFormData({ ...formData, care_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select care type" />
              </SelectTrigger>
              <SelectContent>
                {careTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Details about the care needed..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Scheduled Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.scheduled_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.scheduled_date ? format(formData.scheduled_date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.scheduled_date || undefined}
                  onSelect={(date) => setFormData({ ...formData, scheduled_date: date || null })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}