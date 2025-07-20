import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ChurchSales from "./pages/ChurchSales";
import BusinessSales from "./pages/BusinessSales";
import Demo from "./pages/Demo";
import DemoVideo from "./pages/DemoVideo";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import Donate from "./pages/Donate";
import Members from "./pages/Members";
import Events from "./pages/Events";
import Announcements from "./pages/Announcements";
import DonationSuccess from "./pages/DonationSuccess";
import Analytics from "./pages/Analytics";
import EmailMarketing from "./pages/EmailMarketing";
import Sermons from "./pages/Sermons";
import PrayerRequests from "./pages/PrayerRequests";
import SmallGroups from "./pages/SmallGroups";
import Volunteers from "./pages/Volunteers";
import Documents from "./pages/Documents";
import Messages from "./pages/Messages";
import FinancialManagement from "./pages/FinancialManagement";
import ServicePlanning from "./pages/ServicePlanning";
import RoomBooking from "./pages/RoomBooking";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import AdminDashboard from "./pages/AdminDashboard";
import Blog from "./pages/Blog";
import AICompanion from "./pages/AICompanion";
import FinancialCoaching from "./pages/FinancialCoaching";
import WebinarStudio from "./pages/WebinarStudio";
import PodcastStudio from "./pages/PodcastStudio";
import MobileAppBuilder from "./pages/MobileAppBuilder";
import CoachingPlatform from "./pages/CoachingPlatform";
import LiveStreaming from "./pages/LiveStreaming";
import WebsiteFunnelBuilder from "./pages/WebsiteFunnelBuilder";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import IntelligentChatbot from "./components/IntelligentChatbot";
import ActivityTrackerWrapper from "./components/ActivityTrackerWrapper";
import AdminActivityMonitorPage from "./pages/AdminActivityMonitor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ActivityTrackerWrapper>
            <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sales-churches" element={<ChurchSales />} />
                <Route path="/sales-business" element={<BusinessSales />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/demo-video" element={<DemoVideo />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/members" element={<Members />} />
                <Route path="/events" element={<Events />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/donation-success" element={<DonationSuccess />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/email-marketing" element={<EmailMarketing />} />
                <Route path="/sermons" element={<Sermons />} />
                <Route path="/prayer-requests" element={<PrayerRequests />} />
                <Route path="/small-groups" element={<SmallGroups />} />
                <Route path="/volunteers" element={<Volunteers />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/financial-management" element={<FinancialManagement />} />
                <Route path="/service-planning" element={<ServicePlanning />} />
                <Route path="/room-booking" element={<RoomBooking />} />
                <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/activity" element={<AdminActivityMonitorPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<Blog />} />
                <Route path="/ai-companion" element={<AICompanion />} />
                <Route path="/financial-coaching" element={<FinancialCoaching />} />
                <Route path="/webinar-studio" element={<WebinarStudio />} />
                <Route path="/podcast-studio" element={<PodcastStudio />} />
                <Route path="/mobile-app-builder" element={<MobileAppBuilder />} />
                <Route path="/coaching-platform" element={<CoachingPlatform />} />
                <Route path="/live-streaming" element={<LiveStreaming />} />
                <Route path="/website-funnel-builder" element={<WebsiteFunnelBuilder />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
            <CookieConsent />
            <IntelligentChatbot position="bottom-right" />
            </div>
          </ActivityTrackerWrapper>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
