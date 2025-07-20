import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, DollarSign, User } from "lucide-react";
import { ServiceBookingDialog } from "./ServiceBookingDialog";

interface Service {
  id: string;
  title: string;
  short_description: string | null;
  price_type: string;
  price_amount: number | null;
  hourly_rate: number | null;
  location_type: string;
  images: any;
  created_at: string;
  provider?: {
    business_name: string | null;
    user_id: string;
    average_rating: number;
    total_reviews: number;
  } | null;
  category?: {
    name: string;
    icon_name: string | null;
  } | null;
}

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const formatPrice = () => {
    if (service.price_type === 'quote') return 'Quote';
    if (service.price_type === 'donation') return 'Donation';
    if (service.price_type === 'hourly' && service.hourly_rate) {
      return `$${(service.hourly_rate / 100).toFixed(2)}/hr`;
    }
    if (service.price_amount) {
      return `$${(service.price_amount / 100).toFixed(2)}`;
    }
    return 'Contact for price';
  };

  const getLocationBadgeColor = () => {
    switch (service.location_type) {
      case 'online':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_person':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'both':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{service.title}</CardTitle>
            {service.category && (
              <Badge variant="secondary" className="text-xs mb-2">
                {service.category.name}
              </Badge>
            )}
          </div>
          <Badge className={getLocationBadgeColor()}>
            <MapPin className="h-3 w-3 mr-1" />
            {service.location_type.replace('_', ' ')}
          </Badge>
        </div>
        
        {service.short_description && (
          <CardDescription className="line-clamp-2">
            {service.short_description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Provider Info */}
        {service.provider && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {service.provider.business_name || 'Service Provider'}
              </span>
            </div>
            {service.provider.total_reviews > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">
                  {service.provider.average_rating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({service.provider.total_reviews})
                </span>
              </div>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-semibold text-foreground">
              {formatPrice()}
            </span>
          </div>
          {service.price_type === 'fixed' && (
            <span className="text-xs text-muted-foreground">Fixed Price</span>
          )}
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" size="sm">
            View Details
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsBookingOpen(true)}>
            Book Now
          </Button>
        </div>
        
        <ServiceBookingDialog
          service={service}
          open={isBookingOpen}
          onOpenChange={setIsBookingOpen}
        />
      </CardContent>
    </Card>
  );
}