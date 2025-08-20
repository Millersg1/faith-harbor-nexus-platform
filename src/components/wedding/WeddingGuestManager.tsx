import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Plus, Mail, Phone, Check, X, Gift, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Guest {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  plus_one_name: string;
  rsvp_status: string;
  rsvp_date: string;
  dietary_restrictions: string;
  accommodation_needed: boolean;
  guest_type: string;
  invitation_sent: boolean;
  thank_you_sent: boolean;
  gift_received: string;
  notes: string;
}

interface WeddingGuestManagerProps {
  weddingId: string;
}

export const WeddingGuestManager: React.FC<WeddingGuestManagerProps> = ({ weddingId }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    plus_one_name: '',
    guest_type: 'friend',
    dietary_restrictions: '',
    accommodation_needed: false,
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadGuests();
  }, [weddingId]);

  const loadGuests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wedding_guests')
        .select('*')
        .eq('couple_id', weddingId)
        .order('guest_name');

      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error('Error loading guests:', error);
      toast({
        title: "Error Loading Guests",
        description: "Failed to load guest list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      guest_name: '',
      guest_email: '',
      guest_phone: '',
      plus_one_name: '',
      guest_type: 'friend',
      dietary_restrictions: '',
      accommodation_needed: false,
      notes: ''
    });
    setEditingGuest(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const guestData = {
        couple_id: weddingId,
        guest_name: formData.guest_name,
        guest_email: formData.guest_email || null,
        guest_phone: formData.guest_phone || null,
        plus_one_name: formData.plus_one_name || null,
        guest_type: formData.guest_type,
        dietary_restrictions: formData.dietary_restrictions || null,
        accommodation_needed: formData.accommodation_needed,
        notes: formData.notes || null
      };

      if (editingGuest) {
        const { error } = await supabase
          .from('wedding_guests')
          .update(guestData)
          .eq('id', editingGuest.id);

        if (error) throw error;

        toast({
          title: "Guest Updated",
          description: "Guest information has been updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('wedding_guests')
          .insert(guestData);

        if (error) throw error;

        toast({
          title: "Guest Added",
          description: "Guest has been added to the wedding list",
        });
      }

      loadGuests();
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving guest:', error);
      toast({
        title: "Error",
        description: "Failed to save guest information",
        variant: "destructive",
      });
    }
  };

  const updateRSVP = async (guestId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('wedding_guests')
        .update({ 
          rsvp_status: status,
          rsvp_date: new Date().toISOString()
        })
        .eq('id', guestId);

      if (error) throw error;

      loadGuests();
      toast({
        title: "RSVP Updated",
        description: `Guest RSVP has been marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating RSVP:', error);
      toast({
        title: "Error",
        description: "Failed to update RSVP status",
        variant: "destructive",
      });
    }
  };

  const markInvitationSent = async (guestId: string) => {
    try {
      const { error } = await supabase
        .from('wedding_guests')
        .update({ 
          invitation_sent: true,
          invitation_sent_at: new Date().toISOString()
        })
        .eq('id', guestId);

      if (error) throw error;

      loadGuests();
      toast({
        title: "Invitation Marked",
        description: "Invitation has been marked as sent",
      });
    } catch (error) {
      console.error('Error marking invitation:', error);
    }
  };

  const deleteGuest = async (guestId: string) => {
    if (!confirm('Are you sure you want to remove this guest?')) return;

    try {
      const { error } = await supabase
        .from('wedding_guests')
        .delete()
        .eq('id', guestId);

      if (error) throw error;

      loadGuests();
      toast({
        title: "Guest Removed",
        description: "Guest has been removed from the wedding list",
      });
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast({
        title: "Error",
        description: "Failed to remove guest",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      guest_name: guest.guest_name,
      guest_email: guest.guest_email || '',
      guest_phone: guest.guest_phone || '',
      plus_one_name: guest.plus_one_name || '',
      guest_type: guest.guest_type,
      dietary_restrictions: guest.dietary_restrictions || '',
      accommodation_needed: guest.accommodation_needed,
      notes: guest.notes || ''
    });
    setShowCreateDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredGuests = guests.filter(guest => {
    if (filter === 'all') return true;
    return guest.rsvp_status === filter;
  });

  const stats = {
    total: guests.length,
    accepted: guests.filter(g => g.rsvp_status === 'accepted').length,
    declined: guests.filter(g => g.rsvp_status === 'declined').length,
    pending: guests.filter(g => g.rsvp_status === 'pending').length,
    invitationsSent: guests.filter(g => g.invitation_sent).length
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Guest Management</h3>
          <p className="text-muted-foreground">Manage your wedding guest list and RSVPs</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Guest
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Guests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <div className="text-sm text-muted-foreground">Accepted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
            <div className="text-sm text-muted-foreground">Declined</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.invitationsSent}</div>
            <div className="text-sm text-muted-foreground">Invites Sent</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Guests</SelectItem>
            <SelectItem value="pending">Pending RSVP</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Guest List */}
      <Card>
        <CardHeader>
          <CardTitle>Guest List</CardTitle>
          <CardDescription>
            {filteredGuests.length} of {guests.length} guests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredGuests.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Guests Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your guest list for the wedding
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Guest
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Plus One</TableHead>
                  <TableHead>RSVP Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{guest.guest_name}</div>
                        {guest.dietary_restrictions && (
                          <div className="text-xs text-muted-foreground">
                            Dietary: {guest.dietary_restrictions}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {guest.guest_email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {guest.guest_email}
                          </div>
                        )}
                        {guest.guest_phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {guest.guest_phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {guest.plus_one_name ? (
                        <div className="flex items-center gap-1">
                          <UserPlus className="h-3 w-3" />
                          {guest.plus_one_name}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Badge className={getStatusColor(guest.rsvp_status)}>
                          {guest.rsvp_status.charAt(0).toUpperCase() + guest.rsvp_status.slice(1)}
                        </Badge>
                        {guest.rsvp_status === 'pending' && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRSVP(guest.id, 'accepted')}
                              className="h-6 px-2"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRSVP(guest.id, 'declined')}
                              className="h-6 px-2"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {guest.guest_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {!guest.invitation_sent && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markInvitationSent(guest.id)}
                            title="Mark invitation as sent"
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(guest)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteGuest(guest.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Guest Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        setShowCreateDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingGuest ? 'Edit Guest' : 'Add New Guest'}</DialogTitle>
            <DialogDescription>
              {editingGuest ? 'Update guest information' : 'Add a new guest to the wedding list'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guest_name">Guest Name *</Label>
              <Input
                id="guest_name"
                value={formData.guest_name}
                onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guest_email">Email</Label>
                <Input
                  id="guest_email"
                  type="email"
                  value={formData.guest_email}
                  onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest_phone">Phone</Label>
                <Input
                  id="guest_phone"
                  type="tel"
                  value={formData.guest_phone}
                  onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plus_one_name">Plus One Name</Label>
                <Input
                  id="plus_one_name"
                  value={formData.plus_one_name}
                  onChange={(e) => setFormData({ ...formData, plus_one_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest_type">Guest Type</Label>
                <Select value={formData.guest_type} onValueChange={(value) => setFormData({ ...formData, guest_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="colleague">Colleague</SelectItem>
                    <SelectItem value="neighbor">Neighbor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
              <Input
                id="dietary_restrictions"
                value={formData.dietary_restrictions}
                onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
                placeholder="Vegetarian, allergies, etc."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="accommodation_needed"
                checked={formData.accommodation_needed}
                onCheckedChange={(checked) => setFormData({ ...formData, accommodation_needed: checked })}
              />
              <Label htmlFor="accommodation_needed">Accommodation needed</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                placeholder="Additional notes about this guest..."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingGuest ? 'Update Guest' : 'Add Guest'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};