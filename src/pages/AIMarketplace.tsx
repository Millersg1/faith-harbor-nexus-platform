import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bot, 
  Mic, 
  FileText, 
  Heart, 
  Calendar,
  Users,
  DollarSign,
  Smartphone,
  Globe,
  Video,
  MessageSquare,
  TrendingUp,
  Star,
  Search,
  Filter,
  Sparkles,
  Zap,
  Shield,
  Clock,
  Award,
  Brain
} from "lucide-react";

interface AITool {
  id: string;
  name: string;
  category: 'voice' | 'content' | 'analytics' | 'automation' | 'spiritual' | 'multimedia';
  description: string;
  features: string[];
  price: string;
  rating: number;
  users: string;
  icon: any;
  premium: boolean;
  new: boolean;
  status: 'live' | 'beta' | 'coming-soon';
  capabilities: string[];
}

const aiTools: AITool[] = [
  {
    id: '1',
    name: 'Voice Cloning Studio',
    category: 'voice',
    description: 'Create personalized AI voices for pastoral messages and church communications',
    features: ['ElevenLabs Integration', 'Custom Voice Training', 'Multi-language Support', 'Sermon Narration'],
    price: '$29/month',
    rating: 4.9,
    users: '2.5k+',
    icon: Mic,
    premium: true,
    new: false,
    status: 'live',
    capabilities: ['Voice Cloning', 'Speech Generation', 'Audio Quality Enhancement']
  },
  {
    id: '2',
    name: 'AI Sermon Transcription',
    category: 'content',
    description: 'Automatic transcription and insights generation from sermon audio',
    features: ['OpenAI Whisper', 'Auto-Transcription', 'Key Points Extraction', 'Scripture References'],
    price: '$19/month',
    rating: 4.8,
    users: '3.2k+',
    icon: FileText,
    premium: false,
    new: false,
    status: 'live',
    capabilities: ['Speech-to-Text', 'Content Analysis', 'Scripture Matching']
  },
  {
    id: '3',
    name: 'Spiritual AI Companion',
    category: 'spiritual',
    description: '24/7 AI spiritual guidance and biblical counseling assistant',
    features: ['Biblical Knowledge Base', 'Prayer Support', 'Spiritual Guidance', 'Crisis Intervention'],
    price: '$39/month',
    rating: 4.9,
    users: '5.1k+',
    icon: Heart,
    premium: true,
    new: true,
    status: 'live',
    capabilities: ['Spiritual Counseling', 'Prayer Generation', 'Biblical Q&A', 'Crisis Support']
  },
  {
    id: '4',
    name: 'Predictive Analytics Engine',
    category: 'analytics',
    description: 'AI-powered insights for church growth and member engagement',
    features: ['Member Engagement Prediction', 'Giving Forecasts', 'Attendance Patterns', 'Retention Analytics'],
    price: '$49/month',
    rating: 4.7,
    users: '1.8k+',
    icon: TrendingUp,
    premium: true,
    new: false,
    status: 'live',
    capabilities: ['Predictive Modeling', 'Engagement Scoring', 'Churn Prevention', 'Growth Optimization']
  },
  {
    id: '5',
    name: 'Smart Workflow Automation',
    category: 'automation',
    description: 'Automate church operations with intelligent workflow management',
    features: ['Event Triggers', 'Member Follow-ups', 'Donation Processing', 'Communication Automation'],
    price: '$35/month',
    rating: 4.6,
    users: '2.9k+',
    icon: Zap,
    premium: false,
    new: false,
    status: 'live',
    capabilities: ['Process Automation', 'Smart Triggers', 'Email Sequences', 'Task Management']
  },
  {
    id: '6',
    name: 'AI Content Generator',
    category: 'content',
    description: 'Generate sermons, newsletters, and social media content with AI',
    features: ['Sermon Outlines', 'Newsletter Creation', 'Social Media Posts', 'Bible Study Materials'],
    price: '$25/month',
    rating: 4.5,
    users: '4.2k+',
    icon: Bot,
    premium: false,
    new: true,
    status: 'live',
    capabilities: ['Content Creation', 'Style Adaptation', 'Scripture Integration', 'Multi-format Output']
  },
  {
    id: '7',
    name: 'Virtual Reality Worship',
    category: 'multimedia',
    description: 'Immersive VR worship experiences for remote congregation members',
    features: ['VR Service Streaming', '3D Church Environment', 'Virtual Communion', 'Interactive Prayer'],
    price: '$79/month',
    rating: 4.8,
    users: '850+',
    icon: Video,
    premium: true,
    new: true,
    status: 'beta',
    capabilities: ['VR Streaming', '3D Environments', 'Immersive Audio', 'Remote Interaction']
  },
  {
    id: '8',
    name: 'Blockchain Giving Platform',
    category: 'automation',
    description: 'Transparent, secure cryptocurrency and traditional donations',
    features: ['Crypto Donations', 'Smart Contracts', 'Transparency Dashboard', 'Tax Optimization'],
    price: '$59/month',
    rating: 4.4,
    users: '620+',
    icon: DollarSign,
    premium: true,
    new: true,
    status: 'beta',
    capabilities: ['Crypto Processing', 'Transparency Tracking', 'Smart Contracts', 'Tax Integration']
  }
];

