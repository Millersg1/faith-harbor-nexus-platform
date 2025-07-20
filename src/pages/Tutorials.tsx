import Navigation from "@/components/Navigation";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Clock, 
  Play, 
  BookOpen, 
  Users, 
  Calendar, 
  DollarSign, 
  MessageSquare,
  BarChart3,
  Settings,
  Video
} from "lucide-react";
import { useState } from "react";

const Tutorials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Tutorials", icon: Video, count: 47 },
    { id: "getting-started", name: "Getting Started", icon: BookOpen, count: 8 },
    { id: "members", name: "Member Management", icon: Users, count: 12 },
    { id: "events", name: "Event Planning", icon: Calendar, count: 10 },
    { id: "finance", name: "Financial Tools", icon: DollarSign, count: 7 },
    { id: "communication", name: "Communication", icon: MessageSquare, count: 6 },
    { id: "analytics", name: "Analytics", icon: BarChart3, count: 4 }
  ];

  const featuredTutorials = [
    {
      title: "Complete Platform Walkthrough",
      description: "Comprehensive overview of all Faith Harbor™ features and capabilities",
      duration: "15:30",
      category: "getting-started",
      difficulty: "Beginner",
      views: "2.4k",
      thumbnail: "/placeholder.svg",
      featured: true
    },
    {
      title: "Setting Up Your First Event", 
      description: "Step-by-step guide to creating and managing church events",
      duration: "8:45",
      category: "events",
      difficulty: "Beginner",
      views: "1.8k",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Advanced Member Segmentation",
      description: "Create targeted member groups for better engagement",
      duration: "12:20",
      category: "members",
      difficulty: "Intermediate",
      views: "1.2k",
      thumbnail: "/placeholder.svg"
    }
  ];

  const allTutorials = [
    {
      title: "Quick Start Guide",
      description: "Get up and running in under 10 minutes",
      duration: "6:15",
      category: "getting-started",
      difficulty: "Beginner",
      views: "3.1k",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Import Member Data",
      description: "Migrate existing member information seamlessly",
      duration: "4:30",
      category: "members",
      difficulty: "Beginner",
      views: "1.9k",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Financial Dashboard Overview",
      description: "Understanding your church's financial metrics",
      duration: "7:45",
      category: "finance",
      difficulty: "Intermediate",
      views: "1.5k",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Email Campaign Creation",
      description: "Design effective communication campaigns",
      duration: "9:20",
      category: "communication",
      difficulty: "Intermediate",
      views: "1.3k",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Custom Report Building",
      description: "Create detailed analytics reports",
      duration: "11:10",
      category: "analytics",
      difficulty: "Advanced",
      views: "890",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Mobile App Configuration", 
      description: "Set up your church's mobile presence",
      duration: "5:55",
      category: "getting-started",
      difficulty: "Intermediate",
      views: "1.7k",
      thumbnail: "/placeholder.svg"
    }
  ];

  const filteredTutorials = allTutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Video className="h-3 w-3 mr-1" />
              Video Tutorials
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Learn with 
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"> Step-by-Step Tutorials</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Master every feature of Faith Harbor™ with our comprehensive video tutorial library
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Tutorial */}
      {featuredTutorials.length > 0 && (
        <section className="pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Featured Tutorial</h2>
              <p className="text-muted-foreground">Most popular tutorial this week</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <VideoPlayer
                title={featuredTutorials[0].title}
                description={featuredTutorials[0].description}
                duration={featuredTutorials[0].duration}
                thumbnail={featuredTutorials[0].thumbnail}
                className="lg:order-1"
              />
              
              <div className="lg:order-2">
                <Badge variant="secondary" className="mb-3">
                  {categories.find(cat => cat.id === featuredTutorials[0].category)?.name}
                </Badge>
                <h3 className="text-3xl font-bold mb-4">{featuredTutorials[0].title}</h3>
                <p className="text-muted-foreground mb-6">{featuredTutorials[0].description}</p>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredTutorials[0].duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    {featuredTutorials[0].views} views
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {featuredTutorials[0].difficulty}
                  </Badge>
                </div>
                
                <Button size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Now
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tutorial Library */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Category Sidebar */}
              <div className="lg:w-64">
                <h3 className="font-semibold mb-4">Categories</h3>
                <TabsList className="grid grid-cols-2 lg:grid-cols-1 gap-2 h-auto bg-transparent">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <category.icon className="mr-2 h-4 w-4" />
                      <span className="flex-1 text-left">{category.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {category.count}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Tutorial Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">
                    {selectedCategory === "all" ? "All Tutorials" : 
                     categories.find(cat => cat.id === selectedCategory)?.name} 
                    <span className="text-muted-foreground ml-2">
                      ({filteredTutorials.length})
                    </span>
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTutorials.map((tutorial, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="relative">
                        <VideoPlayer
                          title={tutorial.title}
                          description={tutorial.description}
                          duration={tutorial.duration}
                          thumbnail={tutorial.thumbnail}
                          showControls={false}
                          className="border-0"
                        />
                      </div>
                      
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {tutorial.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Play className="h-3 w-3" />
                            {tutorial.views}
                          </div>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {tutorial.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {tutorial.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {tutorial.duration}
                          </div>
                          <Button size="sm" variant="outline">
                            Watch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredTutorials.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground mb-4">
                      No tutorials found matching your criteria
                    </div>
                    <Button variant="outline" onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Tutorials;