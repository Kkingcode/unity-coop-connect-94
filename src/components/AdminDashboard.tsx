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
  MessageSquare,
  BarChart3,
  Package,
  FileText,
  Archive,
  UserX,
  Lightbulb,
  Database
} from 'lucide-react';
import { Screen } from '@/pages/Index';
import { useAppState } from '@/hooks/useAppState';
import MembersManagement from './admin/MembersManagement';
import LoansManagement from './admin/LoansManagement';
import SavingsManagement from './admin/SavingsManagement';
import InvestmentManagement from './admin/InvestmentManagement';
import ApprovalsManagement from './admin/ApprovalsManagement';
import MessagesCenter from './admin/MessagesCenter';
import ReportsCenter from './admin/ReportsCenter';
import AdminSettings from './admin/AdminSettings';
import AGMManagement from './admin/AGMManagement';
import AuditTrail from './admin/AuditTrail';
import MemberDocuments from './admin/MemberDocuments';
import AutomatedFines from './admin/AutomatedFines';
import BroadcastMessaging from './admin/BroadcastMessaging';
import ReportGenerator from './admin/ReportGenerator';
import InactiveMemberTracker from './admin/InactiveMemberTracker';
import SuggestionBox from './admin/SuggestionBox';
import BackupRestore from './admin/BackupRestore';

