import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Building, 
  TrendingUp, 
  Users, 
  Globe,
  Heart,
  Shield,
  Smartphone,
  BarChart3,
  MessageSquare,
  DollarSign
} from "lucide-react";

const BusinessSolutions = () => {
  const features = [
    {
      icon: Building,
      title: "Faith-Based Business Tools",
      description: "Purpose-built solutions for Christian businesses, nonprofits, and faith-based organizations."
    },
    {
      icon: TrendingUp,
      title: "Growth Analytics",
      description: "Track performance, measure impact, and make data-driven decisions aligned with your mission."
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Manage staff, volunteers, and stakeholders with role-based access and collaboration tools."
    },
    {
      icon: Globe,
      title: "Website & Funnel Builder",
      description: "Create professional websites and sales funnels that reflect your faith-based values."
    },
    {
      icon: Heart,
      title: "Mission-Driven Marketing",
      description: "Ethical marketing tools that help you reach your audience while staying true to your values."
    },
    {
      icon: Shield,
      title: "Ethical Business Practices",
      description: "Built-in frameworks to ensure your business operations align with Christian principles."
    },
    {
      icon: Smartphone,
      title: "Mobile-First Approach",
      description: "Reach your audience wherever they are with mobile-optimized tools and apps."
    },
    {
      icon: BarChart3,
      title: "Financial Stewardship",
      description: "Track finances, manage budgets, and ensure responsible stewardship of resources."
    },
    {
      icon: MessageSquare,
      title: "Customer Engagement",
      description: "Build meaningful relationships with customers through personalized communication."
    },
    {
      icon: DollarSign,
      title: "Revenue Optimization",
      description: "Maximize impact and sustainability while maintaining ethical business practices."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Faith-Based Business Solutions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Grow your Christian business or nonprofit with tools designed for organizations 
            that put faith and values at the center of everything they do.
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
            Powerful Tools for Purpose-Driven Organizations
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

        {/* Use Cases Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Perfect For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Christian Businesses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For-profit businesses founded on Christian principles looking to integrate 
                  faith into their operations and marketing.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Faith-based marketing tools</li>
                  <li>• Ethical business frameworks</li>
                  <li>• Customer relationship management</li>
                  <li>• Values-driven analytics</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Nonprofits & Ministries</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  501(c)(3) organizations and ministries focused on making a kingdom impact 
                  through their programs and services.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Donor management systems</li>
                  <li>• Volunteer coordination</li>
                  <li>• Impact measurement tools</li>
                  <li>• Grant application assistance</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Christian Coaches & Consultants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Individual practitioners offering faith-based coaching, consulting, 
                  or professional services.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Client management systems</li>
                  <li>• Appointment scheduling</li>
                  <li>• Payment processing</li>
                  <li>• Content delivery platforms</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Faith Harbor for Business?</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Values-Aligned Technology</h3>
                  <p className="text-muted-foreground">
                    Built by believers for believers. Our platform ensures your technology 
                    stack aligns with your Christian values and mission.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ethical Business Framework</h3>
                  <p className="text-muted-foreground">
                    Integrated guidelines and tools help ensure your business practices 
                    reflect biblical principles of integrity, stewardship, and service.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Kingdom Impact Focus</h3>
                  <p className="text-muted-foreground">
                    Beyond profit margins, track the kingdom impact of your work with 
                    metrics that matter for eternity.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-8">
              <blockquote className="text-lg italic mb-4">
                "Faith Harbor helps us run our business with excellence while keeping 
                Christ at the center. It's the only platform that truly understands 
                the unique needs of faith-based organizations."
              </blockquote>
              <cite className="text-sm font-semibold">
                David Chen<br />
                <span className="text-muted-foreground">Founder, Kingdom Consulting Group</span>
              </cite>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-muted rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Kingdom Business?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of faith-based businesses and nonprofits using Faith Harbor 
            to make a greater impact while staying true to their values.
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

export default BusinessSolutions;