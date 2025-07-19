import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Play, Download, BookOpen, Calendar, Plus, Search, Filter } from "lucide-react";
import AuthenticatedNavigation from "@/components/AuthenticatedNavigation";

const sermonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  speaker_name: z.string().min(1, "Speaker name is required"),
  sermon_date: z.string().min(1, "Date is required"),
  scripture_reference: z.string().optional(),
  description: z.string().optional(),
  audio_url: z.string().url().optional().or(z.literal("")),
  video_url: z.string().url().optional().or(z.literal("")),
  notes_url: z.string().url().optional().or(z.literal("")),
  series_name: z.string().optional(),
  tags: z.string().optional(),
});

const Sermons = () => {
  const [sermons, setSermons] = useState<any[]>([]);
  const [filteredSermons, setFilteredSermons] = useState<any[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeries, setFilterSeries] = useState("all");
  const [uniqueSeries, setUniqueSeries] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof sermonSchema>>({
    resolver: zodResolver(sermonSchema),
    defaultValues: {
      sermon_date: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    fetchSermons();
  }, []);

  useEffect(() => {
    filterSermons();
  }, [sermons, searchTerm, filterSeries]);

  const fetchSermons = async () => {
    try {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('sermon_date', { ascending: false });

      if (error) throw error;
      setSermons(data || []);
      
      // Extract unique series
      const series = [...new Set(data?.map(s => s.series_name).filter(Boolean) || [])];
      setUniqueSeries(series);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sermons",
        variant: "destructive",
      });
    }
  };

  const filterSermons = () => {
    let filtered = sermons;

    if (searchTerm) {
      filtered = filtered.filter(sermon =>
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.speaker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.scripture_reference?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSeries !== "all") {
      filtered = filtered.filter(sermon => sermon.series_name === filterSeries);
    }

    setFilteredSermons(filtered);
  };

  const onSubmit = async (values: z.infer<typeof sermonSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];

      const sermonData = {
        ...values,
        tags: tagsArray,
        created_by: user.id,
      };

      const { error } = await supabase
        .from('sermons')
        .insert([sermonData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sermon added successfully",
      });

      setIsCreateOpen(false);
      form.reset();
      fetchSermons();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add sermon",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavigation />
      
      <div className="container mx-auto p-6 pt-24">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Sermon Library</h1>
            <p className="text-muted-foreground">Manage and access sermon recordings and notes</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Sermon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Sermon</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sermon Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter sermon title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="speaker_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Speaker</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter speaker name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sermon_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scripture_reference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scripture Reference</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., John 3:16-17" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter sermon description..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="series_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Series Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter series name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="faith, hope, love (comma separated)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="audio_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Audio URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/audio.mp3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="video_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/notes.pdf" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Sermon</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sermons, speakers, or scriptures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterSeries} onValueChange={setFilterSeries}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by series" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Series</SelectItem>
              {uniqueSeries.map(series => (
                <SelectItem key={series} value={series}>{series}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sermons</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sermons.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Series</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueSeries.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sermons.filter(s => {
                  const sermonDate = new Date(s.sermon_date);
                  const now = new Date();
                  return sermonDate.getMonth() === now.getMonth() && 
                         sermonDate.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sermons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSermons.map((sermon) => (
            <Card key={sermon.id} className="hover-scale">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{sermon.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-1">by {sermon.speaker_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(sermon.sermon_date).toLocaleDateString()}
                    </p>
                  </div>
                  {sermon.series_name && (
                    <Badge variant="outline">{sermon.series_name}</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {sermon.scripture_reference && (
                  <p className="text-sm font-medium text-primary mb-2">
                    {sermon.scripture_reference}
                  </p>
                )}
                
                {sermon.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {sermon.description}
                  </p>
                )}

                {sermon.tags && sermon.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {sermon.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  {sermon.audio_url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={sermon.audio_url} target="_blank" rel="noopener noreferrer">
                        <Play className="h-4 w-4 mr-1" />
                        Audio
                      </a>
                    </Button>
                  )}
                  
                  {sermon.video_url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={sermon.video_url} target="_blank" rel="noopener noreferrer">
                        <Play className="h-4 w-4 mr-1" />
                        Video
                      </a>
                    </Button>
                  )}
                  
                  {sermon.notes_url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={sermon.notes_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-1" />
                        Notes
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSermons.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sermons found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterSeries !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Add your first sermon to get started!"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Sermons;