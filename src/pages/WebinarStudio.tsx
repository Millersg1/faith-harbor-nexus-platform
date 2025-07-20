import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, 
  Users, 
  Calendar, 
  Settings, 
  Play, 
  Square, 
  Mic, 
  Camera, 
  Share2, 
  Monitor,
  Clock,
  MessageSquare,
  PlusCircle,
  Eye,
  Download
} from "lucide-react";

interface Webinar {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  attendees: number;
  status: 'scheduled' | 'live' | 'ended';
  recordingUrl?: string;
}

const WebinarStudio = () => {
  const [isLive, setIsLive] = useState(false);
  const [webinars] = useState<Webinar[]>([
    {
      id: '1',
      title: 'Biblical Financial Stewardship Workshop',
      description: 'Learn practical biblical principles for managing your finances',
      date: '2024-02-15T19:00:00',
      duration: '90 minutes',
      attendees: 45,
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Church Leadership in the Digital Age',
      description: 'Adapting traditional ministry practices for modern technology',
      date: '2024-02-10T18:00:00',
      duration: '60 minutes',
      attendees: 127,
      status: 'ended',
      recordingUrl: '/recordings/church-leadership.mp4'
    },
    {
      id: '3',
      title: 'Small Group Leader Training',
      description: 'Essential skills for effective small group facilitation',
      date: '2024-02-12T20:00:00',
      duration: '75 minutes',
      attendees: 23,
      status: 'live'
    }
  ]);

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
            <h1 className="text-5xl font-bold">Webinar Studio</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Professional webinar hosting with interactive features, recording capabilities, and seamless ministry integration
          </p>
          <Button size="lg" className="mr-4">
            <PlusCircle className="h-5 w-5 mr-2" />
            Create Webinar
          </Button>
          <Button variant="outline" size="lg">
            <Play className="h-5 w-5 mr-2" />
            Go Live Now
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="studio" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="studio">Live Studio</TabsTrigger>
            <TabsTrigger value="webinars">My Webinars</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Live Studio */}
          <TabsContent value="studio" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Video Area */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Camera Preview</p>
                          <p className="text-sm opacity-75">Click to start your camera</p>
                        </div>
                      </div>
                      {isLive && (
                        <Badge className="absolute top-4 left-4 bg-red-600">
                          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                          LIVE
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Controls */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant={isLive ? "destructive" : "default"}
                        size="lg"
                        onClick={() => setIsLive(!isLive)}
                      >
                        {isLive ? <Square className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                        {isLive ? 'Stop Stream' : 'Go Live'}
                      </Button>
                      <Button variant="outline" size="lg">
                        <Mic className="h-5 w-5 mr-2" />
                        Mute
                      </Button>
                      <Button variant="outline" size="lg">
                        <Camera className="h-5 w-5 mr-2" />
                        Camera
                      </Button>
                      <Button variant="outline" size="lg">
                        <Monitor className="h-5 w-5 mr-2" />
                        Share Screen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Live Chat */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Live Chat
                      <Badge variant="secondary">24 viewers</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 h-64 overflow-y-auto">
                      <div className="text-sm">
                        <span className="font-semibold text-blue-600">John D:</span>
                        <span className="ml-2">Great presentation!</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-green-600">Sarah M:</span>
                        <span className="ml-2">Can you share the slides?</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-purple-600">Pastor Mike:</span>
                        <span className="ml-2">Excellent biblical insights</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Input placeholder="Type a message..." />
                    </div>
                  </CardContent>
                </Card>

                {/* Webinar Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Session</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">24 attendees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">45 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">Recording: ON</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* My Webinars */}
          <TabsContent value="webinars" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Webinars</h2>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Schedule New Webinar
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {webinars.map(webinar => (
                <Card key={webinar.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant={
                        webinar.status === 'live' ? 'destructive' :
                        webinar.status === 'scheduled' ? 'default' : 'secondary'
                      }>
                        {webinar.status.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {webinar.attendees}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">{webinar.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {webinar.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(webinar.date).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {webinar.duration}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {webinar.status === 'live' && (
                        <Button size="sm" className="flex-1">Join Live</Button>
                      )}
                      {webinar.status === 'scheduled' && (
                        <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                      )}
                      {webinar.recordingUrl && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Webinars</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <Video className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Attendees</p>
                      <p className="text-2xl font-bold">1,247</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Duration</p>
                      <p className="text-2xl font-bold">67 min</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Engagement Rate</p>
                      <p className="text-2xl font-bold">89%</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Webinar Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Default Duration</label>
                    <Input placeholder="60 minutes" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Max Attendees</label>
                    <Input placeholder="100" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Recording Quality</label>
                    <Input placeholder="HD 1080p" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Chat Moderation</label>
                    <Input placeholder="Enabled" />
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

export default WebinarStudio;