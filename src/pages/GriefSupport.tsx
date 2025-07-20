import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Heart, Users, Calendar, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MemorialCard } from "@/components/grief/MemorialCard";
import { CreateMemorialDialog } from "@/components/grief/CreateMemorialDialog";
import { GriefSessionsSection } from "@/components/grief/GriefSessionsSection";
import { BereavementCareSection } from "@/components/grief/BereavementCareSection";
import { GriefResourcesSection } from "@/components/grief/GriefResourcesSection";

interface Memorial {
  id: string;
  deceased_name: string;
  date_of_birth: string | null;
  date_of_passing: string;
  biography: string | null;
  photo_url: string | null;
  service_date: string | null;
  service_location: string | null;
  family_contact_info: string | null;
  memorial_fund_info: string | null;
  created_at: string;
  status: string;
}

interface GriefSession {
  id: string;
  title: string;
  description: string | null;
  session_type: string;
  session_date: string;
  duration_minutes: number | null;
  location: string | null;
  max_participants: number | null;
  registration_required: boolean;
  cost: number | null;
  status: string;
}

export default function GriefSupport() {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [griefSessions, setGriefSessions] = useState<GriefSession[]>([]);
  const [isCreateMemorialOpen, setIsCreateMemorialOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMemorials();
    fetchGriefSessions();
  }, []);

  const fetchMemorials = async () => {
    try {
      const { data, error } = await supabase
        .from('memorials')
        .select('*')
        .eq('status', 'active')
        .order('date_of_passing', { ascending: false });

      if (error) throw error;
      setMemorials(data || []);
    } catch (error) {
      console.error('Error fetching memorials:', error);
      toast({
        title: "Error",
        description: "Failed to load memorials",
        variant: "destructive",
      });
    }
  };

  const fetchGriefSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('grief_support_sessions')
        .select('*')
        .eq('status', 'scheduled')
        .gte('session_date', new Date().toISOString())
        .order('session_date', { ascending: true });

      if (error) throw error;
      setGriefSessions(data || []);
    } catch (error) {
      console.error('Error fetching grief sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load grief support sessions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemorialCreated = () => {
    setIsCreateMemorialOpen(false);
    fetchMemorials();
    toast({
      title: "Success",
      description: "Memorial created successfully",
    });
  };

  const handleSessionRegistered = () => {
    toast({
      title: "Success",
      description: "Successfully registered for grief support session",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">Grief & Bereavement Support</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A place of comfort, remembrance, and healing for our church family during times of loss
          </p>
        </div>

        <Tabs defaultValue="memorials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mx-auto">
            <TabsTrigger value="memorials" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Memorials
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Support Groups
            </TabsTrigger>
            <TabsTrigger value="care" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Bereavement Care
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="memorials" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Memorial Tributes</h2>
                <p className="text-muted-foreground">Honoring the memory of our beloved departed</p>
              </div>
              <Button onClick={() => setIsCreateMemorialOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Memorial
              </Button>
            </div>

            {memorials.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Memorials Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create the first memorial to honor a departed member of our church family
                  </p>
                  <Button onClick={() => setIsCreateMemorialOpen(true)} variant="outline">
                    Create Memorial
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {memorials.map((memorial) => (
                  <MemorialCard key={memorial.id} memorial={memorial} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="support">
            <GriefSessionsSection 
              sessions={griefSessions} 
              onSessionRegistered={handleSessionRegistered}
              onSessionsUpdate={fetchGriefSessions}
            />
          </TabsContent>

          <TabsContent value="care">
            <BereavementCareSection />
          </TabsContent>

          <TabsContent value="resources">
            <GriefResourcesSection />
          </TabsContent>
        </Tabs>

        <CreateMemorialDialog
          open={isCreateMemorialOpen}
          onOpenChange={setIsCreateMemorialOpen}
          onMemorialCreated={handleMemorialCreated}
        />
      </div>
    </div>
  );
}