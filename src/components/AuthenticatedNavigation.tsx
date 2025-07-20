import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  ChevronDown,
  Settings,
  User,
  LogOut,
  Shield,
  Home,
  BarChart3,
  Users,
  Calendar,
  MessageSquare,
  DollarSign,
  FileText,
  Bot,
  BookOpen,
  Heart,
  Store,
  Search
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import LanguageSwitcher from "./LanguageSwitcher";
import faithHarborLogo from "@/assets/faith-harbor-logo.png";

const AuthenticatedNavigation = () => {
  const { user, signOut, isAdmin, userRoles } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "Thank you for using Faith Harbor. See you soon!"
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const mainFeatures = [
    { title: "Member Portal", href: "/member-portal", icon: User, desc: "Personal dashboard" },
    { title: "Dashboard", href: "/dashboards", icon: Home, desc: "Dashboard hub" },
    { title: "Analytics", href: "/analytics", icon: BarChart3, desc: "Insights & reports" },
    { title: "Members", href: "/members", icon: Users, desc: "Member management" },
    { title: "Events", href: "/events", icon: Calendar, desc: "Event planning" },
    { title: "Messages", href: "/messages", icon: MessageSquare, desc: "Communication" },
    { title: "Donations", href: "/donate", icon: DollarSign, desc: "Giving platform" },
  ];

  const advancedFeatures = [
    { title: "AI Companion", href: "/ai-companion", icon: Bot, desc: "Spiritual guidance" },
    { title: "Memory Books", href: "/memory-books", icon: BookOpen, desc: "Printable memory books" },
    { title: "Grief Support", href: "/grief-support", icon: Heart, desc: "Bereavement care" },
    { title: "Marketplace", href: "/marketplace", icon: Store, desc: "Member services" },
    { title: "SEO Management", href: "/seo-management", icon: Search, desc: "Search optimization" },
    { title: "Sermons", href: "/sermons", icon: FileText, desc: "Sermon management" },
    { title: "Small Groups", href: "/small-groups", icon: Users, desc: "Group coordination" },
    { title: "Volunteers", href: "/volunteers", icon: Users, desc: "Volunteer management" },
    { title: "Financial Management", href: "/financial-management", icon: DollarSign, desc: "Budget & finance" },
    { title: "Documents", href: "/documents", icon: FileText, desc: "Document library" },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <img src={faithHarborLogo} alt="Faith Harbor" className="h-8 w-8" />
            <span className="text-xl font-bold bg-lighthouse-gradient bg-clip-text text-transparent">
              Faith Harbor™
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Core Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle('features')}
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
              >
                <span>Features</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === 'features' && (
                <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-large border border-border z-50">
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {mainFeatures.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <IconComponent className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium text-foreground text-sm">{item.title}</div>
                              <div className="text-xs text-muted-foreground">{item.desc}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle('advanced')}
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
              >
                <span>Tools</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === 'advanced' && (
                <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-large border border-border z-50">
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {advancedFeatures.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <IconComponent className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium text-foreground text-sm">{item.title}</div>
                              <div className="text-xs text-muted-foreground">{item.desc}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {isAdmin && (
              <Link 
                to="/admin" 
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSwitcher />
            {isAdmin && (
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
            
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle('profile')}
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="text-sm">
                  {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === 'profile' && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-large border border-border z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground">
                        {user?.user_metadata?.first_name && user?.user_metadata?.last_name 
                          ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                          : user?.email}
                      </p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    
                    <Link
                      to="/member-portal"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <User className="h-4 w-4" />
                      <span>Member Portal</span>
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    
                     <button
                       onClick={() => {
                         setActiveDropdown(null);
                         handleSignOut();
                       }}
                       className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                     >
                       <LogOut className="h-4 w-4" />
                       <span>{t('nav.logout')}</span>
                     </button>
                  </div>
                </div>
              )}
            </div>
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
            {/* User Info */}
            <div className="px-3 py-2 border-b border-border mb-2">
              <p className="text-sm font-medium text-foreground">
                {user?.user_metadata?.first_name && user?.user_metadata?.last_name 
                  ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                  : user?.email}
              </p>
              {isAdmin && (
                <Badge variant="secondary" className="text-xs mt-1">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>

            {/* Main Features */}
            {mainFeatures.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}

            {/* Advanced Features */}
            <div className="pt-2 border-t border-border">
              <p className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase">
                Advanced Tools
              </p>
              {advancedFeatures.slice(0, 4).map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>

            {/* Admin and Settings */}
            <div className="pt-2 border-t border-border space-y-1">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
              )}
              
              <Link
                to="/settings"
                className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleSignOut();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-md"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AuthenticatedNavigation;