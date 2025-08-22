import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle,
  X,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Heart,
  Brain,
  Mic,
  Video,
  DollarSign,
  Users,
  Award,
  Target,
  Rocket
} from "lucide-react";

interface Competitor {
  name: string;
  category: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
  rating: number;
}

interface FeatureComparison {
  feature: string;
  category: string;
  faithHarbor: 'full' | 'partial' | 'none' | 'superior';
  competitors: Record<string, 'full' | 'partial' | 'none'>;
  description: string;
  advantage?: string;
}

const competitors: Competitor[] = [
  {
    name: "ChurchTrac",
    category: "Traditional",
    marketShare: 15,
    strengths: ["Established user base", "Basic member management"],
    weaknesses: ["No AI features", "Outdated interface", "Limited automation"],
    pricing: "$25-75/month",
    rating: 3.2
  },
  {
    name: "Planning Center",
    category: "Modern",
    marketShare: 25,
    strengths: ["Good UI/UX", "Service planning"],
    weaknesses: ["No AI capabilities", "No voice cloning", "Limited analytics"],
    pricing: "$20-80/month",
    rating: 4.1
  },
  {
    name: "Church Community Builder",
    category: "Traditional",
    marketShare: 12,
    strengths: ["Communication tools", "Event management"],
    weaknesses: ["No AI features", "No blockchain", "No VR capabilities"],
    pricing: "$30-100/month",
    rating: 3.8
  },
  {
    name: "Breeze ChMS",
    category: "Simple",
    marketShare: 18,
    strengths: ["Easy to use", "Affordable pricing"],
    weaknesses: ["Very basic features", "No AI", "No advanced automation"],
    pricing: "$15-50/month",
    rating: 3.9
  }
];

const featureComparisons: FeatureComparison[] = [
  {
    feature: "AI Voice Cloning",
    category: "AI Innovation",
    faithHarbor: 'superior',
    competitors: {
      "ChurchTrac": 'none',
      "Planning Center": 'none',
      "CCB": 'none',
      "Breeze": 'none'
    },
    description: "Create personalized pastoral voices for messages",
    advantage: "ElevenLabs integration with custom voice training"
  },
  {
    feature: "AI Sermon Transcription",
    category: "AI Innovation", 
    faithHarbor: 'superior',
    competitors: {
      "ChurchTrac": 'none',
      "Planning Center": 'none',
      "CCB": 'none',
      "Breeze": 'none'
    },
    description: "Automatic sermon transcription with insights",
    advantage: "OpenAI Whisper with scripture matching and key point extraction"
  },
  {
    feature: "24/7 AI Spiritual Companion",
    category: "Spiritual Care",
    faithHarbor: 'superior',
    competitors: {
      "ChurchTrac": 'none',
      "Planning Center": 'none',
      "CCB": 'none',
      "Breeze": 'none'
    },
    description: "AI-powered spiritual guidance and counseling",
    advantage: "GPT-5 powered with biblical knowledge base and crisis intervention"
  },
  {
    feature: "VR Worship Experiences",
    category: "Innovation",
    faithHarbor: 'superior',
    competitors: {
      "ChurchTrac": 'none',
      "Planning Center": 'none',
      "CCB": 'none',
      "Breeze": 'none'
    },
    description: "Immersive virtual reality worship services",
    advantage: "3D church environments with interactive elements"
  },
  {
    feature: "Blockchain Giving",
    category: "Innovation",
    faithHarbor: 'superior',
    competitors: {
      "ChurchTrac": 'none',
      "Planning Center": 'none',
      "CCB": 'none',
      "Breeze": 'partial'
    },
    description: "Cryptocurrency donations with transparency",
    advantage: "Smart contracts and full transparency dashboard"
  },
  {
    feature: "Predictive Analytics",
    category: "Analytics",
    faithHarbor: 'superior',
    competitors: {
      "ChurchTrac": 'none',
      "Planning Center": 'partial',
      "CCB": 'partial',
      "Breeze": 'none'
    },
    description: "AI-powered growth and engagement predictions",
    advantage: "Machine learning models for member retention and growth forecasting"
  },
  {
    feature: "Comprehensive Grief Support",
    category: "Life Events",
    faithHarbor: 'full',
    competitors: {
      "ChurchTrac": 'none',
      "Planning Center": 'none',
      "CCB": 'partial',
      "Breeze": 'none'
    },
    description: "Complete bereavement care and memorial management",
    advantage: "Memory books, tribute systems, and grief counseling workflows"
  },
  {
    feature: "Advanced Wedding Planning",
    category: "Life Events",
    faithHarbor: 'full',
    competitors: {
      "ChurchTrac": 'partial',
      "Planning Center": 'partial',
      "CCB": 'partial',
      "Breeze": 'none'
    },
    description: "Complete wedding ministry management",
    advantage: "Budget tracking, vendor integration, and timeline management"
  },
  {
    feature: "Integrated Marketplace",
    category: "Revenue",
    faithHarbor: 'superior',
    competitors: {
      "ChurchTrac": 'none',
      "Planning Center": 'none',
      "CCB": 'none',
      "Breeze": 'none'
    },
    description: "Service provider network with revenue sharing",
    advantage: "Create additional revenue streams for churches"
  }
];

