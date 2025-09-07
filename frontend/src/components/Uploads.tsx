import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  FileText, 
  Trash2, 
  Eye, 
  Download, 
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  uploadedAt: Date;
  analyzedAt?: Date;
  risksFound?: number;
}

export default function Uploads() {
  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'rental_agreement.pdf',
      size: 245760,
      type: 'application/pdf',
      status: 'completed',
      progress: 100,
      uploadedAt: new Date(2025, 7, 28, 14, 30),
      analyzedAt: new Date(2025, 7, 28, 14, 32),
      risksFound: 3
    },
    {
      id: '2',
      name: 'employment_contract.docx',
      size: 189440,
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      status: 'completed',
      progress: 100,
      uploadedAt: new Date(2025, 7, 25, 10, 15),
      analyzedAt: new Date(2025, 7, 25, 10, 18),
      risksFound: 1
    },
    {
      id: '3',
      name: 'service_agreement.pdf',
      size: 312320,
      type: 'application/pdf',
      status: 'processing',
      progress: 75,
      uploadedAt: new Date(2025, 7, 22, 9, 20)
    }
  ]);



  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-600/30';
      case 'completed':
        return 'bg-green-900/30 text-green-400 border-green-600/30';
      case 'error':
        return 'bg-red-900/30 text-red-400 border-red-600/30';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-600/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Document Uploads</h1>
        <p className="text-purple-200">
          View your uploaded documents and analysis history
        </p>
      </div>



      {/* File Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{files.length}</p>
            <p className="text-sm text-purple-200">Total Files</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-400">
              {files.filter(f => f.status === 'completed').length}
            </p>
            <p className="text-sm text-purple-200">Processed</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {files.filter(f => f.status === 'processing' || f.status === 'uploading').length}
            </p>
            <p className="text-sm text-purple-200">Processing</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">
              {files.reduce((total, file) => total + (file.risksFound || 0), 0)}
            </p>
            <p className="text-sm text-purple-200">Risks Found</p>
          </CardContent>
        </Card>
      </div>

      {/* Files List */}
      <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Uploaded Documents</CardTitle>
          <CardDescription className="text-purple-200">
            View analysis results and manage your document history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <p className="text-white font-medium">No documents in history</p>
              <p className="text-purple-200 text-sm">Your analyzed documents will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                  <FileText className="h-8 w-8 text-purple-400 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <p className="text-white font-medium truncate">{file.name}</p>
                      <Badge className={getStatusColor(file.status)}>
                        {getStatusIcon(file.status)}
                        <span className="ml-1">{file.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-purple-200">
                      <span>{formatFileSize(file.size)}</span>
                      <span>Uploaded {file.uploadedAt.toLocaleDateString()}</span>
                      {file.risksFound !== undefined && (
                        <span className={file.risksFound > 0 ? 'text-red-400' : 'text-green-400'}>
                          {file.risksFound} risk{file.risksFound !== 1 ? 's' : ''} found
                        </span>
                      )}
                    </div>
                    
                    {(file.status === 'uploading' || file.status === 'processing') && (
                      <div className="mt-2">
                        <Progress value={file.progress} className="h-2" />
                        <p className="text-xs text-purple-300 mt-1">
                          {file.status === 'uploading' ? 'Uploading...' : 'Processing...'} {file.progress}%
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {file.status === 'completed' && (
                      <>
                        <Button variant="ghost" size="icon" className="text-purple-400 hover:text-white hover:bg-purple-900/30">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-teal-400 hover:text-white hover:bg-teal-900/30">
                          <Download size={16} />
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-red-400 hover:text-white hover:bg-red-900/30"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}