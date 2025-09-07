import { useState } from 'react';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, MessageCircle, Calendar, FileText, AlertTriangle } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  documentType: string;
  risksFound: number;
  status: 'completed' | 'processing' | 'error';
}

interface HistoryProps {
  onSectionChange: (section: string) => void;
}

export default function History({ onSectionChange }: HistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const chatSessions: ChatSession[] = [
    {
      id: '1',
      title: 'Rental Agreement Analysis',
      description: 'Analyzed lease terms and identified potential issues with security deposit clauses',
      timestamp: new Date(2025, 7, 28, 14, 30),
      documentType: 'Lease Agreement',
      risksFound: 3,
      status: 'completed'
    },
    {
      id: '2',
      title: 'Employment Contract Review',
      description: 'Reviewed non-compete clauses and compensation structure',
      timestamp: new Date(2025, 7, 25, 10, 15),
      documentType: 'Employment Contract',
      risksFound: 1,
      status: 'completed'
    },
    {
      id: '3',
      title: 'NDA Simplification',
      description: 'Created plain English version of confidentiality agreement',
      timestamp: new Date(2025, 7, 23, 16, 45),
      documentType: 'NDA',
      risksFound: 0,
      status: 'completed'
    },
    {
      id: '4',
      title: 'Service Agreement Analysis',
      description: 'Currently analyzing terms of service and liability clauses',
      timestamp: new Date(2025, 7, 22, 9, 20),
      documentType: 'Service Agreement',
      risksFound: 2,
      status: 'processing'
    },
    {
      id: '5',
      title: 'Partnership Agreement',
      description: 'Reviewed profit sharing and decision-making processes',
      timestamp: new Date(2025, 7, 20, 13, 10),
      documentType: 'Partnership Agreement',
      risksFound: 4,
      status: 'completed'
    }
  ];

  const filteredSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.documentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/30 text-green-400 border-green-600/30';
      case 'processing':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-600/30';
      case 'error':
        return 'bg-red-900/30 text-red-400 border-red-600/30';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-600/30';
    }
  };

  const getRiskColor = (risks: number) => {
    if (risks === 0) return 'text-green-400';
    if (risks <= 2) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleOpenChat = (sessionId: string) => {
    // In a real app, this would open the specific chat session
    onSectionChange('chat');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Chat History</h1>
          <p className="text-purple-200">
            Review your previous document analyses and conversations
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past chats..."
            className="pl-10 bg-gray-900/50 border-purple-900/30 text-white placeholder-purple-300 focus:border-purple-600"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center space-x-3">
            <MessageCircle className="h-8 w-8 text-purple-400" />
            <div>
              <p className="text-lg font-semibold text-white">{chatSessions.length}</p>
              <p className="text-sm text-purple-200">Total Sessions</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center space-x-3">
            <FileText className="h-8 w-8 text-teal-400" />
            <div>
              <p className="text-lg font-semibold text-white">
                {chatSessions.filter(s => s.status === 'completed').length}
              </p>
              <p className="text-sm text-purple-200">Completed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <div>
              <p className="text-lg font-semibold text-white">
                {chatSessions.reduce((total, session) => total + session.risksFound, 0)}
              </p>
              <p className="text-sm text-purple-200">Total Risks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <p className="text-white font-medium">No chat sessions found</p>
              <p className="text-purple-200 text-sm">Try adjusting your search terms</p>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => (
            <Card key={session.id} className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm hover:bg-gray-800/50 transition-colors cursor-pointer">
              <CardHeader onClick={() => handleOpenChat(session.id)}>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-white">{session.title}</CardTitle>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-purple-200">
                      {session.description}
                    </CardDescription>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-purple-300">
                        <Calendar size={14} />
                        <span>{session.timestamp.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-teal-400">
                        <FileText size={14} />
                        <span>{session.documentType}</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${getRiskColor(session.risksFound)}`}>
                        <AlertTriangle size={14} />
                        <span>{session.risksFound} risk{session.risksFound !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-400 hover:text-white hover:bg-purple-900/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenChat(session.id);
                    }}
                  >
                    Open Chat
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}