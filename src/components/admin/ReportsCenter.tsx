
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, TrendingDown, Users, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const ReportsCenter = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const loanTrendsData = [
    { month: 'Jan', approved: 12, rejected: 3, amount: 2400000 },
    { month: 'Feb', approved: 15, rejected: 2, amount: 3200000 },
    { month: 'Mar', approved: 18, rejected: 4, amount: 3800000 },
    { month: 'Apr', approved: 14, rejected: 1, amount: 2900000 },
    { month: 'May', approved: 20, rejected: 3, amount: 4200000 },
    { month: 'Jun', approved: 16, rejected: 2, amount: 3500000 }
  ];

  const savingsGrowthData = [
    { month: 'Jan', amount: 15000000 },
    { month: 'Feb', amount: 18000000 },
    { month: 'Mar', amount: 22000000 },
    { month: 'Apr', amount: 25000000 },
    { month: 'May', amount: 28000000 },
    { month: 'Jun', amount: 32000000 }
  ];

  const membershipData = [
    { name: 'Active', value: 847, color: '#22c55e' },
    { name: 'Inactive', value: 123, color: '#f59e0b' },
    { name: 'Suspended', value: 45, color: '#ef4444' }
  ];

  const loanStatusData = [
    { name: 'Active', value: 245, color: '#6c4ab6' },
    { name: 'Repaid', value: 189, color: '#22c55e' },
    { name: 'Overdue', value: 34, color: '#ef4444' }
  ];

  return (
    <div className="animate-slide-in-right">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights and data exports</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export All Reports
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="card-members">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5.2% from last month
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-loans">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Loans</p>
                <p className="text-2xl font-bold text-gray-900">245</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.3% from last month
                </div>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-savings">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Savings</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(32000000)}</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.7% from last month
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-approvals">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Loan Default Rate</p>
                <p className="text-2xl font-bold text-gray-900">2.3%</p>
                <div className="flex items-center text-red-600 text-sm mt-1">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -0.5% from last month
                </div>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Loan Trends */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Loan Approval Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={loanTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="approved" fill="#6c4ab6" name="Approved" />
                <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Savings Growth */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Savings Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={savingsGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Status Distribution */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Member Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={membershipData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {membershipData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Loan Status Distribution */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Loan Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={loanStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {loanStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsCenter;
