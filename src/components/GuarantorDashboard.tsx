
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Check, X, TrendingDown, Calendar } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import StarRating from './StarRating';

interface GuarantorDashboardProps {
  user: any;
}

const GuarantorDashboard = ({ user }: GuarantorDashboardProps) => {
  const { respondToGuarantorRequest, notifications, members } = useAppState();
  const [agreedToTerms, setAgreedToTerms] = useState<{ [key: number]: boolean }>({});

  const guarantorRequests = notifications.filter(
    n => n.memberId === user.id && n.type === 'guarantor' && n.actionRequired
  );

  const handleGuarantorResponse = (notificationId: number, response: 'accepted' | 'rejected') => {
    if (response === 'accepted' && !agreedToTerms[notificationId]) {
      alert('Please agree to the terms before accepting the guarantor request.');
      return;
    }

    respondToGuarantorRequest(notificationId, response, user.id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  // Get member details for guarantor requests
  const getMemberByName = (memberName: string) => {
    return members.find(m => m.name === memberName);
  };

  return (
    <div className="space-y-6">
      {/* Guarantor Requests */}
      {guarantorRequests.length > 0 && (
        <Card className="glass-card border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Guarantor Requests ({guarantorRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {guarantorRequests.map((request) => {
              const requestMember = getMemberByName(request.title.replace('Guarantor Request from ', ''));
              
              return (
                <div key={request.id} className="border rounded-lg p-4 bg-amber-50">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-amber-900">{request.title}</h4>
                      {requestMember?.repaymentRating && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-amber-700">Repayment History:</span>
                          <StarRating rating={requestMember.repaymentRating} size="sm" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-amber-700 mt-2">{request.message}</p>
                    
                    {requestMember?.repaymentRating && requestMember.repaymentRating.totalLoans > 0 && (
                      <div className="mt-3 p-3 bg-white/50 rounded-lg">
                        <p className="text-xs font-medium text-amber-800 mb-1">Member's Loan History Summary:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-amber-700">
                          <div>Total Loans: {requestMember.repaymentRating.totalLoans}</div>
                          <div>On-time Payments: {requestMember.repaymentRating.onTimePayments + requestMember.repaymentRating.earlyPayments}</div>
                          <div>Late Payments: {requestMember.repaymentRating.latePayments}</div>
                          <div>Missed Payments: {requestMember.repaymentRating.missedPayments}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-red-800">Important Agreement:</p>
                        <p className="text-red-700">
                          If you accept this guarantor request, you will NOT be able to apply for your own loan 
                          until this borrower has completely repaid their loan. This is a serious financial commitment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      id={`terms-${request.id}`}
                      checked={agreedToTerms[request.id] || false}
                      onChange={(e) => setAgreedToTerms(prev => ({
                        ...prev,
                        [request.id]: e.target.checked
                      }))}
                      className="rounded"
                    />
                    <label htmlFor={`terms-${request.id}`} className="text-sm text-gray-700">
                      I understand and agree to the terms above
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleGuarantorResponse(request.id, 'accepted')}
                      disabled={!agreedToTerms[request.id]}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300"
                      onClick={() => handleGuarantorResponse(request.id, 'rejected')}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Active Guarantor Commitments */}
      {user.guarantorFor && user.guarantorFor.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Active Guarantor Commitments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.guarantorFor.map((commitment: any, index: number) => {
              const guaranteedMember = getMemberByName(commitment.memberName);
              
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold">{commitment.memberName}</h4>
                        {guaranteedMember?.repaymentRating && (
                          <StarRating rating={guaranteedMember.repaymentRating} size="sm" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Original Loan: {formatCurrency(commitment.loanAmount)}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      Remaining: {formatCurrency(commitment.remainingAmount)}
                    </Badge>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ 
                        width: `${((commitment.loanAmount - commitment.remainingAmount) / commitment.loanAmount) * 100}%` 
                      }}
                    ></div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Progress: {Math.round(((commitment.loanAmount - commitment.remainingAmount) / commitment.loanAmount) * 100)}% completed</span>
                  </div>

                  {commitment.isDefaulting && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">
                          Payment Overdue - Please contact {commitment.memberName}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {guarantorRequests.length === 0 && (!user.guarantorFor || user.guarantorFor.length === 0) && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <Check className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Guarantor Activities</h3>
              <p className="text-sm">You have no pending guarantor requests or active commitments.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GuarantorDashboard;
