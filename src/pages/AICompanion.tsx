import { useState, useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Send, 
  Heart, 
  Book, 
  Hand, 
  MessageCircle, 
  Volume2, 
  VolumeX,
  User,
  Sparkles,
  Clock,
  Mic,
  MicOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  category?: string;
}

interface SpiritualResource {
  id: string;
  title: string;
  category: string;
  content: string;
  verse?: string;
}

const spiritualResources: SpiritualResource[] = [
  {
    id: '1',
    title: 'Finding Peace in Difficult Times',
    category: 'Comfort',
    content: 'When facing challenges, remember that God\'s peace surpasses all understanding. Take time for prayer and meditation.',
    verse: 'Philippians 4:6-7'
  },
  {
    id: '2',
    title: 'Growing in Faith',
    category: 'Growth',
    content: 'Faith grows through consistent prayer, Bible study, and fellowship with other believers.',
    verse: 'Romans 10:17'
  },
  {
    id: '3',
    title: 'Overcoming Anxiety',
    category: 'Mental Health',
    content: 'Cast all your anxieties on God because he cares for you. Remember, you are never alone in your struggles.',
    verse: '1 Peter 5:7'
  }
];

const AICompanion = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Welcome! I\'m your AI Spiritual Companion. I\'m here to provide guidance, prayer support, and biblical wisdom. How can I help you today?',
      timestamp: new Date(),
      category: 'greeting'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        category: 'guidance'
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Text-to-speech if enabled
      if (isSpeechEnabled) {
        speakMessage(aiResponse.content);
      }
    }, 2000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('prayer') || input.includes('pray')) {
      return "I'd be honored to pray with you. Prayer is our direct line to God's heart. Would you like me to share a prayer, or is there something specific you'd like to pray about together?";
    }
    
    if (input.includes('anxiety') || input.includes('worried') || input.includes('stress')) {
      return "I understand you're feeling anxious. Remember God's promise in Matthew 11:28: 'Come to me, all you who are weary and burdened, and I will give you rest.' Would you like to talk through what's causing your anxiety, or shall we focus on some calming scripture together?";
    }
    
    if (input.includes('bible') || input.includes('scripture') || input.includes('verse')) {
      return "The Word of God is a lamp to our feet and a light to our path. What aspect of life are you seeking guidance on? I can share relevant scriptures that might encourage and guide you.";
    }
    
    if (input.includes('faith') || input.includes('believe')) {
      return "Faith is the substance of things hoped for, the evidence of things not seen (Hebrews 11:1). Growing in faith is a journey we all share. What questions about faith are on your heart today?";
    }
    
    return "Thank you for sharing with me. I'm here to listen and provide spiritual guidance. Every question and concern you have matters to God. How can I best support you in your spiritual journey today?";
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Unable to recognize speech. Please try again.",
          variant: "destructive"
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
    }
  };

  const quickPrompts = [
    "I need prayer for...",
    "Help me find peace",
    "What does the Bible say about...",
    "I'm feeling anxious",
    "Guide me in faith"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Bot className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold">AI Spiritual Companion</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your 24/7 spiritual guide providing personalized guidance, prayer support, and biblical wisdom
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Spiritual Guidance Chat
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                  >
                    {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                  <Badge variant="secondary">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Powered
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'ai' && (
                        <div className="p-2 bg-primary rounded-full">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p>{message.content}</p>
                        <div className="flex items-center gap-2 mt-2 opacity-70">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="p-2 bg-muted rounded-full">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="p-2 bg-primary rounded-full">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Quick Prompts */}
                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {quickPrompts.map(prompt => (
                    <Button
                      key={prompt}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                      onClick={() => setInputMessage(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
                
                {/* Input */}
                <div className="flex gap-2">
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Share what's on your heart..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={startListening}
                      disabled={isListening}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Hand className="h-4 w-4 mr-2" />
                  Request Prayer
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Book className="h-4 w-4 mr-2" />
                  Bible Study
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Daily Devotion
                </Button>
              </CardContent>
            </Card>

            {/* Spiritual Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Spiritual Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="comfort" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="comfort">Comfort</TabsTrigger>
                    <TabsTrigger value="growth">Growth</TabsTrigger>
                    <TabsTrigger value="health">Health</TabsTrigger>
                  </TabsList>
                  {['comfort', 'growth', 'health'].map(category => (
                    <TabsContent key={category} value={category} className="space-y-3">
                      {spiritualResources
                        .filter(resource => resource.category.toLowerCase() === category || 
                          (category === 'health' && resource.category === 'Mental Health'))
                        .map(resource => (
                        <div key={resource.id} className="p-3 border rounded-lg">
                          <h4 className="font-semibold text-sm mb-1">{resource.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{resource.content}</p>
                          {resource.verse && (
                            <Badge variant="outline" className="text-xs">
                              {resource.verse}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICompanion;