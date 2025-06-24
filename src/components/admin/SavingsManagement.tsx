
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const SavingsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { members, updateMemberBalance, addActivity } = useAppState();

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.membershipId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const handleAddSavings = (memberId: number, amount: number) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      updateMemberBalance(memberId, member.balance + amount, amount);
      addActivity(`Savings deposit from ${member.name} - ${formatCurrency(amount)}`);
    }
  };

  const totalSavings = members.reduce((sum, member) => sum + member.balance, 0);

  return (
    <div className="animate-slide-in-right">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Savings Management</h1>
          <p className="text-muted-foreground">Manage member savings and deposits</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Savings</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(totalSavings)}</p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="glass-card mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Members Savings List */}
      <div className="grid gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="glass-card hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <Badge variant="outline">{member.membershipId}</Badge>
                    <Badge className={member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {member.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p><span className="font-medium">Current Balance:</span> {formatCurrency(member.balance)}</p>
                      <p><span className="font-medium">Phone:</span> {member.phone}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Last Payment:</span> {member.lastPaymentDate || 'N/A'}</p>
                      <p><span className="font-medium">Amount:</span> {member.lastPaymentAmount ? formatCurrency(member.lastPaymentAmount) : 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      const amount = prompt('Enter deposit amount:');
                      if (amount && !isNaN(Number(amount))) {
                        handleAddSavings(member.id, Number(amount));
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Savings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavingsManagement;
