
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Download,
  Search,
  Filter,
  Send
} from 'lucide-react';
import { useSuperAdminState } from '@/hooks/useSuperAdminState';

const BillingManagement = () => {
  const { cooperatives, analytics } = useSuperAdminState();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  }

  const overdueCooperatives = cooperatives.filter(c => 
    c.status === 'active' && new Date(c.nextBilling) < new Date()
  );

  const upcomingBilling = cooperatives.filter(c => {
    const nextBilling = new Date(c.nextBilling);
    const today = new Date();
    const daysDiff = Math.ceil((nextBilling.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDiff <= 7 && daysDiff > 0;
  });

  const paidThisMonth = cooperatives.filter(c => {
    const lastPayment = new Date(c.lastPayment);
    const thisMonth = new Date();
    return lastPayment.getMonth() === thisMonth.getMonth() && 
           lastPayment.getFullYear() === thisMonth.getFullYear();
  });

  const filteredCooperatives = cooperatives.filter(coop => {
    const matchesSearch = coop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'overdue' && overdueCooperatives.includes(coop)) ||
      (statusFilter === 'upcoming' && upcomingBilling.includes(coop)) ||
      (statusFilter === 'paid' && paidThisMonth.includes(coop));
    return matchesSearch && matchesStatus;
  });

  const getBillingStatus = (coop: any) => {
    const nextBilling = new Date(coop.nextBilling);
    const today = new Date();
    const daysDiff = Math.ceil((nextBilling.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return 'overdue';
    if (daysDiff <= 7) return 'upcoming';
    if (paidThisMonth.includes(coop)) return 'paid';
    return 'current';
  };

  const getBillingStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Billing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Monthly Revenue</p>
                <p className="text-3xl font-bold">{formatCurrency(analytics.monthlyRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Paid This Month</p>
                <p className="text-3xl font-bold">{paidThisMonth.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Upcoming (7 days)</p>
                <p className="text-3xl font-bold">{upcomingBilling.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Overdue</p>
                <p className="text-3xl font-bold">{overdueCooperatives.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4 mr-2" />
              Send Payment Reminders
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Billing Report
            </Button>
            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Process Manual Payment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Billing Overview</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search cooperatives..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid This Month</option>
                <option value="upcoming">Upcoming (7 days)</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCooperatives.map((coop) => {
              const billingStatus = getBillingStatus(coop);
              const nextBilling = new Date(coop.nextBilling);
              const lastPayment = new Date(coop.lastPayment);
              
              return (
                <div key={coop.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img 
                        src={coop.logo} 
                        alt={coop.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{coop.name}</h3>
                        <p className="text-sm text-gray-600">{coop.contactEmail}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant="outline" className="capitalize">
                            {coop.subscriptionTier}
                          </Badge>
                          <Badge className={getBillingStatusColor(billingStatus)}>
                            {billingStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(coop.monthlyFee)}
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Last: {lastPayment.toLocaleDateString()}</div>
                        <div>Next: {nextBilling.toLocaleDateString()}</div>
                      </div>
                      <div className="mt-2">
                        {billingStatus === 'overdue' && (
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Send Reminder
                          </Button>
                        )}
                        {billingStatus === 'upcoming' && (
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        )}
                        {billingStatus === 'paid' && (
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Paid
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {billingStatus === 'overdue' && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-red-800 font-medium">Payment Overdue</span>
                      </div>
                      <p className="text-red-700 text-sm mt-1">
                        Payment was due on {nextBilling.toLocaleDateString()}. 
                        Consider sending a reminder or suspending services.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
            
            {filteredCooperatives.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No Billing Records Found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Billing records will appear here'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingManagement;
