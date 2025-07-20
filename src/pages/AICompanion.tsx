import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Heart, 
  Book, 
  Hand, 
  Brain,
  Shield,
  Zap,
  MessageCircle,
  Settings,
  Users,
  TrendingUp
} from "lucide-react";
import IntelligentChatbot from "@/components/IntelligentChatbot";
import { useToast } from "@/hooks/use-toast";

interface SpiritualResource {
  id: string;
  title: string;
  category: string;
  content: string;
  verse?: string;
}

interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: 'available' | 'coming-soon' | 'beta';
}

const aiFeatures: AIFeature[] = [
  {
    id: '1',
    title: '24/7 Spiritual Guidance',
    description: 'Get instant biblical wisdom and spiritual guidance anytime you need it.',
    icon: MessageCircle,
    status: 'available'
  },
  {
    id: '2',
    title: 'Prayer Support',
    description: 'Receive personalized prayer suggestions and join prayer communities.',
    icon: Hand,
    status: 'available'
  },
  {
    id: '3',
    title: 'Sermon Assistance',
    description: 'AI-powered sermon research, outline generation, and biblical insights.',
    icon: Book,
    status: 'beta'
  },
  {
    id: '4',
    title: 'Pastoral Care Analytics',
    description: 'Track spiritual growth patterns and identify members needing care.',
    icon: TrendingUp,
    status: 'coming-soon'
  },
  {
    id: '5',
    title: 'Voice Cloning',
    description: 'Create personalized pastoral messages with voice cloning technology.',
    icon: Zap,
    status: 'coming-soon'
  },
  {
    id: '6',
    title: 'Smart Insights',
    description: 'AI-driven insights for church growth and ministry effectiveness.',
    icon: Brain,
    status: 'beta'
  }
];

const spiritualResources: SpiritualResource[] = [
  {
    id: '1',
    title: 'Finding Peace in Difficult Times',
    category: 'Comfort',
    content: 'When facing challenges, remember that God\'s peace surpasses all understanding. Take time for prayer and meditation.',
    verse: 'Philippians 4:6-7'
  },
  {
    id: '2',
    title: 'Growing in Faith',
    category: 'Growth',
    content: 'Faith grows through consistent prayer, Bible study, and fellowship with other believers.',
    verse: 'Romans 10:17'
  },
  {
    id: '3',
    title: 'Overcoming Anxiety',
    category: 'Mental Health',
    content: 'Cast all your anxieties on God because he cares for you. Remember, you are never alone in your struggles.',
    verse: '1 Peter 5:7'
  },
  {
    id: '4',
    title: 'Walking in Purpose',
    category: 'Growth',
    content: 'God has a unique plan and purpose for your life. Seek Him through prayer and His Word to discover your calling.',
    verse: 'Jeremiah 29:11'
  },
  {
    id: '5',
    title: 'Finding Rest',
    category: 'Comfort',
    content: 'In our busy lives, Jesus invites us to find rest in Him. Take time to be still and know that He is God.',
    verse: 'Matthew 11:28-30'
  }
];

const AICompanion = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const { toast } = useToast();

  const handleFeatureClick = (feature: AIFeature) => {
    if (feature.status === 'coming-soon') {
      toast({
        title: "Coming Soon",
        description: `${feature.title} will be available in future updates.`,
      });
    } else if (feature.status === 'beta') {
      toast({
        title: "Beta Feature",
        description: `${feature.title} is currently in beta testing.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Bot className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold" style={{color: "hsl(var(--gold))"}}>AI Spiritual Companion</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your 24/7 spiritual guide powered by advanced AI, providing personalized guidance, 
            prayer support, and biblical wisdom to strengthen your faith journey.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="text-sm">
              <Brain className="h-4 w-4 mr-1" />
              AI Powered
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Shield className="h-4 w-4 mr-1" />
              SOC 2 Secure
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Users className="h-4 w-4 mr-1" />
              24/7 Available
            </Badge>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">AI Chat</TabsTrigger>
              <TabsTrigger value="features">AI Features</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-6">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Main Chat Interface */}
                <div className="lg:col-span-3">
                  <IntelligentChatbot 
                    position="embedded" 
                    showTraining={true}
                    customPrompt="You are Faith Harbor AI, a spiritual companion for the Faith Harbor ministry platform. Provide biblical wisdom, spiritual guidance, prayer support, and help with ministry questions. Always respond with compassion, wisdom, and appropriate scripture references."
                  />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Hand className="h-4 w-4 mr-2" />
                        Request Prayer
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Book className="h-4 w-4 mr-2" />
                        Bible Study
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Heart className="h-4 w-4 mr-2" />
                        Daily Devotion
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        AI Settings
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Usage Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Usage Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Conversations</span>
                          <Badge variant="secondary">12</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Prayers</span>
                          <Badge variant="secondary">8</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Scripture References</span>
                          <Badge variant="secondary">15</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiFeatures.map((feature) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card 
                      key={feature.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleFeatureClick(feature)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <Badge 
                            variant={
                              feature.status === 'available' ? 'default' : 
                              feature.status === 'beta' ? 'secondary' : 'outline'
                            }
                          >
                            {feature.status === 'available' ? 'Live' : 
                             feature.status === 'beta' ? 'Beta' : 'Soon'}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Spiritual Resources</CardTitle>
                  <p className="text-muted-foreground">
                    Curated spiritual guidance and biblical wisdom for your journey
                  </p>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="comfort" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="comfort">Comfort</TabsTrigger>
                      <TabsTrigger value="growth">Growth</TabsTrigger>
                      <TabsTrigger value="health">Mental Health</TabsTrigger>
                    </TabsList>
                    
                    {['comfort', 'growth', 'health'].map(category => (
                      <TabsContent key={category} value={category} className="mt-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          {spiritualResources
                            .filter(resource => 
                              resource.category.toLowerCase() === category || 
                              (category === 'health' && resource.category === 'Mental Health')
                            )
                            .map(resource => (
                            <Card key={resource.id}>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base">{resource.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground mb-3">{resource.content}</p>
                                {resource.verse && (
                                  <Badge variant="outline" className="text-xs">
                                    <Book className="h-3 w-3 mr-1" />
                                    {resource.verse}
                                  </Badge>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AICompanion;