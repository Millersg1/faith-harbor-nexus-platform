import { Button } from "@/components/ui/button";
import { Check, Star, TrendingUp, Shield, Zap, ArrowRight, Play, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import lighthouseHarbor from "@/assets/lighthouse-harbor-cross.jpg";

const BusinessSales = () => {
  const pricingPlans = [
    {
      name: "Startup",
      price: 97,
      description: "Perfect for small Christian businesses (1-10 employees)",
      features: [
        "CRM & Lead Management",
        "Project Management Tools",
        "Basic Financial Tracking",
        "Team Communication",
        "Client Portal Access",
        "Mobile App Access", 
        "Email Support"
      ],
      popular: false
    },
    {
      name: "Growth",
      price: 197,
      description: "Ideal for growing businesses (10-50 employees)",
      features: [
        "Everything in Startup",
        "AI Business Coaching",
        "Advanced Analytics",
        "Marketing Automation",
        "Inventory Management",
        "Custom Branding",
        "Priority Support",
        "Integration Suite"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: 397,
      description: "For large Christian enterprises (50+ employees)",
      features: [
        "Everything in Growth",
        "Multi-Location Management",
        "Advanced Security",
        "Custom Integrations",
        "White-Label Options",
        "Dedicated Account Manager",
        "Phone Support",
        "Custom Development"
      ],
      popular: false
    }
  ];

  const businessFeatures = [
    {
      title: "AI Business Coaching",
      description: "24/7 business guidance with faith-based principles and strategic insights",
      icon: "🤖"
    },
    {
      title: "Complete CRM System",
      description: "Manage leads, customers, and relationships with built-in spiritual principles",
      icon: "👥"
    },
    {
      title: "Financial Management",
      description: "Invoicing, expense tracking, profit analysis, and stewardship reporting",
      icon: "💰"
    },
    {
      title: "Project Management",
      description: "Task management, team collaboration, and timeline tracking for all projects",
      icon: "📋"
    },
    {
      title: "Marketing Automation",
      description: "Email campaigns, lead nurturing, and customer journey optimization",
      icon: "📧"
    },
    {
      title: "Performance Analytics",
      description: "KPI tracking, business intelligence, and predictive insights",
      icon: "📊"
    }
  ];


  const integrations = [
    "QuickBooks", "Xero", "Stripe", "PayPal", "Salesforce", "HubSpot",
    "Mailchimp", "Zoom", "Slack", "Microsoft 365", "Google Workspace", "TurboTax"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative text-white py-20 min-h-[80vh] flex items-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${lighthouseHarbor})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-ministry-gradient"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{
              textShadow: '2px 2px 8px rgba(0,0,0,0.7)'
            }}>
              Navigate Your Business to
              <span className="block text-yellow-300" style={{
                textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
              }}>Greater Purpose</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto" style={{
              textShadow: '1px 1px 4px rgba(0,0,0,0.6)'
            }}>
              Chart a course toward Kingdom impact with Faith Harbor's comprehensive business platform. 
              Manage operations, finances, and growth while honoring God in every decision.
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
                Watch Business Demo
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
              <div>
                <div className="text-2xl font-bold">New</div>
                <div className="text-sm opacity-80">Platform</div>
              </div>
              <div>
                <div className="text-2xl font-bold">AI</div>
                <div className="text-sm opacity-80">Powered Technology</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Complete</div>
                <div className="text-sm opacity-80">Business Solution</div>
              </div>
              <div>
                <div className="text-2xl font-bold">SOC 2</div>
                <div className="text-sm opacity-80">Security Ready</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-yellow-600 mb-6">
              Everything Your Business Needs to Thrive
            </h2>
            <p className="text-xl text-blue-600 max-w-3xl mx-auto">
              Comprehensive business management tools built on Christian principles to help you serve your customers and grow your impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessFeatures.map((feature, index) => (
              <div key={index} className="bg-card rounded-xl p-6 shadow-soft border border-border hover:shadow-medium transition-all duration-300">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-yellow-600 mb-3">
                  {feature.title}
                </h3>
                <p className="text-blue-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Integrations */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-yellow-600 mb-8">
              Seamlessly Integrates With Your Favorite Tools
            </h3>
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
              {integrations.map((integration, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-muted rounded-lg text-sm font-medium text-blue-600"
                >
                  {integration}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-yellow-600 mb-6">
              Invest in Your Business Growth
            </h2>
            <p className="text-xl text-blue-600">
              Affordable pricing that scales with your business success
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
                  <h3 className="text-2xl font-bold text-yellow-600 mb-2">{plan.name}</h3>
                  <div className="mb-3">
                    <span className="text-4xl font-bold text-blue-600">${plan.price}</span>
                    <span className="text-blue-600">/month</span>
                  </div>
                  <p className="text-blue-600">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                      <span className="text-blue-600">{feature}</span>
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
      <section className="py-20 bg-ministry-gradient text-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Ready to Scale Your Christian Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Be among the first Christian entrepreneurs to experience the future of business ministry technology.
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
                Schedule Business Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessSales;