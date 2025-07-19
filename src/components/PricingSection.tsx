import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  const plans = [
    {
      name: "Essential",
      price: 49,
      description: "Perfect for small churches and ministries",
      features: [
        "Up to 100 members",
        "Basic member management",
        "Event planning tools",
        "Email communication",
        "Online giving platform",
        "Mobile app access",
        "Basic reporting",
        "Email support"
      ],
      popular: false,
      cta: "Join Early Access"
    },
    {
      name: "Professional",
      price: 99,
      description: "Ideal for growing churches and organizations",
      features: [
        "Up to 500 members",
        "Advanced member management",
        "Complete event management",
        "Email & SMS campaigns",
        "Advanced giving features",
        "Volunteer management",
        "Financial reporting",
        "AI spiritual companion",
        "Live streaming tools",
        "Priority support"
      ],
      popular: true,
      cta: "Join Early Access"
    },
    {
      name: "Enterprise",
      price: 199,
      description: "For large churches and multi-site ministries",
      features: [
        "Unlimited members",
        "Multi-site management",
        "Advanced analytics & AI",
        "Custom branding",
        "API access",
        "Advanced security features",
        "Dedicated account manager",
        "Custom integrations",
        "Phone & priority support",
        "Custom training sessions"
      ],
      popular: false,
      cta: "Contact Us"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-6" style={{color: "hsl(var(--gold))"}}>
            Planned Pricing Structure
            <span className="block text-primary">Designed for Every Ministry Size</span>
          </h2>
          <p className="body-lg text-muted-foreground max-w-3xl mx-auto">
            Our anticipated pricing when the platform launches. Join early access for special founding member rates.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`pricing-card ${plan.popular ? 'featured' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2" style={{color: "hsl(var(--gold))"}}>{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-primary">${plan.price}</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link to="/auth" className="block">
                <Button 
                  variant={plan.popular ? "hero" : "outline"} 
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <div className="bg-muted/30 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-bold" style={{color: "hsl(var(--gold))"}}>All Plans Include</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div>✓ Early access program</div>
              <div>✓ Founding member rates</div>
              <div>✓ Security-first design</div>
              <div>✓ Regular development updates</div>
              <div>✓ Community input</div>
              <div>✓ Feature voting</div>
              <div>✓ Direct developer access</div>
              <div>✓ Special launch pricing</div>
            </div>
          </div>

          <p className="text-muted-foreground">
            Want to help shape the platform? <Link to="/demo" className="text-primary hover:underline">Join our development community</Link> for exclusive access.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;