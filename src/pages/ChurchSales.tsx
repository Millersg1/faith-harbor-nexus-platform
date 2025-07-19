import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  DollarSign, 
  BarChart3, 
  Bot,
  Heart,
  Video,
  Shield,
  Baby,
  Headphones,
  Globe,
  CheckCircle,
  ArrowRight,
  Star,
  Play,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const ChurchSales = () => {
  const coreFeatures = [
    {
      icon: Users,
      title: "Complete Member Management",
      description: "Comprehensive member database with family tracking, spiritual growth monitoring, and attendance management",
      features: ["Member profiles & families", "Attendance tracking", "Spiritual growth milestones", "Custom member fields", "Import/export capabilities"]
    },
    {
      icon: Calendar,
      title: "Advanced Event Management",
      description: "Plan, promote, and manage all church events with automated workflows and volunteer coordination",
      features: ["Event planning & promotion", "Volunteer scheduling", "Registration management", "Resource booking", "Automated reminders"]
    },
    {
      icon: MessageSquare,
      title: "Unified Communication Hub",
      description: "Reach your congregation through email, SMS, push notifications, and social media from one platform",
      features: ["Email campaigns", "SMS messaging", "Push notifications", "Social media integration", "Automated follow-ups"]
    },
    {
      icon: DollarSign,
      title: "Complete Giving Platform",
      description: "Modern online giving with recurring donations, pledges, and comprehensive financial reporting",
      features: ["Online giving portal", "Recurring donations", "Pledge management", "Financial reporting", "Tax statement generation"]
    },
    {
      icon: BarChart3,
      title: "AI-Powered Analytics",
      description: "Gain insights into attendance trends, giving patterns, and ministry effectiveness with AI analytics",
      features: ["Attendance analytics", "Giving insights", "Growth predictions", "Ministry effectiveness", "Custom dashboards"]
    },
    {
      icon: Bot,
      title: "AI Spiritual Companion",
      description: "24/7 pastoral care assistant with voice cloning, sermon help, and personalized spiritual guidance",
      features: ["24/7 pastoral support", "Sermon assistance", "Prayer request management", "Spiritual guidance", "Voice cloning technology"]
    }
  ];

  const additionalFeatures = [
    { icon: Heart, title: "Children's Ministry", description: "Complete kids program management with check-in/out, curriculum planning, and parent communication" },
    { icon: Video, title: "Live Streaming", description: "Multi-platform streaming to Facebook, YouTube, church website with automated recording and archival" },
    { icon: Shield, title: "Enterprise Security", description: "SOC 2 compliance, encrypted data, secure payment processing, and regular security audits" },
    { icon: Baby, title: "Small Groups", description: "Organize and manage small groups, Bible studies, and ministry teams with scheduling and resources" },
    { icon: Headphones, title: "Worship Planning", description: "Plan services, manage song libraries, coordinate with musicians, and track copyright licensing" },
    { icon: Globe, title: "Multi-Site Management", description: "Manage multiple campuses, share resources, coordinate events, and maintain unified communication" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-hero-gradient text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              Built Specifically for Churches
            </Badge>
            
            <h1 className="heading-hero mb-6" style={{
              textShadow: '2px 2px 8px rgba(0,0,0,0.7)'
            }}>
              Transform Your Church with
              <span className="block" style={{color: "hsl(var(--gold))"}}>
                Faith Harbor
              </span>
            </h1>
            
            <p className="body-xl mb-8 text-white/90" style={{
              textShadow: '1px 1px 4px rgba(0,0,0,0.6)'
            }}>
              A complete ministry management platform designed by church leaders, for church leaders. 
              Streamline operations, engage members, and grow your ministry with AI-powered tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/auth">
                <Button size="lg" variant="premium" className="px-8 py-4 text-lg">
                  Join Early Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/demo-video">
                <Button size="lg" variant="premium" className="px-8 py-4 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Church Demo
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">600+</div>
                <div className="text-sm opacity-90">Features Planned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">AI</div>
                <div className="text-sm opacity-90">Powered Platform</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">SOC 2</div>
                <div className="text-sm opacity-90">Security Standard</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">24/7</div>
                <div className="text-sm opacity-90">Ministry Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-6" style={{color: "hsl(var(--gold))"}}>
              Everything Your Church Needs
              <span className="block text-primary">In One Platform</span>
            </h2>
            <p className="body-lg text-muted-foreground max-w-3xl mx-auto">
              Replace dozens of separate tools with our comprehensive church management solution
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="ministry-card">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="feature-icon mr-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl" style={{color: "hsl(var(--gold))"}}>
                      {feature.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-6" style={{color: "hsl(var(--gold))"}}>
              Plus Dozens More Features
            </h2>
            <p className="body-lg text-muted-foreground">
              Every tool your ministry needs, all working together seamlessly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="text-center ministry-card">
                <div className="feature-icon mx-auto mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-3" style={{color: "hsl(var(--gold))"}}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Status */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Star className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-4" style={{color: "hsl(var(--gold))"}}>
                  Be Part of the Development Journey
                </CardTitle>
                <CardDescription className="text-base">
                  Faith Harbor is being built with input from church leaders like you. 
                  Join our early access program to help shape every feature.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">Early</div>
                    <div className="text-sm text-muted-foreground">Access Program</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">2025</div>
                    <div className="text-sm text-muted-foreground">Launch Timeline</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">Free</div>
                    <div className="text-sm text-muted-foreground">To Join Community</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    ✓ Help shape features • ✓ Founding member benefits • ✓ Direct developer access
                  </p>
                  <Link to="/auth">
                    <Button size="lg" variant="hero">
                      <Zap className="mr-2 h-5 w-5" />
                      Join Early Access Program
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-6" style={{color: "hsl(var(--gold))"}}>
              Planned Church Pricing
            </h2>
            <p className="body-lg text-muted-foreground">
              Affordable pricing designed specifically for churches of all sizes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Small Church",
                price: 49,
                description: "Up to 100 active members",
                popular: false
              },
              {
                name: "Growing Church",
                price: 99,
                description: "Up to 500 active members",
                popular: true
              },
              {
                name: "Large Church",
                price: 199,
                description: "Unlimited members & multi-site",
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`text-center pricing-card ${plan.popular ? 'featured' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl" style={{color: "hsl(var(--gold))"}}>{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">${plan.price}<span className="text-base text-muted-foreground">/mo</span></div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/auth">
                    <Button variant={plan.popular ? "hero" : "outline"} className="w-full">
                      Join Early Access
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Early access members receive special founding member rates when we launch
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChurchSales;