import { DonationForm } from "@/components/DonationForm";
import Navigation from "@/components/Navigation";

const Donate = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <DonationForm />
    </div>
  );
};

export default Donate;