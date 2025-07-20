import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mic, 
  Play, 
  Square, 
  Upload, 
  Download, 
  Edit3, 
  Volume2,
  Music,
  Headphones,
  Radio,
  Settings,
  BarChart3,
  Users,
  Clock,
  Eye
} from "lucide-react";

interface Podcast {
  id: string;
  title: string;
  description: string;
  duration: string;
  publishDate: string;
  listens: number;
  status: 'draft' | 'published' | 'processing';
  audioUrl?: string;
}

interface Episode {
  id: string;
  title: string;
  guest?: string;
  recordedAt: string;
  duration: string;
  status: 'recording' | 'editing' | 'published';
}

const PodcastStudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const podcasts: Podcast[] = [
    {
      id: '1',
      title: 'Faith and Leadership in Modern Ministry',
      description: 'Exploring contemporary challenges in church leadership',
      duration: '45:32',
      publishDate: '2024-02-10',
      listens: 1247,
      status: 'published',
      audioUrl: '/audio/episode-1.mp3'
    },
    {
      id: '2',
      title: 'Biblical Financial Stewardship',
      description: 'Practical wisdom for managing money God\'s way',
      duration: '38:15',
      publishDate: '2024-02-03',
      listens: 892,
      status: 'published'
    },
    {
      id: '3',
      title: 'Community Building in Digital Age',
      description: 'Creating authentic connections through technology',
      duration: '42:08',
      publishDate: '2024-01-27',
      listens: 1156,
      status: 'published'
    }
  ];

  const recentEpisodes: Episode[] = [
    {
      id: '1',
      title: 'Prayer and Technology',
      guest: 'Dr. Sarah Johnson',
      recordedAt: '2024-02-15',
      duration: '35:22',
      status: 'editing'
    },
    {
      id: '2',
      title: 'Youth Ministry Trends',
      recordedAt: '2024-02-12',
      duration: '28:45',
      status: 'published'
    }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary rounded-full">
              <Radio className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold">Podcast Studio</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Professional podcast recording, editing, and distribution platform designed for ministry content creation
          </p>
          <div className="flex items-center justify-center gap-6">
            <Badge variant="secondary" className="px-4 py-2">
              <Mic className="h-4 w-4 mr-2" />
              Studio Recording
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Edit3 className="h-4 w-4 mr-2" />
              Built-in Editor
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Upload className="h-4 w-4 mr-2" />
              Auto Distribution
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="studio" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="studio">Recording Studio</TabsTrigger>
            <TabsTrigger value="episodes">Episodes</TabsTrigger>
            <TabsTrigger value="editor">Audio Editor</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>

          {/* Recording Studio */}
          <TabsContent value="studio" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Recording Area */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="h-5 w-5" />
                      Recording Studio
                      {isRecording && (
                        <Badge variant="destructive" className="ml-auto">
                          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                          REC {formatTime(recordingTime)}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Audio Levels */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Host Microphone</label>
                          <div className="h-2 bg-muted rounded-full mt-1">
                            <div className="h-full bg-green-500 rounded-full w-3/4"></div>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Guest Microphone</label>
                          <div className="h-2 bg-muted rounded-full mt-1">
                            <div className="h-full bg-blue-500 rounded-full w-1/2"></div>
                          </div>
                        </div>
                      </div>

                      {/* Recording Controls */}
                      <div className="flex items-center justify-center gap-4 py-8">
                        <Button
                          variant={isRecording ? "destructive" : "default"}
                          size="lg"
                          onClick={() => setIsRecording(!isRecording)}
                          className="h-16 w-16 rounded-full"
                        >
                          {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                        </Button>
                        <Button variant="outline" size="lg">
                          <Play className="h-5 w-5 mr-2" />
                          Playback
                        </Button>
                        <Button variant="outline" size="lg">
                          <Volume2 className="h-5 w-5 mr-2" />
                          Monitor
                        </Button>
                      </div>

                      {/* Episode Info */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Episode Title</label>
                          <Input placeholder="Enter episode title..." />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Guest Name (Optional)</label>
                          <Input placeholder="Guest speaker..." />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Import Audio
                      </Button>
                      <Button variant="outline" size="sm">
                        <Music className="h-4 w-4 mr-2" />
                        Add Intro
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Audio Settings
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Recording History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Recordings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentEpisodes.map(episode => (
                        <div key={episode.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="font-medium text-sm">{episode.title}</p>
                            <p className="text-xs text-muted-foreground">{episode.duration}</p>
                          </div>
                          <Badge variant={episode.status === 'published' ? 'default' : 'secondary'}>
                            {episode.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Equipment Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Equipment Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Primary Microphone</span>
                        <Badge variant="default">Connected</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Audio Interface</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Headphones</span>
                        <Badge variant="secondary">Monitoring</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Episodes */}
          <TabsContent value="episodes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Published Episodes</h2>
              <Button>
                <Mic className="h-4 w-4 mr-2" />
                New Recording
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {podcasts.map(podcast => (
                <Card key={podcast.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant={podcast.status === 'published' ? 'default' : 'secondary'}>
                        {podcast.status.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Headphones className="h-4 w-4" />
                        {podcast.listens}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">{podcast.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {podcast.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {podcast.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Published {new Date(podcast.publishDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Play className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Audio Editor */}
          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audio Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Waveform Placeholder */}
                  <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Music className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">Import audio file to start editing</p>
                    </div>
                  </div>

                  {/* Editor Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                    <Button variant="outline">Trim</Button>
                    <Button variant="outline">Split</Button>
                    <Button variant="outline">Fade</Button>
                    <Button variant="outline">Noise Reduction</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Episodes</p>
                      <p className="text-2xl font-bold">{podcasts.length}</p>
                    </div>
                    <Radio className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Listens</p>
                      <p className="text-2xl font-bold">{podcasts.reduce((sum, p) => sum + p.listens, 0).toLocaleString()}</p>
                    </div>
                    <Headphones className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Duration</p>
                      <p className="text-2xl font-bold">42 min</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Growth Rate</p>
                      <p className="text-2xl font-bold">+23%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Distribution */}
          <TabsContent value="distribution" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Podcast Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center p-6 border rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Apple Podcasts</h3>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Spotify</h3>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="h-6 w-6 text-gray-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Google Podcasts</h3>
                    <Badge variant="secondary">Setup Required</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PodcastStudio;