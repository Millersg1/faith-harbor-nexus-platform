import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Users, Clock, DollarSign, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { DynamicScriptureQuote } from "./DynamicScriptureQuote";
import { EventRegistrationDialog } from "./EventRegistrationDialog";

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
  const [userRegistrations, setUserRegistrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchUserRegistrations();
    }
  }, [user]);

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

  const fetchUserRegistrations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserRegistrations(data?.map(reg => reg.event_id) || []);
    } catch (error) {
      console.error('Error fetching user registrations:', error);
    }
  };

  const handleRegistrationComplete = () => {
    fetchEvents();
    fetchUserRegistrations();
  };

  const isUserRegistered = (eventId: string) => {
    return userRegistrations.includes(eventId);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      worship: "bg-blue-100 text-blue-800",
      youth: "bg-green-100 text-green-800",
      family: "bg-purple-100 text-purple-800",
      outreach: "bg-orange-100 text-orange-800",
      retreat: "bg-indigo-100 text-indigo-800",
      fellowship: "bg-pink-100 text-pink-800",
      music: "bg-teal-100 text-teal-800",
      general: "bg-gray-100 text-gray-800"
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

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
      <DynamicScriptureQuote 
        variant="random"
        theme="community"
      />
      <div className="mb-8 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Upcoming Events</h1>
            <p className="text-muted-foreground">Join us for fellowship and community</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events..."
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
              <SelectItem value="worship">Worship</SelectItem>
              <SelectItem value="youth">Youth</SelectItem>
              <SelectItem value="family">Family</SelectItem>
              <SelectItem value="outreach">Outreach</SelectItem>
              <SelectItem value="retreat">Retreat</SelectItem>
              <SelectItem value="fellowship">Fellowship</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {events.length === 0 ? "No upcoming events" : "No events found"}
          </h3>
          <p className="text-muted-foreground">
            {events.length === 0 
              ? "Check back soon for new events and activities"
              : "Try adjusting your search or filter criteria"
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
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
                  <Badge className={`ml-2 ${getCategoryColor(event.category)}`}>
                    {event.category.replace('_', ' ')}
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
                  <>
                    {isUserRegistered(event.id) ? (
                      <Badge className="w-full justify-center bg-green-100 text-green-800 py-2">
                        <Users className="h-4 w-4 mr-2" />
                        Registered
                      </Badge>
                    ) : (
                      <EventRegistrationDialog
                        event={event}
                        onRegistrationComplete={handleRegistrationComplete}
                        disabled={
                          (event.max_capacity && (event.registrations?.length || 0) >= event.max_capacity) ||
                          (event.registration_deadline && new Date(event.registration_deadline) < new Date())
                        }
                      />
                    )}
                  </>
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