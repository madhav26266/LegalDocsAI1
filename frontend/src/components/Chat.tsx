import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Send, Paperclip, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: "Hello! I'm ClauseBuddy, your legal AI assistant. I can help you analyze contracts, identify risks, and create plain English summaries. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "I understand you'd like me to help with that. Could you please upload the document you'd like me to analyze, or provide more specific details about what you need assistance with?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-900/30 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">ClauseBuddy</h2>
            <p className="text-purple-300 text-sm">Legal AI Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm">Online</span>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                {/* Avatar */}
                <div className={`p-2 rounded-full ${
                  message.role === 'user' 
                    ? 'bg-teal-600' 
                    : 'bg-purple-600'
                }`}>
                  {message.role === 'user' ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <Card className={`p-4 ${
                  message.role === 'user'
                    ? 'bg-teal-900/30 border-teal-600/30'
                    : 'bg-gray-800/50 border-purple-900/30'
                } backdrop-blur-sm`}>
                  <p className="text-white">{message.content}</p>
                  <p className="text-xs text-purple-300 mt-2">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-purple-900/30 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-purple-400 hover:text-white hover:bg-purple-900/30"
          >
            <Paperclip size={20} />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your contract..."
              className="bg-gray-900/50 border-purple-900/30 text-white placeholder-purple-300 focus:border-purple-600 pr-12"
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30 transition-all duration-200"
          >
            <Send size={18} />
          </Button>
        </div>
        
        <div className="flex items-center justify-center mt-2">
          <p className="text-xs text-purple-400">
            ClauseBuddy can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}