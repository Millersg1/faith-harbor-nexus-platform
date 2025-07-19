import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, TrendingUp, Receipt, PiggyBank, Calendar, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Budget {
  id: string;
  name: string;
  description?: string;
  fiscal_year: number;
  total_amount: number;
  allocated_amount: number;
  spent_amount: number;
  status: string;
  created_at: string;
}

interface Expense {
  id: string;
  amount: number;
  description: string;
  vendor?: string;
  expense_date: string;
  status: string;
  created_at: string;
}

interface Pledge {
  id: string;
  amount: number;
  frequency: string;
  start_date: string;
  end_date?: string;
  category: string;
  fulfilled_amount: number;
  status: string;
  created_at: string;
}

const FinancialManagement = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isPledgeDialogOpen, setIsPledgeDialogOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    description: "",
    vendor: "",
    expense_date: new Date().toISOString().split('T')[0]
  });
  const [pledgeForm, setPledgeForm] = useState({
    amount: "",
    frequency: "monthly",
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
    category: "general"
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [budgetsResult, expensesResult, pledgesResult] = await Promise.all([
        supabase.from("budgets").select("*").order("fiscal_year", { ascending: false }),
        supabase.from("expenses").select("*").order("expense_date", { ascending: false }),
        supabase.from("pledges").select("*").order("start_date", { ascending: false })
      ]);

      if (budgetsResult.error) throw budgetsResult.error;
      if (expensesResult.error) throw expensesResult.error;
      if (pledgesResult.error) throw pledgesResult.error;

      setBudgets(budgetsResult.data || []);
      setExpenses(expensesResult.data || []);
      setPledges(pledgesResult.data || []);
    } catch (error) {
      console.error("Error fetching financial data:", error);
      toast({
        title: "Error",
        description: "Failed to load financial data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("expenses")
        .insert({
          amount: parseInt(expenseForm.amount) * 100, // Convert to cents
          description: expenseForm.description,
          vendor: expenseForm.vendor || null,
          expense_date: expenseForm.expense_date,
          submitted_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Expense submitted successfully",
      });

      setExpenseForm({
        amount: "",
        description: "",
        vendor: "",
        expense_date: new Date().toISOString().split('T')[0]
      });
      setIsExpenseDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error submitting expense:", error);
      toast({
        title: "Error",
        description: "Failed to submit expense",
        variant: "destructive",
      });
    }
  };

  const handleSubmitPledge = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("pledges")
        .insert({
          amount: parseInt(pledgeForm.amount) * 100, // Convert to cents
          frequency: pledgeForm.frequency,
          start_date: pledgeForm.start_date,
          end_date: pledgeForm.end_date || null,
          category: pledgeForm.category,
          pledger_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pledge created successfully",
      });

      setPledgeForm({
        amount: "",
        frequency: "monthly",
        start_date: new Date().toISOString().split('T')[0],
        end_date: "",
        category: "general"
      });
      setIsPledgeDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error creating pledge:", error);
      toast({
        title: "Error",
        description: "Failed to create pledge",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
      case 'closed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotals = () => {
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.total_amount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent_amount, 0);
    const totalPledges = pledges.reduce((sum, pledge) => sum + pledge.amount, 0);
    const totalFulfilled = pledges.reduce((sum, pledge) => sum + pledge.fulfilled_amount, 0);

    return { totalBudget, totalSpent, totalPledges, totalFulfilled };
  };

  const { totalBudget, totalSpent, totalPledges, totalFulfilled } = calculateTotals();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Financial Management</h1>
          <p className="text-muted-foreground">Track budgets, expenses, and pledges</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Receipt className="mr-2 h-4 w-4" />
                Submit Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit New Expense</DialogTitle>
                <DialogDescription>
                  Submit an expense for review and approval.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitExpense} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the expense..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor (Optional)</Label>
                  <Input
                    id="vendor"
                    value={expenseForm.vendor}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, vendor: e.target.value }))}
                    placeholder="Vendor name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense_date">Expense Date</Label>
                  <Input
                    id="expense_date"
                    type="date"
                    value={expenseForm.expense_date}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, expense_date: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Expense</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isPledgeDialogOpen} onOpenChange={setIsPledgeDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PiggyBank className="mr-2 h-4 w-4" />
                Create Pledge
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Pledge</DialogTitle>
                <DialogDescription>
                  Make a financial commitment to support the church.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitPledge} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pledge_amount">Amount ($)</Label>
                  <Input
                    id="pledge_amount"
                    type="number"
                    step="0.01"
                    value={pledgeForm.amount}
                    onChange={(e) => setPledgeForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <select
                    id="frequency"
                    value={pledgeForm.frequency}
                    onChange={(e) => setPledgeForm(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={pledgeForm.category}
                    onChange={(e) => setPledgeForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., General Fund, Building Fund"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={pledgeForm.start_date}
                      onChange={(e) => setPledgeForm(prev => ({ ...prev, start_date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date (Optional)</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={pledgeForm.end_date}
                      onChange={(e) => setPledgeForm(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsPledgeDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Pledge</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
            {totalBudget > 0 && (
              <Progress value={(totalSpent / totalBudget) * 100} className="mt-2" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pledges</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPledges)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pledges Fulfilled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalFulfilled)}</div>
            {totalPledges > 0 && (
              <Progress value={(totalFulfilled / totalPledges) * 100} className="mt-2" />
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="budgets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="pledges">Pledges</TabsTrigger>
        </TabsList>

        <TabsContent value="budgets">
          <div className="space-y-4">
            {budgets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No budgets found</h3>
                  <p className="text-muted-foreground text-center">
                    Contact an administrator to set up budgets.
                  </p>
                </CardContent>
              </Card>
            ) : (
              budgets.map((budget) => (
                <Card key={budget.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{budget.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Fiscal Year {budget.fiscal_year}
                        </p>
                        {budget.description && (
                          <p className="text-sm text-muted-foreground mt-2">{budget.description}</p>
                        )}
                      </div>
                      <Badge className={getStatusColor(budget.status)}>
                        {budget.status.charAt(0).toUpperCase() + budget.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Total Budget</p>
                        <p className="text-lg font-bold">{formatCurrency(budget.total_amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Allocated</p>
                        <p className="text-lg font-bold">{formatCurrency(budget.allocated_amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Spent</p>
                        <p className="text-lg font-bold">{formatCurrency(budget.spent_amount)}</p>
                      </div>
                    </div>
                    {budget.total_amount > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Budget Utilization</span>
                          <span>{Math.round((budget.spent_amount / budget.total_amount) * 100)}%</span>
                        </div>
                        <Progress value={(budget.spent_amount / budget.total_amount) * 100} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="expenses">
          <div className="space-y-4">
            {expenses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No expenses found</h3>
                  <p className="text-muted-foreground text-center">
                    Submit your first expense using the button above.
                  </p>
                </CardContent>
              </Card>
            ) : (
              expenses.map((expense) => (
                <Card key={expense.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{expense.description}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {expense.vendor && `Vendor: ${expense.vendor} • `}
                          Date: {new Date(expense.expense_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(expense.amount)}</p>
                        <Badge className={getStatusColor(expense.status)}>
                          {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="pledges">
          <div className="space-y-4">
            {pledges.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <PiggyBank className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pledges found</h3>
                  <p className="text-muted-foreground text-center">
                    Create your first pledge using the button above.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pledges.map((pledge) => (
                <Card key={pledge.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {formatCurrency(pledge.amount)}
                          <span className="ml-2 text-sm font-normal text-muted-foreground">
                            {pledge.frequency}
                          </span>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Category: {pledge.category}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Start: {new Date(pledge.start_date).toLocaleDateString()}
                          {pledge.end_date && ` • End: ${new Date(pledge.end_date).toLocaleDateString()}`}
                        </p>
                      </div>
                      <Badge className={getStatusColor(pledge.status)}>
                        {pledge.status.charAt(0).toUpperCase() + pledge.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Fulfilled: {formatCurrency(pledge.fulfilled_amount)}</p>
                        <Progress 
                          value={(pledge.fulfilled_amount / pledge.amount) * 100} 
                          className="mt-2 w-48"
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {Math.round((pledge.fulfilled_amount / pledge.amount) * 100)}%
                        </p>
                        <p className="text-sm text-muted-foreground">Complete</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialManagement;