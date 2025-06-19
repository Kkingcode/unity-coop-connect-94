
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  CreditCard, 
  History, 
  Bell, 
  Target,
  Eye,
  EyeOff,
  TrendingUp,
  Wallet,
  LogOut
} from 'lucide-react';
import { Screen } from '@/pages/Index';
import BottomNavigation from '@/components/BottomNavigation';

interface MemberDashboardProps {
  user: any;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

const MemberDashboard = ({ user, onNavigate, onLogout }: MemberDashboardProps) => {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const quickActions = [
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Apply for Loan',
      description: 'Quick loan application',
      color: 'bg-blue-500',
      action: () => onNavigate('loan-application')
    },
    {
      icon: <History className="h-6 w-6" />,
      title: 'Transactions',
      description: 'View transaction history',
      color: 'bg-green-500',
      action: () => onNavigate('transaction-history')
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Savings Goal',
      description: 'Set and track goals',
      color: 'bg-purple-500',
      action: () => {}
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: 'Notifications',
      description: '3 new messages',
      color: 'bg-orange-500',
      action: () => {}
    }
  ];

  const recentTransactions = [
    { id: 1, type: 'Credit', amount: 50000, description: 'Monthly Savings', date: '2024-06-18' },
    { id: 2, type: 'Debit', amount: -15000, description: 'Loan Repayment', date: '2024-06-15' },
    { id: 3, type: 'Credit', amount: 25000, description: 'Dividend Payment', date: '2024-06-10' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="gradient-primary text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome back,</h1>
            <p className="text-blue-100">{user?.name || 'Member'}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Balance Card */}
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {showBalance ? formatCurrency(user?.balance || 0) : '••••••••'}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowBalance(!showBalance)}
                  >
                    {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-green-600 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">+12.5%</span>
                </div>
                <p className="text-xs text-gray-500">This month</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Savings</p>
                <p className="font-semibold text-gray-900">
                  {showBalance ? formatCurrency(user?.savings || 0) : '••••••'}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Loan Balance</p>
                <p className="font-semibold text-red-600">
                  {showBalance ? formatCurrency(user?.loanBalance || 0) : '••••••'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="glass-card hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105"
              onClick={action.action}
            >
              <CardContent className="p-4">
                <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 text-white`}>
                  {action.icon}
                </div>
                <h3 className="font-medium mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigate('transaction-history')}
          >
            View All
          </Button>
        </div>
        
        <Card className="glass-card">
          <CardContent className="p-0">
            {recentTransactions.map((transaction, index) => (
              <div key={transaction.id} className={`p-4 flex justify-between items-center ${index !== recentTransactions.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'Credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Wallet className={`h-5 w-5 ${transaction.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-600">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'Credit' ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                  </p>
                  <Badge variant={transaction.type === 'Credit' ? 'default' : 'destructive'} className="text-xs">
                    {transaction.type}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} onNavigate={onNavigate} />
    </div>
  );
};

export default MemberDashboard;
