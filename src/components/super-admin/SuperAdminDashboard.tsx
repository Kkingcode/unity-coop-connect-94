
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, TrendingUp, DollarSign, Plus, Settings, BarChart3 } from 'lucide-react';
import { useSuperAdminState } from '@/hooks/useSuperAdminState';
import CooperativesList from './CooperativesList';
import AddCooperativeModal from './AddCooperativeModal';
import PlatformAnalytics from './PlatformAnalytics';

const SuperAdminDashboard = () => {
  const { analytics, cooperatives } = useSuperAdminState();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  }

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

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'cooperatives', label: 'Cooperatives', icon: Building2 },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
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
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Cooperatives</p>
                      <p className="text-3xl font-bold text-gray-900">{analytics.totalCooperatives}</p>
                      <p className="text-sm text-green-600 mt-1">+{analytics.growthRate}% this month</p>
                    </div>
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Members</p>
                      <p className="text-3xl font-bold text-gray-900">{analytics.totalMembers.toLocaleString()}</p>
                      <p className="text-sm text-green-600 mt-1">Across all cooperatives</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">{formatCurrency(analytics.monthlyRevenue)}</p>
                      <p className="text-sm text-green-600 mt-1">Active subscriptions</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                      <p className="text-3xl font-bold text-gray-900">{analytics.churnRate}%</p>
                      <p className="text-sm text-red-600 mt-1">Monthly average</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-red-600" />
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
                          <p className="text-sm text-gray-600">{coop.currentMembers} members</p>
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
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(coop.monthlyFee)}/mo
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'cooperatives' && <CooperativesList />}
        {activeTab === 'analytics' && <PlatformAnalytics />}
        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Platform settings coming soon...</p>
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
