
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, TrendingUp, DollarSign, Users, Calculator } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import SavingsAllocation from './SavingsAllocation';

const SavingsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [showAllocation, setShowAllocation] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { members, allocateSavings } = useAppState();

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.membershipId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSavings = members.reduce((sum, member) => sum + member.savings, 0);
  const averageSavings = members.length > 0 ? totalSavings / members.length : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const handleAllocateSavings = (memberId: string) => {
    setSelectedMember(memberId);
    setShowAllocation(true);
  };

  if (showAllocation) {
    return (
      <SavingsAllocation 
        memberId={selectedMember}
        onBack={() => {
          setShowAllocation(false);
          setSelectedMember('');
        }}
      />
    );
  }

  return (
    <div className="animate-slide-in-right">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Savings Management</h1>
          <p className="text-gray-600">Manage member savings and allocation</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Savings</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSavings)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Savings</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(averageSavings)}</p>
                  </div>
                  <Calculator className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Savers</p>
                    <p className="text-2xl font-bold text-purple-600">{members.filter(m => m.savings > 0).length}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                    <p className="text-2xl font-bold text-emerald-600">+12.5%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          {/* Search Bar */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Members List */}
          <div className="grid gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="glass-card hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <Badge variant="outline">{member.membershipId}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <p><span className="font-medium">Current Savings:</span></p>
                          <p className="text-lg font-bold text-green-600">{formatCurrency(member.savings)}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Total Balance:</span></p>
                          <p className="text-lg font-bold text-blue-600">{formatCurrency(member.balance)}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Last Payment:</span></p>
                          <p>{member.lastPaymentDate || 'No payments yet'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAllocateSavings(member.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Allocate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavingsManagement;
