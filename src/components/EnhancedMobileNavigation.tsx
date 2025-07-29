import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Calendar,
  Users,
  Heart,
  Settings,
  MessageSquare,
  DollarSign,
  FileText,
  Video,
  Phone,
  Bell,
  Search,
  Menu,
  ChevronRight,
  User,
  LogOut,
} from "lucide-react";
import faithHarborLogo from "@/assets/faith-harbor-platform-logo.png";

interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: number;
  description: string;
}

const EnhancedMobileNavigation = () => {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<NavItem[]>([]);

  const navigationItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      description: "Your personal dashboard and overview"
    },
    {
      title: "Prayer Wall",
      href: "/prayer-requests", 
      icon: Heart,
      badge: 3,
      description: "View and submit prayer requests"
    },
    {
      title: "Events",
      href: "/events",
      icon: Calendar,
      badge: 2,
      description: "Upcoming church events and activities"
    },
    {
      title: "Members",
      href: "/members",
      icon: Users,
      description: "Connect with church members"
    },
    {
      title: "Messages",
      href: "/messages",
      icon: MessageSquare,
      badge: 5,
      description: "Church announcements and messages"
    },
    {
      title: "Donations",
      href: "/donate",
      icon: DollarSign,
      description: "Support our ministry through giving"
    },
    {
      title: "Documents",
      href: "/documents",
      icon: FileText,
      description: "Church documents and resources"
    },
    {
      title: "Live Stream",
      href: "/live-streaming",
      icon: Video,
      description: "Watch live services and recordings"
    },
    {
      title: "Contact",
      href: "/contact",
      icon: Phone,
      description: "Get in touch with church leadership"
    },
  ];

  const quickActions = [
    { title: "Submit Prayer", href: "/prayer-requests", icon: Heart },
    { title: "Give Now", href: "/donate", icon: DollarSign },
    { title: "Join Event", href: "/events", icon: Calendar },
    { title: "Contact Pastor", href: "/messages", icon: MessageSquare },
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = navigationItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(navigationItems);
    }
  }, [searchQuery]);

  const AppSidebar = () => {
    const { state } = useSidebar();
    const collapsed = state === "collapsed";

    return (
      <Sidebar className={`${collapsed ? "w-16" : "w-80"} transition-all duration-300`} collapsible="icon">
        <SidebarContent className="bg-gradient-to-b from-primary/5 to-background">
          {/* Header */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <img src={faithHarborLogo} alt="Faith Harbor" className="h-8 w-8" />
              {!collapsed && (
                <div>
                  <h2 className="text-lg font-bold text-foreground">Faith Harbor</h2>
                  <p className="text-xs text-muted-foreground">Church Community</p>
                </div>
              )}
            </div>
          </div>

          {/* User Profile */}
          {user && (
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.user_metadata?.display_name || user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">Member</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search */}
          {!collapsed && (
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search navigation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {!collapsed && (
            <SidebarGroup>
              <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="grid grid-cols-2 gap-2 p-2">
                  {quickActions.map((action) => (
                    <Link key={action.href} to={action.href}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full h-auto flex-col p-3 space-y-1"
                      >
                        <action.icon className="h-4 w-4" />
                        <span className="text-xs">{action.title}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.href} 
                        className="flex items-center justify-between w-full p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="h-5 w-5 text-primary" />
                          {!collapsed && (
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {item.description}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          {!collapsed && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Settings & Sign Out */}
          <div className="mt-auto p-4 border-t border-border/50 space-y-2">
            <Link to="/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-3" />
                {!collapsed && "Settings"}
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-3" />
              {!collapsed && "Sign Out"}
            </Button>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  };

  // Only show on mobile and when user is authenticated
  if (!isMobile || !user) return null;

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger>
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            
            <div className="flex items-center space-x-2">
              <img src={faithHarborLogo} alt="Faith Harbor" className="h-6 w-6" />
              <span className="text-lg font-bold text-foreground">Faith Harbor</span>
            </div>

            <Link to="/notifications">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                  3
                </Badge>
              </Button>
            </Link>
          </div>
        </div>

        <AppSidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 pt-16 overflow-auto">
          {/* This is where the main content would go */}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EnhancedMobileNavigation;