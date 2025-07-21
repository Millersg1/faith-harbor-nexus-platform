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
