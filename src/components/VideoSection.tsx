import { VideoPlayer } from './VideoPlayer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VideoSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  videos?: {
    title: string;
    description: string;
    duration: string;
    thumbnail?: string;
    videoUrl?: string;
    category?: string;
  }[];
  showGrid?: boolean;
  className?: string;
}

export const VideoSection = ({
  title = "Video Library",
  subtitle = "Learn and Explore",
  description = "Watch our comprehensive video guides to get the most out of Faith Harbor™",
  videos = [],
  showGrid = true,
  className = ""
}: VideoSectionProps) => {
  const defaultVideos = [
    {
      title: "Getting Started with Faith Harbor™",
      description: "Complete setup and basic navigation",
      duration: "3:45",
      category: "Getting Started",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Member Management Made Easy",
      description: "Add, organize, and communicate with members",
      duration: "5:20",
      category: "Members",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Event Planning & Coordination",
      description: "Create and manage church events seamlessly",
      duration: "4:15",
      category: "Events",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Financial Tracking & Reporting",
      description: "Monitor donations and generate reports",
      duration: "6:30",
      category: "Finance",
      thumbnail: "/placeholder.svg"
    }
  ];

  const videosToShow = videos.length > 0 ? videos : defaultVideos;

  if (!showGrid && videosToShow.length > 0) {
    // Single featured video
    const featuredVideo = videosToShow[0];
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{description}</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
              <VideoPlayer
                title={featuredVideo.title}
                description={featuredVideo.description}
                duration={featuredVideo.duration}
                thumbnail={featuredVideo.thumbnail}
                videoUrl={'videoUrl' in featuredVideo ? featuredVideo.videoUrl : undefined}
            />
            
            <div className="space-y-6">
              <div>
                {featuredVideo.category && (
                  <Badge variant="secondary" className="mb-3">
                    {featuredVideo.category}
                  </Badge>
                )}
                <h3 className="text-2xl font-bold mb-3">{featuredVideo.title}</h3>
                <p className="text-muted-foreground mb-6">{featuredVideo.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredVideo.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Beginner Friendly
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Most Popular
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link to="/demo">
                  <Button size="lg" className="w-full sm:w-auto">
                    Try It Yourself
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/demo-video">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    View All Videos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Grid layout for multiple videos
  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{description}</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videosToShow.map((video, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <VideoPlayer
                  title={video.title}
                  description={video.description}
                  duration={video.duration}
                  thumbnail={video.thumbnail}
                  videoUrl={'videoUrl' in video ? video.videoUrl : undefined}
                  showControls={false}
                  className="border-0"
                />
              </div>
              
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  {video.category && (
                    <Badge variant="secondary" className="text-xs">
                      {video.category}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {video.duration}
                  </div>
                </div>
                <CardTitle className="text-lg">{video.title}</CardTitle>
                <CardDescription>{video.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  <Play className="h-3 w-3 mr-2" />
                  Watch Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};