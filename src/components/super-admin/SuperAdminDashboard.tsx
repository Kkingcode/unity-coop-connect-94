
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Settings, 
  BarChart3,
  UserCheck,
  CreditCard,
  Globe,
  Shield,
  Bell,
  HelpCircle
} from 'lucide-react';
import { useSuperAdminState } from '@/hooks/useSuperAdminState';
import CooperativesList from './CooperativesList';
import AddCooperativeModal from './AddCooperativeModal';
import PlatformAnalytics from './PlatformAnalytics';
import OnboardingManagement from './OnboardingManagement';
import BillingManagement from './BillingManagement';
import PlatformSettingsPanel from './PlatformSettingsPanel';

const SuperAdminDashboard = () => {
  const { analytics, cooperatives, onboardingRequests } = useSuperAdminState();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  }

  const pendingOnboardingCount = onboardingRequests.filter(r => r.status === 'pending').length;
  const trialCooperatives = cooperatives.filter(c => c.status === 'trial').length;
  const overduePayments = cooperatives.filter(c => 
    c.status === 'active' && new Date(c.nextBilling) < new Date()
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Alajeseku.com</h1>
                <p className="text-sm text-gray-600">Super Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(pendingOnboardingCount > 0 || overduePayments > 0) && (
                <div className="flex items-center gap-2">
                  {pendingOnboardingCount > 0 && (
                    <Badge variant="destructive" className="animate-pulse">
                      {pendingOnboardingCount} Pending
                    </Badge>
                  )}
                  {overduePayments > 0 && (
                    <Badge variant="destructive" className="animate-pulse">
                      {overduePayments} Overdue
                    </Badge>
                  )}
                </div>
              )}
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Cooperative
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'cooperatives', label: 'Cooperatives', icon: Building2 },
              { id: 'onboarding', label: 'Onboarding', icon: UserCheck, badge: pendingOnboardingCount },
              { id: 'billing', label: 'Billing', icon: CreditCard, badge: overduePayments },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'support', label: 'Support', icon: HelpCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">
                    {tab.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Cooperatives</p>
                      <p className="text-3xl font-bold">{analytics.totalCooperatives}</p>
                      <p className="text-blue-100 mt-1">+{analytics.growthRate}% this month</p>
                    </div>
                    <Building2 className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Total Members</p>
                      <p className="text-3xl font-bold">{analytics.totalMembers.toLocaleString()}</p>
                      <p className="text-green-100 mt-1">Across all cooperatives</p>
                    </div>
                    <Users className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100">Monthly Revenue</p>
                      <p className="text-3xl font-bold">{formatCurrency(analytics.monthlyRevenue)}</p>
                      <p className="text-yellow-100 mt-1">Active subscriptions</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-yellow-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Churn Rate</p>
                      <p className="text-3xl font-bold">{analytics.churnRate}%</p>
                      <p className="text-purple-100 mt-1">Monthly average</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Revenue by Tier</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(analytics.revenueByTier).map(([tier, revenue]) => (
                    <div key={tier} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          tier === 'starter' ? 'bg-blue-500' :
                          tier === 'professional' ? 'bg-green-500' : 'bg-purple-500'
                        }`} />
                        <span className="capitalize font-medium">{tier}</span>
                      </div>
                      <span className="font-bold">{formatCurrency(revenue)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Status Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active</span>
                    <Badge className="bg-green-100 text-green-800">
                      {cooperatives.filter(c => c.status === 'active').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Trial</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {trialCooperatives}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Suspended</span>
                    <Badge className="bg-red-100 text-red-800">
                      {cooperatives.filter(c => c.status === 'suspended').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Expired</span>
                    <Badge className="bg-gray-100 text-gray-800">
                      {cooperatives.filter(c => c.status === 'expired').length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-gray-600">New cooperative registered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-gray-600">Payment received</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-gray-600">Support ticket opened</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span className="text-gray-600">System update completed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Cooperatives */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Cooperatives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cooperatives.slice(0, 5).map((coop) => (
                    <div key={coop.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img 
                          src={coop.logo} 
                          alt={coop.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{coop.name}</h4>
                          <p className="text-sm text-gray-600">{coop.currentMembers} members • {coop.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          className={
                            coop.status === 'active' ? 'bg-green-100 text-green-800' :
                            coop.status === 'trial' ? 'bg-blue-100 text-blue-800' :
                            coop.status === 'suspended' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {coop.status}
                        </Badge>
                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(coop.monthlyFee)}
                          </span>
                          <p className="text-xs text-gray-600">per month</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'cooperatives' && <CooperativesList />}
        {activeTab === 'onboarding' && <OnboardingManagement />}
        {activeTab === 'billing' && <BillingManagement />}
        {activeTab === 'analytics' && <PlatformAnalytics />}
        {activeTab === 'settings' && <PlatformSettingsPanel />}
        {activeTab === 'support' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Support Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert('Platform notification sent to all cooperatives!')}>
                      <Bell className="h-4 w-4 mr-2" />
                      Send Platform Notification
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert('System maintenance mode activated. All cooperatives have been notified.')}>
                      <Globe className="h-4 w-4 mr-2" />
                      System Maintenance Mode
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert('Security audit log generated and downloaded successfully!')}>
                      <Shield className="h-4 w-4 mr-2" />
                      Security Audit Log
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Platform Health</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">System Status</span>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Server Uptime</span>
                      <span className="font-medium">99.9%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Active Sessions</span>
                      <span className="font-medium">234</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Cooperative Modal */}
      {showAddModal && (
        <AddCooperativeModal 
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default SuperAdminDashboard;
