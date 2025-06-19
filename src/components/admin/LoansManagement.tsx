
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

interface Loan {
  id: number;
  memberName: string;
  memberId: string;
  amount: number;
  purpose: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'repaid';
  guarantors: string[];
  repaymentPeriod: number;
  interestRate: number;
}

const LoansManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const loans: Loan[] = [
    {
      id: 1,
      memberName: 'John Doe',
      memberId: 'MEM001',
      amount: 150000,
      purpose: 'Business expansion',
      applicationDate: '2024-06-15',
      status: 'pending',
      guarantors: ['Alice Johnson', 'Bob Williams'],
      repaymentPeriod: 12,
      interestRate: 10
    },
    {
      id: 2,
      memberName: 'Alice Johnson',
      memberId: 'MEM002',
      amount: 200000,
      purpose: 'Home improvement',
      applicationDate: '2024-06-10',
      status: 'approved',
      guarantors: ['John Doe', 'Carol Davis'],
      repaymentPeriod: 18,
      interestRate: 10
    },
    {
      id: 3,
      memberName: 'Bob Williams',
      memberId: 'MEM003',
      amount: 75000,
      purpose: 'Emergency medical',
      applicationDate: '2024-06-08',
      status: 'repaid',
      guarantors: ['John Doe'],
      repaymentPeriod: 6,
      interestRate: 8
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'repaid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'repaid': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredLoans = loans.filter(loan => 
    activeTab === 'all' || loan.status === activeTab
  );

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
            {filteredLoans.map((loan) => (
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
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><span className="font-medium">Amount:</span> {formatCurrency(loan.amount)}</p>
                          <p><span className="font-medium">Purpose:</span> {loan.purpose}</p>
                          <p><span className="font-medium">Applied:</span> {loan.applicationDate}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Repayment:</span> {loan.repaymentPeriod} months</p>
                          <p><span className="font-medium">Interest:</span> {loan.interestRate}%</p>
                          <p><span className="font-medium">Guarantors:</span> {loan.guarantors.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {loan.status === 'pending' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default LoansManagement;
