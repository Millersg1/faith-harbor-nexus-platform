import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Users, Star, ArrowRight, Download, Share2 } from "lucide-react";
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

  const testimonials = [
    {
      name: "Pastor Michael Johnson",
      church: "Grace Community Church",
      quote: "This video showed me exactly what our church needed. The setup was as easy as promised!",
      rating: 5
    },
    {
      name: "Sarah Williams",
      role: "Church Administrator",
      quote: "Finally, a platform that understands ministry needs. The demo was incredibly helpful.",
      rating: 5
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
              See Faith Harbor 
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"> in Action</span>
            </h1>
            <p className="text-xl text-blue-600 max-w-3xl mx-auto">
              Watch our comprehensive demo video to see how Faith Harbor can transform 
              your ministry operations and help you focus on what matters most.
            </p>
          </div>

          {/* Video Player */}
          <div className="mb-16">
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                <div className="text-center text-blue-600">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto hover:bg-primary/90 transition-colors cursor-pointer">
                    <Play className="h-8 w-8 ml-1 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Faith Harbor Demo Video</h3>
                  <p className="text-blue-600/80">Click to watch the complete platform overview</p>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="secondary">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* What You'll Learn */}
            <Card>
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
                <CardDescription>
                  This demo covers all the essential features that make Faith Harbor the complete ministry solution.
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
                    Join thousands of churches and ministries already using Faith Harbor to grow their impact.
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
                  <div className="text-center text-sm text-muted-foreground">
                    No credit card required • Setup in minutes
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">10K+</div>
                      <div className="text-xs text-muted-foreground">Churches</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">4.9</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">99.9%</div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">What Ministry Leaders Say</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-sm mb-4">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="text-sm">
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-muted-foreground">
                        {testimonial.church || testimonial.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoVideo;