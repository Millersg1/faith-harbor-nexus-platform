import { corsHeaders } from '../_shared/cors.ts'

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
const TWILIO_FLEX_WORKSPACE_SID = Deno.env.get('TWILIO_FLEX_WORKSPACE_SID')
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER')

interface FlexTaskRequest {
  action: 'create_task' | 'update_task' | 'get_tasks' | 'get_workers' | 'send_sms'
  data?: any
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FLEX_WORKSPACE_SID) {
      throw new Error('Missing Twilio credentials')
    }

    const { action, data }: FlexTaskRequest = await req.json()
    console.log(`Twilio Flex action: ${action}`, data)

    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
    const baseUrl = `https://taskrouter.twilio.com/v1/Workspaces/${TWILIO_FLEX_WORKSPACE_SID}`

    let response

    switch (action) {
      case 'create_task':
        response = await createTask(baseUrl, auth, data)
        break
      case 'update_task':
        response = await updateTask(baseUrl, auth, data)
        break
      case 'get_tasks':
        response = await getTasks(baseUrl, auth, data)
        break
      case 'get_workers':
        response = await getWorkers(baseUrl, auth)
        break
      case 'send_sms':
        response = await sendSMS(auth, data)
        break
      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Twilio Flex error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.stack 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function createTask(baseUrl: string, auth: string, data: any) {
  const taskAttributes = {
    type: data.type || 'support',
    priority: data.priority || 1,
    name: data.name || 'Church Support Request',
    description: data.description || '',
    contact: data.contact || {},
    ...data.attributes
  }

  const formData = new URLSearchParams({
    Attributes: JSON.stringify(taskAttributes),
    WorkflowSid: data.workflowSid || TWILIO_FLEX_WORKSPACE_SID,
    TaskChannel: data.taskChannel || 'default'
  })

  if (data.timeout) {
    formData.append('Timeout', data.timeout.toString())
  }

  const response = await fetch(`${baseUrl}/Tasks`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to create task: ${response.status} ${errorText}`)
  }

  return await response.json()
}

async function updateTask(baseUrl: string, auth: string, data: any) {
  const { taskSid, ...updateData } = data
  
  const formData = new URLSearchParams()
  
  if (updateData.assignmentStatus) {
    formData.append('AssignmentStatus', updateData.assignmentStatus)
  }
  
  if (updateData.reason) {
    formData.append('Reason', updateData.reason)
  }

  if (updateData.attributes) {
    formData.append('Attributes', JSON.stringify(updateData.attributes))
  }

  const response = await fetch(`${baseUrl}/Tasks/${taskSid}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to update task: ${response.status} ${errorText}`)
  }

  return await response.json()
}

async function getTasks(baseUrl: string, auth: string, data: any = {}) {
  const params = new URLSearchParams()
  
  if (data.assignmentStatus) {
    params.append('AssignmentStatus', data.assignmentStatus)
  }
  
  if (data.priority) {
    params.append('Priority', data.priority.toString())
  }

  if (data.limit) {
    params.append('PageSize', data.limit.toString())
  }

  const url = `${baseUrl}/Tasks${params.toString() ? '?' + params.toString() : ''}`
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Basic ${auth}`,
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get tasks: ${response.status} ${errorText}`)
  }

  return await response.json()
}

async function getWorkers(baseUrl: string, auth: string) {
  const response = await fetch(`${baseUrl}/Workers`, {
    headers: {
      'Authorization': `Basic ${auth}`,
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get workers: ${response.status} ${errorText}`)
  }

  return await response.json()
}

async function sendSMS(auth: string, data: any) {
  const { to, message, from } = data
  
  const formData = new URLSearchParams({
    To: to,
    From: from || TWILIO_PHONE_NUMBER || '',
    Body: message
  })

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to send SMS: ${response.status} ${errorText}`)
  }

  return await response.json()
}