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
            Ready to Transform Your Ministry?
            <span className="block" style={{color: "hsl(var(--gold))"}}>
              Start Your Free Trial Today
            </span>
          </h2>

          {/* Subheadline */}
          <p className="body-xl text-white/90 mb-8 max-w-3xl mx-auto" style={{
            textShadow: '1px 1px 4px rgba(0,0,0,0.6)'
          }}>
            Join thousands of ministry leaders who are already using Faith Harbor to grow their churches and impact their communities.
          </p>

          {/* Features Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="flex items-center justify-center space-x-3 text-white">
              <Clock className="h-6 w-6 text-yellow-300" />
              <span className="font-semibold">Setup in 30 minutes</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-white">
              <Users className="h-6 w-6 text-yellow-300" />
              <span className="font-semibold">Trusted by 500+ churches</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-white">
              <Shield className="h-6 w-6 text-yellow-300" />
              <span className="font-semibold">SOC 2 compliant</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/demo">
              <Button size="lg" variant="premium" className="px-10 py-4 text-lg">
                Start Free 30-Day Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/demo-video">
              <Button size="lg" variant="premium" className="px-10 py-4 text-lg">
                Watch 2-Minute Demo
              </Button>
            </Link>
          </div>

          {/* Trust Statement */}
          <p className="text-white/80 text-sm" style={{
            textShadow: '1px 1px 3px rgba(0,0,0,0.6)'
          }}>
            No credit card required • Cancel anytime • Full support included
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default CallToAction;