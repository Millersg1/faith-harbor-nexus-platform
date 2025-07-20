import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Globe, 
  Palette, 
  Download, 
  Eye, 
  Settings, 
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  Filter,
  Search,
  Monitor,
  Smartphone,
  Laptop,
  ArrowRight,
  Star,
  Crown,
  Rocket,
  Heart,
  Brain,
  DollarSign,
  Users,
  Calendar,
  Book,
  Briefcase,
  Home,
  Coffee,
  Car,
  Music,
  Camera,
  Scissors,
  Dumbbell,
  Leaf,
  Baby,
  Utensils,
  Plane,
  Gamepad2,
  GraduationCap,
  Stethoscope,
  Gavel,
  Wrench,
  PaintBucket,
  ShoppingBag,
  Building,
  Shirt
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'website' | 'funnel';
  niche: string;
  features: string[];
  preview: string;
  isPremium: boolean;
  conversionRate?: number;
  icon: React.ReactNode;
}

interface FunnelStep {
  id: string;
  name: string;
  type: string;
  conversionRate: number;
}

const WebsiteFunnelBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'website' | 'funnel'>('all');
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const templates: Template[] = [
    // Church & Religious Templates
    {
      id: '1',
      name: 'Faith Community Website',
      description: 'Complete church website with sermons, events, and online giving',
      category: 'website',
      niche: 'Religion',
      features: ['Sermon Library', 'Event Calendar', 'Online Giving', 'Prayer Requests', 'Live Streaming'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: '2',
      name: 'Ministry Donation Funnel',
      description: 'High-converting donation funnel for religious organizations',
      category: 'funnel',
      niche: 'Religion',
      features: ['Impact Stories', 'Multiple Giving Options', 'Thank You Pages', 'Email Follow-up'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 12.5,
      icon: <Heart className="h-5 w-5" />
    },

    // Business & Professional Templates
    {
      id: '3',
      name: 'Professional Services Website',
      description: 'Corporate website for consultants, lawyers, and service providers',
      category: 'website',
      niche: 'Business',
      features: ['Service Pages', 'Team Profiles', 'Case Studies', 'Contact Forms', 'Testimonials'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <Briefcase className="h-5 w-5" />
    },
    {
      id: '4',
      name: 'Lead Generation Funnel',
      description: 'B2B lead capture funnel with multi-step qualification',
      category: 'funnel',
      niche: 'Business',
      features: ['Lead Magnets', 'Progressive Profiling', 'CRM Integration', 'Nurture Sequences'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 18.3,
      icon: <Target className="h-5 w-5" />
    },

    // E-commerce Templates
    {
      id: '5',
      name: 'Online Store Website',
      description: 'Complete e-commerce solution with shopping cart and payments',
      category: 'website',
      niche: 'E-commerce',
      features: ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Management', 'Reviews'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      icon: <ShoppingBag className="h-5 w-5" />
    },
    {
      id: '6',
      name: 'Product Launch Funnel',
      description: 'High-converting product launch sequence with urgency elements',
      category: 'funnel',
      niche: 'E-commerce',
      features: ['Pre-launch Pages', 'Countdown Timers', 'Social Proof', 'Upsells', 'Thank You Pages'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 22.7,
      icon: <Rocket className="h-5 w-5" />
    },

    // Health & Wellness Templates
    {
      id: '7',
      name: 'Health Practice Website',
      description: 'Professional website for doctors, clinics, and wellness centers',
      category: 'website',
      niche: 'Health',
      features: ['Appointment Booking', 'Service Info', 'Doctor Profiles', 'Patient Portal', 'Health Blog'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <Stethoscope className="h-5 w-5" />
    },
    {
      id: '8',
      name: 'Wellness Course Funnel',
      description: 'Convert visitors into wellness program participants',
      category: 'funnel',
      niche: 'Health',
      features: ['Health Assessment', 'Video Testimonials', 'Program Benefits', 'Payment Plans'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 15.8,
      icon: <Leaf className="h-5 w-5" />
    },

    // Education Templates
    {
      id: '9',
      name: 'Educational Institution Website',
      description: 'Comprehensive website for schools, colleges, and training centers',
      category: 'website',
      niche: 'Education',
      features: ['Course Catalog', 'Faculty Profiles', 'Admissions Info', 'Student Portal', 'Events'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <GraduationCap className="h-5 w-5" />
    },
    {
      id: '10',
      name: 'Online Course Funnel',
      description: 'Educational course sales funnel with preview content',
      category: 'funnel',
      niche: 'Education',
      features: ['Course Preview', 'Instructor Bio', 'Student Success Stories', 'Early Bird Pricing'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 19.2,
      icon: <Book className="h-5 w-5" />
    },

    // Food & Restaurant Templates
    {
      id: '11',
      name: 'Restaurant Website',
      description: 'Full-featured restaurant website with online ordering',
      category: 'website',
      niche: 'Food',
      features: ['Menu Display', 'Online Ordering', 'Reservations', 'Location Info', 'Reviews'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <Utensils className="h-5 w-5" />
    },
    {
      id: '12',
      name: 'Food Delivery Funnel',
      description: 'Optimize food delivery orders with strategic upselling',
      category: 'funnel',
      niche: 'Food',
      features: ['Menu Optimization', 'Upsell Suggestions', 'Loyalty Programs', 'Quick Checkout'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 28.4,
      icon: <Coffee className="h-5 w-5" />
    },

    // Real Estate Templates
    {
      id: '13',
      name: 'Real Estate Agency Website',
      description: 'Professional real estate website with property listings',
      category: 'website',
      niche: 'Real Estate',
      features: ['Property Search', 'Agent Profiles', 'Market Reports', 'Mortgage Calculator', 'Virtual Tours'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <Home className="h-5 w-5" />
    },
    {
      id: '14',
      name: 'Property Lead Funnel',
      description: 'Generate qualified real estate leads with property interest forms',
      category: 'funnel',
      niche: 'Real Estate',
      features: ['Property Alerts', 'Market Analysis', 'Agent Contact', 'Home Valuation'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 16.7,
      icon: <Building className="h-5 w-5" />
    },

    // Fitness Templates
    {
      id: '15',
      name: 'Fitness Studio Website',
      description: 'Complete website for gyms, studios, and personal trainers',
      category: 'website',
      niche: 'Fitness',
      features: ['Class Schedules', 'Trainer Profiles', 'Membership Plans', 'Online Booking', 'Progress Tracking'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <Dumbbell className="h-5 w-5" />
    },
    {
      id: '16',
      name: 'Fitness Program Funnel',
      description: 'Convert visitors into fitness program members',
      category: 'funnel',
      niche: 'Fitness',
      features: ['Fitness Assessment', 'Transformation Stories', 'Free Trial Offers', 'Nutrition Guides'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 21.3,
      icon: <Dumbbell className="h-5 w-5" />
    },

    // Beauty & Salon Templates
    {
      id: '17',
      name: 'Beauty Salon Website',
      description: 'Elegant website for salons, spas, and beauty professionals',
      category: 'website',
      niche: 'Beauty',
      features: ['Service Menu', 'Online Booking', 'Gallery', 'Staff Profiles', 'Product Sales'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <Scissors className="h-5 w-5" />
    },
    {
      id: '18',
      name: 'Beauty Treatment Funnel',
      description: 'Book more beauty appointments with strategic pricing',
      category: 'funnel',
      niche: 'Beauty',
      features: ['Before/After Gallery', 'Package Deals', 'First-time Discounts', 'Add-on Services'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 24.6,
      icon: <PaintBucket className="h-5 w-5" />
    },

    // Automotive Templates
    {
      id: '19',
      name: 'Auto Dealership Website',
      description: 'Professional website for car dealers and auto services',
      category: 'website',
      niche: 'Automotive',
      features: ['Vehicle Inventory', 'Financing Calculator', 'Service Booking', 'Trade-in Values', 'Reviews'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <Car className="h-5 w-5" />
    },
    {
      id: '20',
      name: 'Auto Sales Funnel',
      description: 'Generate qualified leads for vehicle sales',
      category: 'funnel',
      niche: 'Automotive',
      features: ['Vehicle Finder', 'Financing Pre-approval', 'Trade Estimator', 'Test Drive Booking'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 14.2,
      icon: <Car className="h-5 w-5" />
    },

    // Music & Entertainment Templates
    {
      id: '21',
      name: 'Music Artist Website',
      description: 'Professional website for musicians, bands, and entertainers',
      category: 'website',
      niche: 'Music',
      features: ['Music Player', 'Tour Dates', 'Merchandise Store', 'Fan Club', 'Social Media Integration'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <Music className="h-5 w-5" />
    },
    {
      id: '22',
      name: 'Music Release Funnel',
      description: 'Promote new music releases and build fan base',
      category: 'funnel',
      niche: 'Music',
      features: ['Pre-order Pages', 'Exclusive Content', 'Fan Rewards', 'Social Sharing'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 17.9,
      icon: <Music className="h-5 w-5" />
    },

    // Photography Templates
    {
      id: '23',
      name: 'Photography Portfolio Website',
      description: 'Stunning portfolio website for photographers',
      category: 'website',
      niche: 'Photography',
      features: ['Photo Galleries', 'Booking System', 'Pricing Packages', 'Client Proofing', 'Blog'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <Camera className="h-5 w-5" />
    },
    {
      id: '24',
      name: 'Photography Booking Funnel',
      description: 'Book more photography sessions with attractive packages',
      category: 'funnel',
      niche: 'Photography',
      features: ['Portfolio Showcase', 'Package Comparisons', 'Limited Time Offers', 'Client Testimonials'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 20.1,
      icon: <Camera className="h-5 w-5" />
    },

    // Travel & Tourism Templates
    {
      id: '25',
      name: 'Travel Agency Website',
      description: 'Complete travel booking website with destination guides',
      category: 'website',
      niche: 'Travel',
      features: ['Destination Search', 'Booking System', 'Travel Guides', 'Reviews', 'Itinerary Builder'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <Plane className="h-5 w-5" />
    },
    {
      id: '26',
      name: 'Travel Package Funnel',
      description: 'Sell travel packages with compelling destination content',
      category: 'funnel',
      niche: 'Travel',
      features: ['Destination Videos', 'Package Benefits', 'Early Bird Specials', 'Travel Insurance'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 13.8,
      icon: <Plane className="h-5 w-5" />
    },

    // Gaming Templates
    {
      id: '27',
      name: 'Gaming Community Website',
      description: 'Interactive website for gaming communities and esports',
      category: 'website',
      niche: 'Gaming',
      features: ['Tournament Brackets', 'Player Profiles', 'Game Reviews', 'Forums', 'Live Streams'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <Gamepad2 className="h-5 w-5" />
    },
    {
      id: '28',
      name: 'Gaming Product Funnel',
      description: 'Sell gaming products and accessories to enthusiasts',
      category: 'funnel',
      niche: 'Gaming',
      features: ['Product Demos', 'Gamer Reviews', 'Bundle Offers', 'Gaming Guides'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 25.2,
      icon: <Gamepad2 className="h-5 w-5" />
    },

    // Legal Services Templates
    {
      id: '29',
      name: 'Law Firm Website',
      description: 'Professional website for law firms and legal services',
      category: 'website',
      niche: 'Legal',
      features: ['Practice Areas', 'Attorney Profiles', 'Case Results', 'Legal Resources', 'Consultation Booking'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <Gavel className="h-5 w-5" />
    },
    {
      id: '30',
      name: 'Legal Consultation Funnel',
      description: 'Generate qualified leads for legal consultations',
      category: 'funnel',
      niche: 'Legal',
      features: ['Case Evaluation', 'Success Stories', 'Free Consultation Offers', 'Legal Guides'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 11.7,
      icon: <Gavel className="h-5 w-5" />
    },

    // Home Services Templates
    {
      id: '31',
      name: 'Home Services Website',
      description: 'Professional website for contractors and home service providers',
      category: 'website',
      niche: 'Home Services',
      features: ['Service Areas', 'Project Gallery', 'Online Estimates', 'Emergency Services', 'Reviews'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <Wrench className="h-5 w-5" />
    },
    {
      id: '32',
      name: 'Home Service Booking Funnel',
      description: 'Book more home service appointments with trust signals',
      category: 'funnel',
      niche: 'Home Services',
      features: ['Before/After Photos', 'Instant Quotes', 'Service Guarantees', 'Local Reviews'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 19.5,
      icon: <Wrench className="h-5 w-5" />
    },

    // Fashion Templates
    {
      id: '33',
      name: 'Fashion Brand Website',
      description: 'Stylish website for fashion brands and clothing stores',
      category: 'website',
      niche: 'Fashion',
      features: ['Product Catalog', 'Lookbooks', 'Size Guide', 'Style Blog', 'Wishlist'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <Shirt className="h-5 w-5" />
    },
    {
      id: '34',
      name: 'Fashion Collection Funnel',
      description: 'Launch new fashion collections with pre-order campaigns',
      category: 'funnel',
      niche: 'Fashion',
      features: ['Collection Preview', 'Style Videos', 'Exclusive Access', 'Fashion Influencer Content'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 23.1,
      icon: <Shirt className="h-5 w-5" />
    },

    // Children & Family Templates
    {
      id: '35',
      name: 'Childcare Center Website',
      description: 'Professional website for daycares and childcare centers',
      category: 'website',
      niche: 'Children',
      features: ['Program Info', 'Staff Profiles', 'Parent Portal', 'Photo Gallery', 'Enrollment Forms'],
      preview: '/api/placeholder/300/200',
      isPremium: false,
      icon: <Baby className="h-5 w-5" />
    },
    {
      id: '36',
      name: 'Childcare Enrollment Funnel',
      description: 'Increase childcare enrollments with parent-focused content',
      category: 'funnel',
      niche: 'Children',
      features: ['Virtual Tours', 'Parent Testimonials', 'Safety Information', 'Enrollment Incentives'],
      preview: '/api/placeholder/300/200',
      isPremium: true,
      conversionRate: 16.3,
      icon: <Baby className="h-5 w-5" />
    }
  ];

  const niches = Array.from(new Set(templates.map(t => t.niche))).sort();

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesNiche = selectedNiche === 'all' || template.niche === selectedNiche;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.niche.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesNiche && matchesSearch;
  });

  const funnelSteps: FunnelStep[] = [
    { id: '1', name: 'Landing Page', type: 'entry', conversionRate: 100 },
    { id: '2', name: 'Lead Capture', type: 'conversion', conversionRate: 35 },
    { id: '3', name: 'Product Presentation', type: 'nurture', conversionRate: 80 },
    { id: '4', name: 'Checkout', type: 'conversion', conversionRate: 25 },
    { id: '5', name: 'Thank You', type: 'confirmation', conversionRate: 100 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary rounded-full">
              <Globe className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold">Website & Funnel Builder</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Create stunning websites and high-converting sales funnels with our drag-and-drop builder. 
            Choose from 30+ professionally designed templates across multiple industries.
          </p>
          <div className="flex items-center justify-center gap-6 mb-8">
            <Badge variant="secondary" className="px-4 py-2">
              <Globe className="h-4 w-4 mr-2" />
              Responsive Design
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              Conversion Optimized
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              No Code Required
            </Badge>
          </div>
          
          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">30+</div>
              <div className="text-sm text-muted-foreground">Templates</div>
            </div>
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Industries</div>
            </div>
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">24.3%</div>
              <div className="text-sm text-muted-foreground">Avg. Conversion Rate</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="my-sites">My Sites</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Templates */}
          <TabsContent value="templates" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="website">Websites</SelectItem>
                    <SelectItem value="funnel">Funnels</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {niches.map(niche => (
                      <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                {filteredTemplates.length} templates found
              </div>
            </div>

            {/* Template Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map(template => (
                <Card key={template.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <div className="relative">
                      <img 
                        src={template.preview} 
                        alt={template.name}
                        className="w-full h-40 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform duration-300"
                      />
                      {template.isPremium && (
                        <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                      {template.conversionRate && (
                        <Badge variant="secondary" className="absolute top-2 left-2">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {template.conversionRate}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {template.icon}
                        <CardTitle className="text-lg leading-tight">{template.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground text-sm line-clamp-2">{template.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Industry:</span>
                        <span className="text-xs text-muted-foreground">{template.niche}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 3).map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {template.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.features.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Builder */}
          <TabsContent value="builder" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Builder Tools */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Design Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Site Name</label>
                      <Input placeholder="My Awesome Website" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Primary Color</label>
                      <div className="flex gap-2 mt-1">
                        <Input type="color" className="w-16 h-10" />
                        <Input placeholder="#2563eb" className="flex-1" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Font Style</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inter">Inter</SelectItem>
                          <SelectItem value="roboto">Roboto</SelectItem>
                          <SelectItem value="poppins">Poppins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Page Elements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { name: 'Header', icon: <Monitor className="h-4 w-4" /> },
                        { name: 'Hero Section', icon: <Star className="h-4 w-4" /> },
                        { name: 'Features', icon: <Zap className="h-4 w-4" /> },
                        { name: 'Testimonials', icon: <Users className="h-4 w-4" /> },
                        { name: 'Contact Form', icon: <Target className="h-4 w-4" /> },
                        { name: 'Footer', icon: <Laptop className="h-4 w-4" /> }
                      ].map(element => (
                        <div key={element.name} className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
                          {element.icon}
                          <span className="text-sm">{element.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Canvas */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Live Preview
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Smartphone className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Laptop className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Monitor className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-6 min-h-[600px]">
                      <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
                        {/* Sample Website Preview */}
                        <div className="text-center mb-8">
                          <h1 className="text-4xl font-bold mb-4">Welcome to Your Website</h1>
                          <p className="text-lg text-muted-foreground mb-6">
                            Create something amazing with our powerful builder
                          </p>
                          <Button size="lg">Get Started</Button>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="text-center p-4 border rounded-lg">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                                <Star className="h-6 w-6 text-primary" />
                              </div>
                              <h3 className="font-semibold mb-2">Feature {i}</h3>
                              <p className="text-sm text-muted-foreground">Description of feature {i}</p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="text-center">
                          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
                          <Button>Contact Us</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-4 mt-6">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button>
                        <Globe className="h-4 w-4 mr-2" />
                        Publish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* My Sites */}
          <TabsContent value="my-sites" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Websites & Funnels</h2>
              <Button>
                <Globe className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Church Website', type: 'Website', status: 'Published', visitors: '2,341', conversions: '12.5%' },
                { name: 'Donation Funnel', type: 'Funnel', status: 'Active', visitors: '1,892', conversions: '18.7%' },
                { name: 'Event Landing Page', type: 'Website', status: 'Draft', visitors: '0', conversions: '0%' }
              ].map((site, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{site.name}</CardTitle>
                      <Badge variant={site.status === 'Published' ? 'default' : site.status === 'Active' ? 'secondary' : 'outline'}>
                        {site.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{site.type}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-2xl font-bold">{site.visitors}</div>
                        <div className="text-xs text-muted-foreground">Visitors</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{site.conversions}</div>
                        <div className="text-xs text-muted-foreground">Conversion</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Funnel Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Funnel Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {funnelSteps.map((step, index) => (
                      <div key={step.id} className="flex items-center gap-4">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium">{step.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${step.conversionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12">{step.conversionRate}%</span>
                        </div>
                        {index < funnelSteps.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Key Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Total Visitors', value: '12,847', change: '+15.3%', trend: 'up' },
                      { label: 'Conversion Rate', value: '18.7%', change: '+2.1%', trend: 'up' },
                      { label: 'Revenue', value: '$24,350', change: '+28.4%', trend: 'up' },
                      { label: 'Bounce Rate', value: '32.1%', change: '-5.2%', trend: 'down' }
                    ].map((metric, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <div className="text-sm text-muted-foreground">{metric.label}</div>
                        <div className={`text-xs flex items-center gap-1 mt-1 ${
                          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className="h-3 w-3" />
                          {metric.change}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WebsiteFunnelBuilder;