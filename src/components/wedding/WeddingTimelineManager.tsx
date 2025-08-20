import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Calendar as CalendarComponent, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WeddingTask {
  id: string;
  task_name: string;
  description: string;
  due_date: string;
  completed: boolean;
  priority: string;
  category: string;
  estimated_cost: number;
  actual_cost: number;
  notes: string;
}

interface WeddingTimelineManagerProps {
  weddingId: string;
  tasks: WeddingTask[];
  onTasksUpdate: (weddingId: string) => void;
}

export const WeddingTimelineManager: React.FC<WeddingTimelineManagerProps> = ({
  weddingId,
  tasks,
  onTasksUpdate
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<WeddingTask | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    task_name: '',
    description: '',
    due_date: undefined as Date | undefined,
    priority: 'medium',
    category: 'venue',
    estimated_cost: '',
    notes: ''
  });
  const { toast } = useToast();

  const taskCategories = [
    'venue', 'catering', 'photography', 'videography', 'music', 'flowers',
    'transportation', 'invitations', 'decorations', 'attire', 'rings', 
    'ceremony', 'reception', 'honeymoon', 'legal', 'other'
  ];

  const resetForm = () => {
    setFormData({
      task_name: '',
      description: '',
      due_date: undefined,
      priority: 'medium',
      category: 'venue',
      estimated_cost: '',
      notes: ''
    });
    setEditingTask(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const taskData = {
        couple_id: weddingId,
        task_name: formData.task_name,
        description: formData.description,
        due_date: formData.due_date?.toISOString().split('T')[0],
        priority: formData.priority,
        category: formData.category,
        estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) * 100 : null,
        notes: formData.notes
      };

      if (editingTask) {
        const { error } = await supabase
          .from('wedding_tasks')
          .update(taskData)
          .eq('id', editingTask.id);

        if (error) throw error;

        toast({
          title: "Task Updated",
          description: "Wedding task has been updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('wedding_tasks')
          .insert(taskData);

        if (error) throw error;

        toast({
          title: "Task Created",
          description: "Wedding task has been added to your timeline",
        });
      }

      onTasksUpdate(weddingId);
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: "Error",
        description: "Failed to save wedding task",
        variant: "destructive",
      });
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('wedding_tasks')
        .update({ 
          completed: !completed,
          completed_at: !completed ? new Date().toISOString() : null
        })
        .eq('id', taskId);

      if (error) throw error;

      onTasksUpdate(weddingId);
      
      toast({
        title: completed ? "Task Reopened" : "Task Completed",
        description: completed ? "Task has been marked as pending" : "Great progress on your wedding planning!",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase
        .from('wedding_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      onTasksUpdate(weddingId);
      toast({
        title: "Task Deleted",
        description: "Wedding task has been removed",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (task: WeddingTask) => {
    setEditingTask(task);
    setFormData({
      task_name: task.task_name,
      description: task.description || '',
      due_date: task.due_date ? new Date(task.due_date) : undefined,
      priority: task.priority,
      category: task.category,
      estimated_cost: task.estimated_cost ? (task.estimated_cost / 100).toString() : '',
      notes: task.notes || ''
    });
    setShowCreateDialog(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filter === 'all' || 
      (filter === 'completed' && task.completed) || 
      (filter === 'pending' && !task.completed);
    
    const categoryMatch = categoryFilter === 'all' || task.category === categoryFilter;
    
    return statusMatch && categoryMatch;
  });

  const groupTasksByCategory = (tasks: WeddingTask[]) => {
    return tasks.reduce((groups, task) => {
      const category = task.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(task);
      return groups;
    }, {} as Record<string, WeddingTask[]>);
  };

  const groupedTasks = groupTasksByCategory(filteredTasks);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Wedding Timeline</h3>
          <p className="text-muted-foreground">Manage your wedding planning tasks and deadlines</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {taskCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Task Groups */}
      {Object.keys(groupedTasks).length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CalendarComponent className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Tasks Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first wedding planning task
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedTasks).map(([category, categoryTasks]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                <Badge variant="outline">
                  {categoryTasks.filter(t => t.completed).length}/{categoryTasks.length} completed
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categoryTasks.map((task) => (
                <div key={task.id} className={`p-4 border rounded-lg ${task.completed ? 'bg-muted/50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id, task.completed)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.task_name}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          {task.due_date && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <CalendarIcon className="h-3 w-3" />
                              {new Date(task.due_date).toLocaleDateString()}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            {getPriorityIcon(task.priority)}
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          {task.estimated_cost && (
                            <Badge variant="outline">
                              ${(task.estimated_cost / 100).toFixed(2)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(task)}>
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteTask(task.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}

      {/* Create/Edit Task Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        setShowCreateDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            <DialogDescription>
              {editingTask ? 'Update the wedding task details' : 'Add a new task to your wedding timeline'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task_name">Task Name *</Label>
              <Input
                id="task_name"
                value={formData.task_name}
                onChange={(e) => setFormData({ ...formData, task_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.due_date ? format(formData.due_date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.due_date}
                      onSelect={(date) => setFormData({ ...formData, due_date: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated_cost">Estimated Cost ($)</Label>
                <Input
                  id="estimated_cost"
                  type="number"
                  step="0.01"
                  value={formData.estimated_cost}
                  onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};