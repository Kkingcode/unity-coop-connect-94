
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, DollarSign, AlertTriangle } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const SavingsAllocation = () => {
  const { members, allocateSavings } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [amounts, setAmounts] = useState({
    loan: '',
    investment: '',
    savings: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const handleMemberSelect = (member: any) => {
    setSelectedMember(member);
    setSearchTerm(member.name);
  };

  const handleAmountChange = (field: string, value: string) => {
    setAmounts(prev => ({ ...prev, [field]: value }));
  };

  const getTotalAmount = () => {
    return (Number(amounts.loan) || 0) + (Number(amounts.investment) || 0) + (Number(amounts.savings) || 0);
  };

  const handleSubmit = () => {
    if (!selectedMember || getTotalAmount() === 0) {
      alert('Please select a member and enter at least one amount.');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmAllocation = () => {
    const allocationData = {
      loan: Number(amounts.loan) || 0,
      investment: Number(amounts.investment) || 0,
      savings: Number(amounts.savings) || 0
    };

    allocateSavings(selectedMember.id, allocationData, 'ADMIN001', 'Admin User');
    
    // Reset form
    setSelectedMember(null);
    setSearchTerm('');
    setAmounts({ loan: '', investment: '', savings: '' });
    setShowConfirmation(false);
    
    alert('Payment allocation completed successfully!');
  };

  if (showConfirmation) {
    return (
      <div className="animate-slide-in-right">
        <Card className="glass-card max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Confirm Payment Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold mb-4">Please confirm the following allocation:</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Member:</span>
                  <span>{selectedMember.name} ({selectedMember.membershipId})</span>
                </div>

                {Number(amounts.loan) > 0 && (
                  <div className="flex justify-between">
                    <span>Loan Repayment:</span>
                    <span className="font-medium text-blue-600">{formatCurrency(Number(amounts.loan))}</span>
                  </div>
                )}

                {Number(amounts.investment) > 0 && (
                  <div className="flex justify-between">
                    <span>Investment Repayment:</span>
                    <span className="font-medium text-purple-600">{formatCurrency(Number(amounts.investment))}</span>
                  </div>
                )}

                {Number(amounts.savings) > 0 && (
                  <div className="flex justify-between">
                    <span>Savings Deposit:</span>
                    <span className="font-medium text-green-600">{formatCurrency(Number(amounts.savings))}</span>
                  </div>
                )}

                <div className="border-t pt-2 mt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(getTotalAmount())}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1"
              >
                Go Back
              </Button>
              <Button
                onClick={confirmAllocation}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Confirm Allocation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-slide-in-right">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Savings Allocation</h1>
        <p className="text-gray-600">Allocate member payments to loan, investment, or savings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Search */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Select Member
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchTerm && !selectedMember && (
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleMemberSelect(member)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.membershipId}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p>Balance: {formatCurrency(member.balance)}</p>
                        {member.loanBalance > 0 && (
                          <p className="text-red-600">Loan: {formatCurrency(member.loanBalance)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedMember && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Selected Member</h4>
                <p><strong>Name:</strong> {selectedMember.name}</p>
                <p><strong>ID:</strong> {selectedMember.membershipId}</p>
                <p><strong>Current Balance:</strong> {formatCurrency(selectedMember.balance)}</p>
                {selectedMember.loanBalance > 0 && (
                  <p><strong>Loan Balance:</strong> {formatCurrency(selectedMember.loanBalance)}</p>
                )}
                {selectedMember.investmentBalance > 0 && (
                  <p><strong>Investment Balance:</strong> {formatCurrency(selectedMember.investmentBalance)}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Amount Allocation */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Allocate Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Loan Repayment</label>
              <Input
                type="number"
                placeholder="Enter amount for loan repayment"
                value={amounts.loan}
                onChange={(e) => handleAmountChange('loan', e.target.value)}
                disabled={!selectedMember || selectedMember.loanBalance === 0}
              />
              {selectedMember && selectedMember.loanBalance === 0 && (
                <p className="text-xs text-gray-500 mt-1">No active loan</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Investment Repayment</label>
              <Input
                type="number"
                placeholder="Enter amount for investment repayment"
                value={amounts.investment}
                onChange={(e) => handleAmountChange('investment', e.target.value)}
                disabled={!selectedMember || selectedMember.investmentBalance === 0}
              />
              {selectedMember && selectedMember.investmentBalance === 0 && (
                <p className="text-xs text-gray-500 mt-1">No active investment</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Savings Deposit</label>
              <Input
                type="number"
                placeholder="Enter amount for savings"
                value={amounts.savings}
                onChange={(e) => handleAmountChange('savings', e.target.value)}
                disabled={!selectedMember}
              />
            </div>

            {getTotalAmount() > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-semibold">Total Allocation: {formatCurrency(getTotalAmount())}</p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!selectedMember || getTotalAmount() === 0}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Proceed to Confirmation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SavingsAllocation;
