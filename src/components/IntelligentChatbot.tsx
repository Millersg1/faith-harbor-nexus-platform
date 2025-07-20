import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  X, 
  Minimize2, 
  Maximize2,
  Settings,
  Brain,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatbotProps {
  position?: 'bottom-right' | 'bottom-left' | 'embedded';
  knowledgeBase?: string[];
  customPrompt?: string;
  showTraining?: boolean;
}

const IntelligentChatbot: React.FC<ChatbotProps> = ({ 
  position = 'bottom-right',
  knowledgeBase = [],
  customPrompt,
  showTraining = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your Faith Harbor AI assistant. I can help you with questions about our ministry platform, features, and services. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [trainingData, setTrainingData] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      content: 'Faith Harbor AI is thinking...',
      sender: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const { data, error } = await supabase.functions.invoke('chatbot-assistant', {
        body: {
          message: inputMessage,
          context: knowledgeBase,
          customPrompt: customPrompt || `You are Faith Harbor AI, an intelligent assistant for a Christian ministry platform. 
            You help users with questions about church management, spiritual guidance, and platform features. 
            Always respond with wisdom, compassion, and biblical principles when appropriate.
            Keep responses helpful, concise, and encouraging.`
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'I apologize, but I encountered an issue processing your request. Please try again.',
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => prev.filter(msg => msg.id !== 'typing').concat(assistantMessage));
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => prev.filter(msg => msg.id !== 'typing').concat(errorMessage));
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to AI assistant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const trainChatbot = async () => {
    if (!trainingData.trim()) return;

    setIsTraining(true);
    try {
      const { error } = await supabase.functions.invoke('train-chatbot', {
        body: {
          trainingData: trainingData,
          category: 'faith-harbor-knowledge'
        }
      });

      if (error) throw error;

      toast({
        title: "Training Successful",
        description: "The chatbot has been updated with new knowledge.",
      });
      
      setTrainingData('');
      setShowSettings(false);
    } catch (error) {
      console.error('Training error:', error);
      toast({
        title: "Training Failed",
        description: "Failed to update chatbot knowledge. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTraining(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (position === 'embedded') {
    return (
      <Card className="w-full h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Faith Harbor AI Assistant</CardTitle>
              <Badge variant="secondary" className="text-xs">
                <Brain className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
            {showTraining && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {showSettings && showTraining && (
            <div className="p-4 border-b bg-muted/30">
              <h4 className="font-semibold mb-2">Train AI Assistant</h4>
              <textarea
                value={trainingData}
                onChange={(e) => setTrainingData(e.target.value)}
                placeholder="Enter knowledge base content to train the AI..."
                className="w-full h-20 p-2 border rounded text-sm"
              />
              <Button
                onClick={trainChatbot}
                disabled={isTraining || !trainingData.trim()}
                size="sm"
                className="mt-2"
              >
                {isTraining ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Training...
                  </>
                ) : (
                  'Update Knowledge'
                )}
              </Button>
            </div>
          )}
          
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : message.isTyping
                        ? 'bg-muted text-muted-foreground animate-pulse'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {message.content}
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Faith Harbor..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Floating chatbot
  return (
    <div
      className={`fixed z-50 ${
        position === 'bottom-right' ? 'bottom-4 right-4' : 'bottom-4 left-4'
      }`}
    >
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className={`w-80 h-96 shadow-xl ${isMinimized ? 'h-12' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm">Faith Harbor AI</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  <Brain className="h-2 w-2 mr-1" />
                  AI
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-6 h-6 p-0"
                >
                  {isMinimized ? (
                    <Maximize2 className="h-3 w-3" />
                  ) : (
                    <Minimize2 className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <CardContent className="flex-1 flex flex-col p-0 h-80">
              <ScrollArea className="flex-1 px-3">
                <div className="space-y-3 py-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'assistant' && (
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-3 w-3 text-primary" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[75%] rounded-lg px-2 py-1 text-xs ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : message.isTyping
                            ? 'bg-muted text-muted-foreground animate-pulse'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {message.content}
                      </div>
                      
                      {message.sender === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <User className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="flex-1 text-xs h-8"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    size="sm"
                    className="w-8 h-8 p-0"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Send className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

export default IntelligentChatbot;