import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Plus } from "lucide-react";

interface ProviderDashboardProps {
  onServiceCreated: () => void;
}

export function ProviderDashboard({ onServiceCreated }: ProviderDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">My Services</h2>
          <p className="text-muted-foreground">Manage your service offerings and bookings</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Service
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Services Yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first service to start offering your skills to the community
          </p>
          <Button variant="outline">
            Create Service
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}