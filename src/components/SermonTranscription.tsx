import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Upload, 
  FileAudio, 
  Clock, 
  FileText, 
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface SermonTranscription {
  id: string;
  title: string;
  audio_url: string | null;
  transcription_text: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  duration_seconds: number | null;
  word_count: number | null;
  created_at: string;
  updated_at: string;
}

export const SermonTranscription = () => {
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Fetch user's transcriptions
  const { data: transcriptions, isLoading } = useQuery({
    queryKey: ['sermon-transcriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sermon_transcriptions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SermonTranscription[];
    }
  });

  // Upload audio file
  const uploadAudio = async (file: File) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('sermon-audio')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('sermon-audio')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // Create transcription mutation
  const createTranscription = useMutation({
    mutationFn: async ({ title, audioFile }: { title: string; audioFile: File }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload audio file
      const audioUrl = await uploadAudio(audioFile);

      // Create transcription record
      const { data, error } = await supabase
        .from('sermon_transcriptions')
        .insert({
          user_id: user.id,
          title,
          audio_url: audioUrl,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Convert audio file to base64
      const arrayBuffer = await audioFile.arrayBuffer();
      const base64Audio = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      );

      // Start transcription process
      const { error: transcriptionError } = await supabase.functions.invoke('transcribe-sermon', {
        body: {
          transcriptionId: data.id,
          audioBase64: base64Audio
        }
      });

      if (transcriptionError) throw transcriptionError;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sermon-transcriptions'] });
      setTitle('');
      toast.success('Transcription started successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to start transcription: ${error.message}`);
    }
  });

  // Delete transcription mutation
  const deleteTranscription = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sermon_transcriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sermon-transcriptions'] });
      toast.success('Transcription deleted successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to delete transcription: ${error.message}`);
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!title.trim()) {
      toast.error('Please enter a title for the sermon');
      return;
    }

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload an audio file (MP3, WAV, or M4A)');
      return;
    }

    // Validate file size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      toast.error('File size must be less than 25MB');
      return;
    }

    setUploading(true);
    setTranscribing(true);

    try {
      await createTranscription.mutateAsync({ title, audioFile: file });
    } finally {
      setUploading(false);
      setTranscribing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'Unknown';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const downloadTranscription = (transcription: SermonTranscription) => {
    if (!transcription.transcription_text) return;
    
    const blob = new Blob([transcription.transcription_text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${transcription.title}-transcription.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Sermon Transcription</h1>
          <p className="text-muted-foreground">
            Upload sermon audio files and get accurate AI-powered transcriptions
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Sermon
          </CardTitle>
          <CardDescription>
            Upload an audio file and get an AI-generated transcription using OpenAI's Whisper
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Sermon Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter sermon title..."
              disabled={uploading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="audio">Audio File</Label>
            <Input
              id="audio"
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <p className="text-sm text-muted-foreground">
              Supports MP3, WAV, M4A files up to 25MB
            </p>
          </div>

          {transcribing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Processing transcription...</span>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transcriptions List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Transcriptions</CardTitle>
          <CardDescription>
            View and manage your sermon transcriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading transcriptions...</span>
            </div>
          ) : !transcriptions || transcriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileAudio className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transcriptions yet. Upload your first sermon audio file!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transcriptions.map((transcription) => (
                <Card key={transcription.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{transcription.title}</CardTitle>
                        <CardDescription>
                          Created {new Date(transcription.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(transcription.status)}>
                          {transcription.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTranscription.mutate(transcription.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      {transcription.duration_seconds && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDuration(transcription.duration_seconds)}
                        </div>
                      )}
                      {transcription.word_count && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {transcription.word_count.toLocaleString()} words
                        </div>
                      )}
                    </div>

                    {transcription.status === 'completed' && transcription.transcription_text && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Transcription</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadTranscription(transcription)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                          <Textarea
                            value={transcription.transcription_text}
                            readOnly
                            className="min-h-[200px] font-mono text-sm"
                          />
                        </div>
                      </>
                    )}

                    {transcription.status === 'processing' && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Transcription in progress...</span>
                      </div>
                    )}

                    {transcription.status === 'failed' && (
                      <div className="text-red-600 text-sm">
                        Transcription failed. Please try uploading the file again.
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};