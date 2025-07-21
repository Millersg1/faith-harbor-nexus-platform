import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeatureShowcase from "@/components/FeatureShowcase";
import { VideoSection } from "@/components/VideoSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import CallToAction from "@/components/CallToAction";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Temporary Navigation Helper */}
      <div className="bg-primary/10 border-b border-primary/20 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">Quick Navigation Test:</p>
          <Link to="/memory-books">
            <Button variant="outline" className="mr-2">
              <BookOpen className="h-4 w-4 mr-2" />
              Go to Memory Books
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
      
      <Hero />
      <FeatureShowcase />
      <VideoSection 
        title="See Faith Harbor™ in Action"
        subtitle="Watch & Learn"
        description="Discover how Faith Harbor™ can transform your ministry with our comprehensive video guides"
        showGrid={false}
      />
      <TestimonialsSection />
      <PricingSection />
      <CallToAction />
    </div>
  );
};

export default Index;
