import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Settings, Save, Lock } from "lucide-react";

interface Profile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  organization_name: string | null;
  organization_type: string | null;
  phone: string | null;
  website: string | null;
  bio: string | null;
  avatar_url: string | null;
  bio_name: string | null;
  bio_room: string | null;
  admin_notes: string | null;
}

interface UserRole {
  role_name: string;
}

const ProfileSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isAdmin = userRoles.some(role => 
    ['admin', 'pastor', 'staff'].includes(role.role_name)
  );

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserRoles();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data || {
        user_id: user?.id || '',
        first_name: null,
        last_name: null,
        display_name: null,
        organization_name: null,
        organization_type: null,
        phone: null,
        website: null,
        bio: null,
        avatar_url: null,
        bio_name: null,
        bio_room: null,
        admin_notes: null
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('member_roles')
        .select('role_name')
        .eq('user_id', user?.id)
        .eq('active', true);

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          ...profile
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </CardTitle>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
              disabled={saving}
            >
              {isEditing ? (
                <>Cancel</>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={profile?.display_name || ''}
                onChange={(e) => handleInputChange('display_name', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={profile?.first_name || ''}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={profile?.last_name || ''}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile?.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profile?.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <Separator />

          {/* Bio Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary">Bio Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bio_name">Bio Name</Label>
                <Input
                  id="bio_name"
                  value={profile?.bio_name || ''}
                  onChange={(e) => handleInputChange('bio_name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Name for bio display"
                />
              </div>
              <div>
                <Label htmlFor="bio_room">Room</Label>
                <Input
                  id="bio_room"
                  value={profile?.bio_room || ''}
                  onChange={(e) => handleInputChange('bio_room', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Room number or location"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile?.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>
          </div>

          <Separator />

          {/* Organization Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary">Organization</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organization_name">Organization Name</Label>
                <Input
                  id="organization_name"
                  value={profile?.organization_name || ''}
                  onChange={(e) => handleInputChange('organization_name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="organization_type">Organization Type</Label>
                <select
                  id="organization_type"
                  value={profile?.organization_type || ''}
                  onChange={(e) => handleInputChange('organization_type', e.target.value)}
                  disabled={!isEditing}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Select type</option>
                  <option value="church">Church</option>
                  <option value="business">Business</option>
                  <option value="nonprofit">Nonprofit</option>
                  <option value="individual">Individual</option>
                </select>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <Label>Member Since</Label>
            <p className="text-muted-foreground">
              {new Date(user?.created_at || '').toLocaleDateString()}
            </p>
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Notes Section - Only visible to admins */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-amber-600">
              <Lock className="h-5 w-5 mr-2" />
              Admin Notes
              <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                Admin Only
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="admin_notes">Internal Notes</Label>
              <Textarea
                id="admin_notes"
                value={profile?.admin_notes || ''}
                onChange={(e) => handleInputChange('admin_notes', e.target.value)}
                disabled={!isEditing}
                placeholder="Internal notes visible only to administrators..."
                rows={4}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                These notes are only visible to admins, pastors, and staff members.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileSection;