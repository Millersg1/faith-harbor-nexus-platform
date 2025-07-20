import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Check, X, Eye, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface MemoryComment {
  id: string;
  author_name: string | null;
  author_email: string | null;
  comment_text: string;
  memory_title: string | null;
  photo_url: string | null;
  is_approved: boolean;
  is_included: boolean;
  submitted_at: string;
  memory_book: {
    title: string;
    memorial: {
      deceased_name: string;
    } | null;
  };
}

export function CommentCollectionSection() {
  const [comments, setComments] = useState<MemoryComment[]>([]);
  const [pendingComments, setPendingComments] = useState<MemoryComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('memory_comments')
        .select(`
          *,
          memory_book:memory_books(
            title,
            memorial:memorials(deceased_name)
          )
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      const allComments = data || [];
      setComments(allComments.filter(c => c.is_approved));
      setPendingComments(allComments.filter(c => !c.is_approved));
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('memory_comments')
        .update({
          is_approved: true,
          approved_at: new Date().toISOString()
        })
        .eq('id', commentId);

      if (error) throw error;

      fetchComments();
      toast({
        title: "Success",
        description: "Comment approved successfully",
      });
    } catch (error) {
      console.error('Error approving comment:', error);
      toast({
        title: "Error",
        description: "Failed to approve comment",
        variant: "destructive",
      });
    }
  };

  const handleRejectComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('memory_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      fetchComments();
      toast({
        title: "Success",
        description: "Comment rejected and removed",
      });
    } catch (error) {
      console.error('Error rejecting comment:', error);
      toast({
        title: "Error",
        description: "Failed to reject comment",
        variant: "destructive",
      });
    }
  };

  const handleToggleIncluded = async (commentId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('memory_comments')
        .update({
          is_included: !currentStatus
        })
        .eq('id', commentId);

      if (error) throw error;

      fetchComments();
      toast({
        title: "Success",
        description: `Comment ${!currentStatus ? 'included in' : 'removed from'} memory book`,
      });
    } catch (error) {
      console.error('Error updating comment inclusion:', error);
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Memory Comments & Contributions</h2>
        <p className="text-muted-foreground">Manage community contributions to memory books</p>
      </div>

      {/* Pending Comments */}
      {pendingComments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Pending Approval ({pendingComments.length})
            </CardTitle>
            <CardDescription>
              Review and approve comments before they appear in memory books
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingComments.map((comment) => (
              <div key={comment.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">
                        {comment.author_name || 'Anonymous'}
                      </span>
                      {comment.author_email && (
                        <span className="text-xs text-muted-foreground">
                          ({comment.author_email})
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      For: {comment.memory_book.title}
                      {comment.memory_book.memorial && (
                        <span> - {comment.memory_book.memorial.deceased_name}</span>
                      )}
                    </div>
                    {comment.memory_title && (
                      <h4 className="font-medium text-sm mb-2">{comment.memory_title}</h4>
                    )}
                    <p className="text-sm text-muted-foreground">{comment.comment_text}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApproveComment(comment.id)}
                      className="text-green-600 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectComment(comment.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  Submitted {format(new Date(comment.submitted_at), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Approved Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Approved Comments ({comments.length})
          </CardTitle>
          <CardDescription>
            Manage which approved comments are included in printed memory books
          </CardDescription>
        </CardHeader>
        <CardContent>
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Approved Comments</h3>
              <p className="text-muted-foreground">
                Comments will appear here once they are approved
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">
                          {comment.author_name || 'Anonymous'}
                        </span>
                        <Badge variant={comment.is_included ? "default" : "secondary"}>
                          {comment.is_included ? "Included" : "Not Included"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        For: {comment.memory_book.title}
                        {comment.memory_book.memorial && (
                          <span> - {comment.memory_book.memorial.deceased_name}</span>
                        )}
                      </div>
                      {comment.memory_title && (
                        <h4 className="font-medium text-sm mb-2">{comment.memory_title}</h4>
                      )}
                      <p className="text-sm text-muted-foreground">{comment.comment_text}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={comment.is_included ? "default" : "outline"}
                      onClick={() => handleToggleIncluded(comment.id, comment.is_included)}
                    >
                      {comment.is_included ? "Remove" : "Include"}
                    </Button>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    Submitted {format(new Date(comment.submitted_at), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}