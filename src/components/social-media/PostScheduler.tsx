import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { CalendarDays, Clock, Send, Save, Image, Hash, AtSign } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SocialPost {
  id: string;
  content: string;
  scheduled_for: string | null;
  status: string;
  account_id: string;
  hashtags: string[];
  mentions: string[];
}

export const PostScheduler = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [newPost, setNewPost] = useState({
    content: "",
    account_id: "",
    scheduled_for: "",
    hashtags: [] as string[],
    mentions: [] as string[]
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");
  const [mentionInput, setMentionInput] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
    fetchAccounts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_media_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_media_accounts')
        .select('*')
        .eq('is_connected', true);

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !newPost.hashtags.includes(hashtagInput.trim())) {
      setNewPost(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtagInput.trim()]
      }));
      setHashtagInput("");
    }
  };

  const removeHashtag = (hashtag: string) => {
    setNewPost(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(h => h !== hashtag)
    }));
  };

  const addMention = () => {
    if (mentionInput.trim() && !newPost.mentions.includes(mentionInput.trim())) {
      setNewPost(prev => ({
        ...prev,
        mentions: [...prev.mentions, mentionInput.trim()]
      }));
      setMentionInput("");
    }
  };

  const removeMention = (mention: string) => {
    setNewPost(prev => ({
      ...prev,
      mentions: prev.mentions.filter(m => m !== mention)
    }));
  };

  const schedulePost = async (isDraft = false) => {
    if (!newPost.content.trim() || !newPost.account_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let scheduledFor = null;
      if (!isDraft && selectedDate && selectedTime) {
        const [hours, minutes] = selectedTime.split(':');
        const scheduleDateTime = new Date(selectedDate);
        scheduleDateTime.setHours(parseInt(hours), parseInt(minutes));
        scheduledFor = scheduleDateTime.toISOString();
      }

      const { error } = await supabase
        .from('social_media_posts')
        .insert({
          ...newPost,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          scheduled_for: scheduledFor,
          status: isDraft ? 'draft' : 'scheduled'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: isDraft ? "Post saved as draft" : "Post scheduled successfully"
      });

      // Reset form
      setNewPost({
        content: "",
        account_id: "",
        scheduled_for: "",
        hashtags: [],
        mentions: []
      });
      setSelectedDate(undefined);
      setSelectedTime("");
      
      await fetchPosts();
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast({
        title: "Error",
        description: "Failed to schedule post",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create New Post */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
          <CardDescription>
            Schedule content across your social media platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="What's on your mind? Share an inspiring message..."
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[120px]"
            />
            <div className="text-sm text-muted-foreground">
              {newPost.content.length}/280 characters
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Platform Account</Label>
              <Select
                value={newPost.account_id}
                onValueChange={(value) => setNewPost(prev => ({ ...prev, account_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account: any) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.platform} - @{account.account_handle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Schedule Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Schedule Time</Label>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Add Media</Label>
              <Button variant="outline" className="w-full">
                <Image className="mr-2 h-4 w-4" />
                Upload Image/Video
              </Button>
            </div>
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label>Hashtags</Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Add hashtag"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                  className="pl-10"
                />
              </div>
              <Button onClick={addHashtag} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newPost.hashtags.map((hashtag, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeHashtag(hashtag)}>
                  #{hashtag} ×
                </Badge>
              ))}
            </div>
          </div>

          {/* Mentions */}
          <div className="space-y-2">
            <Label>Mentions</Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Add mention"
                  value={mentionInput}
                  onChange={(e) => setMentionInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMention())}
                  className="pl-10"
                />
              </div>
              <Button onClick={addMention} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newPost.mentions.map((mention, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeMention(mention)}>
                  @{mention} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={() => schedulePost(true)} variant="outline" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={() => schedulePost(false)} disabled={loading}>
              <Send className="mr-2 h-4 w-4" />
              Schedule Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled & Draft Posts</CardTitle>
          <CardDescription>
            Manage your upcoming and draft social media posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No posts scheduled yet. Create your first post above.
            </p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{post.content.substring(0, 100)}...</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <Badge variant={post.status === 'draft' ? 'secondary' : 'default'}>
                        {post.status}
                      </Badge>
                      {post.scheduled_for && (
                        <span>
                          {format(new Date(post.scheduled_for), "PPp")}
                        </span>
                      )}
                    </div>
                    {post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.hashtags.map((hashtag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{hashtag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};