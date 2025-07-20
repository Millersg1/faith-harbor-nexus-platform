import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Bot, User, Lightbulb, Zap, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'prayer' | 'guidance' | 'question';
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your faith companion. I'm here to help with spiritual guidance, prayer, scripture questions, and ministry needs. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'general' | 'prayer' | 'scripture' | 'ministry'>('general');
  const { toast } = useToast();

  const predefinedPrompts = {
    general: [
      "Help me understand a Bible verse",
      "I need guidance with a difficult situation",
      "How can I grow in my faith?",
      "What does the Bible say about forgiveness?"
    ],
    prayer: [
      "Help me write a prayer for healing",
      "I need prayer for a difficult time",
      "How should I pray for my family?",
      "Guide me in thanksgiving prayer"
    ],
    scripture: [
      "Find verses about hope",
      "What does Romans 8:28 mean?",
      "Scripture for anxiety and worry",
      "Verses about God's love"
    ],
    ministry: [
      "How to encourage volunteers",
      "Planning a church event",
      "Dealing with conflict in ministry",
      "Growing church attendance"
    ]
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      type: activeMode === 'prayer' ? 'prayer' : activeMode === 'ministry' ? 'question' : 'guidance'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Simulate AI response (in production, this would call your OpenAI/AI service)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = generateAIResponse(inputValue, activeMode);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "AI Response Generated",
        description: "I've provided guidance based on faith principles.",
      });

    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (input: string, mode: string): string => {
    // This is a simplified response generator. In production, use OpenAI or similar service
    const responses = {
      general: {
        keywords: {
          'forgiveness': "Forgiveness is central to the Christian faith. Jesus taught us in Matthew 6:14-15 that we must forgive others as we have been forgiven. This doesn't mean forgetting, but releasing resentment and choosing love. Start with prayer, asking God to help soften your heart and give you the strength to forgive.",
          'guidance': "When seeking God's guidance, remember Proverbs 3:5-6: 'Trust in the Lord with all your heart and lean not on your own understanding.' Spend time in prayer, study His Word, and seek wise counsel from mature believers. God often speaks through His Word, prayer, and the wisdom of others.",
          'faith': "Growing in faith is a lifelong journey. Regular prayer, Bible study, fellowship with other believers, and serving others are key practices. Remember that faith grows through both mountain-top experiences and valley moments. Trust God's process in your life.",
          'default': "Thank you for sharing that with me. Based on biblical principles, I encourage you to bring this matter to God in prayer. Seek His wisdom through Scripture and consider talking with a trusted pastor or spiritual mentor for additional guidance."
        }
      },
      prayer: {
        default: "Here's a prayer that might help: 'Heavenly Father, I come before You with a humble heart, seeking Your presence and guidance. You know the desires of my heart and the struggles I face. Please grant me Your peace, wisdom, and strength. Help me to trust in Your perfect plan and timing. In Jesus' name, Amen.' Feel free to personalize this prayer with your specific needs."
      },
      scripture: {
        keywords: {
          'hope': "Here are some beautiful verses about hope: Romans 15:13 - 'May the God of hope fill you with all joy and peace as you trust in him.' Jeremiah 29:11 - 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.' These remind us that our hope is anchored in God's faithfulness.",
          'love': "God's love is beautifully described in 1 John 4:16 - 'God is love. Whoever lives in love lives in God, and God in them.' Romans 8:38-39 reminds us that nothing can separate us from God's love. His love is unconditional, eternal, and transformative.",
          'default': "Scripture is God's Word to guide and comfort us. I'd encourage you to explore passages that speak to your current situation. Consider using a study Bible or devotional to deepen your understanding."
        }
      },
      ministry: {
        default: "Ministry can be both rewarding and challenging. Remember that we serve not in our own strength, but in God's power. Consider these principles: lead with love, communicate clearly, delegate wisely, and always point people to Jesus. Don't forget to care for your own spiritual health as you serve others."
      }
    };

    const modeResponses = responses[mode as keyof typeof responses];
    
    if (mode === 'prayer' && 'default' in modeResponses) {
      return modeResponses.default;
    }
    
    if (mode === 'ministry' && 'default' in modeResponses) {
      return modeResponses.default;
    }
    
    // Check for keywords in general and scripture modes
    if ('keywords' in modeResponses) {
      for (const [keyword, response] of Object.entries(modeResponses.keywords)) {
        if (keyword !== 'default' && input.toLowerCase().includes(keyword)) {
          return response;
        }
      }
      return modeResponses.keywords.default;
    }
    
    return "Thank you for your question. I'm here to help with spiritual guidance based on biblical principles.";
  };

  const handlePredefinedPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'prayer': return <Heart className="h-4 w-4" />;
      case 'scripture': return <Lightbulb className="h-4 w-4" />;
      case 'ministry': return <Zap className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Bot className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Faith Harbor AI Assistant</CardTitle>
              <p className="text-muted-foreground">
                Your spiritual companion for guidance, prayer, and ministry support
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Mode Selection */}
      <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="prayer" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Prayer
          </TabsTrigger>
          <TabsTrigger value="scripture" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Scripture
          </TabsTrigger>
          <TabsTrigger value="ministry" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Ministry
          </TabsTrigger>
        </TabsList>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Chat */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getModeIcon(activeMode)}
                    {activeMode.charAt(0).toUpperCase() + activeMode.slice(1)} Assistant
                  </CardTitle>
                  <Badge variant="secondary">
                    {messages.length - 1} messages
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                        <div className="flex items-start space-x-2">
                          {message.role === 'assistant' ? (
                            <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                          ) : (
                            <User className="h-4 w-4 mt-1 flex-shrink-0" />
                          )}
                          <div className="text-sm">{message.content}</div>
                        </div>
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4 animate-pulse" />
                          <div className="text-sm">Thinking...</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Ask about ${activeMode}...`}
                    className="flex-1 min-h-[60px]"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    size="lg"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suggested Prompts */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suggested Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {predefinedPrompts[activeMode].map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-3 whitespace-normal"
                      onClick={() => handlePredefinedPrompt(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>Prayer guidance & support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <span>Scripture interpretation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>Ministry assistance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span>Spiritual counseling</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default AIAssistant;