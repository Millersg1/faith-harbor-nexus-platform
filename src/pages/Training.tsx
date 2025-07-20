import Navigation from "@/components/Navigation";
import { VideoSection } from "@/components/VideoSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users, Star, Download, Award, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Training = () => {
  const trainingCategories = [
    {
      title: "Getting Started",
      description: "Essential basics for new users",
      videoCount: 8,
      duration: "45 min",
      difficulty: "Beginner",
      videos: [
        {
          title: "Platform Setup & First Steps",
          description: "Complete initial setup and navigation basics",
          duration: "5:30",
          category: "Getting Started"
        },
        {
          title: "User Roles & Permissions",
          description: "Understanding and configuring user access",
          duration: "4:15",
          category: "Getting Started"
        }
      ]
    },
    {
      title: "Member Management",
      description: "Advanced member organization and communication",
      videoCount: 12,
      duration: "85 min",
      difficulty: "Intermediate",
      videos: [
        {
          title: "Creating Member Profiles",
          description: "Detailed member information and custom fields",
          duration: "7:20",
          category: "Members"
        },
        {
          title: "Group Management",
          description: "Organizing members into effective groups",
          duration: "6:45",
          category: "Members"
        }
      ]
    },
    {
      title: "Event Planning",
      description: "Master event creation and management",
      videoCount: 10,
      duration: "65 min",
      difficulty: "Intermediate",
      videos: [
        {
          title: "Event Creation Workflow",
          description: "Step-by-step event planning process",
          duration: "8:30",
          category: "Events"
        },
        {
          title: "Registration & Check-in",
          description: "Managing attendees and event day logistics",
          duration: "5:50",
          category: "Events"
        }
      ]
    }
  ];

  const learningPaths = [
    {
      title: "New Administrator Path",
      description: "Complete guide for church administrators",
      modules: 6,
      duration: "3.5 hours",
      difficulty: "Beginner to Intermediate"
    },
    {
      title: "Ministry Leader Certification", 
      description: "Advanced strategies for ministry growth",
      modules: 8,
      duration: "5 hours",
      difficulty: "Intermediate to Advanced"
    },
    {
      title: "Technical Integration",
      description: "API usage and advanced configurations",
      modules: 4,
      duration: "2.5 hours",
      difficulty: "Advanced"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="h-3 w-3 mr-1" />
              Learning Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Master Faith Harbor™ with 
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"> Expert Training</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Comprehensive video training, learning paths, and certification programs to help you maximize your ministry impact
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/demo-video">
                <Button size="lg">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Learning
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <Award className="mr-2 h-4 w-4" />
                View Certification
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Training Videos</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">8hrs</div>
                <div className="text-sm text-muted-foreground">Total Content</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">3</div>
                <div className="text-sm text-muted-foreground">Learning Paths</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Free Access</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Structured Learning Paths</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Follow curated learning journeys designed for your role and experience level
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {learningPaths.map((path, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{path.difficulty}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {path.duration}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{path.title}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{path.modules} modules</span>
                    <span>Certificate included</span>
                  </div>
                  <Button className="w-full">
                    <Target className="mr-2 h-4 w-4" />
                    Start Path
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Training Categories */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Training by Category</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore specific topics and features with detailed video tutorials
            </p>
          </div>

          <div className="space-y-12">
            {trainingCategories.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {category.videoCount} videos • {category.duration}
                    </div>
                    <Badge variant="secondary" className="mt-1">
                      {category.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <VideoSection
                  title=""
                  description=""
                  videos={category.videos}
                  showGrid={true}
                  className="py-0"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Become a Faith Harbor™ Expert?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your learning journey today and transform how you manage your ministry
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/demo">
              <Button size="lg">
                Get Started Free
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <Download className="mr-2 h-4 w-4" />
              Download Resources
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Training;