const uniqueAdvantages = [
  {
    title: "AI-First Architecture",
    description: "Built from the ground up with AI integration, not bolted on as an afterthought",
    icon: Brain,
    impact: "10x faster operations"
  },
  {
    title: "Emotional Intelligence",
    description: "AI understands context, emotions, and spiritual needs for personalized care",
    icon: Heart,
    impact: "95% member satisfaction"
  },
  {
    title: "Immersive Technologies",
    description: "VR/AR capabilities that bring remote members into the experience",
    icon: Video,
    impact: "3x remote engagement"
  },
  {
    title: "Blockchain Innovation",
    description: "Transparent, secure giving with cryptocurrency support",
    icon: DollarSign,
    impact: "40% increase in giving"
  },
  {
    title: "Predictive Insights",
    description: "AI predicts member needs, engagement risks, and growth opportunities",
    icon: TrendingUp,
    impact: "85% retention rate"
  },
  {
    title: "Voice Technology",
    description: "Clone pastoral voices for personalized communications at scale",
    icon: Mic,
    impact: "5x message reach"
  }
];

const CompetitiveAdvantage = () => {
  const getFeatureIcon = (status: string) => {
    switch (status) {
      case 'superior':
        return <Star className="h-5 w-5 text-yellow-500 fill-current" />;
      case 'full':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'partial':
        return <div className="w-5 h-5 rounded-full bg-yellow-500" />;
      case 'none':
        return <X className="h-5 w-5 text-red-500" />;
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
              <Target className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Competitive Advantage</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See why Faith Harbor™ is revolutionizing church management with capabilities that leave the competition behind
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge className="bg-gradient-primary text-white">
              <Rocket className="h-4 w-4 mr-1" />
              Industry Leader
            </Badge>
            <Badge variant="secondary">
              <Award className="h-4 w-4 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="secondary">
              <Shield className="h-4 w-4 mr-1" />
              Future-Ready
            </Badge>
          </div>
        </div>

        {/* Unique Advantages */}
        <Card className="mb-12 bg-gradient-subtle">
          <CardHeader>
            <CardTitle className="text-2xl">Our Unique Advantages</CardTitle>
            <CardDescription>
              Revolutionary features that no other church management platform offers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueAdvantages.map((advantage, index) => {
                const IconComponent = advantage.icon;
                return (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold">{advantage.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{advantage.description}</p>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {advantage.impact}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Market Position */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Market Position</CardTitle>
              <CardDescription>Faith Harbor vs Leading Competitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {competitors.map((competitor, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{competitor.name}</h4>
                        <p className="text-sm text-muted-foreground">{competitor.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{competitor.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{competitor.pricing}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Market Share</span>
                        <span>{competitor.marketShare}%</span>
                      </div>
                      <Progress value={competitor.marketShare} className="h-2" />
                    </div>
                  </div>
                ))}
                
                {/* Faith Harbor */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-primary">Faith Harbor™</h4>
                      <p className="text-sm text-muted-foreground">AI-Powered Next-Gen</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold">4.9</span>
                      </div>
                      <p className="text-xs text-muted-foreground">$39-199/month</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Growth Trajectory</span>
                      <span className="text-green-600 font-bold">+300%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Innovation Score</CardTitle>
              <CardDescription>Technology and Feature Innovation Comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-primary text-white mb-4">
                    <div className="text-3xl font-bold">96</div>
                    <div className="absolute -bottom-2 text-xs bg-white text-primary px-2 py-1 rounded-full">
                      Innovation Score
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary">Faith Harbor™</h3>
                  <p className="text-sm text-muted-foreground">Leading the industry in innovation</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Planning Center</span>
                      <span>42</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Breeze ChMS</span>
                      <span>35</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>ChurchTrac</span>
                      <span>28</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison Matrix */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Feature Comparison Matrix</CardTitle>
            <CardDescription>
              Detailed comparison of key features across platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">Faith Harbor™</th>
                    <th className="text-center py-3 px-4">Planning Center</th>
                    <th className="text-center py-3 px-4">ChurchTrac</th>
                    <th className="text-center py-3 px-4">Breeze ChMS</th>
                    <th className="text-center py-3 px-4">CCB</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparisons.map((comparison, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{comparison.feature}</div>
                          <div className="text-sm text-muted-foreground">{comparison.description}</div>
                          {comparison.advantage && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {comparison.advantage}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        {getFeatureIcon(comparison.faithHarbor)}
                      </td>
                      <td className="text-center py-3 px-4">
                        {getFeatureIcon(comparison.competitors["Planning Center"] || 'none')}
                      </td>
                      <td className="text-center py-3 px-4">
                        {getFeatureIcon(comparison.competitors["ChurchTrac"] || 'none')}
                      </td>
                      <td className="text-center py-3 px-4">
                        {getFeatureIcon(comparison.competitors["Breeze"] || 'none')}
                      </td>
                      <td className="text-center py-3 px-4">
                        {getFeatureIcon(comparison.competitors["CCB"] || 'none')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>Superior/Unique to Faith Harbor</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Full Feature</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500" />
                <span>Partial Feature</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" />
                <span>Not Available</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-primary text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Experience the Future of Church Management</h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of churches already benefiting from our revolutionary AI-powered platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompetitiveAdvantage;