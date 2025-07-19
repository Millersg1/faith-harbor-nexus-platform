import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Cookie, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always enabled
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else {
      setPreferences(JSON.parse(consent));
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    setPreferences(onlyEssential);
    localStorage.setItem('cookieConsent', JSON.stringify(onlyEssential));
    setShowBanner(false);
    setShowSettings(false);
  };

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl shadow-lg border-2">
        <CardContent className="p-6">
          {!showSettings ? (
            // Main consent banner
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Cookie className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    We Value Your Privacy
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. 
                    By clicking "Accept All", you consent to our use of cookies. You can customize your preferences or 
                    learn more in our{' '}
                    <Link to="/cookie-policy" className="text-primary hover:underline">
                      Cookie Policy
                    </Link>.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBanner(false)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button onClick={handleAcceptAll} className="flex-1">
                  Accept All Cookies
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSettings(true)}
                  className="flex-1"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Customize
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleRejectAll}
                  className="flex-1"
                >
                  Reject All
                </Button>
              </div>
            </div>
          ) : (
            // Cookie settings panel
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Cookie Preferences</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">Essential Cookies</h4>
                    <p className="text-sm text-muted-foreground">Required for the website to function</p>
                  </div>
                  <div className="text-sm text-primary font-medium">Always Active</div>
                </div>
                
                {[
                  {
                    key: 'analytics' as const,
                    title: 'Analytics Cookies',
                    description: 'Help us understand how you use our website'
                  },
                  {
                    key: 'preferences' as const,
                    title: 'Preference Cookies',
                    description: 'Remember your settings and preferences'
                  },
                  {
                    key: 'marketing' as const,
                    title: 'Marketing Cookies',
                    description: 'Used to deliver relevant advertisements'
                  }
                ].map(({ key, title, description }) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">{title}</h4>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    <Button
                      variant={preferences[key] ? "default" : "outline"}
                      size="sm"
                      onClick={() => togglePreference(key)}
                    >
                      {preferences[key] ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={handleAcceptSelected} className="flex-1">
                  Accept Selected
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleAcceptAll}
                  className="flex-1"
                >
                  Accept All
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;