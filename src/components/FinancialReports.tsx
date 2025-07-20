import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";

interface BudgetCategory {
  id: string;
  name: string;
  description: string;
  allocated_amount: number;
  spent_amount: number;
}

interface Donation {
  id: string;
  amount: number;
  category: string;
  created_at: string;
  donation_type: string;
  anonymous: boolean;
}

interface FinancialReportsProps {
  className?: string;
}

export const FinancialReports = ({ className }: FinancialReportsProps) => {
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [categoriesResult, donationsResult] = await Promise.all([
        supabase.from("budget_categories").select("*"),
        supabase.from("donations").select("*").eq("status", "completed")
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (donationsResult.error) throw donationsResult.error;

      setBudgetCategories(categoriesResult.data || []);
      setDonations(donationsResult.data || []);
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast({
        title: "Error",
        description: "Failed to load financial reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const formatPercent = (value: number) => {
    return `${Math.round(value)}%`;
  };

  // Calculate budget utilization data for charts
  const budgetChartData = budgetCategories.map(category => ({
    name: category.name.length > 15 ? category.name.substring(0, 15) + '...' : category.name,
    allocated: category.allocated_amount / 100,
    spent: category.spent_amount / 100,
    remaining: (category.allocated_amount - category.spent_amount) / 100,
    utilization: category.allocated_amount > 0 ? (category.spent_amount / category.allocated_amount) * 100 : 0
  }));

  // Calculate donation distribution
  const donationsByCategory = donations.reduce((acc, donation) => {
    const category = donation.category || 'general';
    acc[category] = (acc[category] || 0) + donation.amount;
    return acc;
  }, {} as Record<string, number>);

  const donationChartData = Object.entries(donationsByCategory).map(([category, amount]) => ({
    name: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: amount / 100,
    amount: amount
  }));

  // Calculate summary statistics
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.allocated_amount, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent_amount, 0);
  const totalRemaining = totalBudget - totalSpent;
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const monthlyDonations = donations.filter(d => {
    const donationDate = new Date(d.created_at);
    const now = new Date();
    return donationDate.getMonth() === now.getMonth() && 
           donationDate.getFullYear() === now.getFullYear();
  }).reduce((sum, donation) => sum + donation.amount, 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(budgetUtilization)}</div>
            <Progress value={budgetUtilization} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {formatCurrency(totalSpent)} of {formatCurrency(totalBudget)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRemaining)}</div>
            <div className={`flex items-center text-xs ${budgetUtilization > 80 ? 'text-red-600' : 'text-green-600'}`}>
              {budgetUtilization > 80 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {budgetUtilization > 80 ? 'High utilization' : 'On track'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDonations)}</div>
            <p className="text-xs text-muted-foreground">
              All time donations received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyDonations)}</div>
            <p className="text-xs text-muted-foreground">
              Donations this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="budget" className="space-y-4">
        <TabsList>
          <TabsTrigger value="budget" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Budget Analysis
          </TabsTrigger>
          <TabsTrigger value="donations" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Donation Distribution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={budgetChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value) * 100)} />
                  <Legend />
                  <Bar dataKey="allocated" fill="#8884d8" name="Allocated" />
                  <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Categories Detail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetCategories.map((category) => {
                  const utilization = category.allocated_amount > 0 
                    ? (category.spent_amount / category.allocated_amount) * 100 
                    : 0;
                  const remaining = category.allocated_amount - category.spent_amount;
                  
                  return (
                    <div key={category.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{category.name}</h4>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                        <Badge 
                          variant={utilization > 90 ? "destructive" : utilization > 75 ? "secondary" : "default"}
                        >
                          {formatPercent(utilization)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <Progress value={utilization} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Spent: {formatCurrency(category.spent_amount)}</span>
                          <span>Remaining: {formatCurrency(remaining)}</span>
                          <span>Allocated: {formatCurrency(category.allocated_amount)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Donations by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={donationChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {donationChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value) * 100)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donationChartData
                    .sort((a, b) => b.amount - a.amount)
                    .map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">{formatCurrency(category.amount)}</span>
                          <span className="text-muted-foreground ml-2">
                            ({((category.amount / totalDonations) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};