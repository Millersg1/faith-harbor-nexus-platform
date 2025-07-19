import { Button } from "@/components/ui/button";
import { Check, Star, Users, Shield, Zap, ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const ChurchSales = () => {
  const pricingPlans = [
    {
      name: "Starter",
      price: 97,
      description: "Perfect for small churches (up to 100 members)",
      features: [
        "Member Management System",
        "Basic Financial Tracking", 
        "Email Communication",
        "Event Calendar",
        "Online Giving",
        "Mobile App Access",
        "Basic Support"
      ],
      popular: false
    },
    {
      name: "Professional", 
      price: 197,
      description: "Ideal for growing churches (up to 500 members)",
      features: [
        "Everything in Starter",
        "AI Spiritual Companion",
        "Advanced Analytics",
        "Volunteer Management",
        "Children's Ministry Tools",
        "Live Streaming",
        "Priority Support",
        "Custom Branding"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: 397, 
      description: "For large churches and multi-site ministries",
      features: [
        "Everything in Professional",
        "Multi-Site Management",
        "Advanced Security",
        "Custom Integrations",
        "White-Label Options",
        "Dedicated Account Manager",
        "Phone Support",
        "Custom Training"
      ],
      popular: false
    }
  ];


  const features = [
    {
      title: "AI Spiritual Companion",
      description: "24/7 pastoral care with personalized spiritual guidance and prayer support"
    },
    {
      title: "Complete Member Management",
      description: "Track spiritual growth, manage families, and build stronger community connections"
    },
    {
      title: "Financial Stewardship Suite",
      description: "Online giving, budget planning, campaign management, and comprehensive reporting"
    },
    {
      title: "Communication Hub",
      description: "Email marketing, SMS campaigns, and social media management in one place"
    },
    {
      title: "Event & Volunteer Management",
      description: "Seamless event planning with automated volunteer coordination and scheduling"
    },
    {
      title: "Children's Ministry Tools",
      description: "Check-in systems, curriculum management, and parent communication tools"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-lighthouse-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your Church 
              <span className="block text-yellow-300">With AI-Powered Ministry</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              The complete ministry platform designed specifically for churches. 
              Manage members, finances, events, and spiritual growth all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/demo">
                <Button size="lg" variant="premium" className="px-8 py-4 text-lg">
                  Start Free 30-Day Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="premium" className="px-8 py-4 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Watch Church Demo
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm opacity-80">
              <span>✓ No Setup Fees</span>
              <span>✓ Cancel Anytime</span>
              <span>✓ Free Migration</span>
              <span>✓ 24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Everything Your Church Needs
            </h2>
            <p className="text-xl text-blue-600 max-w-3xl mx-auto">
              Replace multiple systems with one comprehensive platform designed for ministry excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card rounded-xl p-6 shadow-soft border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Choose Your Ministry Plan
            </h2>
            <p className="text-xl text-muted-foreground">
              Affordable pricing designed to grow with your church
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`bg-card rounded-xl p-8 shadow-soft border ${
                  plan.popular ? 'border-primary shadow-medium scale-105' : 'border-border'
                } relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="mb-3">
                    <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.popular ? "hero" : "outline"} 
                  className="w-full"
                  size="lg"
                >
                  Start Free Trial
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Final CTA */}
      <section className="py-20 bg-lighthouse-gradient text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Ministry?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Be among the first churches to experience the future of ministry management technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" variant="premium" className="px-8 py-4 text-lg">
                Start Free 30-Day Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="premium" className="px-8 py-4 text-lg">
                Schedule Demo Call
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChurchSales;