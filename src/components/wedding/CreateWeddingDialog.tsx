import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateWeddingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWeddingCreated: () => void;
}

export const CreateWeddingDialog: React.FC<CreateWeddingDialogProps> = ({
  open,
  onOpenChange,
  onWeddingCreated
}) => {
  const [formData, setFormData] = useState({
    bride_name: '',
    groom_name: '',
    contact_email: '',
    contact_phone: '',
    wedding_date: undefined as Date | undefined,
    engagement_date: undefined as Date | undefined,
    venue_location: '',
    reception_location: '',
    ceremony_type: 'traditional',
    estimated_guests: '',
    budget_amount: '',
    special_requests: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('wedding_couples')
        .insert({
          bride_name: formData.bride_name,
          groom_name: formData.groom_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          wedding_date: formData.wedding_date?.toISOString().split('T')[0],
          engagement_date: formData.engagement_date?.toISOString().split('T')[0],
          venue_location: formData.venue_location,
          reception_location: formData.reception_location,
          ceremony_type: formData.ceremony_type,
          estimated_guests: formData.estimated_guests ? parseInt(formData.estimated_guests) : null,
          budget_amount: formData.budget_amount ? parseFloat(formData.budget_amount) * 100 : null,
          special_requests: formData.special_requests,
          planning_status: 'planning'
        });

      if (error) throw error;

      toast({
        title: "Wedding Created",
        description: "Wedding planning has been started successfully",
      });

      onWeddingCreated();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        bride_name: '',
        groom_name: '',
        contact_email: '',
        contact_phone: '',
        wedding_date: undefined,
        engagement_date: undefined,
        venue_location: '',
        reception_location: '',
        ceremony_type: 'traditional',
        estimated_guests: '',
        budget_amount: '',
        special_requests: ''
      });
    } catch (error) {
      console.error('Error creating wedding:', error);
      toast({
        title: "Error",
        description: "Failed to create wedding planning",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Wedding</DialogTitle>
          <DialogDescription>
            Start planning a new wedding ceremony. Fill in the basic information to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bride_name">Bride's Name *</Label>
              <Input
                id="bride_name"
                value={formData.bride_name}
                onChange={(e) => setFormData({ ...formData, bride_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groom_name">Groom's Name *</Label>
              <Input
                id="groom_name"
                value={formData.groom_name}
                onChange={(e) => setFormData({ ...formData, groom_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email *</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Engagement Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.engagement_date ? format(formData.engagement_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.engagement_date}
                    onSelect={(date) => setFormData({ ...formData, engagement_date: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Wedding Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.wedding_date ? format(formData.wedding_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.wedding_date}
                    onSelect={(date) => setFormData({ ...formData, wedding_date: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ceremony_type">Ceremony Type</Label>
            <Select value={formData.ceremony_type} onValueChange={(value) => setFormData({ ...formData, ceremony_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="traditional">Traditional</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="destination">Destination</SelectItem>
                <SelectItem value="intimate">Intimate</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="venue_location">Ceremony Venue</Label>
              <Input
                id="venue_location"
                value={formData.venue_location}
                onChange={(e) => setFormData({ ...formData, venue_location: e.target.value })}
                placeholder="Church, venue, or location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reception_location">Reception Venue</Label>
              <Input
                id="reception_location"
                value={formData.reception_location}
                onChange={(e) => setFormData({ ...formData, reception_location: e.target.value })}
                placeholder="Reception hall or location"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_guests">Estimated Guests</Label>
              <Input
                id="estimated_guests"
                type="number"
                value={formData.estimated_guests}
                onChange={(e) => setFormData({ ...formData, estimated_guests: e.target.value })}
                placeholder="Number of expected guests"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget_amount">Total Budget ($)</Label>
              <Input
                id="budget_amount"
                type="number"
                step="0.01"
                value={formData.budget_amount}
                onChange={(e) => setFormData({ ...formData, budget_amount: e.target.value })}
                placeholder="Total wedding budget"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_requests">Special Requests or Notes</Label>
            <Textarea
              id="special_requests"
              value={formData.special_requests}
              onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
              placeholder="Any special requests, themes, or important notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Wedding'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};