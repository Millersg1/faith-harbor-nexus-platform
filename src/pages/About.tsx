import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, Users, Globe, Shield } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Faith Harbor™
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We're on a mission to empower faith communities worldwide with cutting-edge technology 
            that strengthens ministry, deepens connections, and spreads God's love.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Faith Harbor exists to bridge the gap between traditional ministry and modern technology. 
                We believe that every church, ministry, and faith-based organization deserves access to 
                world-class tools that help them fulfill their calling more effectively.
              </p>
              <p className="text-lg text-muted-foreground">
                Through our comprehensive ministry platform, we're not just providing software – 
                we're building a community where faith and innovation work hand in hand.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Faith-Centered</h3>
                  <p className="text-sm text-muted-foreground">
                    Every feature is designed with ministry in mind
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Community Driven</h3>
                  <p className="text-sm text-muted-foreground">
                    Built by ministers, for ministers
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Global Reach</h3>
                  <p className="text-sm text-muted-foreground">
                    Supporting ministries worldwide
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Secure & Reliable</h3>
                  <p className="text-sm text-muted-foreground">
                    Enterprise-grade security you can trust
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Story</h2>
            <div className="bg-muted rounded-lg p-8">
              <p className="text-lg text-muted-foreground mb-6">
                Faith Harbor was born from a simple observation: while technology has transformed 
                every industry, many churches and ministries were still struggling with outdated 
                systems that hindered rather than helped their mission.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our founder, Pastor Shawn, experienced this firsthand while leading a growing 
                congregation. The frustration of juggling multiple disconnected systems, 
                the challenge of engaging younger generations, and the desire to reach more 
                people for Christ led to a vision: what if there was a platform designed 
                specifically for faith communities?
              </p>
              <p className="text-lg text-muted-foreground">
                Today, Faith Harbor serves thousands of churches, ministries, and faith-based 
                organizations worldwide, helping them streamline operations, deepen community 
                connections, and focus on what matters most – their calling to serve God and others.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Ministry?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of churches and ministries already using Faith Harbor to make a greater impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" variant="cta">
                Schedule a Demo
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;