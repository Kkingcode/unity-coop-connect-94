
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, CreditCard, DollarSign, Calendar } from 'lucide-react';
import { Screen } from '@/pages/Index';

interface TransactionHistoryProps {
  user: any;
  onNavigate: (screen: Screen) => void;
}

interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'loan' | 'repayment';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

const TransactionHistory = ({ user, onNavigate }: TransactionHistoryProps) => {
  const [filterType, setFilterType] = useState<string>('all');

  const transactions: Transaction[] = [
    {
      id: 1,
      type: 'deposit',
      amount: 50000,
      description: 'Monthly savings contribution',
      date: '2024-06-20',
      status: 'completed',
      reference: 'DEP001'
    },
    {
      id: 2,
      type: 'loan',
      amount: 150000,
      description: 'Business expansion loan',
      date: '2024-06-15',
      status: 'completed',
      reference: 'LON001'
    },
    {
      id: 3,
      type: 'repayment',
      amount: 6250,
      description: 'Weekly loan repayment',
      date: '2024-06-18',
      status: 'completed',
      reference: 'REP001'
    },
    {
      id: 4,
      type: 'deposit',
      amount: 25000,
      description: 'Special savings',
      date: '2024-06-10',
      status: 'completed',
      reference: 'DEP002'
    },
    {
      id: 5,
      type: 'withdrawal',
      amount: 20000,
      description: 'Emergency withdrawal',
      date: '2024-06-08',
      status: 'pending',
      reference: 'WTH001'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'withdrawal': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'loan': return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'repayment': return <DollarSign className="h-4 w-4 text-purple-600" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'bg-green-100 text-green-800';
      case 'withdrawal': return 'bg-red-100 text-red-800';
      case 'loan': return 'bg-blue-100 text-blue-800';
      case 'repayment': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = filterType === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filterType);

  const totalDeposits = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('member-dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-gray-600">View all your financial transactions</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="card-savings">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Deposits</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDeposits)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-loans">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Withdrawals</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalWithdrawals)}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-members">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Balance</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDeposits - totalWithdrawals)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Card className="glass-card mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2 flex-wrap">
              {['all', 'deposit', 'withdrawal', 'loan', 'repayment'].map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(type)}
                  className={filterType === type ? 'bg-primary text-white' : ''}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction List */}
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{transaction.description}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getTypeColor(transaction.type)}>
                          {transaction.type}
                        </Badge>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                        <span className="text-sm text-gray-500">Ref: {transaction.reference}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      transaction.type === 'deposit' || transaction.type === 'loan' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'deposit' || transaction.type === 'loan' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600">No transactions match the selected filter.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
