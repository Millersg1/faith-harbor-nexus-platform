import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Calendar, MapPin, Clock, UserPlus, Search } from "lucide-react";

interface SmallGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  meeting_day: string;
  meeting_time: string;
  location: string;
  age_group: string;
  gender_preference: string;
  max_capacity: number;
  is_open_enrollment: boolean;
  status: string;
  image_url?: string;
  requirements?: string;
}

interface GroupMembership {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  status: string;
  joined_at: string;
}

const SmallGroups = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<SmallGroup[]>([]);
  const [memberships, setMemberships] = useState<GroupMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ageGroupFilter, setAgeGroupFilter] = useState("all");

  useEffect(() => {
    fetchSmallGroups();
    if (user) {
      fetchUserMemberships();
    }
  }, [user]);

  const fetchSmallGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('small_groups' as any)
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setGroups(data as any || []);
    } catch (error) {
      console.error('Error fetching small groups:', error);
      toast({
        title: "Error",
        description: "Failed to load small groups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMemberships = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('small_group_members' as any)
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      setMemberships(data as any || []);
    } catch (error) {
      console.error('Error fetching user memberships:', error);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join a group",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('small_group_members' as any)
        .insert([{
          group_id: groupId,
          user_id: user.id,
          role: 'member',
          status: 'active'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully joined the group!",
      });

      fetchUserMemberships();
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: "Error",
        description: "Failed to join group",
        variant: "destructive",
      });
    }
  };

  const isUserMember = (groupId: string) => {
    return memberships.some(membership => membership.group_id === groupId);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      bible_study: "bg-blue-100 text-blue-800",
      prayer: "bg-purple-100 text-purple-800",
      fellowship: "bg-green-100 text-green-800",
      service: "bg-orange-100 text-orange-800",
      discipleship: "bg-indigo-100 text-indigo-800",
      support: "bg-pink-100 text-pink-800"
    };
    return colors[category as keyof typeof colors] || colors.bible_study;
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || group.category === categoryFilter;
    const matchesAgeGroup = ageGroupFilter === "all" || group.age_group === ageGroupFilter;
    
    return matchesSearch && matchesCategory && matchesAgeGroup;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading small groups...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Small Groups</h1>
          <p className="text-muted-foreground">Join a small group to grow in faith and build meaningful relationships</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="bible_study">Bible Study</SelectItem>
              <SelectItem value="prayer">Prayer</SelectItem>
              <SelectItem value="fellowship">Fellowship</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="discipleship">Discipleship</SelectItem>
              <SelectItem value="support">Support</SelectItem>
            </SelectContent>
          </Select>

          <Select value={ageGroupFilter} onValueChange={setAgeGroupFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Age Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              <SelectItem value="youth">Youth (13-18)</SelectItem>
              <SelectItem value="young_adults">Young Adults (18-30)</SelectItem>
              <SelectItem value="adults">Adults (30-55)</SelectItem>
              <SelectItem value="seniors">Seniors (55+)</SelectItem>
              <SelectItem value="families">Families</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Groups Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No groups found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <Card key={group.id} className="overflow-hidden">
                {group.image_url && (
                  <div className="h-48 bg-muted bg-cover bg-center" 
                       style={{ backgroundImage: `url(${group.image_url})` }} />
                )}
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{group.name}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge className={getCategoryColor(group.category)}>
                          {group.category.replace('_', ' ')}
                        </Badge>
                        {group.age_group && (
                          <Badge variant="outline">
                            {group.age_group.replace('_', ' ')}
                          </Badge>
                        )}
                        {!group.is_open_enrollment && (
                          <Badge variant="secondary">Closed Enrollment</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {group.description}
                  </CardDescription>

                  <div className="space-y-2 mb-4">
                    {group.meeting_day && group.meeting_time && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {group.meeting_day}s at {group.meeting_time}
                      </div>
                    )}
                    
                    {group.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {group.location}
                      </div>
                    )}

                    {group.max_capacity && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        Max {group.max_capacity} members
                      </div>
                    )}

                    {group.gender_preference && group.gender_preference !== 'any' && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {group.gender_preference} only
                      </div>
                    )}
                  </div>

                  {group.requirements && (
                    <div className="mb-4 p-3 bg-muted rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Requirements:</h4>
                      <p className="text-sm text-muted-foreground">{group.requirements}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    {isUserMember(group.id) ? (
                      <Badge className="bg-green-100 text-green-800">
                        <UserPlus className="h-3 w-3 mr-1" />
                        Member
                      </Badge>
                    ) : (
                      <Button
                        onClick={() => handleJoinGroup(group.id)}
                        disabled={!group.is_open_enrollment}
                        size="sm"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {group.is_open_enrollment ? 'Join Group' : 'Enrollment Closed'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SmallGroups;