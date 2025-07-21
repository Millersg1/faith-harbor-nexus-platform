import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause,
  Upload,
  Download,
  Users,
  Volume2,
  VolumeX,
  Copy,
  Trash2,
  Star,
  Heart,
  Settings,
  FileAudio,
  UserPlus,
  AudioWaveform
} from "lucide-react";

interface ClonedVoice {
  voice_id: string;
  name: string;
  description: string;
  preview_url?: string;
  category: string;
  labels: {
    accent?: string;
    age?: string;
    gender?: string;
    use_case?: string;
  };
  samples?: VoiceSample[];
  fine_tuning?: {
    is_allowed_to_fine_tune: boolean;
    language?: string;
  };
}

interface VoiceSample {
  sample_id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  hash: string;
}

interface GeneratedAudio {
  id: string;
  text: string;
  voice_id: string;
  voice_name: string;
  audio_url: string;
  created_at: string;
}

const VoiceCloningStudio = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [voices, setVoices] = useState<ClonedVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [generatedAudios, setGeneratedAudios] = useState<GeneratedAudio[]>([]);
  
  // Recording state
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Form states
  const [cloneForm, setCloneForm] = useState({
    name: '',
    description: '',
    files: [] as File[],
    labels: {
      accent: '',
      age: '',
      gender: '',
      use_case: ''
    }
  });
  
  const [generateForm, setGenerateForm] = useState({
    text: '',
    voice_id: '',
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true
    }
  });

  // Pre-built voices from ElevenLabs
  const prebuiltVoices = [
    { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria', gender: 'female', accent: 'american' },
    { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', gender: 'male', accent: 'american' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', gender: 'female', accent: 'american' },
    { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', gender: 'female', accent: 'american' },
    { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', gender: 'male', accent: 'australian' },
    { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', gender: 'male', accent: 'british' },
    { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', gender: 'male', accent: 'american' },
    { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River', gender: 'male', accent: 'american' },
    { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', gender: 'male', accent: 'american' },
    { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', gender: 'female', accent: 'english' }
  ];

  useEffect(() => {
    if (user) {
      fetchVoices();
      fetchGeneratedAudios();
    }
  }, [user]);

  const fetchVoices = async () => {
    try {
      const response = await supabase.functions.invoke('get-voices', {
        body: {}
      });
      
      if (response.error) throw response.error;
      
      // Combine pre-built and custom voices
      const customVoices = response.data?.voices || [];
      const allVoices = [...prebuiltVoices.map(v => ({
        voice_id: v.id,
        name: v.name,
        description: `Pre-built ${v.gender} voice with ${v.accent} accent`,
        category: 'premade',
        labels: {
          gender: v.gender,
          accent: v.accent,
          use_case: 'general'
        }
      })), ...customVoices];
      
      setVoices(allVoices);
    } catch (error) {
      console.error('Error fetching voices:', error);
      // Fallback to pre-built voices only
      setVoices(prebuiltVoices.map(v => ({
        voice_id: v.id,
        name: v.name,
        description: `Pre-built ${v.gender} voice with ${v.accent} accent`,
        category: 'premade',
        labels: {
          gender: v.gender,
          accent: v.accent,
          use_case: 'general'
        }
      })));
    }
  };

  const fetchGeneratedAudios = async () => {
    // Mock data for generated audios
    const mockAudios: GeneratedAudio[] = [
      {
        id: '1',
        text: 'Welcome to Faith Harbor Church. We are delighted to have you join us today.',
        voice_id: '9BWtsMINqrJLrRacOk9x',
        voice_name: 'Aria',
        audio_url: '',
        created_at: new Date().toISOString()
      }
    ];
    setGeneratedAudios(mockAudios);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/wav'
      });
      
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedBlob(blob);
        setAudioChunks(chunks);
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start(100); // Capture data every 100ms
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly for best voice cloning results. Minimum 30 seconds recommended.",
      });
      
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
    if (recordedBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(recordedBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));
    
    if (audioFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: "Please upload only audio files (MP3, WAV, M4A).",
        variant: "destructive",
      });
      return;
    }
    
    setCloneForm(prev => ({
      ...prev,
      files: [...prev.files, ...audioFiles]
    }));
  };

  const removeFile = (index: number) => {
    setCloneForm(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const cloneVoice = async () => {
    if (!cloneForm.name.trim()) {
      toast({
        title: "Missing Name",
        description: "Please provide a name for your cloned voice.",
        variant: "destructive",
      });
      return;
    }

    if (cloneForm.files.length === 0 && !recordedBlob) {
      toast({
        title: "No Audio Samples",
        description: "Please upload audio files or record a sample.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadProgress(10);
      
      // Prepare files for upload
      const files = recordedBlob ? [...cloneForm.files, new File([recordedBlob], 'recording.wav')] : cloneForm.files;
      
      setUploadProgress(30);
      
      // Call voice cloning edge function
      const response = await supabase.functions.invoke('clone-voice', {
        body: {
          name: cloneForm.name,
          description: cloneForm.description,
          labels: cloneForm.labels,
          files: files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type
          }))
        }
      });
      
      setUploadProgress(70);
      
      if (response.error) throw response.error;
      
      setUploadProgress(100);
      
      toast({
        title: "Voice Cloned Successfully!",
        description: `Your voice "${cloneForm.name}" has been created and is ready to use.`,
      });
      
      // Reset form
      setCloneForm({
        name: '',
        description: '',
        files: [],
        labels: { accent: '', age: '', gender: '', use_case: '' }
      });
      setRecordedBlob(null);
      setUploadProgress(0);
      
      // Refresh voices list
      fetchVoices();
      
    } catch (error) {
      toast({
        title: "Cloning Failed",
        description: "Failed to clone voice. Please try again.",
        variant: "destructive",
      });
      setUploadProgress(0);
    }
  };

  const generateSpeech = async () => {
    if (!generateForm.text.trim()) {
      toast({
        title: "Missing Text",
        description: "Please enter text to convert to speech.",
        variant: "destructive",
      });
      return;
    }

    if (!generateForm.voice_id) {
      toast({
        title: "No Voice Selected",
        description: "Please select a voice to use for generation.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await supabase.functions.invoke('generate-speech', {
        body: {
          text: generateForm.text,
          voice_id: generateForm.voice_id,
          model_id: generateForm.model_id,
          voice_settings: generateForm.voice_settings
        }
      });

      if (response.error) throw response.error;

      const newAudio: GeneratedAudio = {
        id: Date.now().toString(),
        text: generateForm.text,
        voice_id: generateForm.voice_id,
        voice_name: voices.find(v => v.voice_id === generateForm.voice_id)?.name || 'Unknown',
        audio_url: response.data.audio_url,
        created_at: new Date().toISOString()
      };

      setGeneratedAudios(prev => [newAudio, ...prev]);

      toast({
        title: "Speech Generated!",
        description: "Your audio has been generated successfully.",
      });

      // Reset text
      setGenerateForm(prev => ({ ...prev, text: '' }));

    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate speech. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteVoice = async (voiceId: string) => {
    try {
      await supabase.functions.invoke('delete-voice', {
        body: { voice_id: voiceId }
      });

      setVoices(prev => prev.filter(v => v.voice_id !== voiceId));
      
      toast({
        title: "Voice Deleted",
        description: "The voice has been removed from your library.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete voice. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <AudioWaveform className="h-8 w-8 text-purple-500" />
            <span>Voice Cloning Studio</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Create personalized AI voices for your church communications
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-2">
          <Star className="h-4 w-4" />
          <span>Premium Feature</span>
        </Badge>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="clone" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="clone" className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Clone Voice</span>
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4" />
            <span>Generate Speech</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Voice Library</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <FileAudio className="h-4 w-4" />
            <span>Generated Audio</span>
          </TabsTrigger>
        </TabsList>

        {/* Clone Voice Tab */}
        <TabsContent value="clone" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Custom Voice</CardTitle>
                <CardDescription>
                  Clone a voice from audio samples. Upload 3-10 minutes of clear audio for best results.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="voice-name">Voice Name</Label>
                  <Input
                    id="voice-name"
                    value={cloneForm.name}
                    onChange={(e) => setCloneForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Pastor John's Voice"
                  />
                </div>

                <div>
                  <Label htmlFor="voice-description">Description</Label>
                  <Textarea
                    id="voice-description"
                    value={cloneForm.description}
                    onChange={(e) => setCloneForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Warm, pastoral voice for Sunday announcements"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={cloneForm.labels.gender} 
                      onValueChange={(value) => setCloneForm(prev => ({
                        ...prev, 
                        labels: { ...prev.labels, gender: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="age">Age Range</Label>
                    <Select 
                      value={cloneForm.labels.age} 
                      onValueChange={(value) => setCloneForm(prev => ({
                        ...prev, 
                        labels: { ...prev.labels, age: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="young">Young (18-30)</SelectItem>
                        <SelectItem value="middle_aged">Middle Aged (30-50)</SelectItem>
                        <SelectItem value="old">Mature (50+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="use-case">Use Case</Label>
                  <Select 
                    value={cloneForm.labels.use_case} 
                    onValueChange={(value) => setCloneForm(prev => ({
                      ...prev, 
                      labels: { ...prev.labels, use_case: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select use case" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcements">Church Announcements</SelectItem>
                      <SelectItem value="sermons">Sermon Excerpts</SelectItem>
                      <SelectItem value="prayers">Prayer Recordings</SelectItem>
                      <SelectItem value="general">General Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Audio Samples</Label>
                  
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload audio files (MP3, WAV, M4A)
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="audio-upload"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('audio-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>

                  {/* Or Record */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">Or record directly</p>
                    <div className="flex justify-center space-x-3">
                      {!isRecording ? (
                        <Button onClick={startRecording} variant="outline">
                          <Mic className="h-4 w-4 mr-2" />
                          Start Recording
                        </Button>
                      ) : (
                        <Button onClick={stopRecording} variant="destructive">
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop Recording
                        </Button>
                      )}
                      
                      {recordedBlob && (
                        <Button onClick={playRecording} variant="outline" disabled={isPlaying}>
                          <Play className="h-4 w-4 mr-2" />
                          Play Recording
                        </Button>
                      )}
                    </div>
                    <audio ref={audioRef} style={{ display: 'none' }} />
                  </div>

                  {/* File List */}
                  {cloneForm.files.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Files:</Label>
                      {cloneForm.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {recordedBlob && (
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">Recorded Audio</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setRecordedBlob(null)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cloning Progress</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                <Button onClick={cloneVoice} className="w-full" size="lg">
                  <AudioWaveform className="h-5 w-5 mr-2" />
                  Clone Voice
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips for Best Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Heart className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Quality Tips:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Use high-quality audio (no background noise)</li>
                      <li>• Provide 3-10 minutes of varied speech</li>
                      <li>• Include different emotions and tones</li>
                      <li>• Avoid music or sound effects</li>
                      <li>• Record in a quiet environment</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Use Cases:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Pastor announcements</li>
                      <li>• Automated prayer lines</li>
                      <li>• Multilingual services</li>
                      <li>• Memorial tributes</li>
                      <li>• Children's ministry content</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Generate Speech Tab */}
        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Text to Speech</CardTitle>
                <CardDescription>
                  Convert text to natural-sounding speech using your cloned voices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="voice-select">Select Voice</Label>
                  <Select 
                    value={generateForm.voice_id} 
                    onValueChange={(value) => setGenerateForm(prev => ({ ...prev, voice_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((voice) => (
                        <SelectItem key={voice.voice_id} value={voice.voice_id}>
                          <div className="flex items-center space-x-2">
                            <span>{voice.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {voice.labels.gender}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="text-input">Text to Convert</Label>
                  <Textarea
                    id="text-input"
                    value={generateForm.text}
                    onChange={(e) => setGenerateForm(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Welcome to Faith Harbor Church. We are delighted to have you join us for worship today..."
                    rows={6}
                    maxLength={2500}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {generateForm.text.length}/2500 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="model-select">Model Quality</Label>
                  <Select 
                    value={generateForm.model_id} 
                    onValueChange={(value) => setGenerateForm(prev => ({ ...prev, model_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eleven_multilingual_v2">
                        Multilingual v2 (Best Quality)
                      </SelectItem>
                      <SelectItem value="eleven_turbo_v2_5">
                        Turbo v2.5 (Fast, Multilingual)
                      </SelectItem>
                      <SelectItem value="eleven_turbo_v2">
                        Turbo v2 (Fastest, English Only)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={generateSpeech} className="w-full" size="lg">
                  <Volume2 className="h-5 w-5 mr-2" />
                  Generate Speech
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voice Settings</CardTitle>
                <CardDescription>
                  Fine-tune the voice characteristics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Stability: {generateForm.voice_settings.stability}</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={generateForm.voice_settings.stability}
                    onChange={(e) => setGenerateForm(prev => ({
                      ...prev,
                      voice_settings: {
                        ...prev.voice_settings,
                        stability: parseFloat(e.target.value)
                      }
                    }))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher values make the voice more consistent but less expressive
                  </p>
                </div>

                <div>
                  <Label>Similarity: {generateForm.voice_settings.similarity_boost}</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={generateForm.voice_settings.similarity_boost}
                    onChange={(e) => setGenerateForm(prev => ({
                      ...prev,
                      voice_settings: {
                        ...prev.voice_settings,
                        similarity_boost: parseFloat(e.target.value)
                      }
                    }))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    How closely the generated speech should match the original voice
                  </p>
                </div>

                <div>
                  <Label>Style: {generateForm.voice_settings.style}</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={generateForm.voice_settings.style}
                    onChange={(e) => setGenerateForm(prev => ({
                      ...prev,
                      voice_settings: {
                        ...prev.voice_settings,
                        style: parseFloat(e.target.value)
                      }
                    }))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    How much emotion and style variation to add
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="speaker-boost"
                    checked={generateForm.voice_settings.use_speaker_boost}
                    onChange={(e) => setGenerateForm(prev => ({
                      ...prev,
                      voice_settings: {
                        ...prev.voice_settings,
                        use_speaker_boost: e.target.checked
                      }
                    }))}
                  />
                  <Label htmlFor="speaker-boost">Use Speaker Boost</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enhances voice clarity and consistency (recommended)
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Voice Library Tab */}
        <TabsContent value="library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Voice Library</CardTitle>
              <CardDescription>
                Manage your collection of cloned and pre-built voices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {voices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No voices in your library yet</p>
                  <p className="text-sm">Clone your first voice to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {voices.map((voice) => (
                    <Card key={voice.voice_id} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{voice.name}</CardTitle>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {voice.description}
                            </p>
                          </div>
                          {voice.category !== 'premade' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteVoice(voice.voice_id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {voice.labels.gender && (
                            <Badge variant="secondary">{voice.labels.gender}</Badge>
                          )}
                          {voice.labels.accent && (
                            <Badge variant="outline">{voice.labels.accent}</Badge>
                          )}
                          <Badge variant={voice.category === 'premade' ? 'default' : 'secondary'}>
                            {voice.category === 'premade' ? 'Pre-built' : 'Custom'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => setGenerateForm(prev => ({ ...prev, voice_id: voice.voice_id }))}
                          >
                            <Volume2 className="h-4 w-4 mr-2" />
                            Use Voice
                          </Button>
                          
                          {voice.preview_url && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-full"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generated Audio History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Audio History</CardTitle>
              <CardDescription>
                Your previously generated speech files
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedAudios.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileAudio className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No generated audio yet</p>
                  <p className="text-sm">Generated speech will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedAudios.map((audio) => (
                    <div key={audio.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{audio.voice_name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {new Date(audio.created_at).toLocaleDateString()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {audio.text}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VoiceCloningStudio;