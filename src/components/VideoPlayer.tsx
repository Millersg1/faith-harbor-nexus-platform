import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  Settings,
  Download,
  Share2,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  title?: string;
  description?: string;
  duration?: string;
  thumbnail?: string;
  videoUrl?: string;
  className?: string;
  showControls?: boolean;
  autoPlay?: boolean;
  isDemo?: boolean;
}

export const VideoPlayer = ({ 
  title = "Video Player",
  description = "Play video content",
  duration = "2:00",
  thumbnail,
  videoUrl,
  className,
  showControls = true,
  autoPlay = false,
  isDemo = false
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const updateTime = () => setCurrentTime(video.currentTime);
      const updateDuration = () => setTotalDuration(video.duration);
      
      video.addEventListener('timeupdate', updateTime);
      video.addEventListener('loadedmetadata', updateDuration);
      video.addEventListener('loadstart', () => setIsLoading(true));
      video.addEventListener('canplay', () => setIsLoading(false));
      
      return () => {
        video.removeEventListener('timeupdate', updateTime);
        video.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative group">
        {/* Video Container */}
        <div className="relative aspect-video bg-slate-900">
          {videoUrl ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster={thumbnail}
              autoPlay={autoPlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            // Placeholder for demo/no video
            <div className="w-full h-full flex items-center justify-center">
              {thumbnail ? (
                <img 
                  src={thumbnail} 
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto hover:bg-white/30 transition-colors cursor-pointer backdrop-blur-sm">
                    <Play className="h-8 w-8 ml-1" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-white/80">{description}</p>
                </div>
              )}
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}

          {/* Play Button Overlay */}
          {!isPlaying && !isLoading && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={togglePlay}
            >
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                <Play className="h-6 w-6 ml-1 text-slate-900" />
              </div>
            </div>
          )}

          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {duration && (
              <Badge variant="secondary" className="bg-black/50 text-white border-none">
                <Clock className="h-3 w-3 mr-1" />
                {duration}
              </Badge>
            )}
            <Button size="sm" variant="secondary" className="bg-black/50 hover:bg-black/70 text-white border-none">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="bg-black/50 hover:bg-black/70 text-white border-none">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Bottom Controls */}
          {showControls && videoUrl && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Progress Bar */}
              <div className="w-full bg-white/20 h-1 rounded-full mb-3">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>

                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(totalDuration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-white hover:bg-white/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};