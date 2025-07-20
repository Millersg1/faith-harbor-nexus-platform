import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Calculator, 
  PiggyBank, 
  CreditCard,
  Bot,
  CheckCircle,
  AlertCircle,
  Users,
  Calendar,
  Clock,
  MessageSquare
} from "lucide-react";

interface FinancialGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
}

interface CoachingSession {
  id: string;
  type: 'ai' | 'human';
  title: string;
  duration: string;
  price: number;
  rating: number;
  description: string;
  coach?: string;
}

const FinancialCoaching = () => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const financialGoals: FinancialGoal[] = [
    {
      id: '1',
      title: 'Emergency Fund',
      target: 10000,
      current: 3500,
      deadline: '2024-12-31',
      category: 'Security'
    },
    {
      id: '2',
      title: 'Ministry Trip Fund',
      target: 5000,
      current: 1200,
      deadline: '2024-08-15',
      category: 'Ministry'
    },
    {
      id: '3',
      title: 'Debt Payoff',
      target: 15000,
      current: 8500,
      deadline: '2025-06-30',
      category: 'Debt'
    }
  ];

  const coachingSessions: CoachingSession[] = [
    {
      id: '1',
      type: 'ai',
      title: 'AI Financial Assessment',
      duration: '30 min',
      price: 0,
      rating: 4.9,
      description: 'Comprehensive AI-powered analysis of your financial situation with personalized recommendations.'
    },
    {
      id: '2',
      type: 'human',
      title: 'Personal Budget Review',
      duration: '60 min',
      price: 75,
      rating: 4.8,
      description: 'One-on-one session with a certified financial coach to review and optimize your budget.',
      coach: 'Sarah Johnson, CFP'
    },
    {
      id: '3',
      type: 'human',
      title: 'Debt Freedom Strategy',
      duration: '90 min',
      price: 125,
      rating: 4.9,
      description: 'Comprehensive debt elimination plan with actionable steps and accountability.',
      coach: 'Michael Chen, CPA'
    },
    {
      id: '4',
      type: 'human',
      title: 'Stewardship Planning',
      duration: '45 min',
      price: 60,
      rating: 4.7,
      description: 'Biblical approach to money management and generous giving strategies.',
      coach: 'Pastor David Williams'
    }
  ];

  const calculateFinancialHealth = () => {
    const income = parseFloat(monthlyIncome) || 0;
    const expenses = parseFloat(monthlyExpenses) || 0;
    const surplus = income - expenses;
    const savingsRate = income > 0 ? (surplus / income) * 100 : 0;
    
    return {
      surplus,
      savingsRate,
      healthScore: Math.min(100, Math.max(0, savingsRate * 2))
    };
  };

  const { surplus, savingsRate, healthScore } = calculateFinancialHealth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary rounded-full">
              <Calculator className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold">AI Financial Coaching</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            24/7 AI-powered financial guidance combined with expert human coaching for biblical stewardship and financial freedom
          </p>
          <div className="flex items-center justify-center gap-6">
            <Badge variant="secondary" className="px-4 py-2">
              <Bot className="h-4 w-4 mr-2" />
              AI-Powered Analysis
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              Expert Coaches
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Biblical Principles
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="coaching">Coaching</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          {/* Financial Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Surplus</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${surplus.toFixed(2)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Savings Rate</p>
                      <p className="text-2xl font-bold">
                        {savingsRate.toFixed(1)}%
                      </p>
                    </div>
                    <PiggyBank className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Financial Health</p>
                      <p className="text-2xl font-bold">
                        {healthScore.toFixed(0)}/100
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Goals</p>
                      <p className="text-2xl font-bold">
                        {financialGoals.length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Financial Input */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="income">Monthly Income</Label>
                      <Input
                        id="income"
                        type="number"
                        placeholder="5000"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expenses">Monthly Expenses</Label>
                      <Input
                        id="expenses"
                        type="number"
                        placeholder="3500"
                        value={monthlyExpenses}
                        onChange={(e) => setMonthlyExpenses(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Financial Health Score</Label>
                      <div className="mt-2">
                        <Progress value={healthScore} className="h-3" />
                        <p className="text-sm text-muted-foreground mt-1">
                          {healthScore < 30 ? 'Needs Improvement' : 
                           healthScore < 70 ? 'Good Progress' : 'Excellent'}
                        </p>
                      </div>
                    </div>
                    <Button className="w-full">
                      <Bot className="h-4 w-4 mr-2" />
                      Get AI Analysis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Emergency Fund Priority</h4>
                      <p className="text-muted-foreground">Build your emergency fund to 6 months of expenses before investing.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Reduce Discretionary Spending</h4>
                      <p className="text-muted-foreground">Consider reducing entertainment expenses by $200/month to improve savings rate.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Increase Giving Capacity</h4>
                      <p className="text-muted-foreground">Your improved financial position allows for increased ministry giving.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coaching Sessions */}
          <TabsContent value="coaching" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {coachingSessions.map(session => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {session.type === 'ai' ? <Bot className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                          {session.title}
                        </CardTitle>
                        {session.coach && (
                          <p className="text-sm text-muted-foreground">{session.coach}</p>
                        )}
                      </div>
                      <Badge variant={session.type === 'ai' ? 'secondary' : 'default'}>
                        {session.type === 'ai' ? 'AI' : 'Human'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{session.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{session.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {session.price === 0 ? 'Free' : `$${session.price}`}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-yellow-600">
                        ★ {session.rating}
                      </div>
                    </div>
                    <Button className="w-full">
                      {session.type === 'ai' ? 'Start AI Session' : 'Book Session'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Financial Tools */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Budget Calculator</h3>
                  <p className="text-muted-foreground text-sm">
                    Create and track your monthly budget with AI assistance
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Debt Payoff Planner</h3>
                  <p className="text-muted-foreground text-sm">
                    Strategic debt elimination with snowball and avalanche methods
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <PiggyBank className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Savings Tracker</h3>
                  <p className="text-muted-foreground text-sm">
                    Monitor progress toward your financial goals
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Investment Guide</h3>
                  <p className="text-muted-foreground text-sm">
                    Biblical investing principles and portfolio guidance
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Retirement Planner</h3>
                  <p className="text-muted-foreground text-sm">
                    Plan for a secure financial future in ministry
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Stewardship Guide</h3>
                  <p className="text-muted-foreground text-sm">
                    Biblical money management and generous giving strategies
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Goals */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Financial Goals</h2>
              <Button>
                <Target className="h-4 w-4 mr-2" />
                Add New Goal
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {financialGoals.map(goal => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <Card key={goal.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <Badge variant="outline">{goal.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>${goal.current.toLocaleString()}</span>
                            <span>${goal.target.toLocaleString()}</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <p className="text-sm text-muted-foreground mt-1">
                            {progress.toFixed(1)}% complete
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Target: {new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                        <Button variant="outline" className="w-full">
                          Update Progress
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FinancialCoaching;