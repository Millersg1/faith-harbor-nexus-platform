import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Phone, Heart, Users, ExternalLink } from "lucide-react";

export function GriefResourcesSection() {
  const resources = [
    {
      title: "Grief Support Books",
      description: "Recommended reading for those experiencing loss",
      items: [
        "A Grief Observed by C.S. Lewis",
        "The Year of Magical Thinking by Joan Didion",
        "When Bad Things Happen to Good People by Harold Kushner",
        "Healing After Loss by Martha Whitmore Hickman"
      ],
      icon: BookOpen
    },
    {
      title: "Crisis Hotlines",
      description: "24/7 support when you need it most",
      items: [
        "National Suicide Prevention Lifeline: 988",
        "Crisis Text Line: Text HOME to 741741",
        "SAMHSA National Helpline: 1-800-662-4357",
        "Grief Recovery Helpline: 1-800-445-4808"
      ],
      icon: Phone
    },
    {
      title: "Online Support Groups",
      description: "Connect with others who understand your journey",
      items: [
        "GriefShare - griefshare.org",
        "Modern Loss Community",
        "What's Your Grief Support Groups",
        "The Grief Toolbox Online Support"
      ],
      icon: Users
    },
    {
      title: "Spiritual Resources",
      description: "Finding comfort in faith during difficult times",
      items: [
        "Daily devotionals for grief",
        "Scripture verses for comfort",
        "Prayer resources for healing",
        "Meditation and mindfulness practices"
      ],
      icon: Heart
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Grief Support Resources</h2>
        <p className="text-muted-foreground">Helpful resources for navigating the journey of grief and healing</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card key={resource.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {resource.items.map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Heart className="h-12 w-12 text-primary mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Need Personal Support?</h3>
              <p className="text-muted-foreground">
                Our pastoral care team is here to walk alongside you during this difficult time
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact Pastoral Care
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}