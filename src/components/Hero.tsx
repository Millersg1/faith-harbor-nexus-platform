import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Star, Users, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import lighthouseHarbor from "@/assets/lighthouse-harbor-cross.jpg";

const Hero = () => {
  const stats = [
    { icon: Users, value: "New", label: "Innovative Platform" },
    { icon: Star, value: "Built", label: "For Ministry" },
    { icon: Shield, value: "SOC 2", label: "Security Standard" },
    { icon: Zap, value: "AI", label: "Powered Features" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${lighthouseHarbor})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/30 text-white mb-8 animate-fade-in shadow-glow" style={{
            textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
            boxShadow: '0 0 20px hsl(var(--gold) / 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}>
            <Zap className="h-4 w-4 mr-2 text-yellow-300 drop-shadow-sm" />
            <span className="text-sm font-semibold">Introducing AI-Powered Ministry Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight text-white" style={{
            textShadow: '2px 2px 8px rgba(0,0,0,0.7), 0 0 20px hsl(var(--gold) / 0.6)',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
          }}>
            <span className="block sm:inline">Be the Light in Your</span>
            <span className="block font-extrabold" style={{
              color: 'hsl(var(--gold))',
              textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 30px hsl(var(--gold) / 0.8)',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))'
            }}>
              Community
            </span>
            <span className="block sm:inline">with Faith Harbor</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-white mb-6 sm:mb-8 max-w-3xl mx-auto animate-fade-in leading-relaxed font-semibold px-4 sm:px-0" style={{
            textShadow: '1px 1px 4px rgba(0,0,0,0.7), 0 0 15px rgba(0,0,0,0.5)',
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))'
          }}>
            The complete ministry platform designed to guide churches and Christian businesses 
            toward deeper faith, stronger communities, and meaningful impact in God's kingdom.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 animate-scale-in px-4 sm:px-0">
            <Link to="/auth">
              <Button size="lg" variant="hero" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                Join Early Access Program
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link to="/demo-video">
              <Button size="lg" variant="premium" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Watch Preview
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="text-white mb-12 animate-fade-in" style={{
            textShadow: '1px 1px 3px rgba(0,0,0,0.6)'
          }}>
            <p className="text-sm mb-4 font-medium">Being built specifically for churches and Christian businesses</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-90">
              <span className="text-sm font-medium">✓ Early Access Program</span>
              <span className="text-sm font-medium">✓ Community Input</span>
              <span className="text-sm font-medium">✓ Development Updates</span>
              <span className="text-sm font-medium">✓ Security-First Design</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto animate-fade-in px-4 sm:px-0">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300" />
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white px-1">
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