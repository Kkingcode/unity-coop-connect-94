
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Upload, File, CheckCircle, X, Camera } from 'lucide-react';
import { Screen } from '@/pages/Index';

interface DocumentUploadProps {
  user: any;
  onNavigate: (screen: Screen) => void;
}

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: string;
  size: string;
}

const DocumentUpload = ({ user, onNavigate }: DocumentUploadProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'National ID Card',
      type: 'identity',
      status: 'approved',
      uploadDate: '2024-06-15',
      size: '2.1 MB'
    },
    {
      id: '2',
      name: 'Proof of Address',
      type: 'address',
      status: 'pending',
      uploadDate: '2024-06-18',
      size: '1.8 MB'
    }
  ]);

  const requiredDocuments = [
    {
      type: 'identity',
      title: 'Identity Document',
      description: 'National ID, Driver\'s License, or Passport',
      required: true
    },
    {
      type: 'address',
      title: 'Proof of Address',
      description: 'Utility bill or bank statement (max 3 months old)',
      required: true
    },
    {
      type: 'income',
      title: 'Proof of Income',
      description: 'Salary slip or business registration',
      required: false
    },
    {
      type: 'photo',
      title: 'Passport Photo',
      description: 'Recent passport-sized photograph',
      required: false
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(files);
      simulateUpload(files[0], docType);
    }
  };

  const simulateUpload = (file: File, docType: string) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Add the new document
          const newDoc: Document = {
            id: Date.now().toString(),
            name: file.name,
            type: docType,
            status: 'pending',
            uploadDate: new Date().toISOString().split('T')[0],
            size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
          };
          
          setDocuments(prev => [...prev, newDoc]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const getDocumentStatus = (docType: string) => {
    return documents.find(doc => doc.type === docType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('member-dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Document Upload</h1>
            <p className="text-sm text-gray-600">Upload required documents</p>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <Card className="glass-card mb-6">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium mb-2">Uploading document...</p>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-gray-600 mt-1">{uploadProgress}% complete</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Required Documents */}
        <div className="space-y-4">
          {requiredDocuments.map((docReq) => {
            const existingDoc = getDocumentStatus(docReq.type);
            
            return (
              <Card key={docReq.type} className="glass-card">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{docReq.title}</CardTitle>
                      <CardDescription className="text-sm">{docReq.description}</CardDescription>
                    </div>
                    {docReq.required && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Required</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {existingDoc ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium">{existingDoc.name}</p>
                            <p className="text-xs text-gray-600">{existingDoc.size} • {existingDoc.uploadDate}</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(existingDoc.status)}`}>
                          {getStatusIcon(existingDoc.status)}
                          {existingDoc.status}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Replace Document
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Drag & drop or click to upload</p>
                        <p className="text-xs text-gray-500">Max file size: 5MB (PDF, JPG, PNG)</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Label htmlFor={`file-${docReq.type}`} className="cursor-pointer">
                          <Button variant="outline" className="w-full" size="sm" asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload File
                            </span>
                          </Button>
                          <Input
                            id={`file-${docReq.type}`}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleFileSelect(e, docReq.type)}
                          />
                        </Label>
                        
                        <Button variant="outline" size="sm">
                          <Camera className="h-4 w-4 mr-2" />
                          Take Photo
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Upload Guidelines */}
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle className="text-base">Upload Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Documents must be clear and readable</li>
              <li>• Maximum file size: 5MB per document</li>
              <li>• Accepted formats: PDF, JPG, PNG</li>
              <li>• Processing time: 1-3 business days</li>
              <li>• You'll be notified of approval status</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentUpload;
