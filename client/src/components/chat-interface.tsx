import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from "@/components/sidebar";
import CrisisModal from "@/components/crisis-modal";
import { Heart, Send, Phone, User, Menu, X, Paperclip } from "lucide-react";
import { mockConversations, mockMessages, generateMockAIResponse } from "@/lib/mockData";

interface Message {
  id: number;
  conversationId: number;
  content: string;
  role: "user" | "assistant";
  sentiment?: string | null;
  stressIndicators?: string[] | null;
  timestamp: string;
}

export default function ChatInterface() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [messageText, setMessageText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [messageText]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || isTyping) return;

    const userMessage: Message = {
      id: messages.length + 1,
      conversationId: 1,
      content: messageText.trim(),
      role: "user",
      sentiment: null,
      stressIndicators: null,
      timestamp: new Date().toISOString(),
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = messageText.trim();
    setMessageText("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateMockAIResponse(currentMessage);
      
      const assistantMessage: Message = {
        id: messages.length + 2,
        conversationId: 1,
        content: aiResponse.message,
        role: "assistant",
        sentiment: aiResponse.sentiment,
        stressIndicators: aiResponse.stressIndicators,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // Show stress indicators if detected
      if (aiResponse.stressIndicators.length > 0) {
        toast({
          title: "I noticed some stress indicators",
          description: "Would you like me to suggest some coping strategies?",
          variant: "default",
        });
      }
      
      // Show crisis modal if immediate help needed
      if (aiResponse.requiresImmediate) {
        setIsCrisisModalOpen(true);
      }
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickResponse = (response: string) => {
    setMessageText(response);
    setTimeout(() => handleSendMessage(), 100);
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X /> : <Menu />}
              </Button>
              
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center animate-pulse-gentle">
                <Heart className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-800">MindfulChat</h1>
                <div className="text-sm text-blue-600 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  AI Companion Online
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsCrisisModalOpen(true)}
                className="bg-red-500 hover:bg-red-600"
              >
                <Phone className="w-4 h-4 mr-1" />
                Crisis Help
              </Button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-600 hidden sm:inline">
                  {user?.firstName || user?.email || "User"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-full p-0"
                >
                  <User className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex max-w-7xl mx-auto w-full relative">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block w-80 flex-shrink-0`}>
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 animate-slide-up ${
                  message.role === "user" ? "justify-end" : ""
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="text-white text-sm" />
                  </div>
                )}
                
                <div
                  className={`rounded-2xl p-4 shadow-sm max-w-md ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-tr-sm"
                      : "bg-white/90 backdrop-blur-sm text-slate-800 rounded-tl-sm border border-blue-100"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <div
                    className={`text-xs mt-2 ${
                      message.role === "user" ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : "Now"}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="text-neutral-600 text-sm" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start space-x-3 animate-slide-up">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="text-white text-sm" />
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4 shadow-sm border border-blue-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t border-neutral-100 bg-white p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <Textarea
                  ref={textareaRef}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Share what's on your mind... I'm here to listen 💙"
                  className="resize-none border border-neutral-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-calm-500 focus:border-transparent transition-all duration-200 bg-neutral-50 min-h-[44px] max-h-[120px]"
                  rows={1}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-11 h-11 rounded-full p-0"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || isTyping}
                  className="w-11 h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-full p-0 transition-all duration-200 transform hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Quick Responses */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickResponse("I'm feeling anxious")}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 rounded-full"
              >
                I'm feeling anxious
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickResponse("I need motivation")}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 rounded-full"
              >
                I need motivation
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickResponse("Help me relax")}
                className="bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-200 rounded-full"
              >
                Help me relax
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickResponse("I can't sleep")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 rounded-full"
              >
                I can't sleep
              </Button>
            </div>
          </div>
        </div>
      </main>

      <CrisisModal 
        isOpen={isCrisisModalOpen} 
        onClose={() => setIsCrisisModalOpen(false)} 
      />
    </div>
  );
}
