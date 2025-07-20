import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Store, Search, Filter, Star, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ServiceCard } from "@/components/marketplace/ServiceCard";
import { CreateServiceDialog } from "@/components/marketplace/CreateServiceDialog";
import { ProviderDashboard } from "@/components/marketplace/ProviderDashboard";
import { BookingHistory } from "@/components/marketplace/BookingHistory";

interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  icon_name: string | null;
}

interface Service {
  id: string;
  title: string;
  short_description: string | null;
  price_type: string;
  price_amount: number | null;
  hourly_rate: number | null;
  location_type: string;
  images: any;
  created_at: string;
  provider?: {
    business_name: string | null;
    user_id: string;
    average_rating: number;
    total_reviews: number;
  } | null;
  category?: {
    name: string;
    icon_name: string | null;
  } | null;
}

export default function Marketplace() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [isCreateServiceOpen, setIsCreateServiceOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("browse");
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, selectedCategory, priceFilter]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider:provider_profiles(business_name, user_id, average_rating, total_reviews),
          category:service_categories(name, icon_name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Type assertion to match our interface since Supabase returns additional fields
      setServices((data as any) || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(service => service.category?.name === selectedCategory);
    }

    if (priceFilter) {
      filtered = filtered.filter(service => {
        const price = service.price_amount || service.hourly_rate || 0;
        switch (priceFilter) {
          case 'under-50':
            return price < 5000;
          case '50-100':
            return price >= 5000 && price < 10000;
          case '100-200':
            return price >= 10000 && price < 20000;
          case 'over-200':
            return price >= 20000;
          default:
            return true;
        }
      });
    }

    setFilteredServices(filtered);
  };

  const handleServiceCreated = () => {
    setIsCreateServiceOpen(false);
    fetchServices();
    toast({
      title: "Success",
      description: "Service created successfully",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Store className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">Church Marketplace</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with trusted members of our community for services, skills, and support
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mx-auto">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="my-services" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              My Services
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="provider" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Become Provider
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Search services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Price</SelectItem>
                      <SelectItem value="under-50">Under $50</SelectItem>
                      <SelectItem value="50-100">$50 - $100</SelectItem>
                      <SelectItem value="100-200">$100 - $200</SelectItem>
                      <SelectItem value="over-200">Over $200</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                    setPriceFilter("");
                  }}>
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Services Grid */}
            {filteredServices.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Services Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || selectedCategory || priceFilter 
                      ? "Try adjusting your filters to see more services"
                      : "Be the first to offer a service to the community!"
                    }
                  </p>
                  <Button onClick={() => setActiveTab("provider")} variant="outline">
                    Offer a Service
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-services">
            <ProviderDashboard onServiceCreated={fetchServices} />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingHistory />
          </TabsContent>

          <TabsContent value="provider" className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Become a Service Provider</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Share your skills and talents with our church community. Whether you're offering professional services, 
                helping with home tasks, or providing spiritual guidance, your contributions make a difference.
              </p>
              <Button onClick={() => setIsCreateServiceOpen(true)} size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Service
              </Button>
            </div>

            {/* Categories Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.slice(0, 6).map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <CreateServiceDialog
          open={isCreateServiceOpen}
          onOpenChange={setIsCreateServiceOpen}
          onServiceCreated={handleServiceCreated}
        />
      </div>
    </div>
  );
}