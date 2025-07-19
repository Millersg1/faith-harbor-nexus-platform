import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeatureShowcase from "@/components/FeatureShowcase";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import CallToAction from "@/components/CallToAction";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <FeatureShowcase />
      <TestimonialsSection />
      <PricingSection />
      <CallToAction />
    </div>
  );
};

export default Index;
