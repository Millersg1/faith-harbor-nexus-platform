import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from './use-toast'

interface FlexTask {
  sid: string
  attributes: any
  assignment_status: string
  priority: number
  reason?: string
  date_created: string
  date_updated: string
}

interface FlexWorker {
  sid: string
  friendly_name: string
  activity_name: string
  available: boolean
}

export const useTwilioFlex = () => {
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState<FlexTask[]>([])
  const [workers, setWorkers] = useState<FlexWorker[]>([])
  const { toast } = useToast()

  const callFlexFunction = async (action: string, data?: any) => {
    setLoading(true)
    try {
      const { data: result, error } = await supabase.functions.invoke('twilio-flex-integration', {
        body: { action, data }
      })

      if (error) throw error
      return result
    } catch (error) {
      console.error('Flex function error:', error)
      toast({
        title: 'Error',
        description: 'Failed to communicate with Twilio Flex',
        variant: 'destructive'
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: {
    type?: string
    priority?: number
    name: string
    description: string
    contact: {
      name?: string
      email?: string
      phone?: string
    }
    attributes?: any
  }) => {
    try {
      const result = await callFlexFunction('create_task', taskData)
      toast({
        title: 'Success',
        description: 'Support task created successfully'
      })
      return result
    } catch (error) {
      throw error
    }
  }

  const updateTask = async (taskSid: string, updates: {
    assignmentStatus?: 'pending' | 'reserved' | 'assigned' | 'canceled' | 'completed'
    reason?: string
    attributes?: any
  }) => {
    try {
      const result = await callFlexFunction('update_task', { taskSid, ...updates })
      toast({
        title: 'Success',
        description: 'Task updated successfully'
      })
      return result
    } catch (error) {
      throw error
    }
  }

  const getTasks = async (filters?: {
    assignmentStatus?: string
    priority?: number
    limit?: number
  }) => {
    try {
      const result = await callFlexFunction('get_tasks', filters)
      setTasks(result.tasks || [])
      return result
    } catch (error) {
      throw error
    }
  }

  const getWorkers = async () => {
    try {
      const result = await callFlexFunction('get_workers')
      setWorkers(result.workers || [])
      return result
    } catch (error) {
      throw error
    }
  }

  const sendSMS = async (phoneNumber: string, message: string, fromNumber?: string) => {
    try {
      const result = await callFlexFunction('send_sms', {
        to: phoneNumber,
        message,
        from: fromNumber
      })
      toast({
        title: 'Success',
        description: 'SMS sent successfully'
      })
      return result
    } catch (error) {
      throw error
    }
  }

  return {
    loading,
    tasks,
    workers,
    createTask,
    updateTask,
    getTasks,
    getWorkers,
    sendSMS
  }
}