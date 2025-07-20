import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function BookingHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Booking History</h2>
        <p className="text-muted-foreground">View your past and upcoming service bookings</p>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Bookings Yet</h3>
          <p className="text-muted-foreground">
            Your service bookings will appear here once you start booking services
          </p>
        </CardContent>
      </Card>
    </div>
  );
}