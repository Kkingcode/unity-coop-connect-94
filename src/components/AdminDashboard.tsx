
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu,
  X,
  Users,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Bell,
  Settings,
  LogOut,
  DollarSign,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import { Screen } from '@/pages/Index';

interface AdminDashboardProps {
  user: any;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

const AdminDashboard = ({ user, onNavigate, onLogout }: AdminDashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      title: 'Total Members',
      value: '1,247',
      change: '+12',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Loans',
      value: '₦12.5M',
      change: '+5.2%',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Savings',
      value: '₦45.8M',
      change: '+8.1%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Pending Approvals',
      value: '23',
      change: '+3',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentActivities = [
    { id: 1, type: 'loan', description: 'New loan application from John Doe', amount: '₦150,000', time: '2 min ago' },
    { id: 2, type: 'member', description: 'New member registration: Alice Johnson', amount: '', time: '15 min ago' },
    { id: 3, type: 'payment', description: 'Loan repayment from Bob Williams', amount: '₦25,000', time: '1 hour ago' },
    { id: 4, type: 'savings', description: 'Savings deposit from Carol Davis', amount: '₦50,000', time: '2 hours ago' },
  ];

  const pendingApprovals = [
    { id: 1, member: 'John Doe', type: 'Loan Application', amount: '₦150,000', status: 'pending' },
    { id: 2, member: 'Alice Johnson', type: 'Membership', amount: '', status: 'pending' },
    { id: 3, member: 'Bob Williams', type: 'Loan Extension', amount: '₦75,000', status: 'pending' },
  ];

  const menuItems = [
    { icon: Users, label: 'Members', action: () => {} },
    { icon: CreditCard, label: 'Loans', action: () => {} },
    { icon: DollarSign, label: 'Savings', action: () => {} },
    { icon: UserCheck, label: 'Approvals', action: () => {} },
    { icon: MessageSquare, label: 'Messages', action: () => {} },
    { icon: TrendingUp, label: 'Reports', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">ONCS Admin</h2>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start gap-3 text-left"
                onClick={item.action}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest member activities and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.description}</p>
                        <p className="text-xs text-gray-600">{activity.time}</p>
                      </div>
                      {activity.amount && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.amount}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Items requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.member}</p>
                        <p className="text-xs text-gray-600">{item.type}</p>
                        {item.amount && <p className="text-xs text-blue-600 font-medium">{item.amount}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                          Reject
                        </Button>
                        <Button size="sm" className="text-xs px-2 py-1">
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
