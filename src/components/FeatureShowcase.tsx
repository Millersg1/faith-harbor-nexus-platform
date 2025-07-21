import { Button } from "@/components/ui/button";
import { 
  Bot, 
  DollarSign, 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart3,
  Shield,
  Smartphone,
  Video,
  Heart,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const FeatureShowcase = () => {
  const coreFeatures = [
    {
      icon: Bot,
      title: "AI Spiritual Companion",
      description: "24/7 pastoral care with voice cloning technology and personalized spiritual guidance",
      benefits: ["Instant prayer support", "Sermon assistance", "Counseling guidance"],
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: DollarSign,
      title: "Complete Financial Suite",
      description: "Advanced giving platform, budget tracking, and stewardship campaigns all in one",
      benefits: ["Online giving", "Budget planning", "Financial reporting"],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Member Management",
      description: "Comprehensive member profiles, family management, and spiritual growth tracking",
      benefits: ["Member database", "Family connections", "Growth tracking"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Calendar,
      title: "Event & Volunteer Management",
      description: "Seamless event planning, volunteer coordination, and automated scheduling",
      benefits: ["Event planning", "Volunteer matching", "Automated reminders"],
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description: "Email marketing, SMS campaigns, and social media management unified",
      benefits: ["Email campaigns", "SMS messaging", "Social media"],
      gradient: "from-pink-500 to-purple-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "AI-powered insights, growth tracking, and predictive analytics for ministry optimization",
      benefits: ["Growth insights", "Predictive analytics", "Custom reports"],
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  const additionalFeatures = [
    { icon: Video, title: "Live Streaming", desc: "Multi-platform broadcasting" },
    { icon: Smartphone, title: "Mobile App Builder", desc: "Custom church apps" },
    { icon: Shield, title: "Enterprise Security", desc: "SOC 2 compliance" },
    { icon: Heart, title: "Children's Ministry", desc: "Complete kids programs" },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gold">
            Everything Your Ministry Needs
            <span className="block text-primary">In One Platform</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4 sm:px-0">
            Replace 20+ separate tools with our comprehensive ministry management platform. 
            Built specifically for churches and Christian businesses.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 px-4 sm:px-0">
          {coreFeatures.map((feature, index) => {
            // Define navigation paths for each feature
            const getFeaturePath = (title: string) => {
              switch(title) {
                case "AI Spiritual Companion": return "/ai-companion";
                case "Complete Financial Suite": return "/financial-management";
                case "Member Management": return "/members";
                case "Event & Volunteer Management": return "/events";
                case "Communication Hub": return "/email-marketing";
                case "Advanced Analytics": return "/analytics";
                default: return "/dashboard";
              }
            };

            return (
              <Link 
                key={index}
                to={getFeaturePath(feature.title)}
                className="group bg-card rounded-xl p-4 sm:p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-border hover:border-primary/20 block"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.gradient} mb-4`}>
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold mb-3 group-hover:text-primary transition-colors text-gold">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </Link>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="bg-muted/30 rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 mx-4 sm:mx-0">
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-gold">
            Plus Many Additional Features
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-2 sm:p-3 rounded-lg bg-white shadow-soft mb-2 sm:mb-3">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1 text-sm sm:text-base text-gold">{feature.title}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-lighthouse-gradient rounded-2xl p-6 sm:p-8 text-white mx-4 sm:mx-0">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-gold">
            Ready to Transform Your Ministry?
          </h3>
          <p className="text-lg sm:text-xl mb-4 sm:mb-6 opacity-90">
            Be among the first to experience the future of ministry management
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/sales-churches">
              <Button size="lg" variant="premium" className="w-full sm:w-auto px-6 sm:px-8">
                Explore Church Solutions
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link to="/sales-business">
              <Button size="lg" variant="premium" className="w-full sm:w-auto px-6 sm:px-8">
                View Business Features
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;