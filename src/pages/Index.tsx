import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeatureShowcase from "@/components/FeatureShowcase";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <FeatureShowcase />
    </div>
  );
};

export default Index;
