
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Search, Eye, Upload } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const MemberDocuments = () => {
  const { members } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.membershipId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const documentTypes = [
    { key: 'idCard', label: 'ID Card', required: true },
    { key: 'passportPhoto', label: 'Passport Photo', required: true },
    { key: 'nepaBill', label: 'NEPA Bill', required: true },
    { key: 'registrationForm', label: 'Registration Form', required: true },
    { key: 'nomineeForm', label: 'Nominee Form', required: false }
  ];

  const getDocumentStatus = (member: any, docKey: string) => {
    if (member.documents && member.documents[docKey]) {
      return 'uploaded';
    }
    return documentTypes.find(dt => dt.key === docKey)?.required ? 'missing' : 'optional';
  };

  const downloadDocument = (member: any, docKey: string) => {
    if (member.documents && member.documents[docKey]) {
      // In a real app, this would download the actual file
      console.log(`Downloading ${docKey} for ${member.name}`);
      alert(`Downloading ${docKey} for ${member.name}`);
    }
  };

  if (selectedMember) {
    return (
      <div className="animate-slide-in-right">
        <Card className="glass-card max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <FileText className="h-5 w-5" />
                Documents for {selectedMember.name}
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => setSelectedMember(null)}
              >
                Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Member Information</h4>
                <p><strong>Name:</strong> {selectedMember.name}</p>
                <p><strong>Membership ID:</strong> {selectedMember.membershipId}</p>
                <p><strong>Email:</strong> {selectedMember.email}</p>
                <p><strong>Phone:</strong> {selectedMember.phone}</p>
                <p><strong>Join Date:</strong> {selectedMember.joinDate}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Document Status</h4>
                <div className="space-y-2">
                  {documentTypes.map(docType => {
                    const status = getDocumentStatus(selectedMember, docType.key);
                    return (
                      <div key={docType.key} className="flex items-center justify-between">
                        <span className="text-sm">{docType.label}</span>
                        <Badge 
                          className={
                            status === 'uploaded' ? 'bg-green-100 text-green-800' :
                            status === 'missing' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Document Files</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTypes.map(docType => {
                  const hasDocument = selectedMember.documents && selectedMember.documents[docType.key];
                  return (
                    <div key={docType.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">{docType.label}</h5>
                        {hasDocument ? (
                          <Badge className="bg-green-100 text-green-800">Uploaded</Badge>
                        ) : (
                          <Badge className={docType.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                            {docType.required ? 'Required' : 'Optional'}
                          </Badge>
                        )}
                      </div>
                      
                      {hasDocument ? (
                        <div className="space-y-2">
                          <div className="bg-gray-100 h-24 rounded flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => downloadDocument(selectedMember, docType.key)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="bg-gray-100 h-24 rounded flex items-center justify-center">
                            <Upload className="h-8 w-8 text-gray-400" />
                          </div>
                          <Button size="sm" variant="outline" className="w-full">
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedMember.signatures && (
              <div>
                <h4 className="font-semibold mb-4">Digital Signatures</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(selectedMember.signatures).map(([role, signature]) => (
                    <div key={role} className="border rounded-lg p-4">
                      <h5 className="font-medium mb-2 capitalize">{role.replace(/([A-Z])/g, ' $1')}</h5>
                      <div className="bg-gray-100 h-20 rounded flex items-center justify-center">
                        {signature ? (
                          <img src={signature as string} alt={`${role} signature`} className="max-h-16" />
                        ) : (
                          <span className="text-gray-400 text-sm">No signature</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-slide-in-right">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Member Documents</h1>
        <p className="text-gray-600">View and manage member document repository</p>
      </div>

      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name or membership ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const uploadedDocs = documentTypes.filter(dt => 
            member.documents && member.documents[dt.key]
          ).length;
          const requiredDocs = documentTypes.filter(dt => dt.required).length;
          
          return (
            <Card key={member.id} className="glass-card hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6" onClick={() => setSelectedMember(member)}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.membershipId}</p>
                  </div>
                  <Badge className={member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {member.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Documents:</span>
                    <span className={uploadedDocs >= requiredDocs ? 'text-green-600' : 'text-red-600'}>
                      {uploadedDocs}/{documentTypes.length} uploaded
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${uploadedDocs >= requiredDocs ? 'bg-green-600' : 'bg-red-600'}`}
                      style={{ width: `${(uploadedDocs / documentTypes.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <Eye className="h-4 w-4 mr-2" />
                  View Documents
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No members found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 

export default MemberDocuments;