const categories = [
  { id: 'all', name: 'All Tools', icon: Sparkles },
  { id: 'voice', name: 'Voice & Audio', icon: Mic },
  { id: 'content', name: 'Content Creation', icon: FileText },
  { id: 'analytics', name: 'Analytics & Insights', icon: TrendingUp },
  { id: 'automation', name: 'Automation', icon: Zap },
  { id: 'spiritual', name: 'Spiritual Care', icon: Heart },
  { id: 'multimedia', name: 'Multimedia', icon: Video }
];

const AIMarketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const filteredTools = aiTools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price':
        return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''));
      case 'new':
        return Number(b.new) - Number(a.new);
      default: // popular
        return parseInt(b.users.replace(/\D/g, '')) - parseInt(a.users.replace(/\D/g, ''));
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-green-100 text-green-800">Live</Badge>;
      case 'beta':
        return <Badge className="bg-blue-100 text-blue-800">Beta</Badge>;
      case 'coming-soon':
        return <Badge className="bg-gray-100 text-gray-800">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">AI Marketplace</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cutting-edge AI tools that make Faith Harbor superior to any church management platform on the market
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="text-sm">
              <Award className="h-4 w-4 mr-1" />
              Market Leading
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Shield className="h-4 w-4 mr-1" />
              Enterprise Grade
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Clock className="h-4 w-4 mr-1" />
              24/7 Available
            </Badge>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search AI tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="new">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-7">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* AI Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Card key={tool.id} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
                {tool.new && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-gradient-primary text-white">NEW</Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    {getStatusBadge(tool.status)}
                  </div>
                  
                  <CardTitle className="text-lg flex items-center gap-2">
                    {tool.name}
                    {tool.premium && (
                      <Badge variant="outline" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Pro
                      </Badge>
                    )}
                  </CardTitle>
                  
                  <CardDescription className="text-sm leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Capabilities */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Key Capabilities:</h4>
                    <div className="flex flex-wrap gap-1">
                      {tool.capabilities.slice(0, 3).map((capability, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{tool.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{tool.users}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-lg font-bold text-primary">{tool.price}</div>
                    <Button 
                      size="sm" 
                      className={tool.status === 'live' ? '' : 'opacity-50 cursor-not-allowed'}
                      disabled={tool.status !== 'live'}
                    >
                      {tool.status === 'live' ? 'Get Started' : 
                       tool.status === 'beta' ? 'Join Beta' : 'Coming Soon'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Market Advantages Section */}
        <div className="mt-16 bg-gradient-subtle rounded-3xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Faith Harbor Leads the Market</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Our AI-powered platform delivers capabilities that no other church management system can match
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Advanced AI Integration</h3>
              <p className="text-sm text-muted-foreground">
                GPT-5, ElevenLabs, Whisper, and custom AI models
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Immersive Technologies</h3>
              <p className="text-sm text-muted-foreground">
                VR worship, AR experiences, and 3D environments
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Blockchain Innovation</h3>
              <p className="text-sm text-muted-foreground">
                Crypto donations, transparency, and smart contracts
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Predictive Analytics</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered growth forecasts and member insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMarketplace;