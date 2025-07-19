import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import faithHarborLogo from "@/assets/faith-harbor-logo.png";
import NotificationCenter from "@/components/NotificationCenter";

const AuthenticatedNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-primary/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <img src={faithHarborLogo} alt="Faith Harbor" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">
              Faith Harbor™
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/dashboard" className="text-white hover:text-primary-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/members" className="text-white hover:text-primary-foreground transition-colors">
              Members
            </Link>
            <Link to="/events" className="text-white hover:text-primary-foreground transition-colors">
              Events
            </Link>
            <Link to="/announcements" className="text-white hover:text-primary-foreground transition-colors">
              Announcements
            </Link>
            <Link to="/sermons" className="text-white hover:text-primary-foreground transition-colors">
              Sermons
            </Link>
            <Link to="/email-marketing" className="text-white hover:text-primary-foreground transition-colors">
              Email Marketing
            </Link>
            <Link to="/analytics" className="text-white hover:text-primary-foreground transition-colors">
              Analytics
            </Link>
            <Link to="/donate" className="text-white hover:text-primary-foreground transition-colors">
              Donate
            </Link>
          </div>

          {/* User Actions */}
          {user && (
            <div className="flex items-center gap-4">
              <NotificationCenter />
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-white hover:bg-white/10"
              >
                Sign Out
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-primary-foreground transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-primary border-t border-border">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link
              to="/dashboard"
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/members"
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Members
            </Link>
            <Link
              to="/events"
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/announcements"
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Announcements
            </Link>
            <Link
              to="/sermons"
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Sermons
            </Link>
            <Link
              to="/email-marketing"
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Email Marketing
            </Link>
            <Link
              to="/analytics"
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Analytics
            </Link>
            <Link
              to="/donate"
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Donate
            </Link>
            <div className="pt-4">
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full text-white hover:bg-white/10"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AuthenticatedNavigation;