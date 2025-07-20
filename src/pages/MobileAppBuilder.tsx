import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, 
  Palette, 
  Download, 
  Eye, 
  Settings, 
  Bell,
  Home,
  Calendar,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Play,
  Monitor
} from "lucide-react";

interface AppTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  preview: string;
}

interface AppPreview {
  id: string;
  name: string;
  icon: string;
  primaryColor: string;
  status: 'building' | 'ready' | 'published';
}

const MobileAppBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [appName, setAppName] = useState('Faith Harbor Church');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');

  const templates: AppTemplate[] = [
    {
      id: '1',
      name: 'Church Essential',
      description: 'Core features for church communication and engagement',
      category: 'Church',
      features: ['Sermons', 'Events', 'Prayer Requests', 'Live Stream', 'Giving'],
      preview: '/api/placeholder/200/400'
    },
    {
      id: '2',
      name: 'Youth Ministry',
      description: 'Designed specifically for youth group engagement',
      category: 'Youth',
      features: ['Youth Events', 'Small Groups', 'Devotionals', 'Games', 'Chat'],
      preview: '/api/placeholder/200/400'
    },
    {
      id: '3',
      name: 'Business Ministry',
      description: 'Professional features for ministry businesses',
      category: 'Business',
      features: ['Services', 'Booking', 'Payments', 'CRM', 'Analytics'],
      preview: '/api/placeholder/200/400'
    },
    {
      id: '4',
      name: 'Community Connect',
      description: 'Focus on community building and connections',
      category: 'Community',
      features: ['Member Directory', 'Groups', 'Messaging', 'Forums', 'Events'],
      preview: '/api/placeholder/200/400'
    }
  ];

  const myApps: AppPreview[] = [
    {
      id: '1',
      name: 'Grace Community Church',
      icon: '⛪',
      primaryColor: '#2563eb',
      status: 'published'
    },
    {
      id: '2',
      name: 'Youth Connect',
      icon: '🎯',
      primaryColor: '#16a34a',
      status: 'ready'
    },
    {
      id: '3',
      name: 'Ministry Business Hub',
      icon: '💼',
      primaryColor: '#dc2626',
      status: 'building'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary rounded-full">
              <Smartphone className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold">Mobile App Builder</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Create professional mobile apps for your church or ministry with our drag-and-drop builder. No coding required.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Badge variant="secondary" className="px-4 py-2">
              <Smartphone className="h-4 w-4 mr-2" />
              iOS & Android
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Settings className="h-4 w-4 mr-2" />
              No Code Required
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Download className="h-4 w-4 mr-2" />
              App Store Ready
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="builder">App Builder</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="my-apps">My Apps</TabsTrigger>
            <TabsTrigger value="publish">Publish</TabsTrigger>
          </TabsList>

          {/* App Builder */}
          <TabsContent value="builder" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Design Panel */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      App Design
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">App Name</label>
                      <Input 
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        placeholder="Enter app name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Primary Color</label>
                      <div className="flex gap-2 mt-1">
                        <Input 
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input 
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">App Icon</label>
                      <div className="grid grid-cols-4 gap-2 mt-1">
                        {['⛪', '✝️', '🙏', '📖', '❤️', '🎯', '🌟', '💫'].map(icon => (
                          <Button key={icon} variant="outline" className="h-12 text-lg">
                            {icon}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: 'Live Streaming', icon: Play },
                        { name: 'Push Notifications', icon: Bell },
                        { name: 'Event Calendar', icon: Calendar },
                        { name: 'Member Directory', icon: Users },
                        { name: 'Prayer Requests', icon: Heart },
                        { name: 'Messaging', icon: MessageSquare },
                        { name: 'Social Sharing', icon: Share2 }
                      ].map(feature => (
                        <div key={feature.name} className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <feature.icon className="h-4 w-4" />
                          <span className="text-sm">{feature.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Phone Preview */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <div className="relative">
                        {/* Phone Frame */}
                        <div className="w-80 h-[640px] bg-black rounded-[3rem] p-4 shadow-2xl">
                          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                            {/* Status Bar */}
                            <div className="h-12 bg-gray-100 flex items-center justify-between px-4 text-xs">
                              <span>9:41</span>
                              <span>●●●●● WiFi 100%</span>
                            </div>
                            
                            {/* App Header */}
                            <div 
                              className="h-16 flex items-center justify-center text-white font-semibold"
                              style={{ backgroundColor: primaryColor }}
                            >
                              {appName}
                            </div>
                            
                            {/* App Content */}
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                                  <Play className="h-8 w-8 mb-2 text-gray-600" />
                                  <span className="text-xs">Live Stream</span>
                                </div>
                                <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                                  <Calendar className="h-8 w-8 mb-2 text-gray-600" />
                                  <span className="text-xs">Events</span>
                                </div>
                                <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                                  <Heart className="h-8 w-8 mb-2 text-gray-600" />
                                  <span className="text-xs">Prayer</span>
                                </div>
                                <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                                  <Users className="h-8 w-8 mb-2 text-gray-600" />
                                  <span className="text-xs">Connect</span>
                                </div>
                              </div>
                              
                              <div className="bg-gray-50 rounded-lg p-3">
                                <h3 className="font-semibold text-sm mb-1">Upcoming Event</h3>
                                <p className="text-xs text-gray-600">Sunday Service - 10:00 AM</p>
                              </div>
                            </div>
                            
                            {/* Bottom Navigation */}
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around">
                              <Home className="h-6 w-6 text-gray-400" />
                              <Calendar className="h-6 w-6 text-gray-400" />
                              <Heart className="h-6 w-6" style={{ color: primaryColor }} />
                              <Users className="h-6 w-6 text-gray-400" />
                              <Settings className="h-6 w-6 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-4 mt-6">
                      <Button>
                        <Monitor className="h-4 w-4 mr-2" />
                        Preview on Device
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Choose Your Template</h2>
              <p className="text-muted-foreground">Start with a professionally designed template and customize it for your ministry</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map(template => (
                <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <img 
                      src={template.preview} 
                      alt={template.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{template.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Included Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.features.map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4"
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      Use This Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Apps */}
          <TabsContent value="my-apps" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Apps</h2>
              <Button>
                <Smartphone className="h-4 w-4 mr-2" />
                Create New App
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myApps.map(app => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                        style={{ backgroundColor: app.primaryColor }}
                      >
                        {app.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{app.name}</CardTitle>
                        <Badge variant={
                          app.status === 'published' ? 'default' :
                          app.status === 'ready' ? 'secondary' : 'outline'
                        }>
                          {app.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      {app.status === 'ready' && (
                        <Button size="sm" className="flex-1">
                          <Download className="h-4 w-4 mr-1" />
                          Publish
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Publish */}
          <TabsContent value="publish" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>App Store Publishing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">iOS App Store</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        </div>
                        <span className="text-sm">App Review Guidelines Check</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        </div>
                        <span className="text-sm">App Store Connect Setup</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                        </div>
                        <span className="text-sm">Ready for Submission</span>
                      </div>
                    </div>
                    <Button className="w-full">Submit to App Store</Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Google Play Store</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        </div>
                        <span className="text-sm">Play Console Setup</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        </div>
                        <span className="text-sm">Content Rating Complete</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                        </div>
                        <span className="text-sm">Ready for Submission</span>
                      </div>
                    </div>
                    <Button className="w-full">Submit to Play Store</Button>
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

export default MobileAppBuilder;