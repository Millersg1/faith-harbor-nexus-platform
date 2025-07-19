import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Pastor Michael Johnson",
      role: "Senior Pastor",
      church: "Grace Community Church",
      image: "/placeholder.svg",
      content: "Faith Harbor has revolutionized how we manage our ministry. The AI spiritual companion and comprehensive tools have helped us grow by 40% this year.",
      rating: 5
    },
    {
      name: "Sarah Martinez",
      role: "Ministry Leader",
      church: "New Hope Fellowship",
      image: "/placeholder.svg",
      content: "The volunteer management and event planning features are incredible. We've streamlined everything into one platform and our team loves it.",
      rating: 5
    },
    {
      name: "Dr. James Wilson",
      role: "Executive Pastor",
      church: "First Baptist Downtown",
      image: "/placeholder.svg",
      content: "As a large church, we needed enterprise-level features with spiritual focus. Faith Harbor delivers exactly that with SOC 2 compliance and amazing support.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-6" style={{color: "hsl(var(--gold))"}}>
            Trusted by Ministry Leaders
            <span className="block text-primary">Across the Nation</span>
          </h2>
          <p className="body-lg text-muted-foreground max-w-3xl mx-auto">
            Join thousands of churches and Christian businesses who are transforming their ministry with Faith Harbor
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="ministry-card relative overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="h-12 w-12 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <span className="text-primary font-semibold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  <div className="text-sm text-primary">{testimonial.church}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-8">Trusted by 500+ ministry organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-sm font-medium">✓ SOC 2 Type II Certified</div>
            <div className="text-sm font-medium">✓ 99.9% Uptime Guarantee</div>
            <div className="text-sm font-medium">✓ 24/7 Ministry Support</div>
            <div className="text-sm font-medium">✓ Data Backup & Recovery</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;