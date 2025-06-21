
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, DollarSign, AlertTriangle, Check } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

interface SavingsAllocationProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMember?: any;
}

const SavingsAllocation = ({ isOpen, onClose, selectedMember }: SavingsAllocationProps) => {
  const { addSavings } = useAppState();
  const [totalAmount, setTotalAmount] = useState('');
  const [allocations, setAllocations] = useState({
    loan: '',
    investment: '',
    savings: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleAllocationChange = (type: keyof typeof allocations, value: string) => {
    setAllocations(prev => ({ ...prev, [type]: value }));
  };

  const getTotalAllocated = () => {
    return (Number(allocations.loan) || 0) + 
           (Number(allocations.investment) || 0) + 
           (Number(allocations.savings) || 0);
  };

  const getRemainingAmount = () => {
    return (Number(totalAmount) || 0) - getTotalAllocated();
  };

  const handleDistributeEvenly = () => {
    const amount = Number(totalAmount) || 0;
    const perCategory = Math.floor(amount / 3);
    const remainder = amount % 3;
    
    setAllocations({
      loan: perCategory.toString(),
      investment: perCategory.toString(),
      savings: (perCategory + remainder).toString()
    });
  };

  const handleConfirm = () => {
    if (!selectedMember || getTotalAllocated() === 0) return;
    
    const amounts = {
      loan: Number(allocations.loan) || 0,
      investment: Number(allocations.investment) || 0,
      savings: Number(allocations.savings) || 0
    };

    addSavings(selectedMember.id, amounts, 'ADMIN001', 'Admin User');
    
    // Reset form
    setTotalAmount('');
    setAllocations({ loan: '', investment: '', savings: '' });
    setShowConfirmation(false);
    onClose();
    
    alert('Payment allocated successfully!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  if (!selectedMember) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Allocate Payment - {selectedMember.name}
          </DialogTitle>
        </DialogHeader>

        {!showConfirmation ? (
          <div className="space-y-6">
            {/* Member Info */}
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Current Savings</p>
                    <p className="font-medium">{formatCurrency(selectedMember.balance)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Loan Balance</p>
                    <p className="font-medium text-red-600">{formatCurrency(selectedMember.loanBalance)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Investment Balance</p>
                    <p className="font-medium text-blue-600">{formatCurrency(selectedMember.investmentBalance || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Amount */}
            <div>
              <label className="block text-sm font-medium mb-2">Total Payment Amount *</label>
              <Input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="Enter total amount received"
                className="text-lg"
              />
              {totalAmount && (
                <p className="text-sm text-gray-600 mt-1">
                  {formatCurrency(Number(totalAmount))}
                </p>
              )}
            </div>

            {/* Allocation Section */}
            {totalAmount && (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Allocate Payment</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleDistributeEvenly}
                  >
                    Distribute Evenly
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Loan Allocation */}
                  {selectedMember.loanBalance > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Loan Repayment 
                        <span className="text-red-600 ml-1">(Balance: {formatCurrency(selectedMember.loanBalance)})</span>
                      </label>
                      <Input
                        type="number"
                        value={allocations.loan}
                        onChange={(e) => handleAllocationChange('loan', e.target.value)}
                        placeholder="Amount for loan repayment"
                        max={Math.min(selectedMember.loanBalance, Number(totalAmount) || 0)}
                      />
                    </div>
                  )}

                  {/* Investment Allocation */}
                  {selectedMember.investmentBalance > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Investment Repayment 
                        <span className="text-blue-600 ml-1">(Balance: {formatCurrency(selectedMember.investmentBalance)})</span>
                      </label>
                      <Input
                        type="number"
                        value={allocations.investment}
                        onChange={(e) => handleAllocationChange('investment', e.target.value)}
                        placeholder="Amount for investment repayment"
                        max={Math.min(selectedMember.investmentBalance, Number(totalAmount) || 0)}
                      />
                    </div>
                  )}

                  {/* Savings Allocation */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Savings Deposit
                      <span className="text-green-600 ml-1">(Current: {formatCurrency(selectedMember.balance)})</span>
                    </label>
                    <Input
                      type="number"
                      value={allocations.savings}
                      onChange={(e) => handleAllocationChange('savings', e.target.value)}
                      placeholder="Amount for savings"
                    />
                  </div>
                </div>

                {/* Allocation Summary */}
                <Card className={`${getRemainingAmount() === 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Payment</p>
                        <p className="font-medium">{formatCurrency(Number(totalAmount) || 0)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Allocated</p>
                        <p className="font-medium">{formatCurrency(getTotalAllocated())}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Remaining</p>
                        <p className={`font-medium ${getRemainingAmount() === 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(getRemainingAmount())}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        {getRemainingAmount() === 0 ? (
                          <p className="text-green-600 flex items-center gap-1">
                            <Check className="h-4 w-4" />
                            Fully Allocated
                          </p>
                        ) : (
                          <p className="text-yellow-600 flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" />
                            Incomplete
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={() => setShowConfirmation(true)}
                    disabled={getTotalAllocated() === 0 || getRemainingAmount() !== 0}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Continue to Confirmation
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          // Confirmation Screen
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Confirm Payment Allocation</h3>
              <p className="text-blue-800 text-sm">
                Please review the allocation details below before final confirmation.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-medium">Member: {selectedMember.name} ({selectedMember.membershipId})</p>
                <p className="text-sm text-gray-600">Total Payment: {formatCurrency(Number(totalAmount))}</p>
              </div>

              {Number(allocations.loan) > 0 && (
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span>Loan Repayment</span>
                  <span className="font-medium">{formatCurrency(Number(allocations.loan))}</span>
                </div>
              )}

              {Number(allocations.investment) > 0 && (
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span>Investment Repayment</span>
                  <span className="font-medium">{formatCurrency(Number(allocations.investment))}</span>
                </div>
              )}

              {Number(allocations.savings) > 0 && (
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span>Savings Deposit</span>
                  <span className="font-medium">{formatCurrency(Number(allocations.savings))}</span>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Final Confirmation Required</p>
                  <p className="text-yellow-700">
                    This action will update the member's balances and cannot be undone. 
                    Please ensure all amounts are correct.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4 mr-2" />
                Confirm Allocation
              </Button>
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                Back to Edit
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SavingsAllocation;
