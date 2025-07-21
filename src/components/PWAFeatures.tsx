import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Wifi, 
  Bell, 
  Download, 
  Zap, 
  Shield,
  Home,
  RotateCcw
} from 'lucide-react';

export const PWAFeatures = () => {
  const features = [
    {
      icon: Smartphone,
      title: 'Mobile App Experience',
      description: 'Native app-like experience on any device',
      badge: 'Cross-Platform'
    },
    {
      icon: Wifi,
      title: 'Offline Access',
      description: 'Continue using core features without internet',
      badge: 'Always Available'
    },
    {
      icon: Bell,
      title: 'Push Notifications',
      description: 'Stay updated with prayer requests and events',
      badge: 'Real-time'
    },
    {
      icon: Download,
      title: 'Easy Installation',
      description: 'Install directly from your browser',
      badge: 'No App Store'
    },
    {
      icon: Zap,
      title: 'Fast Loading',
      description: 'Lightning-fast performance with caching',
      badge: 'Optimized'
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'HTTPS encryption and secure storage',
      badge: 'Protected'
    },
    {
      icon: Home,
      title: 'Home Screen Access',
      description: 'Add to home screen for quick access',
      badge: 'Convenient'
    },
    {
      icon: RotateCcw,
      title: 'Auto Updates',
      description: 'Automatic updates in the background',
      badge: 'Seamless'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Progressive Web App Features
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience Faith Harbor as a native mobile app with offline capabilities, 
          push notifications, and seamless performance across all devices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <feature.icon className="h-8 w-8 text-primary" />
                <Badge variant="secondary" className="text-xs">
                  {feature.badge}
                </Badge>
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-8 text-primary-foreground text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Install?</h2>
        <p className="text-lg mb-6">
          Get the full Faith Harbor experience on your device. 
          Install our PWA for offline access and native app features.
        </p>
        <div className="space-y-2 text-sm opacity-90">
          <p>📱 Works on iOS, Android, and Desktop</p>
          <p>⚡ No app store required</p>
          <p>🔄 Auto-updates</p>
        </div>
      </div>
    </div>
  );
};