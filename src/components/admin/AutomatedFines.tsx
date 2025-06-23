
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Clock, DollarSign, Users, Settings } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const AutomatedFines = () => {
  const { members, loans, applyAutomatedFines, addAdminLog } = useAppState();
  const [autoFineEnabled, setAutoFineEnabled] = useState(true);
  const [finePercentage, setFinePercentage] = useState(2);
  const [gracePeriodDays, setGracePeriodDays] = useState(3);

  const overdueLoans = loans.filter(loan => {
    if (loan.status !== 'approved') return false;
    const nextPaymentDate = new Date(loan.nextPaymentDate);
    const today = new Date();
    const gracePeriod = new Date(nextPaymentDate);
    gracePeriod.setDate(gracePeriod.getDate() + gracePeriodDays);
    return today > gracePeriod;
  });

  const membersWithFines = members.filter(member => member.fines > 0);

  const handleApplyFines = () => {
    applyAutomatedFines();
    addAdminLog('ADMIN001', 'Admin User', 'Manual Fine Application', 
      `Applied automated fines to ${overdueLoans.length} overdue loans`);
  };

  const handleUpdateSettings = () => {
    addAdminLog('ADMIN001', 'Admin User', 'Fine Settings Update', 
      `Updated fine percentage to ${finePercentage}% and grace period to ${gracePeriodDays} days`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  return (
    <div className="animate-slide-in-right">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Automated Fine System</h1>
        <p className="text-gray-600">Manage automatic fines for overdue payments</p>
      </div>

      {/* Settings Card */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Fine System Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable Automated Fines</h3>
              <p className="text-sm text-gray-600">Automatically apply fines to overdue payments</p>
            </div>
            <Switch
              checked={autoFineEnabled}
              onCheckedChange={setAutoFineEnabled}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fine Percentage (%)</label>
              <Input
                type="number"
                value={finePercentage}
                onChange={(e) => setFinePercentage(Number(e.target.value))}
                min="0"
                max="10"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Grace Period (Days)</label>
              <Input
                type="number"
                value={gracePeriodDays}
                onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                min="0"
                max="30"
              />
            </div>
          </div>

          <Button onClick={handleUpdateSettings} className="bg-blue-600 hover:bg-blue-700">
            Update Settings
          </Button>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Loans</p>
                <p className="text-2xl font-bold text-red-600">{overdueLoans.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Members with Fines</p>
                <p className="text-2xl font-bold text-yellow-600">{membersWithFines.length}</p>
              </div>
              <Users className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Fines</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(members.reduce((sum, member) => sum + member.fines, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Loans */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Overdue Loans ({overdueLoans.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {overdueLoans.length > 0 && (
            <div className="mb-4">
              <Button 
                onClick={handleApplyFines} 
                className="bg-red-600 hover:bg-red-700"
                disabled={!autoFineEnabled}
              >
                Apply Fines to All Overdue Loans
              </Button>
            </div>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {overdueLoans.map((loan) => {
              const member = members.find(m => m.membershipId === loan.memberId);
              const daysOverdue = Math.floor((new Date().getTime() - new Date(loan.nextPaymentDate).getTime()) / (1000 * 60 * 60 * 24));
              const potentialFine = loan.amount * (finePercentage / 100);

              return (
                <div key={loan.id} className="border-l-4 border-red-500 pl-4 py-3 bg-red-50 rounded-r-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-red-100 text-red-800">
                          {daysOverdue} days overdue
                        </Badge>
                        <span className="font-medium">{loan.memberName}</span>
                      </div>
                      <p className="text-sm text-gray-800 mb-1">
                        Loan Amount: {formatCurrency(loan.amount)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Due Date: {new Date(loan.nextPaymentDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium text-red-600">
                        Potential Fine: {formatCurrency(potentialFine)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {overdueLoans.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No Overdue Loans</h3>
                <p className="text-gray-600">All loans are up to date with payments</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Members with Fines */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Members with Outstanding Fines ({membersWithFines.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {membersWithFines.map((member) => (
              <div key={member.id} className="border-l-4 border-yellow-500 pl-4 py-3 bg-yellow-50 rounded-r-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-gray-600">ID: {member.membershipId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-600">
                      {formatCurrency(member.fines)}
                    </p>
                    <Badge className="bg-yellow-100 text-yellow-800">Outstanding</Badge>
                  </div>
                </div>
              </div>
            ))}

            {membersWithFines.length === 0 && (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No Outstanding Fines</h3>
                <p className="text-gray-600">All members have cleared their fines</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomatedFines;
