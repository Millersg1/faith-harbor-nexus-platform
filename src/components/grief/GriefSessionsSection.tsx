import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Plus, Heart } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CreateGriefSessionDialog } from "./CreateGriefSessionDialog";

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

interface GriefSessionsSectionProps {
  sessions: GriefSession[];
  onSessionRegistered: () => void;
  onSessionsUpdate: () => void;
}

export function GriefSessionsSection({ sessions, onSessionRegistered, onSessionsUpdate }: GriefSessionsSectionProps) {
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [registeringSessionId, setRegisteringSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRegisterForSession = async (sessionId: string) => {
    setRegisteringSessionId(sessionId);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to register for grief support sessions",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('grief_session_registrations')
        .insert({
          session_id: sessionId,
          participant_id: userData.user.id,
          attendance_status: 'registered'
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already Registered",
            description: "You are already registered for this session",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        onSessionRegistered();
      }
    } catch (error) {
      console.error('Error registering for session:', error);
      toast({
        title: "Error",
        description: "Failed to register for session",
        variant: "destructive",
      });
    } finally {
      setRegisteringSessionId(null);
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'support_group': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'individual_counseling': return 'bg-green-100 text-green-800 border-green-200';
      case 'workshop': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'retreat': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatSessionType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleSessionCreated = () => {
    setIsCreateSessionOpen(false);
    onSessionsUpdate();
    toast({
      title: "Success",
      description: "Grief support session created successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Grief Support Sessions</h2>
          <p className="text-muted-foreground">Find comfort and healing through group support and counseling</p>
        </div>
        <Button onClick={() => setIsCreateSessionOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Schedule Session
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Sessions Scheduled</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to schedule a grief support session for the community
            </p>
            <Button onClick={() => setIsCreateSessionOpen(true)} variant="outline">
              Schedule Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge className={getSessionTypeColor(session.session_type)}>
                    {formatSessionType(session.session_type)}
                  </Badge>
                  {session.cost && session.cost > 0 && (
                    <Badge variant="secondary">${(session.cost / 100).toFixed(2)}</Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{session.title}</CardTitle>
                {session.description && (
                  <CardDescription className="line-clamp-2">{session.description}</CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(session.session_date), "MMMM d, yyyy")}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {format(new Date(session.session_date), "h:mm a")}
                    {session.duration_minutes && ` (${session.duration_minutes} min)`}
                  </div>
                  
                  {session.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {session.location}
                    </div>
                  )}
                  
                  {session.max_participants && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      Max {session.max_participants} participants
                    </div>
                  )}
                </div>

                {session.registration_required && (
                  <Button
                    onClick={() => handleRegisterForSession(session.id)}
                    disabled={registeringSessionId === session.id}
                    className="w-full"
                  >
                    {registeringSessionId === session.id ? "Registering..." : "Register for Session"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateGriefSessionDialog
        open={isCreateSessionOpen}
        onOpenChange={setIsCreateSessionOpen}
        onSessionCreated={handleSessionCreated}
      />
    </div>
  );
}