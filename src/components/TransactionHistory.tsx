
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Filter, Download, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { Screen } from '@/pages/Index';

interface TransactionHistoryProps {
  user: any;
  onNavigate: (screen: Screen) => void;
}

const TransactionHistory = ({ user, onNavigate }: TransactionHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const transactions = [
    {
      id: '001',
      date: '2024-06-18',
      time: '14:30',
      type: 'Credit',
      category: 'Savings',
      description: 'Monthly Savings Deposit',
      amount: 50000,
      balance: 175000,
      status: 'Completed'
    },
    {
      id: '002',
      date: '2024-06-15',
      time: '10:15',
      type: 'Debit',
      category: 'Loan',
      description: 'Loan Repayment - June',
      amount: -15000,
      balance: 125000,
      status: 'Completed'
    },
    {
      id: '003',
      date: '2024-06-10',
      time: '09:45',
      type: 'Credit',
      category: 'Dividend',
      description: 'Quarterly Dividend Payment',
      amount: 25000,
      balance: 140000,
      status: 'Completed'
    },
    {
      id: '004',
      date: '2024-06-05',
      time: '16:20',
      type: 'Debit',
      category: 'Fine',
      description: 'Late Payment Fine',
      amount: -2000,
      balance: 115000,
      status: 'Completed'
    },
    {
      id: '005',
      date: '2024-06-01',
      time: '11:30',
      type: 'Credit',
      category: 'Loan',
      description: 'Loan Disbursement',
      amount: 100000,
      balance: 117000,
      status: 'Completed'
    },
    {
      id: '006',
      date: '2024-05-30',
      time: '13:15',
      type: 'Credit',
      category: 'Savings',
      description: 'Weekly Savings',
      amount: 12000,
      balance: 17000,
      status: 'Completed'
    },
    {
      id: '007',
      date: '2024-05-25',
      time: '08:45',
      type: 'Debit',
      category: 'Withdrawal',
      description: 'Emergency Withdrawal',
      amount: -8000,
      balance: 5000,
      status: 'Completed'
    },
    {
      id: '008',
      date: '2024-05-20',
      time: '15:30',
      type: 'Credit',
      category: 'Savings',
      description: 'Monthly Contribution',
      amount: 35000,
      balance: 13000,
      status: 'Completed'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalCredits = transactions
    .filter(t => t.type === 'Credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = transactions
    .filter(t => t.type === 'Debit')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-2xl font-bold">Transaction History</h1>
            <p className="text-gray-600">View all your account activities</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Credits</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(totalCredits)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Debits</p>
                  <p className="text-lg font-bold text-red-600">{formatCurrency(totalDebits)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wallet className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Net Balance</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(totalCredits - totalDebits)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass-card mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="credit">Credits Only</SelectItem>
                  <SelectItem value="debit">Debits Only</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full md:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction List */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              {filteredTransactions.length} of {transactions.length} transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction, index) => (
                <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === 'Credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Wallet className={`h-6 w-6 ${
                          transaction.type === 'Credit' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{transaction.description}</p>
                          <Badge variant="secondary" className="text-xs">
                            {transaction.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{formatDate(transaction.date)}</span>
                          <span>{transaction.time}</span>
                          <span className="text-green-600">#{transaction.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        transaction.type === 'Credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'Credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Balance: {formatCurrency(transaction.balance)}
                      </p>
                    </div>
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

export default TransactionHistory;
