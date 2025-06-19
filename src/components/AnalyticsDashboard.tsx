
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, TrendingUp, TrendingDown, Users, DollarSign, CreditCard, Calendar } from 'lucide-react';
import { Screen } from '@/pages/Index';

interface AnalyticsDashboardProps {
  user: any;
  onNavigate: (screen: Screen) => void;
}

const AnalyticsDashboard = ({ user, onNavigate }: AnalyticsDashboardProps) => {
  const [timeRange, setTimeRange] = useState('30d');

  const stats = [
    {
      title: 'Total Loans Disbursed',
      value: '₦45.2M',
      change: '+15.3%',
      trend: 'up',
      icon: CreditCard,
      details: '234 active loans'
    },
    {
      title: 'Total Savings',
      value: '₦128.7M',
      change: '+8.9%',
      trend: 'up',
      icon: DollarSign,
      details: '1,247 members'
    },
    {
      title: 'New Members',
      value: '47',
      change: '+23.1%',
      trend: 'up',
      icon: Users,
      details: 'This month'
    },
    {
      title: 'Default Rate',
      value: '2.3%',
      change: '-0.8%',
      trend: 'down',
      icon: TrendingDown,
      details: 'Below target'
    }
  ];

  const loanTrends = [
    { month: 'Jan', approved: 25, rejected: 5, pending: 8 },
    { month: 'Feb', approved: 32, rejected: 3, pending: 6 },
    { month: 'Mar', approved: 28, rejected: 7, pending: 12 },
    { month: 'Apr', approved: 35, rejected: 4, pending: 9 },
    { month: 'May', approved: 41, rejected: 6, pending: 15 },
    { month: 'Jun', approved: 38, rejected: 2, pending: 11 }
  ];

  const savingsGrowth = [
    { month: 'Jan', amount: 85.2 },
    { month: 'Feb', amount: 92.1 },
    { month: 'Mar', amount: 98.7 },
    { month: 'Apr', amount: 105.3 },
    { month: 'May', amount: 118.9 },
    { month: 'Jun', amount: 128.7 }
  ];

  const memberActivity = [
    { category: 'Active Savers', count: 856, percentage: 68.7 },
    { category: 'Loan Recipients', count: 234, percentage: 18.8 },
    { category: 'New Members', count: 47, percentage: 3.8 },
    { category: 'Inactive', count: 110, percentage: 8.8 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('admin-dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Analytics Dashboard</h1>
              <p className="text-sm text-gray-600">Financial insights & trends</p>
            </div>
          </div>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-blue-600" />
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.details}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Loan Trends */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Loan Application Trends</CardTitle>
              <CardDescription>Monthly loan approval statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanTrends.slice(-3).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{trend.month} 2024</p>
                      <p className="text-xs text-gray-600">{trend.approved + trend.rejected + trend.pending} total applications</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">{trend.approved} approved</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">{trend.pending} pending</span>
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">{trend.rejected} rejected</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Savings Growth */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Savings Growth</CardTitle>
              <CardDescription>Monthly savings accumulation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savingsGrowth.slice(-3).map((growth, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{growth.month} 2024</p>
                      <p className="text-xs text-gray-600">Total accumulated</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">₦{growth.amount}M</p>
                      {index > 0 && (
                        <p className="text-xs text-green-600">
                          +₦{(growth.amount - savingsGrowth[savingsGrowth.length - 3 + index - 1].amount).toFixed(1)}M
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Member Activity */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Member Activity</CardTitle>
              <CardDescription>Member engagement breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memberActivity.map((activity, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{activity.category}</span>
                      <span className="text-sm text-gray-600">{activity.count} ({activity.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${activity.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Recent Admin Actions</CardTitle>
              <CardDescription>Latest administrative activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Approved loan application', user: 'John Doe', amount: '₦150,000', time: '2 hours ago' },
                  { action: 'Added new member', user: 'Alice Johnson', amount: '', time: '4 hours ago' },
                  { action: 'Applied fine', user: 'Bob Williams', amount: '₦500', time: '6 hours ago' },
                  { action: 'Processed savings deposit', user: 'Carol Davis', amount: '₦25,000', time: '8 hours ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border-l-4 border-l-blue-500 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                    </div>
                    {activity.amount && (
                      <span className="text-sm font-medium text-blue-600">{activity.amount}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <div className="mt-6 flex justify-center gap-4">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            Schedule Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
