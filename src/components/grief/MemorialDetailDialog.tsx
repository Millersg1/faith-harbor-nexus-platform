import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Heart, Calendar, MapPin, MessageCircle, Send } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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

interface MemorialTribute {
  id: string;
  author_name: string | null;
  tribute_text: string;
  created_at: string;
}

interface MemorialDetailDialogProps {
  memorial: Memorial;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemorialDetailDialog({ memorial, open, onOpenChange }: MemorialDetailDialogProps) {
  const [tributes, setTributes] = useState<MemorialTribute[]>([]);
  const [newTribute, setNewTribute] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchTributes();
    }
  }, [open, memorial.id]);

  const fetchTributes = async () => {
    try {
      const { data, error } = await supabase
        .from('memorial_tributes')
        .select('*')
        .eq('memorial_id', memorial.id)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTributes(data || []);
    } catch (error) {
      console.error('Error fetching tributes:', error);
    }
  };

  const handleSubmitTribute = async () => {
    if (!newTribute.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('memorial_tributes')
        .insert({
          memorial_id: memorial.id,
          author_id: userData.user?.id || null,
          author_name: authorName || null,
          tribute_text: newTribute,
          is_public: true
        });

      if (error) throw error;

      setNewTribute("");
      setAuthorName("");
      fetchTributes();
      toast({
        title: "Success",
        description: "Your tribute has been shared",
      });
    } catch (error) {
      console.error('Error submitting tribute:', error);
      toast({
        title: "Error",
        description: "Failed to submit tribute",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const age = memorial.date_of_birth && memorial.date_of_passing 
    ? new Date(memorial.date_of_passing).getFullYear() - new Date(memorial.date_of_birth).getFullYear()
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            In Loving Memory of {memorial.deceased_name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Memorial Details */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                {memorial.photo_url ? (
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden bg-muted">
                    <img 
                      src={memorial.photo_url} 
                      alt={memorial.deceased_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-muted flex items-center justify-center">
                    <Heart className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <CardTitle className="text-xl">{memorial.deceased_name}</CardTitle>
                <p className="text-muted-foreground">
                  {memorial.date_of_birth && format(new Date(memorial.date_of_birth), "MMMM d, yyyy")} - {format(new Date(memorial.date_of_passing), "MMMM d, yyyy")}
                  {age && ` (Age ${age})`}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {memorial.service_date && (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Memorial Service</p>
                      <p className="text-muted-foreground">
                        {format(new Date(memorial.service_date), "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                )}
                
                {memorial.service_location && (
                  <div className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{memorial.service_location}</p>
                    </div>
                  </div>
                )}

                {memorial.family_contact_info && (
                  <div className="border-t pt-4">
                    <p className="font-medium text-sm mb-2">Family Contact</p>
                    <p className="text-sm text-muted-foreground">{memorial.family_contact_info}</p>
                  </div>
                )}

                {memorial.memorial_fund_info && (
                  <div className="border-t pt-4">
                    <p className="font-medium text-sm mb-2">Memorial Fund</p>
                    <p className="text-sm text-muted-foreground">{memorial.memorial_fund_info}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Biography and Tributes */}
          <div className="md:col-span-2 space-y-6">
            {memorial.biography && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Life Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {memorial.biography}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Add Tribute */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Share a Memory or Tribute
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Your name (optional)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
                <Textarea
                  placeholder="Share a memory, condolence, or tribute..."
                  value={newTribute}
                  onChange={(e) => setNewTribute(e.target.value)}
                  rows={3}
                />
                <Button 
                  onClick={handleSubmitTribute}
                  disabled={!newTribute.trim() || isSubmitting}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Sharing..." : "Share Tribute"}
                </Button>
              </CardContent>
            </Card>

            {/* Tributes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tributes & Memories ({tributes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {tributes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No tributes shared yet. Be the first to share a memory.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {tributes.map((tribute) => (
                      <div key={tribute.id} className="border-l-2 border-primary pl-4 py-2">
                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {tribute.tribute_text}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm font-medium text-foreground">
                            {tribute.author_name || "Anonymous"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(tribute.created_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}