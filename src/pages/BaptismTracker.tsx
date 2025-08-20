import React from 'react';
import { BaptismDashboard } from '@/components/baptism/BaptismDashboard';

export default function BaptismTracker() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <BaptismDashboard />
      </div>
    </div>
  );
}