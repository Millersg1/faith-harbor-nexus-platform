import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { 
  Users, 
  Search, 
  UserPlus, 
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Settings,
  Eye,
  EyeOff,
  Filter,
  Heart,
  Calendar
} from "lucide-react";

interface DirectoryMember {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  avatar_url?: string;
  directory_bio?: string;
  ministry_interests?: string[];
  skills?: string[];
  show_email: boolean;
  show_phone: boolean;
  show_address: boolean;
  show_birthday: boolean;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  date_of_birth?: string;
  member_status?: string;
}

const MemberDirectory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState<DirectoryMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<DirectoryMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [directorySettings, setDirectorySettings] = useState({
    is_visible: true,
    show_email: false,
    show_phone: false,
    show_address: false,
    show_birthday: true,
    show_ministry_interests: true,
    show_skills: true,
    directory_bio: "",
    contact_preferences: { email: true, phone: false, in_person: true }
  });

  useEffect(() => {
    if (user) {
      fetchMembers();
      fetchDirectorySettings();
    }
  }, [user]);

  useEffect(() => {
    filterMembers();
  }, [searchTerm, selectedFilters, members]);

  const fetchMembers = async () => {
    try {
      // First get visible directory entries
      const { data: directoryData, error: directoryError } = await supabase
        .from('member_directory')
        .select('user_id, show_email, show_phone, show_address, show_birthday, show_ministry_interests, show_skills, directory_bio')
        .eq('is_visible', true);

      if (directoryError) throw directoryError;

      if (!directoryData || directoryData.length === 0) {
        setMembers([]);
        return;
      }

      const userIds = directoryData.map(d => d.user_id);

      // Then get profile data for those users
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, display_name, avatar_url, phone, address, city, state, date_of_birth, ministry_interests, skills, member_status')
        .in('user_id', userIds);

      if (profileError) throw profileError;

      const formattedMembers: DirectoryMember[] = profileData?.map(profile => {
        const directorySettings = directoryData.find(d => d.user_id === profile.user_id);
        
        return {
          id: profile.user_id,
          user_id: profile.user_id,
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          display_name: profile.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
          avatar_url: profile.avatar_url,
          directory_bio: directorySettings?.directory_bio,
          ministry_interests: directorySettings?.show_ministry_interests ? profile.ministry_interests : undefined,
          skills: directorySettings?.show_skills ? profile.skills : undefined,
          show_email: directorySettings?.show_email || false,
          show_phone: directorySettings?.show_phone || false,
          show_address: directorySettings?.show_address || false,
          show_birthday: directorySettings?.show_birthday || false,
          phone: directorySettings?.show_phone ? profile.phone : undefined,
          address: directorySettings?.show_address ? 
            [profile.address, profile.city, profile.state].filter(Boolean).join(', ') : undefined,
          date_of_birth: directorySettings?.show_birthday ? profile.date_of_birth : undefined,
          member_status: profile.member_status
        };
      }) || [];

      setMembers(formattedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Failed to load member directory",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDirectorySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('member_directory')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setDirectorySettings({
          is_visible: data.is_visible,
          show_email: data.show_email,
          show_phone: data.show_phone,
          show_address: data.show_address,
          show_birthday: data.show_birthday,
          show_ministry_interests: data.show_ministry_interests,
          show_skills: data.show_skills,
          directory_bio: data.directory_bio || "",
          contact_preferences: typeof data.contact_preferences === 'object' && data.contact_preferences 
            ? data.contact_preferences as { email: boolean; phone: boolean; in_person: boolean }
            : { email: true, phone: false, in_person: true }
        });
      }
    } catch (error) {
      console.error('Error fetching directory settings:', error);
    }
  };

  const updateDirectorySettings = async (settings: any) => {
    try {
      const { error } = await supabase
        .from('member_directory')
        .upsert({
          user_id: user?.id,
          ...settings
        });

      if (error) throw error;

      setDirectorySettings(settings);
      toast({
        title: "Settings Updated",
        description: "Your directory privacy settings have been saved",
      });
    } catch (error) {
      console.error('Error updating directory settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  const filterMembers = () => {
    let filtered = members;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.directory_bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(member => {
        return selectedFilters.some(filter => {
          if (filter === 'has_ministry_interests') {
            return member.ministry_interests && member.ministry_interests.length > 0;
          }
          if (filter === 'has_skills') {
            return member.skills && member.skills.length > 0;
          }
          return true;
        });
      });
    }

    setFilteredMembers(filtered);
  };

  const sendConnectionRequest = async (targetUserId: string, message: string = "") => {
    try {
      const { error } = await supabase
        .from('member_connections')
        .insert({
          requester_id: user?.id,
          requested_id: targetUserId,
          message,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Connection Request Sent",
        description: "Your connection request has been sent successfully",
      });
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error", 
        description: "Failed to send connection request",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading member directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold" style={{color: "hsl(var(--gold))"}}>
                Member Directory
              </h1>
              <p className="text-muted-foreground">
                Connect with fellow church members
              </p>
            </div>
            <Badge variant="outline" className="text-primary border-primary">
              <Users className="h-4 w-4 mr-2" />
              {members.length} Members
            </Badge>
          </div>

          <Tabs defaultValue="directory" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="directory">Browse Directory</TabsTrigger>
              <TabsTrigger value="settings">Privacy Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="directory" className="space-y-6">
              {/* Search and Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search members by name or bio..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedFilters.includes('has_ministry_interests') ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setSelectedFilters(prev => 
                            prev.includes('has_ministry_interests')
                              ? prev.filter(f => f !== 'has_ministry_interests')
                              : [...prev, 'has_ministry_interests']
                          );
                        }}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Ministry Interests
                      </Button>
                      <Button
                        variant={selectedFilters.includes('has_skills') ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setSelectedFilters(prev => 
                            prev.includes('has_skills')
                              ? prev.filter(f => f !== 'has_skills')
                              : [...prev, 'has_skills']
                          );
                        }}
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Skills
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Member Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar_url} />
                          <AvatarFallback>
                            {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{member.display_name}</h3>
                          {member.member_status && (
                            <Badge variant="secondary" className="text-xs">
                              {member.member_status}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {member.directory_bio && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {member.directory_bio}
                        </p>
                      )}

                      {/* Contact Info */}
                      <div className="space-y-2 mb-4">
                        {member.email && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 mr-2" />
                            {member.email}
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 mr-2" />
                            {member.phone}
                          </div>
                        )}
                        {member.address && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {member.address}
                          </div>
                        )}
                      </div>

                      {/* Ministry Interests */}
                      {member.ministry_interests && member.ministry_interests.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Ministry Interests:</p>
                          <div className="flex flex-wrap gap-1">
                            {member.ministry_interests.slice(0, 3).map((interest, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                            {member.ministry_interests.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{member.ministry_interests.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Skills */}
                      {member.skills && member.skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {member.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {member.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{member.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => sendConnectionRequest(member.user_id)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredMembers.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No members found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters to find more members.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Directory Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control how your information appears in the member directory
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Visibility Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Directory Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        Show your profile in the member directory
                      </p>
                    </div>
                    <Switch
                      checked={directorySettings.is_visible}
                      onCheckedChange={(checked) => 
                        updateDirectorySettings({ ...directorySettings, is_visible: checked })
                      }
                    />
                  </div>

                  {directorySettings.is_visible && (
                    <>
                      {/* Bio */}
                      <div className="space-y-2">
                        <Label htmlFor="bio">Directory Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell other members a bit about yourself..."
                          value={directorySettings.directory_bio}
                          onChange={(e) => 
                            setDirectorySettings({ ...directorySettings, directory_bio: e.target.value })
                          }
                          onBlur={() => updateDirectorySettings(directorySettings)}
                        />
                      </div>

                      {/* Contact Information Visibility */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Contact Information Visibility</h4>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Address</Label>
                            <p className="text-sm text-muted-foreground">Show your email to other members</p>
                          </div>
                          <Switch
                            checked={directorySettings.show_email}
                            onCheckedChange={(checked) => 
                              updateDirectorySettings({ ...directorySettings, show_email: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Phone Number</Label>
                            <p className="text-sm text-muted-foreground">Show your phone number to other members</p>
                          </div>
                          <Switch
                            checked={directorySettings.show_phone}
                            onCheckedChange={(checked) => 
                              updateDirectorySettings({ ...directorySettings, show_phone: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Address</Label>
                            <p className="text-sm text-muted-foreground">Show your address to other members</p>
                          </div>
                          <Switch
                            checked={directorySettings.show_address}
                            onCheckedChange={(checked) => 
                              updateDirectorySettings({ ...directorySettings, show_address: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Birthday</Label>
                            <p className="text-sm text-muted-foreground">Show your birthday to other members</p>
                          </div>
                          <Switch
                            checked={directorySettings.show_birthday}
                            onCheckedChange={(checked) => 
                              updateDirectorySettings({ ...directorySettings, show_birthday: checked })
                            }
                          />
                        </div>
                      </div>

                      {/* Profile Information Visibility */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Profile Information Visibility</h4>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Ministry Interests</Label>
                            <p className="text-sm text-muted-foreground">Show your ministry interests</p>
                          </div>
                          <Switch
                            checked={directorySettings.show_ministry_interests}
                            onCheckedChange={(checked) => 
                              updateDirectorySettings({ ...directorySettings, show_ministry_interests: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Skills</Label>
                            <p className="text-sm text-muted-foreground">Show your skills and talents</p>
                          </div>
                          <Switch
                            checked={directorySettings.show_skills}
                            onCheckedChange={(checked) => 
                              updateDirectorySettings({ ...directorySettings, show_skills: checked })
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MemberDirectory;