
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, TrendingUp, TrendingDown } from 'lucide-react';

interface SavingsTransaction {
  id: number;
  memberName: string;
  memberId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  balance: number;
  date: string;
  description: string;
}

const SavingsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const transactions: SavingsTransaction[] = [
    {
      id: 1,
      memberName: 'John Doe',
      memberId: 'MEM001',
      type: 'deposit',
      amount: 50000,
      balance: 450000,
      date: '2024-06-18',
      description: 'Monthly savings'
    },
    {
      id: 2,
      memberName: 'Alice Johnson',
      memberId: 'MEM002',
      type: 'deposit',
      amount: 75000,
      balance: 320000,
      date: '2024-06-17',
      description: 'Bonus savings'
    },
    {
      id: 3,
      memberName: 'Bob Williams',
      memberId: 'MEM003',
      type: 'withdrawal',
      amount: 25000,
      balance: 125000,
      date: '2024-06-16',
      description: 'Emergency withdrawal'
    },
    {
      id: 4,
      memberName: 'Carol Davis',
      memberId: 'MEM004',
      type: 'deposit',
      amount: 100000,
      balance: 500000,
      date: '2024-06-15',
      description: 'Quarterly savings'
    }
  ];

  const filteredTransactions = transactions.filter(transaction =>
    transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const totalSavings = transactions.reduce((sum, t) => {
    return sum + (t.type === 'deposit' ? t.amount : -t.amount);
  }, 0);

  const totalMembers = new Set(transactions.map(t => t.memberId)).size;

  return (
    <div className="animate-slide-in-right">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Savings Management</h1>
          <p className="text-gray-600">Track member savings and transactions</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="card-savings">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Savings</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSavings)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-members">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Savers</p>
                <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-loans">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Balance</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSavings / totalMembers)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="glass-card mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by member name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{transaction.memberName}</div>
                        <div className="text-sm text-gray-500">{transaction.memberId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        <div className="flex items-center gap-1">
                          {transaction.type === 'deposit' ? 
                            <TrendingUp className="h-3 w-3" /> : 
                            <TrendingDown className="h-3 w-3" />
                          }
                          {transaction.type}
                        </div>
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(transaction.amount)}</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(transaction.balance)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{transaction.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{transaction.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SavingsManagement;
