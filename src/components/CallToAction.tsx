import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h2 className="heading-xl text-white mb-6" style={{
            textShadow: '2px 2px 8px rgba(0,0,0,0.7)'
          }}>
            Help Us Build the Future of Ministry
            <span className="block" style={{color: "hsl(var(--gold))"}}>
              Join Our Early Access Program
            </span>
          </h2>

          {/* Subheadline */}
          <p className="body-xl text-white/90 mb-8 max-w-3xl mx-auto" style={{
            textShadow: '1px 1px 4px rgba(0,0,0,0.6)'
          }}>
            Be part of creating the most comprehensive ministry management platform. Your feedback will help shape every feature.
          </p>

          {/* Features Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="flex items-center justify-center space-x-3 text-white">
              <Clock className="h-6 w-6 text-yellow-300" />
              <span className="font-semibold">In active development</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-white">
              <Users className="h-6 w-6 text-yellow-300" />
              <span className="font-semibold">Community-driven</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-white">
              <Shield className="h-6 w-6 text-yellow-300" />
              <span className="font-semibold">Security-first design</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/demo">
              <Button size="lg" variant="premium" className="px-10 py-4 text-lg">
                Join Early Access Program
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/demo-video">
              <Button size="lg" variant="premium" className="px-10 py-4 text-lg">
                Watch Development Preview
              </Button>
            </Link>
          </div>

          {/* Trust Statement */}
          <p className="text-white/80 text-sm" style={{
            textShadow: '1px 1px 3px rgba(0,0,0,0.6)'
          }}>
            No cost to join • Early access benefits • Help shape the platform
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default CallToAction;