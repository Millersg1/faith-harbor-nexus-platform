import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SystemHealth {
  database: 'healthy' | 'warning' | 'error';
  api: 'healthy' | 'warning' | 'error';
  storage: 'healthy' | 'warning' | 'error';
  auth: 'healthy' | 'warning' | 'error';
}

interface PerformanceMetrics {
  pageLoad: number;
  apiResponse: number;
  errorRate: number;
  uptime: number;
}

export const MonitoringDashboard: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth>({
    database: 'healthy',
    api: 'healthy',
    storage: 'healthy',
    auth: 'healthy',
  });

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoad: 1.2,
    apiResponse: 150,
    errorRate: 0.1,
    uptime: 99.9,
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'High API response time detected', timestamp: new Date() },
    { id: 2, type: 'info', message: 'Database backup completed successfully', timestamp: new Date(Date.now() - 3600000) },
  ]);

  useEffect(() => {
    // Simulate health checks
    const interval = setInterval(() => {
      // Random health simulation for demo
      const systems: (keyof SystemHealth)[] = ['database', 'api', 'storage', 'auth'];
      const statuses: SystemHealth[keyof SystemHealth][] = ['healthy', 'warning', 'error'];
      
      setHealth(prev => ({
        ...prev,
        [systems[Math.floor(Math.random() * systems.length)]]: 
          statuses[Math.floor(Math.random() * statuses.length)]
      }));
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <Badge variant="outline" className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          System Online
        </Badge>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(health).map(([system, status]) => (
          <Card key={system}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">{system}</CardTitle>
              {getStatusIcon(status)}
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${getStatusColor(status)}`} />
                <span className="text-xs text-muted-foreground capitalize">{status}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Load Time</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pageLoad}s</div>
            <p className="text-xs text-muted-foreground">
              -12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Response</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.apiResponse}ms</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.errorRate}%</div>
            <p className="text-xs text-muted-foreground">
              -2% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uptime}%</div>
            <Progress value={metrics.uptime} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Latest system notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center space-x-4">
                {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                {alert.type === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                {alert.type === 'info' && <CheckCircle className="h-4 w-4 text-blue-500" />}
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {alert.timestamp.toLocaleString()}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {alert.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};