import Navigation from "@/components/Navigation";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoSection } from "@/components/VideoSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Users, Star, ArrowRight, Download, Share2, BookOpen, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const DemoVideo = () => {
  const videoFeatures = [
    "Complete platform overview",
    "Member management system", 
    "Event planning tools",
    "Financial tracking",
    "Communication features",
    "Reporting dashboard"
  ];

  const trainingVideos = [
    {
      title: "Platform Overview & Setup",
      description: "Get started with Faith Harbor™ and learn the basics",
      duration: "8:45",
      category: "Getting Started",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Advanced Member Management",
      description: "Deep dive into member profiles, groups, and permissions",
      duration: "12:30",
      category: "Members",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Event Management Masterclass",
      description: "Plan, organize, and track events like a pro",
      duration: "15:20",
      category: "Events",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Financial Systems & Reporting",
      description: "Master donation tracking and financial reports",
      duration: "10:15",
      category: "Finance",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Communication & Outreach",
      description: "Effective member communication strategies",
      duration: "9:30",
      category: "Communication",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Analytics & Growth Insights",
      description: "Use data to grow your ministry effectively",
      duration: "11:45",
      category: "Analytics",
      thumbnail: "/placeholder.svg"
    }
  ];


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Clock className="h-3 w-3 mr-1" />
              2 minute overview
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              See Faith Harbor™ 
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"> in Action</span>
            </h1>
            <p className="text-xl text-blue-600 max-w-3xl mx-auto">
              Watch our comprehensive demo video to see how Faith Harbor™ can transform 
              your ministry operations and help you focus on what matters most.
            </p>
          </div>

          {/* Main Demo Video */}
          <div className="mb-16">
            <VideoPlayer
              title="Faith Harbor™ Complete Demo"
              description="Watch our comprehensive platform overview and see how Faith Harbor™ can transform your ministry"
              duration="2:00"
              thumbnail="/placeholder.svg"
              className="max-w-4xl mx-auto"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* What You'll Learn */}
            <Card>
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
                <CardDescription>
                  This demo covers all the essential features that make Faith Harbor™ the complete ministry solution.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {videoFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-primary">{index + 1}</span>
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center justify-between text-sm text-blue-600">
                    <span>Duration: 2 minutes</span>
                    <span>Updated: December 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Get Started?</CardTitle>
                  <CardDescription>
                    Be among the first to experience the innovative ministry management platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to="/demo">
                    <Button size="lg" className="w-full">
                      Start Your Free 30-Day Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="w-full">
                    Schedule Personal Demo
                  </Button>
                  <div className="text-center text-sm text-blue-600">
                    No credit card required • Setup in minutes
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">New</div>
                      <div className="text-xs text-blue-600">Platform</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">AI</div>
                      <div className="text-xs text-blue-600">Powered</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">SOC 2</div>
                      <div className="text-xs text-blue-600">Ready</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Training Video Library */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <BookOpen className="h-3 w-3 mr-1" />
                Training Library
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Master Every Feature with Our 
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"> Training Videos</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive step-by-step guides to help you become a Faith Harbor™ expert
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainingVideos.map((video, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <VideoPlayer
                      title={video.title}
                      description={video.description}
                      duration={video.duration}
                      thumbnail={video.thumbnail}
                      showControls={false}
                      className="border-0"
                    />
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {video.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {video.duration}
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {video.title}
                    </CardTitle>
                    <CardDescription>{video.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Play className="h-3 w-3 mr-2" />
                      Watch Tutorial
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="mt-20">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Practical Skills</h3>
                  <p className="text-muted-foreground">
                    Learn hands-on techniques you can implement immediately in your ministry
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Step-by-Step</h3>
                  <p className="text-muted-foreground">
                    Follow along with detailed guides that make complex features simple
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Best Practices</h3>
                  <p className="text-muted-foreground">
                    Discover proven strategies from successful ministry leaders
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default DemoVideo;