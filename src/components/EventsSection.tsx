import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Users, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ScriptureQuote } from "./ScriptureQuote";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  end_date: string;
  location: string;
  max_capacity: number;
  registration_required: boolean;
  registration_deadline: string;
  cost: number;
  category: string;
  image_url: string;
  organizer_id: string;
  status: string;
  registrations?: { id: string }[];
}

export const EventsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          registrations:event_registrations(id)
        `)
        .eq('status', 'published')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to register for events",
        variant: "destructive"
      });
      return;
    }

    setRegistering(eventId);
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
          attendee_name: user.user_metadata?.full_name || user.email,
          attendee_email: user.email,
          payment_status: 'free'
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already registered",
            description: "You're already registered for this event",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Registration successful!",
          description: "You've been registered for the event",
        });
        fetchEvents(); // Refresh to update registration counts
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setRegistering(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p>Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ScriptureQuote 
        verse="And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together, as some are in the habit of doing, but encouraging one another."
        reference="Hebrews 10:24-25"
        theme="community"
      />
      <div className="mb-8 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Upcoming Events</h1>
            <p className="text-muted-foreground">Join us for fellowship and community</p>
          </div>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
          <p className="text-muted-foreground">Check back soon for new events and activities</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              {event.image_url && (
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {event.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {event.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(event.event_date), 'PPP')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(event.event_date), 'p')}</span>
                    {event.end_date && (
                      <span>- {format(new Date(event.end_date), 'p')}</span>
                    )}
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}
                  
                  {event.cost > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>${(event.cost / 100).toFixed(2)}</span>
                    </div>
                  )}
                  
                  {event.max_capacity && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.registrations?.length || 0} / {event.max_capacity} registered
                      </span>
                    </div>
                  )}
                </div>
                
                {event.registration_required && (
                  <Button
                    onClick={() => handleRegister(event.id)}
                    disabled={
                      registering === event.id ||
                      (event.max_capacity && (event.registrations?.length || 0) >= event.max_capacity) ||
                      (event.registration_deadline && new Date(event.registration_deadline) < new Date())
                    }
                    className="w-full"
                  >
                    {registering === event.id ? "Registering..." : "Register"}
                  </Button>
                )}
                
                {event.registration_deadline && (
                  <p className="text-xs text-muted-foreground text-center">
                    Registration deadline: {format(new Date(event.registration_deadline), 'PPP')}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};