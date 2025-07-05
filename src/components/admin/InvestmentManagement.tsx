
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package, Users, TrendingUp, Eye, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const InvestmentManagement = () => {
  const { investments, createInvestment, stats, addAdminLog } = useAppState();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newInvestment, setNewInvestment] = useState({
    productName: '',
    description: '',
    unitPrice: '',
    totalWeeks: '52',
    totalUnits: '',
    productImages: [] as string[]
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  // Calculate total investment money to be returned
  const calculateTotalInvestmentReturns = () => {
    return investments.reduce((total, investment) => {
      return total + investment.applications.reduce((investmentTotal, app) => {
        return investmentTotal + (app.status === 'approved' ? app.remainingAmount : 0);
      }, 0);
    }, 0);
  };

  // Get defaulting members
  const getDefaultingMembers = () => {
    const defaulters: any[] = [];
    investments.forEach(investment => {
      investment.applications.forEach(app => {
        if (app.status === 'approved' && app.weeksRemaining <= 0 && app.remainingAmount > 0) {
          defaulters.push({
            ...app,
            productName: investment.productName,
            investmentId: investment.id
          });
        }
      });
    });
    return defaulters;
  };

  const handleCreateInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const investment = {
      productName: newInvestment.productName,
      productImages: newInvestment.productImages,
      description: newInvestment.description,
      unitPrice: Number(newInvestment.unitPrice),
      totalWeeks: Number(newInvestment.totalWeeks),
      availableUnits: Number(newInvestment.totalUnits),
      totalUnits: Number(newInvestment.totalUnits),
      status: 'active' as const
    };

    createInvestment(investment);
    
    // Log the activity
    addAdminLog('ADMIN001', 'Admin User', 'Investment Created', 
      `Created new investment "${investment.productName}" with ${investment.totalUnits} units at ${formatCurrency(investment.unitPrice)} each`);

    setShowCreateForm(false);
    setNewInvestment({
      productName: '',
      description: '',
      unitPrice: '',
      totalWeeks: '52',
      totalUnits: '',
      productImages: []
    });
    
    alert('Investment product created successfully and broadcasted to all members!');
  };

  const handleGiveGracePeriod = (investmentId: string, memberId: string) => {
    // Add 3 weeks grace period
    addAdminLog('ADMIN001', 'Admin User', 'Grace Period Extended', 
      `Extended 3 weeks grace period for member ${memberId} on investment ${investmentId}`);
    alert('3 weeks grace period has been granted to the member.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalInvestmentReturns = calculateTotalInvestmentReturns();
  const defaultingMembers = getDefaultingMembers();

  if (showCreateForm) {
    return (
      <div className="animate-slide-in-right">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Investment Product</h1>
            <p className="text-gray-600">Add a new investment opportunity for members</p>
          </div>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            Cancel
          </Button>
        </div>

        <Card className="glass-card">
          <CardContent className="p-6">
            <form onSubmit={handleCreateInvestment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <Input
                    value={newInvestment.productName}
                    onChange={(e) => setNewInvestment(prev => ({ ...prev, productName: e.target.value }))}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Unit Price (₦) *</label>
                  <Input
                    type="number"
                    value={newInvestment.unitPrice}
                    onChange={(e) => setNewInvestment(prev => ({ ...prev, unitPrice: e.target.value }))}
                    placeholder="Enter price per unit"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Total Units Available *</label>
                  <Input
                    type="number"
                    value={newInvestment.totalUnits}
                    onChange={(e) => setNewInvestment(prev => ({ ...prev, totalUnits: e.target.value }))}
                    placeholder="Enter total units"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Repayment Period (weeks) *</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={newInvestment.totalWeeks}
                    onChange={(e) => setNewInvestment(prev => ({ ...prev, totalWeeks: e.target.value }))}
                    required
                  >
                    <option value="26">26 weeks (6 months)</option>
                    <option value="52">52 weeks (1 year)</option>
                    <option value="78">78 weeks (1.5 years)</option>
                    <option value="104">104 weeks (2 years)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Description *</label>
                <Textarea
                  value={newInvestment.description}
                  onChange={(e) => setNewInvestment(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the investment product, benefits, and terms"
                  required
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Upload product images (Max 2 images)</p>
                  <Button type="button" variant="outline" className="mt-2" onClick={() => alert('Image upload feature coming soon!')}>
                    Choose Images
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Create Investment Product
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-slide-in-right">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Management</h1>
          <p className="text-gray-600">Manage investment products and member applications</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Investment
        </Button>
      </div>

      {/* Investment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="card-investments">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Returns Expected</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvestmentReturns)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-investments">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">{investments.filter(i => i.status === 'active').length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-investments">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">
                  {investments.reduce((sum, inv) => sum + inv.applications.length, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-investments border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Defaulting Members</p>
                <p className="text-2xl font-bold text-red-600">{defaultingMembers.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Defaulting Members Alert */}
      {defaultingMembers.length > 0 && (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Defaulting Members Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {defaultingMembers.map((defaulter, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-red-900">{defaulter.memberName}</p>
                    <p className="text-sm text-red-700">
                      {defaulter.productName} - {formatCurrency(defaulter.remainingAmount)} overdue
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-red-300 text-red-700 hover:bg-red-100"
                    onClick={() => handleGiveGracePeriod(defaulter.investmentId, defaulter.memberId)}
                  >
                    Give 3 Weeks Grace
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Products Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="active">Active Investments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6">
            {investments.map((investment) => (
              <Card key={investment.id} className="glass-card hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{investment.productName}</h3>
                        <Badge className={getStatusColor(investment.status)}>
                          {investment.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{investment.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Unit Price</p>
                          <p className="font-medium">{formatCurrency(investment.unitPrice)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Available Units</p>
                          <p className="font-medium">{investment.availableUnits}/{investment.totalUnits}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Repayment Period</p>
                          <p className="font-medium">{investment.totalWeeks} weeks</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Applications</p>
                          <p className="font-medium">{investment.applications.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => alert(`Viewing details for ${investment.productName}`)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {investment.status === 'active' && (
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => {
                        if (confirm(`Are you sure you want to close ${investment.productName}?`)) {
                          alert('Investment closed successfully!');
                        }
                      }}>
                        Close Investment
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {investments.length === 0 && (
              <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Investment Products</h3>
                  <p className="text-gray-600 mb-4">Create your first investment product to get started</p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Investment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <div className="space-y-4">
            {investments.map((investment) => 
              investment.applications.map((application) => (
                <Card key={`${investment.id}-${application.memberId}`} className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{application.memberName}</h4>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <p>Product: {investment.productName}</p>
                          </div>
                          <div>
                            <p>Quantity: {application.quantity} units</p>
                          </div>
                          <div>
                            <p>Total: {formatCurrency(application.totalAmount)}</p>
                          </div>
                          <div>
                            <p>Applied: {new Date(application.applicationDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      {application.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => {
                            if (confirm(`Approve ${application.memberName}'s investment application?`)) {
                              alert(`${application.memberName}'s investment application approved!`);
                            }
                          }}>
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => {
                            if (confirm(`Reject ${application.memberName}'s investment application?`)) {
                              alert(`${application.memberName}'s investment application rejected.`);
                            }
                          }}>
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <div className="space-y-4">
            {investments.map((investment) => 
              investment.applications
                .filter(app => app.status === 'approved')
                .map((application) => (
                  <Card key={`active-${investment.id}-${application.memberId}`} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{application.memberName}</h4>
                            <Badge className="bg-blue-100 text-blue-800">
                              {application.weeksRemaining} weeks remaining
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <p>Product: {investment.productName}</p>
                            </div>
                            <div>
                              <p>Remaining: {formatCurrency(application.remainingAmount)}</p>
                            </div>
                            <div>
                              <p>Weekly Payment: {formatCurrency(application.totalAmount / investment.totalWeeks)}</p>
                            </div>
                            <div>
                              <p>Progress: {Math.round(((application.totalAmount - application.remainingAmount) / application.totalAmount) * 100)}%</p>
                            </div>
                          </div>
                        </div>
                        
                        <Button size="sm" variant="outline" onClick={() => alert(`Viewing investment details for ${application.memberName}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestmentManagement;
