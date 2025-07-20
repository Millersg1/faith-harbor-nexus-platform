import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Zap, TrendingUp, BarChart3, Clock, CheckCircle, AlertCircle, Database, Cpu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PerformanceOptimization = () => {
  const [optimizationScore, setOptimizationScore] = useState(78);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const performanceMetrics = [
    {
      name: 'Page Load Time',
      current: '2.3s',
      target: '< 2.0s',
      score: 75,
      trend: 'improving'
    },
    {
      name: 'Database Queries',
      current: '45ms avg',
      target: '< 50ms',
      score: 90,
      trend: 'stable'
    },
    {
      name: 'Memory Usage',
      current: '234MB',
      target: '< 512MB',
      score: 85,
      trend: 'stable'
    },
    {
      name: 'API Response Time',
      current: '120ms',
      target: '< 200ms',
      score: 92,
      trend: 'improving'
    }
  ];

  const optimizationRecommendations = [
    {
      category: 'Database',
      title: 'Optimize Query Performance',
      description: 'Add indexes to frequently queried columns in donations and events tables',
      impact: 'high',
      effort: 'medium',
      status: 'pending'
    },
    {
      category: 'Caching',
      title: 'Implement Redis Caching',
      description: 'Cache frequently accessed data like member profiles and event details',
      impact: 'high',
      effort: 'high',
      status: 'in-progress'
    },
    {
      category: 'Frontend',
      title: 'Enable Code Splitting',
      description: 'Split JavaScript bundles for better initial load performance',
      impact: 'medium',
      effort: 'low',
      status: 'completed'
    },
    {
      category: 'Images',
      title: 'Implement Image Optimization',
      description: 'Compress and resize images automatically, use WebP format',
      impact: 'medium',
      effort: 'medium',
      status: 'pending'
    },
    {
      category: 'API',
      title: 'Add Request Rate Limiting',
      description: 'Prevent API abuse and improve response times for legitimate users',
      impact: 'low',
      effort: 'low',
      status: 'completed'
    }
  ];

  const systemResources = {
    cpu: 45,
    memory: 62,
    disk: 34,
    network: 28
  };

  const performanceHistory = [
    { date: '7 days ago', score: 72 },
    { date: '6 days ago', score: 74 },
    { date: '5 days ago', score: 76 },
    { date: '4 days ago', score: 75 },
    { date: '3 days ago', score: 77 },
    { date: '2 days ago', score: 78 },
    { date: '1 day ago', score: 78 },
    { date: 'Today', score: 78 }
  ];

  const runOptimization = async () => {
    setIsOptimizing(true);
    toast({
      title: "Performance Optimization Started",
      description: "Running automated performance improvements...",
    });

    // Simulate optimization process
    setTimeout(() => {
      setOptimizationScore(82);
      setIsOptimizing(false);
      toast({
        title: "Optimization Complete",
        description: "Performance score improved to 82%. Several optimizations applied.",
      });
    }, 5000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp className="h-4 w-4 text-green-500" />;
    return <BarChart3 className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Zap className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Performance Optimization</h1>
            <p className="text-muted-foreground">Monitor and improve system performance</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{optimizationScore}%</div>
            <div className="text-sm text-muted-foreground">Performance Score</div>
          </div>
          <Button onClick={runOptimization} disabled={isOptimizing}>
            <Zap className="h-4 w-4 mr-2" />
            {isOptimizing ? 'Optimizing...' : 'Auto Optimize'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, index) => (
              <Card key={index} className="hover-scale">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                    {getTrendIcon(metric.trend)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{metric.current}</div>
                    <div className="text-sm text-muted-foreground">Target: {metric.target}</div>
                    <Progress value={metric.score} className="h-2" />
                    <div className="text-xs text-right text-muted-foreground">{metric.score}%</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{entry.date}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={entry.score} className="w-32 h-2" />
                      <span className="text-sm font-medium w-8">{entry.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Optimization Recommendations</CardTitle>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(rec.status)}
                        <div>
                          <div className="font-semibold">{rec.title}</div>
                          <Badge variant="outline" className="mt-1">{rec.category}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${getImpactColor(rec.impact)}`}>
                          {rec.impact.toUpperCase()} IMPACT
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {rec.effort} effort
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant={
                        rec.status === 'completed' ? 'default' :
                        rec.status === 'in-progress' ? 'secondary' : 'outline'
                      }>
                        {rec.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                      {rec.status === 'pending' && (
                        <Button size="sm" variant="outline">
                          Implement
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{systemResources.cpu}%</div>
                  <Progress value={systemResources.cpu} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {systemResources.cpu < 70 ? 'Normal' : 'High usage'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{systemResources.memory}%</div>
                  <Progress value={systemResources.memory} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {systemResources.memory < 80 ? 'Normal' : 'High usage'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{systemResources.disk}%</div>
                  <Progress value={systemResources.disk} className="h-2" />
                  <div className="text-xs text-muted-foreground">Plenty of space</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Network I/O</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{systemResources.network}%</div>
                  <Progress value={systemResources.network} className="h-2" />
                  <div className="text-xs text-muted-foreground">Low activity</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resource Optimization Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="font-semibold text-blue-800 dark:text-blue-200">CPU Optimization</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Consider upgrading to a higher CPU tier if usage consistently exceeds 80%
                  </div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="font-semibold text-green-800 dark:text-green-200">Memory Efficiency</div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Current memory usage is optimal. Monitor during peak hours
                  </div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="font-semibold text-purple-800 dark:text-purple-200">Storage Management</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">
                    Implement automated cleanup for old log files and temporary data
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">+5%</div>
                    <div className="text-sm text-muted-foreground">7-day improvement</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-muted-foreground">Optimizations applied</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">98.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime this month</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Recent Optimizations</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>Database query optimization applied</span>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>Image compression enabled</span>
                      <span className="text-sm text-muted-foreground">1 day ago</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>API response caching implemented</span>
                      <span className="text-sm text-muted-foreground">3 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceOptimization;