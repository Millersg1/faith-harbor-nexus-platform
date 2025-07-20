import Navigation from "@/components/Navigation";
import { PWAFeatures } from "@/components/PWAFeatures";

const PWAFeaturesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PWAFeatures />
    </div>
  );
};

export default PWAFeaturesPage;