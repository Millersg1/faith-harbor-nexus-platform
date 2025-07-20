import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthenticatedNavigation from "./AuthenticatedNavigation";
import LanguageSwitcher from "./LanguageSwitcher";
import faithHarborLogo from "@/assets/faith-harbor-logo.png";

const Navigation = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Show authenticated navigation if user is logged in
  if (user) {
    return <AuthenticatedNavigation />;
  }

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const solutions = [
    { title: "Church Management", href: "/solutions/church", desc: "Complete church administration" },
    { title: "Business Management", href: "/solutions/business", desc: "Faith-based business tools" },
    { title: "AI Spiritual Companion", href: "/ai-companion", desc: "24/7 spiritual guidance" },
    { title: "Financial Management", href: "/financial-management", desc: "Stewardship & budgeting" },
  ];

  const features = [
    { title: "Website & Funnel Builder", href: "/website-funnel-builder", desc: "Create stunning websites and funnels" },
    { title: "Mobile App Builder", href: "/mobile-app-builder", desc: "Build native mobile apps" },
    { title: "Live Streaming", href: "/live-streaming", desc: "Multi-platform broadcasting" },
    { title: "Coaching Platform", href: "/coaching-platform", desc: "Professional coaching tools" },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={faithHarborLogo} alt="Faith Harbor" className="h-8 w-8" />
            <span className="text-xl font-bold bg-lighthouse-gradient bg-clip-text text-transparent">
              Faith Harbor™
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Solutions Dropdown */}
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle('solutions')}
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
              >
                <span>Solutions</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === 'solutions' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-large border border-border z-50">
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-3">
                      {solutions.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="block p-3 rounded-lg hover:bg-muted transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="font-medium text-foreground">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.desc}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle('features')}
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
              >
                <span>Features</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === 'features' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-large border border-border z-50">
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-3">
                      {features.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="block p-3 rounded-lg hover:bg-muted transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="font-medium text-foreground">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.desc}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/blog" className="text-foreground hover:text-primary transition-colors">
              Blog
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSwitcher />
            <Link to="/auth">
              <Button variant="ghost">{t('nav.login')}</Button>
            </Link>
            <Link to="/auth">
              <Button variant="cta">{t('nav.signup')}</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-border">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link
              to="/solutions/church"
              className="block px-3 py-2 text-foreground hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Church Solutions
            </Link>
            <Link
              to="/solutions/business"
              className="block px-3 py-2 text-foreground hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Business Solutions
            </Link>
            <Link
              to="/pricing"
              className="block px-3 py-2 text-foreground hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/blog"
              className="block px-3 py-2 text-foreground hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <div className="pt-4 space-y-2">
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button variant="cta" className="w-full">
                  Join Early Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;