interface AdminDashboardProps {
  user: any;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

type AdminScreen = 'dashboard' | 'members' | 'loans' | 'savings' | 'investments' | 'approvals' | 'messages' | 'reports' | 'settings' | 'agm' | 'audit' | 'documents' | 'fines' | 'broadcast' | 'generator' | 'inactive' | 'suggestions' | 'backup';

const AdminDashboard = ({ user, onNavigate, onLogout }: AdminDashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState<AdminScreen>('dashboard');
  const { stats, activities } = useAppState();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const statsData = [
    {
      title: 'Total Members',
      value: stats.totalMembers.toString(),
      change: `+${stats.totalMembers > 0 ? Math.floor(stats.totalMembers * 0.1) : 0}`,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'card-members',
      onClick: () => setActiveScreen('members')
    },
    {
      title: 'Total Savings',
      value: formatCurrency(stats.totalSavings),
      change: '+8.1%',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'card-savings',
      onClick: () => setActiveScreen('savings')
    },
    {
      title: 'Active Loans',
      value: formatCurrency(stats.activeLoanAmount),
      change: `${stats.activeLoans} loans`,
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'card-loans',
      onClick: () => setActiveScreen('loans')
    },
    {
      title: 'Investments',
      value: formatCurrency(stats.totalInvestments),
      change: 'Active',
      icon: Package,
      color: 'text-emerald-600',
      bgColor: 'card-investments',
      onClick: () => setActiveScreen('investments')
    }
  ];

  const menuItems = [
    { icon: Users, label: 'Members', screen: 'members' as AdminScreen },
    { icon: CreditCard, label: 'Loans', screen: 'loans' as AdminScreen },
    { icon: DollarSign, label: 'Savings', screen: 'savings' as AdminScreen },
    { icon: Package, label: 'Investments', screen: 'investments' as AdminScreen },
    { icon: UserCheck, label: 'Approvals', screen: 'approvals' as AdminScreen },
    { icon: MessageSquare, label: 'Messages', screen: 'messages' as AdminScreen },
    { icon: BarChart3, label: 'Reports', screen: 'reports' as AdminScreen },
    { icon: Users, label: 'AGM', screen: 'agm' as AdminScreen },
    { icon: FileText, label: 'Audit Trail', screen: 'audit' as AdminScreen },
    { icon: Archive, label: 'Documents', screen: 'documents' as AdminScreen },
    { icon: AlertTriangle, label: 'Auto Fines', screen: 'fines' as AdminScreen },
    { icon: MessageSquare, label: 'Broadcast', screen: 'broadcast' as AdminScreen },
    { icon: FileText, label: 'Report Gen', screen: 'generator' as AdminScreen },
    { icon: UserX, label: 'Inactive', screen: 'inactive' as AdminScreen },
    { icon: Lightbulb, label: 'Suggestions', screen: 'suggestions' as AdminScreen },
    { icon: Database, label: 'Backup', screen: 'backup' as AdminScreen },
    { icon: Settings, label: 'Settings', screen: 'settings' as AdminScreen },
  ];

  const handleMenuClick = (screen: AdminScreen) => {
    setActiveScreen(screen);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeScreen) {
      case 'members':
        return <MembersManagement />;
      case 'loans':
        return <LoansManagement />;
      case 'savings':
        return <SavingsManagement />;
      case 'investments':
        return <InvestmentManagement />;
      case 'approvals':
        return <ApprovalsManagement />;
      case 'messages':
        return <MessagesCenter />;
      case 'reports':
        return <ReportsCenter />;
      case 'agm':
        return <AGMManagement />;
      case 'audit':
        return <AuditTrail />;
      case 'documents':
        return <MemberDocuments />;
      case 'fines':
        return <AutomatedFines />;
      case 'broadcast':
        return <BroadcastMessaging />;
      case 'generator':
        return <ReportGenerator />;
      case 'inactive':
        return <InactiveMemberTracker />;
      case 'suggestions':
        return <SuggestionBox />;
      case 'backup':
        return <BackupRestore />;
      case 'settings':
        return <AdminSettings />;
      default:
        return (
          <div className="animate-fade-in-up">
            {/* Daily Returns Card */}
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="text-purple-700">Daily Returns Summary</CardTitle>
                <CardDescription>Total collections for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.dailyReturns.totalAmount)}</p>
                    <p className="text-sm text-green-600">Total Returns</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-lg font-semibold text-blue-600">{formatCurrency(stats.dailyReturns.loanReturns)}</p>
                    <p className="text-sm text-blue-600">Loan Returns</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-lg font-semibold text-purple-600">{formatCurrency(stats.dailyReturns.investmentReturns)}</p>
                    <p className="text-sm text-purple-600">Investment Returns</p>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <p className="text-lg font-semibold text-emerald-600">{formatCurrency(stats.dailyReturns.savings)}</p>
                    <p className="text-sm text-emerald-600">Savings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsData.map((stat, index) => (
                <Card 
                  key={index} 
                  className={`${stat.bgColor} hover:shadow-lg transition-all duration-200 cursor-pointer`}
                  onClick={stat.onClick}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                      </div>
                      <div className="bg-white/50 p-3 rounded-lg">
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                      <p className="text-2xl font-bold text-red-600">{stats.pendingApprovals}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Fines</p>
                      <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.totalFines)}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Dormant Members</p>
                      <p className="text-2xl font-bold text-gray-600">{stats.dormantMembers}</p>
                    </div>
                    <Users className="h-8 w-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-purple-700">Recent Activities</CardTitle>
                  <CardDescription>Latest member activities and transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.slice(0, 6).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>{activity.time}</span>
                            {activity.adminName && (
                              <span>• by {activity.adminName}</span>
                            )}
                            {activity.memberName && (
                              <span>• {activity.memberName}</span>
                            )}
                          </div>
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

              {/* Quick Actions */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-purple-700">Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start gap-3 bg-purple-600 hover:bg-purple-700"
                      onClick={() => setActiveScreen('members')}
                    >
                      <Users className="h-4 w-4" />
                      Manage Members
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-3"
                      onClick={() => setActiveScreen('approvals')}
                    >
                      <UserCheck className="h-4 w-4" />
                      Review Approvals ({stats.pendingApprovals})
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-3"
                      onClick={() => setActiveScreen('loans')}
                    >
                      <CreditCard className="h-4 w-4" />
                      Loan Management
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-3"
                      onClick={() => setActiveScreen('investments')}
                    >
                      <Package className="h-4 w-4" />
                      Investment Products
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="gradient-primary p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">ONCS Admin</h2>
              <p className="text-white/80 text-sm">OLORUN NI NSOGO CS</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/20"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            <Button
              variant={activeScreen === 'dashboard' ? 'default' : 'ghost'}
              className={`w-full justify-start gap-3 text-left ${activeScreen === 'dashboard' ? 'bg-purple-600 text-white' : ''}`}
              onClick={() => handleMenuClick('dashboard')}
            >
              <BarChart3 className="h-5 w-5" />
              Dashboard
            </Button>
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant={activeScreen === item.screen ? 'default' : 'ghost'}
                className={`w-full justify-start gap-3 text-left transition-all duration-200 ${
                  activeScreen === item.screen ? 'bg-purple-600 text-white' : 'hover:bg-purple-50'
                }`}
                onClick={() => handleMenuClick(item.screen)}
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
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeScreen === 'dashboard' ? 'Dashboard' : 
                   menuItems.find(item => item.screen === activeScreen)?.label || 'Dashboard'}
                </h1>
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
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
