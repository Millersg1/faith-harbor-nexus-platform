import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  PhoneCall, 
  Mic, 
  MicOff, 
  PlayCircle, 
  PauseCircle,
  StopCircle,
  Volume2,
  Users,
  Calendar,
  Clock,
  MessageSquare,
  Settings,
  Upload,
  Download
} from "lucide-react";

interface RoboCall {
  id: string;
  name: string;
  message: string;
  voice_type: 'male' | 'female' | 'robotic';
  recipients: string[];
  status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_for?: string;
  created_at: string;
  completed_at?: string;
  stats: {
    total: number;
    answered: number;
    voicemail: number;
    failed: number;
  };
}

interface CallLog {
  id: string;
  phone_number: string;
  duration: number;
  status: 'answered' | 'voicemail' | 'failed' | 'busy' | 'no_answer';
  timestamp: string;
  robo_call_id?: string;
}

const RoboCallingSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [roboCalls, setRoboCalls] = useState<RoboCall[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('create');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    voice_type: 'female' as const,
    recipients: '',
    scheduled_for: '',
    send_immediately: true,
    repeat_count: 1,
    retry_failed: true
  });

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    if (user) {
      fetchRoboCalls();
      fetchCallLogs();
    }
  }, [user]);

  const fetchRoboCalls = async () => {
    // Mock data since table might not exist yet
    const mockCalls: RoboCall[] = [
      {
        id: '1',
        name: 'Sunday Service Reminder',
        message: 'This is a reminder that Sunday service starts at 10 AM. We look forward to seeing you there!',
        voice_type: 'female',
        recipients: ['+1234567890', '+1987654321'],
        status: 'completed',
        scheduled_for: new Date().toISOString(),
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        stats: {
          total: 150,
          answered: 85,
          voicemail: 45,
          failed: 20
        }
      }
    ];
    setRoboCalls(mockCalls);
  };

  const fetchCallLogs = async () => {
    // Mock data
    const mockLogs: CallLog[] = [
      {
        id: '1',
        phone_number: '+1234567890',
        duration: 45,
        status: 'answered',
        timestamp: new Date().toISOString(),
        robo_call_id: '1'
      },
      {
        id: '2',
        phone_number: '+1987654321',
        duration: 0,
        status: 'voicemail',
        timestamp: new Date().toISOString(),
        robo_call_id: '1'
      }
    ];
    setCallLogs(mockLogs);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const playRecording = () => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    }
  };

  const createRoboCall = async () => {
    if (!formData.name.trim() || (!formData.message.trim() && !audioBlob)) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and either a text message or audio recording.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.recipients.trim()) {
      toast({
        title: "No Recipients",
        description: "Please provide phone numbers to call.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Parse recipients
      const phoneNumbers = formData.recipients
        .split(/[,\n]/)
        .map(num => num.trim())
        .filter(num => num.length > 0);

      const newCall: RoboCall = {
        id: Date.now().toString(),
        name: formData.name,
        message: formData.message,
        voice_type: formData.voice_type,
        recipients: phoneNumbers,
        status: formData.send_immediately ? 'in_progress' : 'scheduled',
        scheduled_for: formData.send_immediately ? undefined : formData.scheduled_for,
        created_at: new Date().toISOString(),
        stats: {
          total: phoneNumbers.length,
          answered: 0,
          voicemail: 0,
          failed: 0
        }
      };

      // Simulate API call to create robo call
      setRoboCalls(prev => [newCall, ...prev]);

      toast({
        title: "Robo Call Created",
        description: `Your call "${formData.name}" has been ${formData.send_immediately ? 'started' : 'scheduled'}.`,
      });

      // Reset form
      setFormData({
        name: '',
        message: '',
        voice_type: 'female',
        recipients: '',
        scheduled_for: '',
        send_immediately: true,
        repeat_count: 1,
        retry_failed: true
      });
      setAudioBlob(null);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create robo call. Please try again.",
        variant: "destructive",
      });
    }
  };

  const makeManualCall = async (phoneNumber: string) => {
    try {
      // This would integrate with Twilio Voice API
      const response = await supabase.functions.invoke('make-phone-call', {
        body: { 
          to: phoneNumber,
          message: "Hello, this is a call from Faith Harbor Church. Please stay on the line for an important message."
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Call Initiated",
        description: `Calling ${phoneNumber}...`,
      });

      // Add to call logs
      const newLog: CallLog = {
        id: Date.now().toString(),
        phone_number: phoneNumber,
        duration: 0,
        status: 'answered', // This would be updated by webhook
        timestamp: new Date().toISOString()
      };
      setCallLogs(prev => [newLog, ...prev]);

    } catch (error) {
      toast({
        title: "Call Failed",
        description: "Could not initiate call. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'scheduled': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'text-green-600';
      case 'voicemail': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      case 'busy': return 'text-yellow-600';
      case 'no_answer': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <PhoneCall className="h-8 w-8 text-blue-500" />
            <span>Robo Calling System</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Automated voice calls and manual calling features for your church community
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        {[
          { id: 'create', label: 'Create Call', icon: Phone },
          { id: 'campaigns', label: 'Campaigns', icon: Users },
          { id: 'logs', label: 'Call Logs', icon: Clock },
          { id: 'manual', label: 'Manual Call', icon: PhoneCall }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Create Call Tab */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Robo Call</CardTitle>
              <CardDescription>
                Set up an automated voice call campaign for your community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="call-name">Campaign Name</Label>
                <Input
                  id="call-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Sunday Service Reminder"
                />
              </div>

              <div>
                <Label htmlFor="voice-type">Voice Type</Label>
                <Select 
                  value={formData.voice_type} 
                  onValueChange={(value) => setFormData({...formData, voice_type: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female Voice</SelectItem>
                    <SelectItem value="male">Male Voice</SelectItem>
                    <SelectItem value="robotic">Robotic Voice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Message Text</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Hello, this is a reminder that Sunday service starts at 10 AM..."
                  rows={4}
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.message.length}/300 characters
                </p>
              </div>

              <div className="space-y-3">
                <Label>Audio Recording (Optional)</Label>
                <div className="flex items-center space-x-3">
                  {!isRecording ? (
                    <Button 
                      variant="outline" 
                      onClick={startRecording}
                      className="flex items-center space-x-2"
                    >
                      <Mic className="h-4 w-4" />
                      <span>Start Recording</span>
                    </Button>
                  ) : (
                    <Button 
                      variant="destructive" 
                      onClick={stopRecording}
                      className="flex items-center space-x-2"
                    >
                      <MicOff className="h-4 w-4" />
                      <span>Stop Recording</span>
                    </Button>
                  )}
                  
                  {audioBlob && (
                    <Button 
                      variant="outline" 
                      onClick={playRecording}
                      disabled={isPlaying}
                      className="flex items-center space-x-2"
                    >
                      <Volume2 className="h-4 w-4" />
                      <span>Play Recording</span>
                    </Button>
                  )}
                </div>
                {audioBlob && (
                  <p className="text-sm text-green-600">✓ Audio recorded successfully</p>
                )}
              </div>

              <div>
                <Label htmlFor="recipients">Phone Numbers</Label>
                <Textarea
                  id="recipients"
                  value={formData.recipients}
                  onChange={(e) => setFormData({...formData, recipients: e.target.value})}
                  placeholder="+1234567890, +1987654321&#10;One per line or comma separated"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={formData.send_immediately}
                  onCheckedChange={(checked) => setFormData({
                    ...formData, 
                    send_immediately: checked
                  })}
                />
                <span className="text-sm">Send immediately</span>
              </div>

              {!formData.send_immediately && (
                <div>
                  <Label htmlFor="scheduled_for">Schedule for</Label>
                  <Input
                    id="scheduled_for"
                    type="datetime-local"
                    value={formData.scheduled_for}
                    onChange={(e) => setFormData({
                      ...formData, 
                      scheduled_for: e.target.value
                    })}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}

              <Button 
                onClick={createRoboCall} 
                className="w-full"
                size="lg"
              >
                <PhoneCall className="h-5 w-5 mr-2" />
                {formData.send_immediately ? 'Start Calling Now' : 'Schedule Campaign'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Effective Robo Calls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">📞 Best Practices</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Keep messages under 60 seconds</li>
                  <li>• Identify your church at the beginning</li>
                  <li>• Speak clearly and slowly</li>
                  <li>• Include a call-to-action</li>
                  <li>• Test with a small group first</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">⏰ Optimal Call Times</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Weekdays: 10 AM - 12 PM, 2 PM - 4 PM</li>
                  <li>• Evenings: 6 PM - 8 PM</li>
                  <li>• Avoid: Early mornings, late nights, meal times</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">📋 Legal Compliance</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Only call members who opted in</li>
                  <li>• Provide easy opt-out instructions</li>
                  <li>• Maintain do-not-call lists</li>
                  <li>• Follow local telemarketing laws</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Robo Call Campaigns</CardTitle>
              <CardDescription>
                View and manage your automated calling campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {roboCalls.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <PhoneCall className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No campaigns yet</p>
                  <p className="text-sm">Create your first robo call campaign to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {roboCalls.map((call) => (
                    <div key={call.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg">{call.name}</h3>
                            <Badge className={`${getStatusColor(call.status)} text-white`}>
                              {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">{call.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Voice: {call.voice_type}</span>
                            <span>Recipients: {call.recipients.length}</span>
                            <span>Created: {new Date(call.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 pt-3 border-t">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">{call.stats.total}</div>
                          <div className="text-xs text-muted-foreground">Total Calls</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{call.stats.answered}</div>
                          <div className="text-xs text-muted-foreground">Answered</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{call.stats.voicemail}</div>
                          <div className="text-xs text-muted-foreground">Voicemail</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{call.stats.failed}</div>
                          <div className="text-xs text-muted-foreground">Failed</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Call Logs Tab */}
      {activeTab === 'logs' && (
        <Card>
          <CardHeader>
            <CardTitle>Call Logs</CardTitle>
            <CardDescription>
              Detailed log of all outbound calls
            </CardDescription>
          </CardHeader>
          <CardContent>
            {callLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No call logs yet</p>
                <p className="text-sm">Call logs will appear here once you start making calls</p>
              </div>
            ) : (
              <div className="space-y-3">
                {callLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-muted">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{log.phone_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-medium ${getCallStatusColor(log.status)}`}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {log.duration > 0 ? `${log.duration}s` : '0s'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Manual Call Tab */}
      {activeTab === 'manual' && (
        <Card>
          <CardHeader>
            <CardTitle>Manual Phone Call</CardTitle>
            <CardDescription>
              Make individual phone calls to church members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="max-w-md">
              <Label htmlFor="manual-phone">Phone Number</Label>
              <div className="flex items-center space-x-3">
                <Input
                  id="manual-phone"
                  placeholder="+1234567890"
                  type="tel"
                />
                <Button 
                  onClick={() => {
                    const phoneInput = document.getElementById('manual-phone') as HTMLInputElement;
                    if (phoneInput?.value) {
                      makeManualCall(phoneInput.value);
                    }
                  }}
                  className="flex items-center space-x-2"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Call Now</span>
                </Button>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Quick Dial</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Common numbers for quick access
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Church Office", number: "+1234567890" },
                  { name: "Pastor Emergency", number: "+1987654321" },
                  { name: "Youth Leader", number: "+1555123456" },
                  { name: "Prayer Line", number: "+1444999888" }
                ].map((contact) => (
                  <Button 
                    key={contact.name}
                    variant="outline" 
                    onClick={() => makeManualCall(contact.number)}
                    className="justify-start text-left h-auto p-3"
                  >
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.number}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoboCallingSystem;