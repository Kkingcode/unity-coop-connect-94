
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, FileText, BarChart3, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const ReportGenerator = () => {
  const { members, loans, investments, activities, stats } = useAppState();
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const generateCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateMembersReport = () => {
    const membersData = members.map(member => ({
      'Member ID': member.membershipId,
      'Name': member.name,
      'Email': member.email,
      'Phone': member.phone,
      'Status': member.status,
      'Join Date': member.joinDate,
      'Balance': member.balance,
      'Loan Balance': member.loanBalance,
      'Investment Balance': member.investmentBalance,
      'Fines': member.fines,
      'Town': member.town,
      'State': member.stateOfOrigin
    }));
    generateCSV(membersData, 'members-report');
  };

  const generateLoansReport = () => {
    const loansData = loans.map(loan => ({
      'Loan ID': loan.id,
      'Member Name': loan.memberName,
      'Member ID': loan.memberId,
      'Amount': loan.amount,
      'Purpose': loan.purpose,
      'Status': loan.status,
      'Application Date': loan.applicationDate,
      'Weekly Payment': loan.weeklyPayment,
      'Weeks Remaining': loan.weeksRemaining,
      'Fines': loan.fines,
      'Next Payment Date': loan.nextPaymentDate
    }));
    generateCSV(loansData, 'loans-report');
  };

  const generateInvestmentsReport = () => {
    const investmentData: any[] = [];
    investments.forEach(investment => {
      investment.applications.forEach(app => {
        investmentData.push({
          'Investment ID': investment.id,
          'Product Name': investment.productName,
          'Member Name': app.memberName,
          'Member ID': app.memberId,
          'Quantity': app.quantity,
          'Total Amount': app.totalAmount,
          'Status': app.status,
          'Application Date': app.applicationDate,
          'Remaining Amount': app.remainingAmount,
          'Weeks Remaining': app.weeksRemaining
        });
      });
    });
    generateCSV(investmentData, 'investments-report');
  };

  const generateFinancialSummary = () => {
    const summaryData = [{
      'Total Members': stats.totalMembers,
      'Active Members': members.filter(m => m.status === 'active').length,
      'Total Savings': stats.totalSavings,
      'Total Loans': stats.totalLoans,
      'Active Loans': stats.activeLoans,
      'Active Loan Amount': stats.activeLoanAmount,
      'Total Investments': stats.totalInvestments,
      'Total Fines': stats.totalFines,
      'Pending Approvals': stats.pendingApprovals,
      'Dormant Members': stats.dormantMembers,
      'Report Date': new Date().toLocaleDateString()
    }];
    generateCSV(summaryData, 'financial-summary');
  };

  const generateActivitiesReport = () => {
    const activitiesData = activities
      .filter(activity => {
        const activityDate = new Date(activity.time);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        return activityDate >= fromDate && activityDate <= toDate;
      })
      .map(activity => ({
        'Date': activity.time,
        'Type': activity.type,
        'Description': activity.description,
        'Amount': activity.amount || '',
        'Admin': activity.adminName || '',
        'Member': activity.memberName || ''
      }));
    generateCSV(activitiesData, 'activities-report');
  };

  const reportTypes = [
    {
      title: 'Members Report',
      description: 'Complete member information and status',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: generateMembersReport,
      count: members.length
    },
    {
      title: 'Loans Report',
      description: 'All loan applications and repayment status',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: generateLoansReport,
      count: loans.length
    },
    {
      title: 'Investments Report',
      description: 'Investment applications and progress',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: generateInvestmentsReport,
      count: investments.reduce((sum, inv) => sum + inv.applications.length, 0)
    },
    {
      title: 'Financial Summary',
      description: 'Overall financial health and statistics',
      icon: BarChart3,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      action: generateFinancialSummary,
      count: 1
    },
    {
      title: 'Activities Report',
      description: 'All system activities within date range',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: generateActivitiesReport,
      count: activities.length
    }
  ];

  return (
    <div className="animate-slide-in-right">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Generator</h1>
        <p className="text-gray-600">Generate and export detailed reports</p>
      </div>

      {/* Date Range Filter */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Date Range Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">From Date</label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To Date</label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalMembers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Savings</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalSavings)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Loans</p>
                <p className="text-2xl font-bold text-purple-600">{stats.activeLoans}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Fines</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalFines)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report, index) => (
          <Card key={index} className="glass-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className={`w-12 h-12 ${report.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <report.icon className={`h-6 w-6 ${report.color}`} />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{report.description}</p>
              
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {report.count} records
                </Badge>
                <Button 
                  onClick={report.action}
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Report Builder */}
      <Card className="glass-card mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Custom Report Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Custom Reports Coming Soon</h3>
            <p className="text-gray-600">
              Build custom reports with specific filters and data combinations
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;
