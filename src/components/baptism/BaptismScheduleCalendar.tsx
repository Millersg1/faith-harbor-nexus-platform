import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Baptism {
  id: string;
  candidate_name: string;
  baptism_date: string;
  sacrament_type: string;
  location: string;
  status: string;
}

interface BaptismScheduleCalendarProps {
  baptisms: Baptism[];
  onRefresh: () => void;
}

export const BaptismScheduleCalendar: React.FC<BaptismScheduleCalendarProps> = ({
  baptisms
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'postponed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSacramentIcon = (type: string) => {
    switch (type) {
      case 'baptism': return '💧';
      case 'confirmation': return '✋';
      case 'communion': return '🍞';
      case 'dedication': return '🙏';
      case 'blessing': return '✨';
      default: return '⛪';
    }
  };

  // Group baptisms by date
  const groupedBaptisms = baptisms.reduce((acc, baptism) => {
    const date = new Date(baptism.baptism_date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(baptism);
    return acc;
  }, {} as Record<string, Baptism[]>);

  const sortedDates = Object.keys(groupedBaptisms).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Baptism Schedule</h3>
          <p className="text-muted-foreground">View all scheduled baptisms and sacraments</p>
        </div>
      </div>

      {sortedDates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No Baptisms Scheduled</h3>
            <p className="text-muted-foreground">
              Schedule baptisms to see them appear in the calendar
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardTitle>
                <CardDescription>
                  {groupedBaptisms[date].length} sacrament{groupedBaptisms[date].length !== 1 ? 's' : ''} scheduled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedBaptisms[date].map((baptism) => (
                    <div
                      key={baptism.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getSacramentIcon(baptism.sacrament_type)}</span>
                          <h4 className="font-medium">{baptism.candidate_name}</h4>
                        </div>
                        <Badge className={getStatusColor(baptism.status)}>
                          {baptism.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><strong>Type:</strong> {baptism.sacrament_type.charAt(0).toUpperCase() + baptism.sacrament_type.slice(1)}</p>
                        <p><strong>Location:</strong> {baptism.location}</p>
                        <p><strong>Time:</strong> {new Date(baptism.baptism_date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};