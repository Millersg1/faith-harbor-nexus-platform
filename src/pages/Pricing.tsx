import Navigation from "@/components/Navigation";
import PricingSection from "@/components/PricingSection";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that's right for your ministry. All plans include our core features 
            with no hidden fees or setup costs.
          </p>
        </div>
        <PricingSection />
      </div>
    </div>
  );
};

export default Pricing;