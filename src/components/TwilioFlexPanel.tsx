import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTwilioFlex } from '@/hooks/useTwilioFlex'
import { Phone, MessageSquare, Users, Plus, Clock, CheckCircle, AlertCircle, User } from 'lucide-react'
import { format } from 'date-fns'

const TwilioFlexPanel = () => {
  const { loading, tasks, workers, createTask, updateTask, getTasks, getWorkers, sendSMS } = useTwilioFlex()
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false)
  const [taskForm, setTaskForm] = useState({
    name: '',
    description: '',
    type: 'support',
    priority: 1,
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  })
  const [smsForm, setSmsForm] = useState({
    phoneNumber: '',
    message: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      await getTasks()
      await getWorkers()
    } catch (error) {
      console.error('Failed to load Flex data:', error)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createTask({
        name: taskForm.name,
        description: taskForm.description,
        type: taskForm.type,
        priority: taskForm.priority,
        contact: {
          name: taskForm.contactName,
          email: taskForm.contactEmail,
          phone: taskForm.contactPhone
        }
      })
      
      setTaskForm({
        name: '',
        description: '',
        type: 'support',
        priority: 1,
        contactName: '',
        contactEmail: '',
        contactPhone: ''
      })
      setIsTaskDialogOpen(false)
      loadData()
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleSendSMS = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await sendSMS(smsForm.phoneNumber, smsForm.message)
      setSmsForm({ phoneNumber: '', message: '' })
      setIsSMSDialogOpen(false)
    } catch (error) {
      console.error('Failed to send SMS:', error)
    }
  }

  const handleUpdateTaskStatus = async (taskSid: string, status: string) => {
    try {
      await updateTask(taskSid, { assignmentStatus: status as any })
      loadData()
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock, label: 'Pending' },
      reserved: { variant: 'default' as const, icon: User, label: 'Reserved' },
      assigned: { variant: 'default' as const, icon: User, label: 'Assigned' },
      completed: { variant: 'default' as const, icon: CheckCircle, label: 'Completed' },
      canceled: { variant: 'destructive' as const, icon: AlertCircle, label: 'Canceled' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-red-600'
    if (priority >= 5) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Twilio Flex Support Center</h2>
          <p className="text-muted-foreground">Manage support tasks and communications</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create Support Task</DialogTitle>
                <DialogDescription>
                  Create a new support task for your team to handle.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-name">Task Name</Label>
                    <Input
                      id="task-name"
                      value={taskForm.name}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Support request title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-type">Type</Label>
                    <Select value={taskForm.type} onValueChange={(value) => setTaskForm(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="pastoral">Pastoral Care</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (1-10)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="10"
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the support request"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Contact Name</Label>
                    <Input
                      id="contact-name"
                      value={taskForm.contactName}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, contactName: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={taskForm.contactEmail}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Phone</Label>
                    <Input
                      id="contact-phone"
                      value={taskForm.contactPhone}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    Create Task
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isSMSDialogOpen} onOpenChange={setIsSMSDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send SMS
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Send SMS</DialogTitle>
                <DialogDescription>
                  Send an SMS message to a community member.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSendSMS} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={smsForm.phoneNumber}
                    onChange={(e) => setSmsForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-message">Message</Label>
                  <Textarea
                    id="sms-message"
                    value={smsForm.message}
                    onChange={(e) => setSmsForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Type your message here..."
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsSMSDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    Send SMS
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workers Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {workers.length === 0 ? (
              <p className="text-muted-foreground text-sm">No workers available</p>
            ) : (
              <div className="space-y-3">
                {workers.slice(0, 5).map((worker) => (
                  <div key={worker.sid} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{worker.friendly_name}</span>
                    <Badge variant={worker.available ? "default" : "secondary"}>
                      {worker.activity_name}
                    </Badge>
                  </div>
                ))}
                {workers.length > 5 && (
                  <p className="text-xs text-muted-foreground">
                    +{workers.length - 5} more workers
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tasks found</p>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.sid} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {task.attributes?.name || 'Support Task'}
                        </span>
                        <span className={`text-xs font-bold ${getPriorityColor(task.priority)}`}>
                          P{task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Created {format(new Date(task.date_created), 'MMM d, h:mm a')}
                      </p>
                      {task.attributes?.contact?.name && (
                        <p className="text-xs text-muted-foreground">
                          Contact: {task.attributes.contact.name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(task.assignment_status)}
                      {task.assignment_status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateTaskStatus(task.sid, 'assigned')}
                          disabled={loading}
                        >
                          Assign
                        </Button>
                      )}
                      {task.assignment_status === 'assigned' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateTaskStatus(task.sid, 'completed')}
                          disabled={loading}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TwilioFlexPanel