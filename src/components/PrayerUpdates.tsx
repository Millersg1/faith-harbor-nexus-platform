import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, CheckCircle, Clock, User } from "lucide-react";
import { format } from "date-fns";

interface PrayerUpdate {
  id: string;
  prayer_request_id: string;
  user_id: string | null;
  update_text: string;
  is_answer: boolean;
  created_at: string;
}

interface PrayerUpdatesProps {
  prayerRequestId: string;
  canAddUpdate?: boolean;
  onUpdateAdded?: () => void;
}

export const PrayerUpdates = ({ 
  prayerRequestId, 
  canAddUpdate = true, 
  onUpdateAdded 
}: PrayerUpdatesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [updates, setUpdates] = useState<PrayerUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const [isAnswer, setIsAnswer] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, [prayerRequestId]);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('prayer_request_updates')
        .select('*')
        .eq('prayer_request_id', prayerRequestId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setUpdates(data || []);
    } catch (error) {
      console.error('Error fetching prayer updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !updateText.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('prayer_request_updates')
        .insert({
          prayer_request_id: prayerRequestId,
          user_id: user.id,
          update_text: updateText.trim(),
          is_answer: isAnswer
        });

      if (error) throw error;

      // If this is marked as an answer, update the prayer request status
      if (isAnswer) {
        await supabase
          .from('prayer_requests')
          .update({
            status: 'answered',
            answered_at: new Date().toISOString(),
            answer_description: updateText.trim()
          })
          .eq('id', prayerRequestId);
      }

      toast({
        title: "Success",
        description: isAnswer ? "Prayer answer shared!" : "Update added successfully",
      });

      setUpdateText("");
      setIsAnswer(false);
      setIsDialogOpen(false);
      fetchUpdates();
      onUpdateAdded?.();
    } catch (error) {
      console.error('Error submitting update:', error);
      toast({
        title: "Error",
        description: "Failed to submit update",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="text-sm text-muted-foreground">Loading updates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Prayer Updates ({updates.length})
        </h4>
        
        {canAddUpdate && user && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Add Update
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Prayer Update</DialogTitle>
                <DialogDescription>
                  Share an update or testimony about this prayer request
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="update">Update or Testimony</Label>
                  <Textarea
                    id="update"
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                    placeholder="Share how God is working in this situation..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isAnswer"
                    checked={isAnswer}
                    onCheckedChange={setIsAnswer}
                  />
                  <Label htmlFor="isAnswer" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    This is a prayer answer/testimony
                  </Label>
                </div>

                {isAnswer && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700">
                      Marking this as an answer will change the prayer request status to "answered" 
                      and notify others of God&apos;s faithfulness.
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Submitting..." : "Share Update"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {updates.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No updates yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {updates.map((update) => (
            <Card key={update.id} className={update.is_answer ? "border-green-200 bg-green-50/50" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {update.is_answer ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Prayer Answer
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        Update
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      Community Member
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(update.created_at), 'MMM d, h:mm a')}
                  </span>
                </div>
                
                <p className="text-sm leading-relaxed">{update.update_text}</p>
                
                {update.is_answer && (
                  <div className="mt-3 flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Praise God for His faithfulness!
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};