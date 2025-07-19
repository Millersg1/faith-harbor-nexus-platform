import Navigation from "@/components/Navigation";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold mb-8" style={{color: "hsl(var(--gold))"}}>Terms of Service</h1>
        
        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using Faith Harbor's services, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily access Faith Harbor for personal, non-commercial transitory viewing only.
            </p>
            <p className="mb-4">Under this license you may not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Service Availability</h2>
            <p className="mb-4">
              Faith Harbor is currently in development. We strive to provide reliable service but cannot 
              guarantee uninterrupted availability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">User Accounts</h2>
            <p className="mb-4">
              You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Prohibited Uses</h2>
            <p className="mb-4">You may not use our service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall Faith Harbor or its suppliers be liable for any damages arising out of the use 
              or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at legal@faithharbor.com.
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;