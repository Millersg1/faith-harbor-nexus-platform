import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, User, Clock, Reply, Phone } from "lucide-react";
import { format } from "date-fns";
import TwilioFlexPanel from "@/components/TwilioFlexPanel";
import { PhoneSystemTest } from "@/components/PhoneSystemTest";
import { ScriptureQuote } from "@/components/ScriptureQuote";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  read: boolean;
  thread_id?: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  user_id: string;
  display_name: string;
  first_name: string;
  last_name: string;
}

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [composeForm, setComposeForm] = useState({
    recipient_id: "",
    subject: "",
    content: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchProfiles();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, display_name, first_name, last_name");

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const getProfileName = (userId: string) => {
    const profile = profiles.find(p => p.user_id === userId);
    return profile?.display_name || `${profile?.first_name} ${profile?.last_name}` || "Unknown User";
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!composeForm.recipient_id || !composeForm.subject || !composeForm.content) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          recipient_id: composeForm.recipient_id,
          subject: composeForm.subject,
          content: composeForm.content,
          sender_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message sent successfully",
      });

      setComposeForm({ recipient_id: "", subject: "", content: "" });
      setIsComposeOpen(false);
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ read: true })
        .eq("id", messageId);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getProfileName(message.sender_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-20">
        <ScriptureQuote 
          verse="Therefore encourage one another and build each other up, just as in fact you are doing."
          reference="1 Thessalonians 5:11"
          theme="community"
        />
        <div className="flex justify-between items-center mb-8 mt-8">
        <div>
          <h1 className="text-3xl font-bold">Messages & Support</h1>
          <p className="text-muted-foreground">Internal messaging and Twilio Flex support center</p>
        </div>
      </div>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Internal Messages
          </TabsTrigger>
          <TabsTrigger value="flex" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Support & SMS
          </TabsTrigger>
          <TabsTrigger value="phone-test" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Test
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="mb-6">
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Send className="mr-2 h-4 w-4" />
                  Compose Message
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Compose New Message</DialogTitle>
                  <DialogDescription>
                    Send a message to a community member.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient</Label>
                    <select
                      id="recipient"
                      value={composeForm.recipient_id}
                      onChange={(e) => setComposeForm(prev => ({ ...prev, recipient_id: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select recipient...</option>
                      {profiles.map((profile) => (
                        <option key={profile.user_id} value={profile.user_id}>
                          {getProfileName(profile.user_id)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={composeForm.subject}
                      onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Enter message subject"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Message</Label>
                    <Textarea
                      id="content"
                      value={composeForm.content}
                      onChange={(e) => setComposeForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Type your message here..."
                      rows={6}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsComposeOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {filteredMessages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No messages found</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm ? "No messages match your search." : "Start a conversation by sending your first message."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <Card 
                  key={message.id} 
                  className={`cursor-pointer transition-colors hover:bg-accent ${!message.read ? 'border-primary' : ''}`}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.read) markAsRead(message.id);
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{getProfileName(message.sender_id)}</span>
                        {!message.read && <Badge variant="secondary">New</Badge>}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(message.created_at), "MMM d, yyyy h:mm a")}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{message.subject}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2">{message.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedMessage && (
            <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle>{selectedMessage.subject}</DialogTitle>
                      <DialogDescription className="flex items-center mt-2">
                        <User className="h-4 w-4 mr-1" />
                        From: {getProfileName(selectedMessage.sender_id)}
                        <Clock className="h-4 w-4 ml-4 mr-1" />
                        {format(new Date(selectedMessage.created_at), "MMM d, yyyy h:mm a")}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="mt-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setComposeForm({
                          recipient_id: selectedMessage.sender_id,
                          subject: `Re: ${selectedMessage.subject}`,
                          content: ""
                        });
                        setSelectedMessage(null);
                        setIsComposeOpen(true);
                      }}
                    >
                      <Reply className="mr-2 h-4 w-4" />
                      Reply
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>
        
        <TabsContent value="flex" className="mt-6">
          <TwilioFlexPanel />
        </TabsContent>
        
        <TabsContent value="phone-test" className="mt-6">
          <div className="flex justify-center">
            <PhoneSystemTest />
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default Messages;