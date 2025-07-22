import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const developmentHighlights = [
    {
      title: "Ministry-Focused Design",
      description: "Every feature is being designed specifically with churches and Christian organizations in mind, ensuring the platform serves your spiritual mission.",
      icon: "🙏"
    },
    {
      title: "Comprehensive Feature Set",
      description: "We're developing an all-in-one solution to replace multiple tools, streamlining ministry operations into a single, powerful platform.",
      icon: "⚡"
    },
    {
      title: "Founding Members Program",
      description: "Join our development community to help shape the platform and get exclusive access as features become available.",
      icon: "🚀"
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-6" style={{color: "hsl(var(--gold))"}}>
            Built for Ministry Leaders
            <span className="block text-primary">By Ministry Leaders</span>
          </h2>
          <p className="body-lg text-muted-foreground max-w-3xl mx-auto">
            We're developing Faith Harbor based on real ministry needs and feedback from church leaders
          </p>
        </div>

        {/* Development Highlights */}
        <div className="grid md:grid-cols-3 gap-8">
          {developmentHighlights.map((highlight, index) => (
            <div 
              key={index}
              className="ministry-card text-center"
            >
              {/* Icon */}
              <div className="text-4xl mb-4">{highlight.icon}</div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-4" style={{color: "hsl(var(--gold))"}}>
                {highlight.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>

        {/* Development Status */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-8">Currently in development - Join our founding members program</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-sm font-medium">✓ Security-First Development</div>
            <div className="text-sm font-medium">✓ Ministry-Focused Features</div>
            <div className="text-sm font-medium">✓ Founding Members Program</div>
            <div className="text-sm font-medium">✓ Community Feedback Driven</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;