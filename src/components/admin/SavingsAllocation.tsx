
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, DollarSign, AlertTriangle } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const SavingsAllocation = () => {
  const { members, allocateSavings } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [allocationType, setAllocationType] = useState<'investment' | 'savings' | 'loan'>('savings');
  const [amount, setAmount] = useState('');
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

  const handleSubmit = () => {
    if (!selectedMember || !amount || Number(amount) <= 0) {
      alert('Please select a member and enter a valid amount.');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmAllocation = () => {
    const allocationData = {
      loan: allocationType === 'loan' ? Number(amount) : 0,
      investment: allocationType === 'investment' ? Number(amount) : 0,
      savings: allocationType === 'savings' ? Number(amount) : 0
    };

    allocateSavings(selectedMember.id, allocationData);
    
    // Reset form
    setSelectedMember(null);
    setSearchTerm('');
    setAmount('');
    setAllocationType('savings');
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

                <div className="flex justify-between">
                  <span>Allocation Type:</span>
                  <span className="font-medium capitalize text-blue-600">{allocationType}</span>
                </div>

                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium text-green-600">{formatCurrency(Number(amount))}</span>
                </div>

                <div className="border-t pt-2 mt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(Number(amount))}</span>
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
        <p className="text-gray-600">Allocate member payments to investment, savings, or loan</p>
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
              <label className="block text-sm font-medium mb-2">Allocation Type</label>
              <Select value={allocationType} onValueChange={(value: 'investment' | 'savings' | 'loan') => setAllocationType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select allocation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">Savings Deposit</SelectItem>
                  <SelectItem value="investment">Investment Deposit</SelectItem>
                  <SelectItem value="loan">Loan Repayment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!selectedMember}
              />
            </div>

            {Number(amount) > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-semibold">
                  {allocationType === 'savings' && 'Savings Deposit: '}
                  {allocationType === 'investment' && 'Investment Deposit: '}
                  {allocationType === 'loan' && 'Loan Repayment: '}
                  {formatCurrency(Number(amount))}
                </p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!selectedMember || !amount || Number(amount) <= 0}
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
