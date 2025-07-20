import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, MapPin, Users, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { MemorialDetailDialog } from "./MemorialDetailDialog";

interface Memorial {
  id: string;
  deceased_name: string;
  date_of_birth: string | null;
  date_of_passing: string;
  biography: string | null;
  photo_url: string | null;
  service_date: string | null;
  service_location: string | null;
  family_contact_info: string | null;
  memorial_fund_info: string | null;
  created_at: string;
  status: string;
}

interface MemorialCardProps {
  memorial: Memorial;
}

export function MemorialCard({ memorial }: MemorialCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    if (memorial.date_of_birth && memorial.date_of_passing) {
      const birthDate = new Date(memorial.date_of_birth);
      const passingDate = new Date(memorial.date_of_passing);
      const calculatedAge = passingDate.getFullYear() - birthDate.getFullYear();
      setAge(calculatedAge);
    }
  }, [memorial.date_of_birth, memorial.date_of_passing]);

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200 bg-card border border-border">
        <CardHeader className="text-center">
          {memorial.photo_url ? (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-muted">
              <img 
                src={memorial.photo_url} 
                alt={memorial.deceased_name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-muted flex items-center justify-center">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <CardTitle className="text-xl text-foreground">{memorial.deceased_name}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {memorial.date_of_birth && format(new Date(memorial.date_of_birth), "MMMM d, yyyy")} - {format(new Date(memorial.date_of_passing), "MMMM d, yyyy")}
            {age && ` (Age ${age})`}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {memorial.service_date && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Service: {format(new Date(memorial.service_date), "MMMM d, yyyy 'at' h:mm a")}
            </div>
          )}
          
          {memorial.service_location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              {memorial.service_location}
            </div>
          )}

          {memorial.biography && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {memorial.biography}
            </p>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsDetailOpen(true)}
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-2" />
              View Memorial
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsDetailOpen(true)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <MemorialDetailDialog
        memorial={memorial}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </>
  );
}