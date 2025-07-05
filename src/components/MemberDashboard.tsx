
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  DollarSign, 
  TrendingUp, 
  Bell, 
  FileText, 
  CreditCard,
  Package,
  LogOut,
  AlertTriangle,
  Star
} from 'lucide-react';
import { Screen } from '@/pages/Index';
import { useAppState } from '@/hooks/useAppState';
import StarRating from './StarRating';

interface MemberDashboardProps {
  user: any;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

const MemberDashboard = ({ user, onNavigate, onLogout }: MemberDashboardProps) => {
  const { investments, canMemberApplyForLoan } = useAppState();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  // Check if user has any investments
  const userInvestments = investments.filter(inv => 
    inv.applications.some(app => app.memberId === user.id)
  );

  const hasOverdueInvestments = userInvestments.some(inv => {
    const userApp = inv.applications.find(app => app.memberId === user.id);
    if (!userApp) return false;
    
    const startDate = new Date(userApp.applicationDate);
    const endDate = new Date(startDate.getTime() + (inv.totalWeeks * 7 * 24 * 60 * 60 * 1000));
    const today = new Date();
    const isOverdue = today > endDate && userApp.remainingAmount > 0;
    
    return isOverdue;
  });

  const eligibility = canMemberApplyForLoan(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
              <p className="text-gray-600">Member ID: {user.membershipId || user.id}</p>
              {user.repaymentRating && (
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg border">
                  <span className="text-sm font-medium text-gray-700">Your Credit Rating:</span>
                  <StarRating rating={user.repaymentRating} size="md" showTooltip={true} />
                </div>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Credit Rating Card - Prominent Display */}
        {user.repaymentRating && (
          <Card className="glass-card mb-6 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Your Loan Repayment Rating</h3>
                    <p className="text-sm text-gray-600">Based on your payment history and consistency</p>
                  </div>
                </div>
                <div className="text-right">
                  <StarRating rating={user.repaymentRating} size="lg" showTooltip={true} />
                  <p className="text-xs text-gray-500 mt-1">
                    {user.repaymentRating.totalLoans > 0 ? 
                      `Based on ${user.repaymentRating.totalLoans} loan(s)` : 
                      'New member - Build your rating!'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loan Eligibility Alert */}
        {!eligibility.canApply && (
          <Card className="border-amber-200 bg-amber-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Loan Application Restricted</p>
                  <p className="text-sm text-amber-600">{eligibility.reason}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overdue Investment Alert */}
        {hasOverdueInvestments && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Investment Payment Overdue!</p>
                  <p className="text-sm text-red-600">You have overdue investment payments. Please check your investments section.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(user.balance)}</div>
              <p className="text-xs text-muted-foreground">Available funds</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(user.savings)}</div>
              <p className="text-xs text-muted-foreground">Total savings</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loan Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(user.loanBalance || 0)}</div>
              <p className="text-xs text-muted-foreground">Outstanding loan</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className={`glass-card hover:shadow-lg transition-all duration-200 ${
              eligibility.canApply ? 'cursor-pointer hover:border-blue-300' : 'opacity-50 cursor-not-allowed'
            }`} 
            onClick={() => eligibility.canApply && onNavigate('loan-application')}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${eligibility.canApply ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <CreditCard className={`h-6 w-6 ${eligibility.canApply ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="font-semibold">Apply for Loan</h3>
                  <p className="text-sm text-gray-600">
                    {eligibility.canApply ? 'Submit a new loan application' : 'Currently restricted'}
                  </p>
                  {!eligibility.canApply && (
                    <p className="text-xs text-red-500 mt-1">Improve your rating to unlock</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-purple-300" onClick={() => onNavigate('member-investments')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Investments</h3>
                    {hasOverdueInvestments && (
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        Overdue
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">View and manage investments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-green-300" onClick={() => onNavigate('transaction-history')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Transaction History</h3>
                  <p className="text-sm text-gray-600">View all transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-yellow-300" onClick={() => onNavigate('notifications-center')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Bell className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-sm text-gray-600">Check your messages</p>
                  <Badge className="bg-red-500 text-white text-xs mt-1">3 New</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-gray-300" onClick={() => alert('Profile settings feature coming soon!')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Profile Settings</h3>
                  <p className="text-sm text-gray-600">Update your information</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="glass-card mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Monthly Savings Contribution</p>
                  <p className="text-sm text-gray-600">December 2024</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Loan Payment</p>
                  <p className="text-sm text-gray-600">November 2024</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Processed</Badge>
              </div>
              {userInvestments.length > 0 && (
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Investment Payment</p>
                    <p className="text-sm text-gray-600">Check investments section</p>
                  </div>
                  <Badge className={hasOverdueInvestments ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                    {hasOverdueInvestments ? "Overdue" : "Active"}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDashboard;
