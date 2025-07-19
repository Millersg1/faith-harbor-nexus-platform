import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Phone, Mail, Calendar, Users, Zap, Shield, Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Demo = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organizationType: "",
    organizationName: "",
    size: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Demo Request Submitted!",
      description: "We'll contact you within 24 hours to schedule your personalized demo.",
    });
  };

  const benefits = [
    { icon: Calendar, title: "Personalized Demo", description: "See Faith Harbor customized for your ministry needs" },
    { icon: Users, title: "Expert Guidance", description: "Get insights from our ministry technology specialists" },
    { icon: Zap, title: "Quick Setup", description: "Learn how to get started in under 30 minutes" },
    { icon: Shield, title: "No Pressure", description: "No sales pressure - just valuable insights for your ministry" }
  ];

  const features = [
    "Member Management System", 
    "Event Planning Tools", 
    "Financial Tracking", 
    "Communication Platform",
    "Volunteer Coordination", 
    "Donation Processing", 
    "Report Generation", 
    "Mobile App Access",
    "Multi-site Management",
    "Security & Compliance",
    "Custom Workflows",
    "24/7 Support"
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full border mb-6">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Free 30-Day Trial Available</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Request Your 
              <span className="text-blue-600"> Free Demo</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              See how Faith Harbor can transform your ministry operations with a personalized demonstration 
              tailored to your organization's specific needs. Join 10,000+ churches already growing with us.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-sm text-gray-600">Active Churches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">4.9/5</div>
              <div className="text-sm text-gray-600">Customer Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">600+</div>
              <div className="text-sm text-gray-600">Built-in Features</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-sm text-gray-600">Uptime SLA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Demo Request Form */}
            <Card className="shadow-lg border">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Schedule Your Personal Demo</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Fill out this form and we'll contact you within 24 hours to schedule your personalized demo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-900">First Name *</Label>
                      <Input
                        id="firstName"
                        className="border-gray-300 text-gray-900"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-900">Last Name *</Label>
                      <Input
                        id="lastName"
                        className="border-gray-300 text-gray-900"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-900">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      className="border-gray-300 text-gray-900"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-900">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      className="border-gray-300 text-gray-900"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationType" className="text-sm font-medium text-gray-900">Organization Type *</Label>
                    <Select onValueChange={(value) => setFormData({...formData, organizationType: value})}>
                      <SelectTrigger className="border-gray-300 text-gray-900">
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="church">Church</SelectItem>
                        <SelectItem value="nonprofit">Non-Profit Organization</SelectItem>
                        <SelectItem value="ministry">Ministry</SelectItem>
                        <SelectItem value="christian-business">Christian Business</SelectItem>
                        <SelectItem value="denomination">Denomination</SelectItem>
                        <SelectItem value="seminary">Seminary/Bible College</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationName" className="text-sm font-medium text-gray-900">Organization Name *</Label>
                    <Input
                      id="organizationName"
                      className="border-gray-300 text-gray-900"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size" className="text-sm font-medium text-gray-900">Organization Size</Label>
                    <Select onValueChange={(value) => setFormData({...formData, size: value})}>
                      <SelectTrigger className="border-gray-300 text-gray-900">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="small">Under 100 members</SelectItem>
                        <SelectItem value="medium">100-500 members</SelectItem>
                        <SelectItem value="large">500-2000 members</SelectItem>
                        <SelectItem value="mega">Over 2000 members</SelectItem>
                        <SelectItem value="multi-site">Multi-site Church</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium text-gray-900">Tell us about your needs</Label>
                    <Textarea
                      id="message"
                      placeholder="What challenges are you looking to solve? What features are most important to you?"
                      className="border-gray-300 text-gray-900 min-h-[120px]"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={4}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Request Free Demo
                  </Button>
                  
                  <div className="text-center text-sm text-gray-500">
                    ✓ No credit card required • ✓ Setup in under 30 minutes
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Demo Benefits & Information */}
            <div className="space-y-8">
              {/* What You'll Get */}
              <Card className="border shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
                    <Zap className="h-5 w-5 text-blue-600" />
                    What You'll Get in Your Demo
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Your demo will be customized to show you exactly how Faith Harbor can benefit your ministry.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <benefit.icon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-gray-900">{benefit.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Key Features Preview */}
              <Card className="border shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Key Features You'll See</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-blue-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Options */}
              <Card className="border shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Prefer to Talk Directly?</CardTitle>
                  <CardDescription className="text-gray-600">
                    Our ministry technology specialists are standing by to help.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <Phone className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Call us directly</p>
                      <p className="text-sm text-gray-600">1-800-FAITH-HARBOR (1-800-324-8442)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                    <Mail className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Send us an email</p>
                      <p className="text-sm text-gray-600">demo@faithharbor.com</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Available Monday-Friday, 9 AM - 6 PM EST</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial */}
              <Card className="border shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="flex justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-lg font-medium text-gray-900 mb-4">
                      "Faith Harbor transformed how we manage our church. The demo showed us exactly what we needed, 
                      and the setup was incredibly smooth. Highly recommend!"
                    </blockquote>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">Pastor Michael Rodriguez</div>
                      <div className="text-gray-600">Grace Community Church, Austin TX</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Transform Your Ministry?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of churches and ministries already using Faith Harbor to grow their impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
              Start Free 30-Day Trial
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Watch 2-Minute Video
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Demo;