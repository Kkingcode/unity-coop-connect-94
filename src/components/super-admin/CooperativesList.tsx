
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Search, 
  MoreVertical, 
  Eye, 
  Pause, 
  Play, 
  Trash2,
  Edit
} from 'lucide-react';
import { useSuperAdminState } from '@/hooks/useSuperAdminState';
import { Cooperative } from '@/types/multiTenant';

const CooperativesList = () => {
  const { 
    cooperatives, 
    subscriptionTiers,
    suspendCooperative, 
    reactivateCooperative, 
    deleteCooperative,
    getSubscriptionTierById 
  } = useSuperAdminState();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCoop, setSelectedCoop] = useState<Cooperative | null>(null);

  const filteredCooperatives = cooperatives.filter(coop => {
    const matchesSearch = coop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coop.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || coop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  }

  const handleAction = (action: string, coop: Cooperative) => {
    switch (action) {
      case 'suspend':
        suspendCooperative(coop.id);
        break;
      case 'reactivate':
        reactivateCooperative(coop.id);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${coop.name}? This action cannot be undone.`)) {
          deleteCooperative(coop.id);
        }
        break;
      case 'view':
        setSelectedCoop(coop);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search cooperatives by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Cooperatives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCooperatives.map((coop) => {
          const tier = getSubscriptionTierById(coop.subscriptionTier);
          const memberUsagePercent = coop.memberLimit > 0 
            ? (coop.currentMembers / coop.memberLimit) * 100 
            : 0;

          return (
            <Card key={coop.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={coop.logo} 
                      alt={coop.name}
                      className="w-12 h-12 rounded-lg object-cover border"
                    />
                    <div>
                      <CardTitle className="text-lg">{coop.name}</CardTitle>
                      <p className="text-sm text-gray-600">{coop.motto}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedCoop(coop)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Members</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {coop.currentMembers}
                      {coop.memberLimit > 0 && (
                        <span className="text-sm text-gray-600">/{coop.memberLimit}</span>
                      )}
                    </p>
                    {coop.memberLimit > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${Math.min(memberUsagePercent, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Revenue</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(coop.monthlyFee)}
                    </p>
                    <p className="text-xs text-gray-600">per month</p>
                  </div>
                </div>

                {/* Subscription Info */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Plan:</span>
                  <Badge variant="outline" className="capitalize">
                    {tier?.name}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Next Billing:</span>
                  <span className="font-medium">
                    {new Date(coop.nextBilling).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction('view', coop)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  
                  {coop.status === 'active' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction('suspend', coop)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction('reactivate', coop)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Activate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCooperatives.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Cooperatives Found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first cooperative'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Cooperative Details Modal */}
      {selectedCoop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <img 
                    src={selectedCoop.logo} 
                    alt={selectedCoop.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  {selectedCoop.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedCoop(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="font-semibold mb-3">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Contact Email:</span>
                    <p className="font-medium">{selectedCoop.contactEmail}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{selectedCoop.contactPhone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Address:</span>
                    <p className="font-medium">{selectedCoop.address}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <p className="font-medium">{new Date(selectedCoop.createdDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Settings Preview */}
              <div>
                <h4 className="font-semibold mb-3">Custom Settings</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Loan Amount:</span>
                    <span className="font-medium">{formatCurrency(selectedCoop.settings.loanSettings.maxLoanAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Default Interest Rate:</span>
                    <span className="font-medium">{selectedCoop.settings.loanSettings.defaultInterestRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Fee:</span>
                    <span className="font-medium">{formatCurrency(selectedCoop.settings.membershipSettings.registrationFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Dues:</span>
                    <span className="font-medium">{formatCurrency(selectedCoop.settings.membershipSettings.monthlyDues)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleAction('delete', selectedCoop)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CooperativesList;
