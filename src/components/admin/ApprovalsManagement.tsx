
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, User, CreditCard } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const ApprovalsManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { approvals, stats, approveApplication, rejectApplication } = useAppState();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'membership': return <User className="h-4 w-4" />;
      case 'loan': return <CreditCard className="h-4 w-4" />;
      case 'withdrawal': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'membership': return 'bg-blue-100 text-blue-800';
      case 'loan': return 'bg-purple-100 text-purple-800';
      case 'withdrawal': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApprovals = approvals.filter(approval => 
    activeTab === 'all' || approval.status === activeTab
  );

  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const highPriorityCount = approvals.filter(a => a.priority === 'high' && a.status === 'pending').length;

  const handleApprove = (approvalId: number) => {
    approveApplication(approvalId);
  };

  const handleReject = (approvalId: number) => {
    rejectApplication(approvalId);
  };

  return (
    <div className="animate-slide-in-right">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Approvals Management</h1>
        <p className="text-gray-600">Review pending applications and requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="card-approvals">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-cyan-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">{highPriorityCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <div className="grid gap-4">
            {filteredApprovals.map((approval) => (
              <Card key={approval.id} className="glass-card hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{approval.applicantName}</h3>
                        <Badge className={getTypeColor(approval.type)}>
                          <div className="flex items-center gap-1">
                            {getTypeIcon(approval.type)}
                            {approval.type}
                          </div>
                        </Badge>
                        <Badge className={getPriorityColor(approval.priority)}>
                          {approval.priority} priority
                        </Badge>
                        <Badge className={approval.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                       approval.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                       'bg-red-100 text-red-800'}>
                          {approval.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <p>{approval.details}</p>
                        {approval.amount && (
                          <p><span className="font-medium">Amount:</span> {formatCurrency(approval.amount)}</p>
                        )}
                        <p><span className="font-medium">Applied:</span> {approval.applicationDate}</p>
                      </div>
                    </div>
                  </div>

                  {approval.status === 'pending' && (
                    <div className="flex gap-2 justify-end">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(approval.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-300"
                        onClick={() => handleReject(approval.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ApprovalsManagement;
