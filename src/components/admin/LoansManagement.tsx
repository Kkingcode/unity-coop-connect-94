
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Eye, Calendar } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import StarRating from '../StarRating';

const LoansManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { loanApplications, members, approveLoan } = useAppState();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'repaid': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'repaid': return <CheckCircle className="h-4 w-4 text-cyan-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getMemberRating = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member?.repaymentRating;
  };

  const filteredLoans = loanApplications.filter(loan => 
    activeTab === 'all' || loan.status === activeTab
  );

  const handleApproveLoan = (loanId: string) => {
    approveLoan(loanId);
  };

  return (
    <div className="animate-slide-in-right">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Loans Management</h1>
        <p className="text-gray-600">Review and manage loan applications and repayments</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="repaid">Repaid</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <div className="grid gap-4">
            {filteredLoans.map((loan) => {
              const memberRating = getMemberRating(loan.memberId);
              const progressPercentage = loan.totalPaid && loan.amount 
                ? Math.round((loan.totalPaid / loan.amount) * 100) 
                : 0;

              return (
                <Card key={loan.id} className="glass-card hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{loan.memberName}</h3>
                          <Badge className={getStatusColor(loan.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(loan.status)}
                              {loan.status}
                            </div>
                          </Badge>
                          {memberRating && (
                            <StarRating rating={memberRating} size="sm" />
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <p><span className="font-medium">Amount:</span> {formatCurrency(loan.amount)}</p>
                            <p><span className="font-medium">Purpose:</span> {loan.purpose}</p>
                            <p><span className="font-medium">Applied:</span> {loan.applicationDate}</p>
                            {loan.fines && loan.fines > 0 && (
                              <p><span className="font-medium text-red-600">Fines:</span> {formatCurrency(loan.fines)}</p>
                            )}
                          </div>
                          <div>
                            {loan.weeklyPayment && (
                              <p><span className="font-medium">Weekly Payment:</span> {formatCurrency(loan.weeklyPayment)}</p>
                            )}
                            <p><span className="font-medium">Monthly Payment:</span> {formatCurrency(loan.monthlyPayment)}</p>
                            {loan.weeksRemaining !== undefined && (
                              <p><span className="font-medium">Weeks Remaining:</span> {loan.weeksRemaining}</p>
                            )}
                            {loan.nextPaymentDate && (
                              <p><span className="font-medium">Next Payment:</span> {loan.nextPaymentDate}</p>
                            )}
                          </div>
                        </div>

                        {/* Loan Progress for Approved Loans */}
                        {loan.status === 'approved' && loan.totalPaid !== undefined && (
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Repayment Progress</span>
                              <span className="text-sm text-gray-600">
                                {formatCurrency(loan.totalPaid || 0)} / {formatCurrency(loan.amount)} ({progressPercentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              ></div>
                            </div>
                            {loan.remainingAmount !== undefined && (
                              <p className="text-sm text-gray-600 mt-1">
                                Remaining: {formatCurrency(loan.remainingAmount)}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="text-sm text-gray-600">
                          <p><span className="font-medium">Guarantors:</span> {loan.guarantor1?.name}{loan.guarantor2 ? `, ${loan.guarantor2.name}` : ''}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => alert(`Viewing loan details for ${loan.memberName}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {loan.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveLoan(loan.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-300" onClick={() => {
                            if (confirm(`Are you sure you want to reject ${loan.memberName}'s loan application?`)) {
                              alert('Loan application rejected and member has been notified.');
                            }
                          }}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      {loan.status === 'approved' && loan.remainingAmount && loan.remainingAmount > 0 && (
                        <Button size="sm" variant="outline" className="text-blue-600 border-blue-300" onClick={() => {
                          const amount = prompt('Enter payment amount:');
                          if (amount && !isNaN(Number(amount))) {
                            alert(`Payment of ₦${amount} recorded for ${loan.memberName}`);
                          }
                        }}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Record Payment
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default LoansManagement;
