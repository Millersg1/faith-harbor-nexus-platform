import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, Download, QrCode, Zap, Bell, Users, Calendar, Heart } from "lucide-react";

const MobileAppPreview = () => {
  const [activeDevice, setActiveDevice] = useState<'ios' | 'android'>('ios');

  const features = [
    {
      icon: <Bell className="h-5 w-5" />,
      title: "Push Notifications",
      description: "Get instant updates about events, prayer requests, and announcements"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Community Connect",
      description: "Stay connected with your church family through direct messaging"
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Event Management",
      description: "Register for events, view schedules, and get location details"
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: "Digital Giving",
      description: "Make secure donations and manage recurring giving directly from your phone"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Offline Access",
      description: "Access sermon notes, prayer lists, and key information without internet"
    }
  ];

  const screenshots = [
    { name: "Home", src: "/api/placeholder/300/600" },
    { name: "Events", src: "/api/placeholder/300/600" },
    { name: "Giving", src: "/api/placeholder/300/600" },
    { name: "Community", src: "/api/placeholder/300/600" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Smartphone className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold">Faith Harbor Mobile App</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Take your church community with you wherever you go. Connect, give, and grow in faith through our native mobile experience.
        </p>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          Coming Soon - Beta Testing Available
        </Badge>
      </div>

      {/* Download Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-6 w-6" />
            <span>Join Beta Program</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              size="lg" 
              variant={activeDevice === 'ios' ? 'default' : 'outline'}
              onClick={() => setActiveDevice('ios')}
              className="h-16"
            >
              <div className="text-left">
                <div className="font-semibold">Download for iOS</div>
                <div className="text-sm opacity-75">iPhone & iPad</div>
              </div>
            </Button>
            <Button 
              size="lg" 
              variant={activeDevice === 'android' ? 'default' : 'outline'}
              onClick={() => setActiveDevice('android')}
              className="h-16"
            >
              <div className="text-left">
                <div className="font-semibold">Download for Android</div>
                <div className="text-sm opacity-75">Google Play Store</div>
              </div>
            </Button>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Or scan the QR code</p>
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                <QrCode className="h-16 w-16 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover-scale">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {feature.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Device Preview */}
      <Card>
        <CardHeader>
          <CardTitle>App Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="home" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="giving">Giving</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>

            <div className="flex justify-center">
              <div className="relative">
                {/* Phone Frame */}
                <div className="w-80 h-96 bg-black rounded-3xl p-3 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                    
                    <TabsContent value="home" className="m-0">
                      <div className="p-4 space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary rounded-full"></div>
                          <div>
                            <div className="font-semibold">Welcome back, John</div>
                            <div className="text-sm text-muted-foreground">Sunday Service in 2 days</div>
                          </div>
                        </div>
                        
                        <div className="bg-primary/5 rounded-lg p-4">
                          <div className="font-semibold mb-2">This Week</div>
                          <div className="space-y-2 text-sm">
                            <div>• Sunday Service - 10:00 AM</div>
                            <div>• Bible Study - Wed 7:00 PM</div>
                            <div>• Youth Group - Fri 6:30 PM</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-muted rounded-lg p-3 text-center">
                            <div className="font-semibold">Give</div>
                            <div className="text-xs text-muted-foreground">Make donation</div>
                          </div>
                          <div className="bg-muted rounded-lg p-3 text-center">
                            <div className="font-semibold">Pray</div>
                            <div className="text-xs text-muted-foreground">Prayer requests</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="events" className="m-0">
                      <div className="p-4 space-y-4">
                        <div className="font-bold text-lg">Upcoming Events</div>
                        
                        <div className="space-y-3">
                          <div className="border rounded-lg p-3">
                            <div className="font-semibold">Sunday Service</div>
                            <div className="text-sm text-muted-foreground">Dec 24, 10:00 AM</div>
                            <div className="text-xs mt-1">Main Sanctuary</div>
                          </div>
                          
                          <div className="border rounded-lg p-3">
                            <div className="font-semibold">Christmas Eve Service</div>
                            <div className="text-sm text-muted-foreground">Dec 24, 7:00 PM</div>
                            <div className="text-xs mt-1">Main Sanctuary</div>
                          </div>
                          
                          <div className="border rounded-lg p-3">
                            <div className="font-semibold">New Year Prayer</div>
                            <div className="text-sm text-muted-foreground">Dec 31, 11:00 PM</div>
                            <div className="text-xs mt-1">Chapel</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="giving" className="m-0">
                      <div className="p-4 space-y-4">
                        <div className="font-bold text-lg">Digital Giving</div>
                        
                        <div className="bg-primary text-primary-foreground rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold">$2,450</div>
                          <div className="text-sm opacity-90">Total given this year</div>
                        </div>
                        
                        <div className="space-y-3">
                          <button className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold">
                            Give Now
                          </button>
                          
                          <div className="text-center text-sm text-muted-foreground">
                            Recurring giving: $100/month
                          </div>
                          
                          <div className="border rounded-lg p-3">
                            <div className="font-semibold">Recent Donations</div>
                            <div className="space-y-1 mt-2 text-sm">
                              <div className="flex justify-between">
                                <span>Dec 10, 2024</span>
                                <span>$100</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Nov 10, 2024</span>
                                <span>$100</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="community" className="m-0">
                      <div className="p-4 space-y-4">
                        <div className="font-bold text-lg">Community</div>
                        
                        <div className="space-y-3">
                          <div className="border rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary rounded-full"></div>
                              <div>
                                <div className="font-semibold">Pastor Mike</div>
                                <div className="text-sm text-muted-foreground">Peace be with you all 🙏</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-secondary rounded-full"></div>
                              <div>
                                <div className="font-semibold">Sarah Johnson</div>
                                <div className="text-sm text-muted-foreground">Prayer request for healing...</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-accent rounded-full"></div>
                              <div>
                                <div className="font-semibold">Youth Group</div>
                                <div className="text-sm text-muted-foreground">Game night this Friday!</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <button className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold">
                          Join Conversation
                        </button>
                      </div>
                    </TabsContent>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Beta Testing Signup */}
      <Card>
        <CardHeader>
          <CardTitle>Join Beta Testing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Be among the first to experience our mobile app. Beta testers get exclusive access and can help shape the final product.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex-1">
              Sign Up for Beta Testing
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileAppPreview;