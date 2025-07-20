import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Volume2,
  Users,
  Calendar,
  Settings,
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share2
} from "lucide-react";

interface LiveStream {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  status: 'scheduled' | 'live' | 'ended';
  viewers: number;
  platforms: string[];
  thumbnailUrl: string;
}

const LiveStreaming = () => {
  const [isLive, setIsLive] = useState(false);
  const [currentViewers, setCurrentViewers] = useState(247);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const streams: LiveStream[] = [
    {
      id: '1',
      title: 'Sunday Morning Service',
      description: 'Join us for worship, prayer, and an inspiring message from Pastor David',
      scheduledAt: '2024-02-18T10:00:00',
      status: 'live',
      viewers: 347,
      platforms: ['YouTube', 'Facebook', 'Website'],
      thumbnailUrl: '/api/placeholder/300/200'
    },
    {
      id: '2',
      title: 'Wednesday Night Bible Study',
      description: 'Deep dive into the book of Romans with interactive discussion',
      scheduledAt: '2024-02-21T19:00:00',
      status: 'scheduled',
      viewers: 0,
      platforms: ['YouTube', 'Website'],
      thumbnailUrl: '/api/placeholder/300/200'
    },
    {
      id: '3',
      title: 'Youth Service',
      description: 'High-energy worship and relevant teaching for our youth',
      scheduledAt: '2024-02-17T18:00:00',
      status: 'ended',
      viewers: 156,
      platforms: ['YouTube', 'Instagram', 'TikTok'],
      thumbnailUrl: '/api/placeholder/300/200'
    }
  ];

  const platforms = [
    { name: 'YouTube', connected: true, viewers: 124 },
    { name: 'Facebook', connected: true, viewers: 89 },
    { name: 'Instagram', connected: false, viewers: 0 },
    { name: 'TikTok', connected: false, viewers: 0 },
    { name: 'Website', connected: true, viewers: 34 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary rounded-full">
              <Video className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold">Live Streaming Platform</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Professional multi-platform live streaming for services, events, and ministry content
          </p>
          <div className="flex items-center justify-center gap-6">
            <Badge variant="secondary" className="px-4 py-2">
              <Monitor className="h-4 w-4 mr-2" />
              Multi-Platform
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              Interactive Chat
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Camera className="h-4 w-4 mr-2" />
              HD Quality
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="live">Live Studio</TabsTrigger>
            <TabsTrigger value="streams">My Streams</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Live Studio */}
          <TabsContent value="live" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Main Stream View */}
              <div className="lg:col-span-3 space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Live Stream Preview</p>
                          <p className="text-sm opacity-75">Your stream content will appear here</p>
                        </div>
                      </div>
                      
                      {/* Live Indicator */}
                      {isLive && (
                        <div className="absolute top-4 left-4 flex items-center gap-3">
                          <Badge className="bg-red-600">
                            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                            LIVE
                          </Badge>
                          <Badge variant="secondary">
                            <Users className="h-3 w-3 mr-1" />
                            {currentViewers} viewers
                          </Badge>
                        </div>
                      )}
                      
                      {/* Stream Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                          <h3 className="text-white font-semibold">Sunday Morning Service</h3>
                          <p className="text-white/80 text-sm">Join us for worship and fellowship</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stream Controls */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant={isLive ? "destructive" : "default"}
                          size="lg"
                          onClick={() => setIsLive(!isLive)}
                        >
                          {isLive ? 'End Stream' : 'Go Live'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setIsCameraOn(!isCameraOn)}
                        >
                          {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                        </Button>
                        
                        <Button variant="outline" size="lg">
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          Stream Health: <span className="text-green-600 font-semibold">Excellent</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Bitrate: <span className="font-semibold">2.5 Mbps</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stream Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Stream Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Stream Title</label>
                      <Input defaultValue="Sunday Morning Service" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input defaultValue="Join us for worship and fellowship" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Platform Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Platform Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {platforms.map(platform => (
                        <div key={platform.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${platform.connected ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className="text-sm font-medium">{platform.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {platform.connected ? `${platform.viewers}` : 'Offline'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Live Chat */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Live Chat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 overflow-y-auto space-y-2 mb-4">
                      <div className="text-sm">
                        <span className="font-semibold text-blue-600">John D:</span>
                        <span className="ml-2">Blessed morning everyone! 🙏</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-green-600">Sarah M:</span>
                        <span className="ml-2">Amazing worship today!</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-purple-600">Pastor Mike:</span>
                        <span className="ml-2">Thank you for joining us online</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Type a message..." className="flex-1" />
                      <Button size="sm">Send</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Stream Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Session</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="text-sm font-semibold">1:23:45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Peak Viewers</span>
                      <span className="text-sm font-semibold">312</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Chat Messages</span>
                      <span className="text-sm font-semibold">156</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* My Streams */}
          <TabsContent value="streams" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Streams</h2>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Stream
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {streams.map(stream => (
                <Card key={stream.id}>
                  <CardHeader>
                    <img 
                      src={stream.thumbnailUrl} 
                      alt={stream.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <div className="flex items-center justify-between">
                      <Badge variant={
                        stream.status === 'live' ? 'destructive' :
                        stream.status === 'scheduled' ? 'default' : 'secondary'
                      }>
                        {stream.status.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {stream.viewers}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">{stream.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {stream.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Scheduled: </span>
                        {new Date(stream.scheduledAt).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Platforms: </span>
                        {stream.platforms.join(', ')}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {stream.status === 'live' && (
                        <Button size="sm" className="flex-1">Manage Live</Button>
                      )}
                      {stream.status === 'scheduled' && (
                        <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                      )}
                      {stream.status === 'ended' && (
                        <Button size="sm" variant="outline" className="flex-1">View Recording</Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Streaming Analytics</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Streams</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                    <Video className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Viewers</p>
                      <p className="text-2xl font-bold">8,247</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Watch Time</p>
                      <p className="text-2xl font-bold">42 min</p>
                    </div>
                    <Play className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Engagement Rate</p>
                      <p className="text-2xl font-bold">76%</p>
                    </div>
                    <Volume2 className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Streaming Settings</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Video Quality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Resolution</label>
                    <Input defaultValue="1920x1080" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Frame Rate</label>
                    <Input defaultValue="30 FPS" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bitrate</label>
                    <Input defaultValue="2500 kbps" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {platforms.map(platform => (
                    <div key={platform.name} className="flex items-center justify-between">
                      <span className="font-medium">{platform.name}</span>
                      <Button 
                        variant={platform.connected ? "destructive" : "default"}
                        size="sm"
                      >
                        {platform.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LiveStreaming;