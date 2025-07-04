
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  UserCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText,
  Phone,
  Mail,
  MapPin,
  Users
} from 'lucide-react';
import { useSuperAdminState } from '@/hooks/useSuperAdminState';

const OnboardingManagement = () => {
  const { 
    onboardingRequests, 
    subscriptionTiers,
    approveOnboardingRequest, 
    rejectOnboardingRequest,
    getSubscriptionTierById 
  } = useSuperAdminState();
  
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const pendingRequests = onboardingRequests.filter(r => r.status === 'pending');
  const approvedRequests = onboardingRequests.filter(r => r.status === 'approved');
  const rejectedRequests = onboardingRequests.filter(r => r.status === 'rejected');

  const handleApprove = (id: string) => {
    approveOnboardingRequest(id);
    setSelectedRequest(null);
  };

  const handleReject = (id: string) => {
    rejectOnboardingRequest(id, rejectReason);
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-orange-600">{pendingRequests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedRequests.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{rejectedRequests.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-blue-600">{onboardingRequests.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {onboardingRequests.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No Onboarding Requests</h3>
              <p className="text-gray-600">New cooperative registration requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {onboardingRequests.map((request) => {
                const tier = getSubscriptionTierById(request.selectedTier);
                
                return (
                  <div key={request.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{request.cooperativeName}</h3>
                          <Badge 
                            className={
                              request.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                              request.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }
                          >
                            {request.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span>{request.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span>{request.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{request.address}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span>Expected: {request.expectedMembers} members</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">Plan:</span>
                              <Badge variant="outline" className="capitalize">
                                {tier?.name} - ₦{tier?.price?.toLocaleString()}/month
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              Submitted: {new Date(request.submittedDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {request.documents && request.documents.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Documents</h4>
                            <div className="flex gap-2">
                              {request.documents.map((doc) => (
                                <Badge key={doc.id} variant="outline" className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {doc.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {request.notes && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-1">Notes</h4>
                            <p className="text-sm text-gray-600 bg-white p-2 rounded border">
                              {request.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(request.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowRejectModal(true);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Reject Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Please provide a reason for rejecting this onboarding request:
              </p>
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleReject(selectedRequest?.id)}
                  disabled={!rejectReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && !showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedRequest.cooperativeName}</CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedRequest(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Contact Person:</span> {selectedRequest.contactPerson}</p>
                    <p><span className="font-medium">Email:</span> {selectedRequest.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedRequest.phone}</p>
                    <p><span className="font-medium">Address:</span> {selectedRequest.address}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Business Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Expected Members:</span> {selectedRequest.expectedMembers}</p>
                    <p><span className="font-medium">Selected Plan:</span> {getSubscriptionTierById(selectedRequest.selectedTier)?.name}</p>
                    <p><span className="font-medium">Status:</span> 
                      <Badge className="ml-1">
                        {selectedRequest.status}
                      </Badge>
                    </p>
                    <p><span className="font-medium">Submitted:</span> {new Date(selectedRequest.submittedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => {
                      setShowRejectModal(true);
                    }}
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Create Cooperative
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OnboardingManagement;
