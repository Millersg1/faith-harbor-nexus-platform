import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Star, Users, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  const stats = [
    { icon: Users, value: "10,000+", label: "Churches & Businesses" },
    { icon: Star, value: "4.9/5", label: "Customer Rating" },
    { icon: Shield, value: "99.9%", label: "Uptime Guarantee" },
    { icon: Zap, value: "600+", label: "Built-in Features" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-blue-600 mb-8 animate-fade-in">
            <Zap className="h-4 w-4 mr-2 text-yellow-300" />
            <span className="text-sm font-medium">Introducing AI-Powered Ministry Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-blue-600 mb-6 animate-fade-in leading-tight">
            The Complete
            <span className="block bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
              Ministry Platform
            </span>
            for Modern Churches
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-blue-600 mb-8 max-w-3xl mx-auto animate-fade-in leading-relaxed">
            600+ powerful features, AI-powered tools, and complete management solutions 
            to grow your ministry and streamline operations in one platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-scale-in">
            <Link to="/demo">
              <Button size="lg" variant="hero" className="px-8 py-4 text-lg">
                Start Free 30-Day Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/demo-video">
              <Button size="lg" variant="premium" className="px-8 py-4 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo (2 min)
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="text-blue-600 mb-12 animate-fade-in">
            <p className="text-sm mb-4">Trusted by 10,000+ churches and Christian businesses worldwide</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-75">
              <span className="text-sm">✓ No Setup Fees</span>
              <span className="text-sm">✓ Cancel Anytime</span>
              <span className="text-sm">✓ 24/7 Support</span>
              <span className="text-sm">✓ SOC 2 Compliant</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon className="h-8 w-8 text-yellow-300" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-blue-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;