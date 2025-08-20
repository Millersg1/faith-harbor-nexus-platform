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
import type { Database } from '@/integrations/supabase/types';

interface CreateBaptismDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBaptismCreated: () => void;
}

export const CreateBaptismDialog: React.FC<CreateBaptismDialogProps> = ({
  open,
  onOpenChange,
  onBaptismCreated
}) => {
  const [formData, setFormData] = useState({
    candidate_name: '',
    candidate_email: '',
    candidate_phone: '',
    date_of_birth: undefined as Date | undefined,
    baptism_date: undefined as Date | undefined,
    sacrament_type: 'baptism',
    baptism_method: 'immersion',
    location: '',
    parent_guardian_name: '',
    parent_guardian_email: '',
    parent_guardian_phone: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    special_requests: '',
    medical_considerations: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('baptisms')
        .insert([{
          candidate_name: formData.candidate_name,
          candidate_email: formData.candidate_email || null,
          candidate_phone: formData.candidate_phone || null,
          date_of_birth: formData.date_of_birth?.toISOString().split('T')[0] || null,
          baptism_date: formData.baptism_date?.toISOString() || new Date().toISOString(),
          sacrament_type: formData.sacrament_type as Database['public']['Enums']['sacrament_type'],
          baptism_method: formData.baptism_method as Database['public']['Enums']['baptism_method'],
          location: formData.location,
          parent_guardian_name: formData.parent_guardian_name || null,
          parent_guardian_email: formData.parent_guardian_email || null,
          parent_guardian_phone: formData.parent_guardian_phone || null,
          emergency_contact_name: formData.emergency_contact_name || null,
          emergency_contact_phone: formData.emergency_contact_phone || null,
          special_requests: formData.special_requests || null,
          medical_considerations: formData.medical_considerations || null,
          notes: formData.notes || null,
          status: 'scheduled'
        }]);

      if (error) throw error;

      toast({
        title: "Baptism Scheduled",
        description: "The baptism has been successfully scheduled",
      });

      onBaptismCreated();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        candidate_name: '',
        candidate_email: '',
        candidate_phone: '',
        date_of_birth: undefined,
        baptism_date: undefined,
        sacrament_type: 'baptism',
        baptism_method: 'immersion',
        location: '',
        parent_guardian_name: '',
        parent_guardian_email: '',
        parent_guardian_phone: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        special_requests: '',
        medical_considerations: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating baptism:', error);
      toast({
        title: "Error",
        description: "Failed to schedule baptism",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule New Baptism</DialogTitle>
          <DialogDescription>
            Schedule a baptism or other sacrament. Fill in the candidate information and ceremony details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Candidate Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Candidate Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="candidate_name">Full Name *</Label>
                <Input
                  id="candidate_name"
                  value={formData.candidate_name}
                  onChange={(e) => setFormData({ ...formData, candidate_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="candidate_email">Email</Label>
                <Input
                  id="candidate_email"
                  type="email"
                  value={formData.candidate_email}
                  onChange={(e) => setFormData({ ...formData, candidate_email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="candidate_phone">Phone</Label>
                <Input
                  id="candidate_phone"
                  type="tel"
                  value={formData.candidate_phone}
                  onChange={(e) => setFormData({ ...formData, candidate_phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date_of_birth ? format(formData.date_of_birth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date_of_birth}
                      onSelect={(date) => setFormData({ ...formData, date_of_birth: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Ceremony Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ceremony Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sacrament Type</Label>
                <Select value={formData.sacrament_type} onValueChange={(value) => setFormData({ ...formData, sacrament_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baptism">Baptism</SelectItem>
                    <SelectItem value="confirmation">Confirmation</SelectItem>
                    <SelectItem value="communion">First Communion</SelectItem>
                    <SelectItem value="dedication">Child Dedication</SelectItem>
                    <SelectItem value="blessing">Blessing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Baptism Method</Label>
                <Select value={formData.baptism_method} onValueChange={(value) => setFormData({ ...formData, baptism_method: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immersion">Full Immersion</SelectItem>
                    <SelectItem value="sprinkling">Sprinkling</SelectItem>
                    <SelectItem value="pouring">Pouring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ceremony Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.baptism_date ? format(formData.baptism_date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.baptism_date}
                      onSelect={(date) => setFormData({ ...formData, baptism_date: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Church sanctuary, baptism pool, etc."
                  required
                />
              </div>
            </div>
          </div>

          {/* Family/Guardian Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Family/Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parent_guardian_name">Parent/Guardian Name</Label>
                <Input
                  id="parent_guardian_name"
                  value={formData.parent_guardian_name}
                  onChange={(e) => setFormData({ ...formData, parent_guardian_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent_guardian_email">Parent/Guardian Email</Label>
                <Input
                  id="parent_guardian_email"
                  type="email"
                  value={formData.parent_guardian_email}
                  onChange={(e) => setFormData({ ...formData, parent_guardian_email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent_guardian_phone">Parent/Guardian Phone</Label>
                <Input
                  id="parent_guardian_phone"
                  type="tel"
                  value={formData.parent_guardian_phone}
                  onChange={(e) => setFormData({ ...formData, parent_guardian_phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                <Input
                  id="emergency_contact_phone"
                  type="tel"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="special_requests">Special Requests</Label>
                <Textarea
                  id="special_requests"
                  value={formData.special_requests}
                  onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                  placeholder="Any special requests for the ceremony..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medical_considerations">Medical Considerations</Label>
                <Textarea
                  id="medical_considerations"
                  value={formData.medical_considerations}
                  onChange={(e) => setFormData({ ...formData, medical_considerations: e.target.value })}
                  placeholder="Any medical considerations or accessibility needs..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes or comments..."
                  rows={2}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Scheduling...' : 'Schedule Baptism'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};