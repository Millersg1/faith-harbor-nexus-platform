import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Users, Mail, Phone, MapPin } from "lucide-react";

interface Member {
  id: string;
  display_name: string;
  first_name: string;
  last_name: string;
  organization_name: string;
  phone: string;
  bio: string;
  avatar_url: string;
  member_status: string;
  membership_type: string;
  date_joined: string;
  city: string;
  state: string;
  roles?: { role_name: string }[];
}

export const MemberDirectory = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          roles:member_roles(role_name)
        `)
        .eq('member_status', 'active')
        .order('display_name');

      if (error) throw error;
      setMembers((data || []) as unknown as Member[]);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.organization_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p>Loading member directory...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Member Directory</h1>
            <p className="text-muted-foreground">Connect with our faith community</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src={member.avatar_url} alt={member.display_name} />
                <AvatarFallback className="text-lg">
                  {member.first_name?.[0]}{member.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">
                {member.display_name || `${member.first_name} ${member.last_name}`}
              </CardTitle>
              {member.organization_name && (
                <CardDescription>{member.organization_name}</CardDescription>
              )}
              <div className="flex flex-wrap gap-1 justify-center mt-2">
                {member.roles?.map((role, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {role.role_name}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-xs">
                  {member.membership_type}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {member.bio && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {member.bio}
                </p>
              )}
              
              <div className="space-y-2 text-sm">
                {member.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{member.phone}</span>
                  </div>
                )}
                
                {(member.city || member.state) && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{[member.city, member.state].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                
                {member.date_joined && (
                  <div className="text-xs text-muted-foreground">
                    Member since {new Date(member.date_joined).getFullYear()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No members found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms" : "No members in the directory yet"}
          </p>
        </div>
      )}
    </div>
  );
};