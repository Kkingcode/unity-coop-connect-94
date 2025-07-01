
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Users, Building2, Calendar, Activity } from 'lucide-react';
import { useSuperAdminState } from '@/hooks/useSuperAdminState';

const PlatformAnalytics = () => {
  const { analytics, cooperatives, subscriptionTiers } = useSuperAdminState();

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  }

  const tierDistribution = subscriptionTiers.map(tier => ({
    ...tier,
    count: cooperatives.filter(coop => coop.subscriptionTier === tier.id).length
  }));

  const statusDistribution = [
    { status: 'Active', count: cooperatives.filter(c => c.status === 'active').length, color: 'bg-green-500' },
    { status: 'Trial', count: cooperatives.filter(c => c.status === 'trial').length, color: 'bg-blue-500' },
    { status: 'Suspended', count: cooperatives.filter(c => c.status === 'suspended').length, color: 'bg-red-500' },
    { status: 'Expired', count: cooperatives.filter(c => c.status === 'expired').length, color: 'bg-gray-500' },
  ];

  const recentActivities = [
    { type: 'new_signup', message: 'Unity Savings & Credit joined', time: '2 hours ago' },
    { type: 'upgrade', message: 'Sunrise Society upgraded to Professional', time: '1 day ago' },
    { type: 'payment', message: 'Payment received from 3 cooperatives', time: '2 days ago' },
    { type: 'support', message: '5 new support tickets created', time: '3 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.monthlyRevenue)}</p>
                <p className="text-sm text-green-600 mt-1">+12.5% from last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Annual Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.monthlyRevenue * 12)}</p>
                <p className="text-sm text-green-600 mt-1">Projected</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Revenue per Coop</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.monthlyRevenue / Math.max(analytics.totalCooperatives, 1))}
                </p>
                <p className="text-sm text-gray-600 mt-1">per month</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.churnRate}%</p>
                <p className="text-sm text-red-600 mt-1">This month</p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Tiers Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Tiers Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tierDistribution.map((tier) => {
              const percentage = analytics.totalCooperatives > 0 
                ? (tier.count / analytics.totalCooperatives) * 100 
                : 0;
              
              return (
                <div key={tier.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <div>
                      <span className="font-medium">{tier.name}</span>
                      <p className="text-sm text-gray-600">{formatCurrency(tier.price)}/month</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">
                      {tier.count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Cooperative Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statusDistribution.map((item) => (
              <div key={item.status} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 ${item.color} rounded-full mx-auto mb-2`}></div>
                <p className="font-semibold text-lg">{item.count}</p>
                <p className="text-sm text-gray-600">{item.status}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Platform Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'new_signup' ? 'bg-green-500' :
                  activity.type === 'upgrade' ? 'bg-blue-500' :
                  activity.type === 'payment' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-gray-600">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Member Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Members</span>
                <span className="font-bold text-lg">{analytics.totalMembers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average per Cooperative</span>
                <span className="font-medium">
                  {Math.round(analytics.totalMembers / Math.max(analytics.totalCooperatives, 1))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Growth Rate</span>
                <span className="text-green-600 font-medium">+{analytics.growthRate}% monthly</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Cooperatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topPerformingCooperatives.map((coop, index) => (
                <div key={coop.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{coop.name}</p>
                      <p className="text-xs text-gray-600">{coop.currentMembers} members</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(coop.monthlyFee)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
