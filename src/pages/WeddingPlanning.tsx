import React from 'react';
import { WeddingPlanningDashboard } from '@/components/wedding/WeddingPlanningDashboard';

export default function WeddingPlanning() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <WeddingPlanningDashboard />
      </div>
    </div>
  );
}