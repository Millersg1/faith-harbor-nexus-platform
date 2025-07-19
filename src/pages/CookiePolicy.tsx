import Navigation from "@/components/Navigation";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold mb-8" style={{color: "hsl(var(--gold))"}}>Cookie Policy</h1>
        
        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">What Are Cookies</h2>
            <p className="mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
              They are widely used to make websites work more efficiently and provide information to site owners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">How We Use Cookies</h2>
            <p className="mb-4">Faith Harbor™ uses cookies for several purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
              <li><strong>Analytics cookies:</strong> Help us understand how you use our website</li>
              <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Types of Cookies We Use</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-600">Session Cookies</h3>
                <p>These are temporary cookies that remain in your browser until you leave our website.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-600">Persistent Cookies</h3>
                <p>These remain in your browser for a set period or until you delete them.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-600">First-party Cookies</h3>
                <p>Set by Faith Harbor™ directly.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-600">Third-party Cookies</h3>
                <p>Set by external services we use, such as analytics providers.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Managing Cookies</h2>
            <p className="mb-4">
              You can control and manage cookies in various ways:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use our cookie consent banner to manage your preferences</li>
              <li>Modify your browser settings to block or delete cookies</li>
              <li>Use browser plugins that manage cookies for you</li>
              <li>Opt out of analytics tracking through our settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Impact of Disabling Cookies</h2>
            <p className="mb-4">
              Please note that blocking or deleting cookies may impact your experience on our website. 
              Some features may not work properly without cookies enabled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at cookies@faithharbor.com.
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

export default CookiePolicy;