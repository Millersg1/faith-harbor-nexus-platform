import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, DollarSign, Users, Calendar, Target, Brain, Download, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BusinessIntelligence = () => {
  const [timeRange, setTimeRange] = useState("12months");
  const [selectedMetric, setSelectedMetric] = useState("overview");
  const { toast } = useToast();

  // Predictive Analytics Data
  const donationForecast = [
    { month: 'Jan', actual: 12000, predicted: 12500, upper: 13200, lower: 11800 },
    { month: 'Feb', actual: 11500, predicted: 11800, upper: 12500, lower: 11100 },
    { month: 'Mar', actual: 13200, predicted: 13000, upper: 13700, lower: 12300 },
    { month: 'Apr', actual: null, predicted: 13500, upper: 14200, lower: 12800 },
    { month: 'May', actual: null, predicted: 14000, upper: 14800, lower: 13200 },
    { month: 'Jun', actual: null, predicted: 14200, upper: 15000, lower: 13400 }
  ];

  const attendanceForecast = [
    { month: 'Jan', actual: 450, predicted: 465, seasonal: 440 },
    { month: 'Feb', actual: 440, predicted: 445, seasonal: 430 },
    { month: 'Mar', actual: 480, predicted: 475, seasonal: 460 },
    { month: 'Apr', actual: null, predicted: 490, seasonal: 475 },
    { month: 'May', actual: null, predicted: 510, seasonal: 495 },
    { month: 'Jun', actual: null, predicted: 520, seasonal: 505 }
  ];

  const memberLifecycle = [
    { stage: 'Visitor', count: 120, retention: 35, avgDays: 0 },
    { stage: 'First Time', count: 42, retention: 60, avgDays: 7 },
    { stage: 'Regular Attendee', count: 25, retention: 80, avgDays: 45 },
    { stage: 'Member', count: 20, retention: 95, avgDays: 120 },
    { stage: 'Active Volunteer', count: 12, retention: 98, avgDays: 365 }
  ];

  const financialProjections = [
    { category: 'General Fund', current: 45000, projected: 52000, variance: 15.6 },
    { category: 'Building Fund', current: 23000, projected: 28000, variance: 21.7 },
    { category: 'Missions', current: 8500, projected: 9200, variance: 8.2 },
    { category: 'Youth Ministry', current: 3200, projected: 3800, variance: 18.8 }
  ];

  const engagementMetrics = [
    { category: 'Sunday Service', engagement: 92, trend: 'up' },
    { category: 'Small Groups', engagement: 68, trend: 'up' },
    { category: 'Events', engagement: 54, trend: 'stable' },
    { category: 'Volunteering', engagement: 31, trend: 'down' },
    { category: 'Online Content', engagement: 78, trend: 'up' }
  ];

  const riskFactors = [
    { factor: 'Member Churn Rate', risk: 'medium', value: '12%', trend: 'increasing' },
    { factor: 'Donation Volatility', risk: 'low', value: '8%', trend: 'stable' },
    { factor: 'Volunteer Burnout', risk: 'high', value: '23%', trend: 'increasing' },
    { factor: 'Seasonal Attendance Drop', risk: 'medium', value: '15%', trend: 'stable' }
  ];

  const generateReport = () => {
    toast({
      title: "Report Generated",
      description: "Business intelligence report has been generated and will be emailed to you.",
    });
  };

  const exportData = () => {
    toast({
      title: "Data Exported",
      description: "Analytics data has been exported to CSV format.",
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up' || trend === 'increasing') return '↗️';
    if (trend === 'down' || trend === 'decreasing') return '↘️';
    return '➡️';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Business Intelligence</h1>
            <p className="text-muted-foreground">Advanced analytics and predictive insights</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="2years">Last 2 Years</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={generateReport}>
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="lifecycle">Member Lifecycle</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-scale">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Predictive Score</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">87%</div>
                <p className="text-xs text-muted-foreground">Growth prediction accuracy</p>
                <Progress value={87} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Revenue Forecast</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+15.2%</div>
                <p className="text-xs text-muted-foreground">Next quarter projection</p>
                <div className="text-sm text-green-600 mt-1">↗️ Strong growth expected</div>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Member Retention</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">92.3%</div>
                <p className="text-xs text-muted-foreground">12-month retention rate</p>
                <div className="text-sm text-blue-600 mt-1">➡️ Stable retention</div>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Engagement Index</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">78</div>
                <p className="text-xs text-muted-foreground">Overall engagement score</p>
                <div className="text-sm text-purple-600 mt-1">↗️ Improving engagement</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {engagementMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium">{metric.category}</span>
                        <span className="text-xs">{getTrendIcon(metric.trend)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={metric.engagement} className="w-20" />
                        <span className="text-sm font-medium w-8">{metric.engagement}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Average Donation</span>
                    <span className="font-bold text-green-600">$127.50</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Weekly Attendance</span>
                    <span className="font-bold text-blue-600">487</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Active Volunteers</span>
                    <span className="font-bold text-purple-600">156</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium">Small Group Participation</span>
                    <span className="font-bold text-orange-600">68%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation Forecasting</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={donationForecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`$${value}`, name]} />
                    <Area type="monotone" dataKey="upper" stackId="1" stroke="none" fill="hsl(var(--primary))" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="lower" stackId="1" stroke="none" fill="white" />
                    <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))' }} />
                    <Line type="monotone" dataKey="predicted" stroke="hsl(var(--secondary))" strokeDasharray="5 5" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceForecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))' }} />
                    <Line type="monotone" dataKey="predicted" stroke="hsl(var(--secondary))" strokeDasharray="5 5" strokeWidth={2} />
                    <Line type="monotone" dataKey="seasonal" stroke="hsl(var(--accent))" strokeWidth={1} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Projections by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {financialProjections.map((projection, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">{projection.category}</h3>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Current: ${projection.current.toLocaleString()}</div>
                      <div className="text-sm font-medium">Projected: ${projection.projected.toLocaleString()}</div>
                      <div className={`text-sm font-bold ${projection.variance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {projection.variance > 0 ? '+' : ''}{projection.variance}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifecycle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Member Journey Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memberLifecycle.map((stage, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div>
                        <div className="font-semibold">{stage.stage}</div>
                        <div className="text-sm text-muted-foreground">Average: {stage.avgDays} days</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{stage.count} people</div>
                      <div className="text-sm text-muted-foreground">{stage.retention}% retention</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={memberLifecycle} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="stage" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retention Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={memberLifecycle}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Retention Rate']} />
                    <Bar dataKey="retention" fill="hsl(var(--secondary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+18.5%</div>
                <p className="text-sm text-muted-foreground">Year over year</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cost per Member</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45.20</div>
                <p className="text-sm text-muted-foreground">Monthly average</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">ROI on Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">340%</div>
                <p className="text-sm text-muted-foreground">Overall return</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Health Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Revenue Streams</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tithes & Offerings</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Special Events</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fundraising</span>
                      <span className="font-medium">8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Income</span>
                      <span className="font-medium">5%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Expense Categories</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Staff & Benefits</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Facilities</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Programs</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Administrative</span>
                      <span className="font-medium">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskFactors.map((risk, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(risk.risk)}`}>
                        {risk.risk.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">{risk.factor}</div>
                        <div className="text-sm text-muted-foreground">Current: {risk.value}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{getTrendIcon(risk.trend)} {risk.trend}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mitigation Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-800">Member Engagement</div>
                    <div className="text-sm text-blue-700">Implement personalized follow-up programs</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-800">Financial Diversification</div>
                    <div className="text-sm text-green-700">Develop multiple revenue streams</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-800">Volunteer Support</div>
                    <div className="text-sm text-purple-700">Create volunteer appreciation programs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Early Warning Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Donation Variance</span>
                    <Badge variant="secondary">Normal</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Attendance Decline</span>
                    <Badge variant="outline">Watch</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Member Complaints</span>
                    <Badge variant="destructive">Alert</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessIntelligence;