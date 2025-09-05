import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  Heart, 
  BookOpen,
  Video,
  BarChart3,
  Shield,
  Smartphone
} from "lucide-react";

const ChurchSolutions = () => {
  const features = [
    {
      icon: Users,
      title: "Member Management",
      description: "Complete member database with attendance tracking, small groups, and communication tools."
    },
    {
      icon: Calendar,
      title: "Event Planning",
      description: "Streamline event registration, volunteer coordination, and facility booking."
    },
    {
      icon: DollarSign,
      title: "Digital Giving",
      description: "Secure online donations with recurring giving, pledge tracking, and detailed reporting."
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description: "Multi-channel messaging including email, SMS, and push notifications."
    },
    {
      icon: Heart,
      title: "Pastoral Care",
      description: "Prayer request management, grief support, and member care coordination."
    },
    {
      icon: BookOpen,
      title: "Sermon Management",
      description: "Upload, organize, and share sermons with automated transcription and AI insights."
    },
    {
      icon: Video,
      title: "Live Streaming",
      description: "Multi-platform broadcasting with recording, chat, and engagement analytics."
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Comprehensive insights into attendance, giving, engagement, and growth trends."
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Enterprise-grade security with role-based access and data protection."
    },
    {
      icon: Smartphone,
      title: "Mobile App Builder",
      description: "Custom branded mobile apps for iOS and Android with push notifications."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Complete Church Management Solution
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Everything your church needs to thrive in one integrated platform. 
            From member management to live streaming, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" variant="cta">
                Schedule a Demo
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features for Modern Churches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <IconComponent className="h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Churches Choose Faith Harbor</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Built for Ministry</h3>
                  <p className="text-muted-foreground">
                    Every feature is designed with church operations in mind, created by ministry leaders 
                    who understand your unique needs and challenges.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">All-in-One Platform</h3>
                  <p className="text-muted-foreground">
                    Stop juggling multiple systems. Faith Harbor combines member management, 
                    communication, giving, events, and more in one seamless platform.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Scalable & Affordable</h3>
                  <p className="text-muted-foreground">
                    Whether you're a small community church or a large congregation, 
                    our pricing scales with your ministry without breaking your budget.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-8">
              <blockquote className="text-lg italic mb-4">
                "Faith Harbor has transformed how we connect with our congregation. 
                The integrated platform saves us hours every week and helps us focus 
                on what matters most – serving our community."
              </blockquote>
              <cite className="text-sm font-semibold">
                Pastor Sarah Johnson<br />
                <span className="text-muted-foreground">Grace Community Church</span>
              </cite>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-muted rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Church?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of churches already using Faith Harbor to strengthen their ministry 
            and deepen community connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" variant="cta">
                Get Started Today
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChurchSolutions;