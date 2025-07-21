import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Heart, Plus, Clock, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const prayerRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().default('general'),
  privacy_level: z.string().default('public'),
  is_anonymous: z.boolean().default(false),
  requester_name: z.string().optional(),
  requester_email: z.string().email().optional(),
});

interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  privacy_level: string;
  is_anonymous: boolean;
  requester_name: string | null;
  created_at: string;
  status: string;
  prayer_count?: number;
}

export const RealTimePrayerWall = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof prayerRequestSchema>>({
    resolver: zodResolver(prayerRequestSchema),
    defaultValues: {
      category: 'general',
      privacy_level: 'public',
      is_anonymous: false,
    },
  });

  // Fetch prayer requests
  const { data: prayerRequests, isLoading } = useQuery({
    queryKey: ['prayer-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PrayerRequest[];
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('prayer-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prayer_requests'
        },
        (payload) => {
          console.log('Prayer request change:', payload);
          queryClient.invalidateQueries({ queryKey: ['prayer-requests'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Create prayer request mutation
  const createPrayerRequest = useMutation({
    mutationFn: async (values: z.infer<typeof prayerRequestSchema>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const requestData = {
        title: values.title,
        description: values.description,
        category: values.category,
        privacy_level: values.privacy_level,
        is_anonymous: values.is_anonymous,
        requester_name: values.is_anonymous ? null : values.requester_name,
        requester_email: values.requester_email,
        requester_id: user?.id || null,
      };

      const { data, error } = await supabase
        .from('prayer_requests')
        .insert([requestData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayer-requests'] });
      form.reset();
      setIsOpen(false);
      toast.success('Prayer request posted successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to post prayer request: ${error.message}`);
    }
  });

  const onSubmit = (values: z.infer<typeof prayerRequestSchema>) => {
    createPrayerRequest.mutate(values);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      healing: 'bg-green-100 text-green-800',
      family: 'bg-blue-100 text-blue-800',
      guidance: 'bg-purple-100 text-purple-800',
      thanksgiving: 'bg-yellow-100 text-yellow-800',
      general: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.general;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            Prayer Wall
          </h1>
          <p className="text-muted-foreground">
            Share your prayer requests and pray for others in real-time
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Prayer Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Prayer Request</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief prayer title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share your prayer request..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="healing">Healing</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                          <SelectItem value="guidance">Guidance</SelectItem>
                          <SelectItem value="thanksgiving">Thanksgiving</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_anonymous"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Post anonymously</FormLabel>
                    </FormItem>
                  )}
                />

                {!form.watch('is_anonymous') && (
                  <FormField
                    control={form.control}
                    name="requester_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createPrayerRequest.isPending}>
                    {createPrayerRequest.isPending ? 'Posting...' : 'Post Request'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Prayer Requests */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8">Loading prayer requests...</div>
        ) : !prayerRequests || prayerRequests.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No prayer requests yet</h3>
              <p className="text-muted-foreground">
                Be the first to share a prayer request with the community
              </p>
            </CardContent>
          </Card>
        ) : (
          prayerRequests.map((request) => (
            <Card key={request.id} className="animate-fade-in">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{request.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {request.is_anonymous ? 'Anonymous' : request.requester_name || 'Anonymous'}
                      </span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <Badge className={getCategoryColor(request.category)}>
                    {request.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{request.description}</p>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Heart className="h-4 w-4" />
                    Pray
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {request.prayer_count || 0} prayers
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};