import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface WeddingBudgetTrackerProps {
  weddingId: string;
  totalBudget: number;
}

interface BudgetCategory {
  category: string;
  allocated: number;
  spent: number;
  planned: number;
}

export const WeddingBudgetTracker: React.FC<WeddingBudgetTrackerProps> = ({
  weddingId,
  totalBudget
}) => {
  const [budgetData, setBudgetData] = useState<BudgetCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBudgetData();
  }, [weddingId]);

  const loadBudgetData = async () => {
    setIsLoading(true);
    try {
      // Get tasks with costs by category
      const { data: tasks, error } = await supabase
        .from('wedding_tasks')
        .select('category, estimated_cost, actual_cost, completed')
        .eq('couple_id', weddingId);

      if (error) throw error;

      // Group and calculate budget by category
      const categoryData = tasks?.reduce((acc, task) => {
        const category = task.category;
        if (!acc[category]) {
          acc[category] = {
            category,
            allocated: 0,
            spent: 0,
            planned: 0
          };
        }

        const estimatedCost = task.estimated_cost || 0;
        const actualCost = task.actual_cost || 0;

        acc[category].planned += estimatedCost;
        if (task.completed && actualCost > 0) {
          acc[category].spent += actualCost;
        } else {
          acc[category].allocated += estimatedCost;
        }

        return acc;
      }, {} as Record<string, BudgetCategory>) || {};

      // Convert to array and add suggested budget allocation if no data
      let categories = Object.values(categoryData);
      
      if (categories.length === 0) {
        // Default budget allocation percentages
        const defaultAllocations = [
          { category: 'venue', percentage: 30 },
          { category: 'catering', percentage: 25 },
          { category: 'photography', percentage: 10 },
          { category: 'flowers', percentage: 8 },
          { category: 'music', percentage: 7 },
          { category: 'attire', percentage: 5 },
          { category: 'transportation', percentage: 3 },
          { category: 'invitations', percentage: 2 },
          { category: 'other', percentage: 10 }
        ];

        categories = defaultAllocations.map(item => ({
          category: item.category,
          allocated: Math.round((totalBudget * item.percentage) / 100),
          spent: 0,
          planned: Math.round((totalBudget * item.percentage) / 100)
        }));
      }

      setBudgetData(categories);
    } catch (error) {
      console.error('Error loading budget data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalSpent = budgetData.reduce((sum, category) => sum + category.spent, 0);
  const totalAllocated = budgetData.reduce((sum, category) => sum + category.allocated, 0);
  const totalPlanned = budgetData.reduce((sum, category) => sum + category.planned, 0);
  const budgetUsed = totalBudget > 0 ? ((totalSpent + totalAllocated) / totalBudget) * 100 : 0;
  const remainingBudget = totalBudget - totalSpent - totalAllocated;

  const pieChartData = budgetData.map(category => ({
    name: category.category.charAt(0).toUpperCase() + category.category.slice(1),
    value: category.spent + category.allocated,
    spent: category.spent,
    allocated: category.allocated
  }));

  const barChartData = budgetData.map(category => ({
    category: category.category.charAt(0).toUpperCase() + category.category.slice(1),
    planned: category.planned / 100,
    spent: category.spent / 100,
    remaining: (category.planned - category.spent) / 100
  }));

  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88',
    '#ff8042', '#0088fe', '#00c49f', '#ffbb28', '#ff6b6b'
  ];

  const getBudgetStatus = () => {
    if (budgetUsed > 100) return { color: 'text-red-600', icon: TrendingUp, status: 'Over Budget' };
    if (budgetUsed > 90) return { color: 'text-yellow-600', icon: AlertTriangle, status: 'Near Limit' };
    return { color: 'text-green-600', icon: TrendingDown, status: 'On Track' };
  };

  const budgetStatus = getBudgetStatus();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Budget Tracker</h3>
        <p className="text-muted-foreground">Monitor your wedding expenses and budget allocation</p>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">${(totalBudget / 100).toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-red-600">${(totalSpent / 100).toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-green-600">${(remainingBudget / 100).toLocaleString()}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Used</p>
                <p className={`text-2xl font-bold ${budgetStatus.color}`}>{budgetUsed.toFixed(1)}%</p>
                <Badge className={budgetStatus.color}>
                  {budgetStatus.status}
                </Badge>
              </div>
              <budgetStatus.icon className={`h-8 w-8 ${budgetStatus.color}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
          <CardDescription>
            Overall budget utilization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Budget Used</span>
              <span>{budgetUsed.toFixed(1)}%</span>
            </div>
            <Progress value={budgetUsed} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${(totalSpent / 100).toLocaleString()} spent</span>
              <span>${(totalAllocated / 100).toLocaleString()} allocated</span>
              <span>${(remainingBudget / 100).toLocaleString()} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Distribution</CardTitle>
            <CardDescription>Budget allocation by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`$${(value / 100).toLocaleString()}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Planned vs actual spending</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, '']} />
                <Bar dataKey="planned" fill="#8884d8" name="Planned" />
                <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Detailed budget information by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetData.map((category, index) => {
              const categoryTotal = category.spent + category.allocated;
              const categoryProgress = category.planned > 0 ? (categoryTotal / category.planned) * 100 : 0;
              
              return (
                <div key={category.category} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium capitalize">{category.category}</h4>
                    <Badge 
                      variant="outline"
                      className={categoryProgress > 100 ? 'border-red-500 text-red-700' : ''}
                    >
                      {categoryProgress.toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={Math.min(categoryProgress, 100)} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Planned: ${(category.planned / 100).toLocaleString()}</span>
                      <span>Spent: ${(category.spent / 100).toLocaleString()}</span>
                      <span>Allocated: ${(category.allocated / 100).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};