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
import { User, Settings, Save, Lock, Upload, X, Image } from "lucide-react";

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
  logo_url: string | null;
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
  const [uploading, setUploading] = useState<{avatar?: boolean, logo?: boolean}>({});

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
        logo_url: null,
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

  const handleFileUpload = async (file: File, type: 'avatar' | 'logo') => {
    if (!user || !file) return;

    setUploading(prev => ({ ...prev, [type]: true }));

    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      // Update profile with the new URL
      const fieldName = type === 'avatar' ? 'avatar_url' : 'logo_url';
      handleInputChange(fieldName, publicUrl);

      toast({
        title: "Success",
        description: `${type === 'avatar' ? 'Profile picture' : 'Logo'} uploaded successfully`,
      });
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to upload ${type === 'avatar' ? 'profile picture' : 'logo'}`,
        variant: "destructive",
      });
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleRemoveImage = async (type: 'avatar' | 'logo') => {
    const fieldName = type === 'avatar' ? 'avatar_url' : 'logo_url';
    const currentUrl = profile?.[fieldName];
    
    if (currentUrl) {
      try {
        // Extract filename from URL
        const urlParts = currentUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const fullPath = `${user?.id}/${fileName}`;

        // Remove from storage
        await supabase.storage
          .from('profile-images')
          .remove([fullPath]);
      } catch (error) {
        console.error(`Error removing ${type} from storage:`, error);
      }
    }

    handleInputChange(fieldName, '');
    toast({
      title: "Success",
      description: `${type === 'avatar' ? 'Profile picture' : 'Logo'} removed`,
    });
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
        <CardContent className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary">Profile Images</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Picture Upload */}
              <div className="space-y-3">
                <Label>Profile Picture</Label>
                <div className="flex flex-col items-center space-y-3">
                  {profile?.avatar_url ? (
                    <div className="relative group">
                      <img
                        src={profile.avatar_url}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-muted"
                      />
                      {isEditing && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage('avatar')}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  {isEditing && (
                    <div className="flex flex-col items-center space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'avatar');
                        }}
                        className="w-full"
                        disabled={uploading.avatar}
                      />
                      {uploading.avatar && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span>Uploading...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-3">
                <Label>Organization Logo</Label>
                <div className="flex flex-col items-center space-y-3">
                  {profile?.logo_url ? (
                    <div className="relative group">
                      <img
                        src={profile.logo_url}
                        alt="Logo"
                        className="w-24 h-24 rounded-lg object-cover border-2 border-muted"
                      />
                      {isEditing && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage('logo')}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-muted border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  {isEditing && (
                    <div className="flex flex-col items-center space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'logo');
                        }}
                        className="w-full"
                        disabled={uploading.logo}
                      />
                      {uploading.logo && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span>Uploading...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
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