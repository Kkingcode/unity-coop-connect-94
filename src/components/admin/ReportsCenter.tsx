
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, TrendingUp, Users, CreditCard, DollarSign, Calendar } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const ReportsCenter = () => {
  const { stats, members, loans } = useAppState();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const generateReport = (reportType: string) => {
    alert(`Generating ${reportType} report...`);
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="animate-slide-in-right">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports Center</h1>
        <p className="text-gray-600">Generate and view comprehensive reports</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="card-members">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-savings">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Savings</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSavings)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-loans">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Loans</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.activeLoanAmount)}</p>
                <p className="text-xs text-gray-500">{stats.activeLoans} loans</p>
              </div>
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-approvals">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Member Activity Report</h4>
              <p className="text-sm text-gray-600 mb-3">Complete member activities for {currentMonth}</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => generateReport('Member Activity')}
              >
                <Download className="h-4 w-4 mr-2" />
                Generate PDF
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Financial Summary</h4>
              <p className="text-sm text-gray-600 mb-3">Savings and loan summary for {currentMonth}</p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => generateReport('Financial Summary')}
              >
                <Download className="h-4 w-4 mr-2" />
                Generate PDF
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Loan Performance</h4>
              <p className="text-sm text-gray-600 mb-3">Loan repayment and default analysis</p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => generateReport('Loan Performance')}
              >
                <Download className="h-4 w-4 mr-2" />
                Generate PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Member Status */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Member Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.slice(0, 6).map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-gray-600">{member.membershipId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      member.status === 'active' ? 'bg-green-100 text-green-800' :
                      member.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {member.status}
                    </Badge>
                    {member.loanBalance > 0 && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Loan: {formatCurrency(member.loanBalance)}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsCenter;
