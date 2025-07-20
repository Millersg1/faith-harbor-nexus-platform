import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  Video, 
  MessageSquare, 
  Target, 
  Star,
  Clock,
  DollarSign,
  BookOpen,
  TrendingUp,
  Award,
  Heart
} from "lucide-react";

interface Coach {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  bio: string;
  experience: string;
  certifications: string[];
  availability: string[];
  imageUrl: string;
}

interface CoachingSession {
  id: string;
  coachId: string;
  coachName: string;
  title: string;
  type: 'spiritual' | 'leadership' | 'financial' | 'marriage' | 'career';
  duration: number;
  scheduledAt: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
}

const CoachingPlatform = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const coaches: Coach[] = [
    {
      id: '1',
      name: 'Pastor David Williams',
      specialization: 'Spiritual Direction & Leadership',
      rating: 4.9,
      reviews: 127,
      hourlyRate: 85,
      bio: 'Experienced pastor with 20+ years in ministry leadership and spiritual formation.',
      experience: '20+ years in ministry',
      certifications: ['M.Div Theology', 'Certified Spiritual Director', 'Leadership Coach'],
      availability: ['Mon 9-5', 'Wed 9-5', 'Fri 9-3'],
      imageUrl: '/api/placeholder/150/150'
    },
    {
      id: '2',
      name: 'Dr. Sarah Johnson',
      specialization: 'Marriage & Family Counseling',
      rating: 4.8,
      reviews: 89,
      hourlyRate: 95,
      bio: 'Licensed counselor specializing in Christian marriage and family dynamics.',
      experience: '15+ years counseling',
      certifications: ['Ph.D Psychology', 'Licensed Marriage Counselor', 'AACC Certified'],
      availability: ['Tue 10-6', 'Thu 10-6', 'Sat 9-1'],
      imageUrl: '/api/placeholder/150/150'
    },
    {
      id: '3',
      name: 'Michael Chen',
      specialization: 'Financial Stewardship',
      rating: 4.7,
      reviews: 156,
      hourlyRate: 75,
      bio: 'CPA and financial planner helping Christians achieve biblical financial wellness.',
      experience: '12+ years financial planning',
      certifications: ['CPA', 'CFP', 'Kingdom Advisor Certified'],
      availability: ['Mon 1-8', 'Wed 1-8', 'Fri 1-6'],
      imageUrl: '/api/placeholder/150/150'
    }
  ];

  const mySessions: CoachingSession[] = [
    {
      id: '1',
      coachId: '1',
      coachName: 'Pastor David Williams',
      title: 'Leadership Development Session',
      type: 'leadership',
      duration: 60,
      scheduledAt: '2024-02-20T14:00:00',
      status: 'upcoming',
      price: 85
    },
    {
      id: '2',
      coachId: '2',
      coachName: 'Dr. Sarah Johnson',
      title: 'Marriage Enrichment Coaching',
      type: 'marriage',
      duration: 90,
      scheduledAt: '2024-02-18T16:00:00',
      status: 'completed',
      price: 95
    }
  ];

  const categories = [
    { id: 'all', name: 'All Coaches', icon: Users },
    { id: 'spiritual', name: 'Spiritual Direction', icon: Heart },
    { id: 'leadership', name: 'Leadership', icon: Target },
    { id: 'financial', name: 'Financial', icon: DollarSign },
    { id: 'marriage', name: 'Marriage & Family', icon: Users },
    { id: 'career', name: 'Career & Calling', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Coaching Platform</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Connect with certified Christian coaches for spiritual growth, leadership development, and life transformation
          </p>
          <div className="flex items-center justify-center gap-6">
            <Badge variant="secondary" className="px-4 py-2">
              <Video className="h-4 w-4 mr-2" />
              Video Sessions
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              Certified Coaches
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <BookOpen className="h-4 w-4 mr-2" />
              Biblical Foundation
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Coaches</TabsTrigger>
            <TabsTrigger value="sessions">My Sessions</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
          </TabsList>

          {/* Browse Coaches */}
          <TabsContent value="browse" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Coaches Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coaches.map(coach => (
                <Card key={coach.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <img 
                      src={coach.imageUrl} 
                      alt={coach.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4"
                    />
                    <CardTitle className="text-xl">{coach.name}</CardTitle>
                    <p className="text-muted-foreground">{coach.specialization}</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-semibold">{coach.rating}</span>
                      </div>
                      <span className="text-muted-foreground">({coach.reviews} reviews)</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {coach.bio}
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{coach.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">${coach.hourlyRate}/hour</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-semibold">Certifications:</h4>
                      <div className="flex flex-wrap gap-1">
                        {coach.certifications.map(cert => (
                          <Badge key={cert} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-semibold">Availability:</h4>
                      <div className="text-xs text-muted-foreground">
                        {coach.availability.join(', ')}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">Book Session</Button>
                      <Button variant="outline">View Profile</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Sessions */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Coaching Sessions</h2>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule New Session
              </Button>
            </div>

            <div className="space-y-4">
              {mySessions.map(session => (
                <Card key={session.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          {session.type === 'leadership' && <Target className="h-6 w-6 text-primary" />}
                          {session.type === 'marriage' && <Users className="h-6 w-6 text-primary" />}
                          {session.type === 'financial' && <DollarSign className="h-6 w-6 text-primary" />}
                          {session.type === 'spiritual' && <Heart className="h-6 w-6 text-primary" />}
                        </div>
                        <div>
                          <h3 className="font-semibold">{session.title}</h3>
                          <p className="text-muted-foreground">with {session.coachName}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{new Date(session.scheduledAt).toLocaleString()}</span>
                            <span>{session.duration} minutes</span>
                            <span>${session.price}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge variant={
                          session.status === 'upcoming' ? 'default' :
                          session.status === 'completed' ? 'secondary' : 'destructive'
                        }>
                          {session.status.toUpperCase()}
                        </Badge>
                        
                        {session.status === 'upcoming' && (
                          <div className="flex gap-2">
                            <Button size="sm">
                              <Video className="h-4 w-4 mr-1" />
                              Join
                            </Button>
                            <Button size="sm" variant="outline">Reschedule</Button>
                          </div>
                        )}
                        
                        {session.status === 'completed' && (
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Progress Tracking */}
          <TabsContent value="progress" className="space-y-6">
            <h2 className="text-2xl font-bold">My Progress</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary">12</div>
                  <p className="text-muted-foreground">Total Sessions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600">18</div>
                  <p className="text-muted-foreground">Hours Coached</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">3</div>
                  <p className="text-muted-foreground">Coaches Worked With</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600">89%</div>
                  <p className="text-muted-foreground">Goal Achievement</p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Areas */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { area: 'Leadership Skills', progress: 75, sessions: 5 },
                    { area: 'Spiritual Growth', progress: 82, sessions: 4 },
                    { area: 'Financial Stewardship', progress: 60, sessions: 3 }
                  ].map(item => (
                    <div key={item.area}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{item.area}</span>
                        <span className="text-muted-foreground">{item.sessions} sessions</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground mt-1">
                        {item.progress}% complete
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoachingPlatform;