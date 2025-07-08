import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, User, DollarSign, Calendar } from 'lucide-react';
import { Screen } from '@/pages/Index';
import { authService, AuthUser } from '@/services/authService';
import { loanService } from '@/services/loanService';
import { toast } from 'sonner';

interface LoanApplicationProps {
  user: any;
  onNavigate: (screen: Screen) => void;
}

const LoanApplication = ({ user, onNavigate }: LoanApplicationProps) => {
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [loanData, setLoanData] = useState({
    amount: '',
    purpose: '',
    duration: '12',
    guarantor1: null as AuthUser | null,
    guarantor2: null as AuthUser | null
  });
  const [guarantorSearch, setGuarantorSearch] = useState('');
  const [searchResults, setSearchResults] = useState<AuthUser[]>([]);
  const [selectedGuarantor, setSelectedGuarantor] = useState<1 | 2 | null>(null);

  const userSavings = user?.balance || 0;
  const loanAmount = Number(loanData.amount);

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    if (guarantorSearch) {
      const results = members.filter(member => 
        member.id !== user.id &&
        (member.name?.toLowerCase().includes(guarantorSearch.toLowerCase()) ||
         member.account_number.toLowerCase().includes(guarantorSearch.toLowerCase()))
      ).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [guarantorSearch, members, user.id]);

  const loadMembers = async () => {
    try {
      const allMembers = await authService.getAllMembers();
      setMembers(allMembers);
    } catch (error) {
      console.error('Error loading members:', error);
      toast.error('Failed to load members');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const selectGuarantor = (guarantor: AuthUser) => {
    if (selectedGuarantor === 1) {
      setLoanData({ ...loanData, guarantor1: guarantor });
    } else if (selectedGuarantor === 2) {
      setLoanData({ ...loanData, guarantor2: guarantor });
    }
    setGuarantorSearch('');
    setSearchResults([]);
    setSelectedGuarantor(null);
  };

  const canUseOneGuarantor = () => {
    if (!loanData.guarantor1 || !loanAmount) return false;
    const guarantor1Savings = loanData.guarantor1.balance || 0;
    return (guarantor1Savings + userSavings) >= loanAmount;
  };

  const handleSubmit = async () => {
    if (!loanData.amount || !loanData.purpose || !loanData.guarantor1) {
      toast.error('Please fill in all required fields');
      return;
    }

    const requiredGuarantors = canUseOneGuarantor() ? 1 : 2;
    
    if (requiredGuarantors === 2 && !loanData.guarantor2) {
      toast.error('You need two guarantors for this loan amount. Please select a second guarantor.');
      return;
    }

    // Check loan eligibility
    const eligibility = await loanService.checkLoanEligibility(user.id, loanAmount);
    if (!eligibility.eligible) {
      toast.error(eligibility.reason || 'You are not eligible for this loan');
      return;
    }

    setLoading(true);
    try {
      const application = await loanService.createLoanApplication({
        memberId: user.id,
        amount: loanAmount,
        purpose: loanData.purpose,
        durationMonths: Number(loanData.duration),
        guarantor1Id: loanData.guarantor1.id,
        guarantor2Id: requiredGuarantors === 2 ? loanData.guarantor2?.id : undefined
      });

      if (application) {
        toast.success('Loan application submitted successfully! Guarantors will be notified.');
        onNavigate('member-dashboard');
      } else {
        toast.error('Failed to submit loan application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting loan application:', error);
      toast.error('Failed to submit loan application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderGuarantorRequirement = () => {
    if (!loanAmount) return null;

    if (canUseOneGuarantor()) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-700 font-medium">✓ One Guarantor Required</p>
          <p className="text-green-600 text-sm">
            Your savings ({formatCurrency(userSavings)}) + Guarantor's savings covers the loan amount
          </p>
        </div>
      );
    } else {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-700 font-medium">Two Guarantors Required</p>
          <p className="text-blue-600 text-sm">
            Combined savings must be at least {formatCurrency(loanAmount)}
          </p>
        </div>
      );
    }
  };

  // Calculate loan terms for display
  const loanTerms = loanAmount > 0 ? loanService.calculateLoanTerms(loanAmount, Number(loanData.duration)) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('member-dashboard')}
            className="text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loan Application</h1>
            <p className="text-gray-600">Apply for a loan with guarantor support</p>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-purple-600" />
              Loan Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Loan Amount and Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Loan Amount (₦)</label>
                <Input
                  type="number"
                  placeholder="Enter loan amount"
                  value={loanData.amount}
                  onChange={(e) => setLoanData({ ...loanData, amount: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration (months)</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={loanData.duration}
                  onChange={(e) => setLoanData({ ...loanData, duration: e.target.value })}
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Purpose of Loan</label>
              <Textarea
                placeholder="Briefly describe the purpose of this loan"
                value={loanData.purpose}
                onChange={(e) => setLoanData({ ...loanData, purpose: e.target.value })}
                rows={3}
              />
            </div>

            {/* Guarantor Requirements */}
            {renderGuarantorRequirement()}

            {/* Loan Terms Info */}
            {loanTerms && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-2">
                <p className="text-purple-700 font-medium">Loan Terms</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-purple-600">Monthly Payment</p>
                    <p className="font-semibold">{formatCurrency(loanTerms.monthlyPayment)}</p>
                  </div>
                  <div>
                    <p className="text-purple-600">Total Amount</p>
                    <p className="font-semibold">{formatCurrency(loanTerms.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-purple-600">Interest (5%)</p>
                    <p className="font-semibold">{formatCurrency(loanTerms.interestAmount)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Guarantor Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Select Guarantor(s)</h3>
              
              {/* First Guarantor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">First Guarantor *</label>
                  {!loanData.guarantor1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedGuarantor(1)}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search Member
                    </Button>
                  )}
                </div>

                {loanData.guarantor1 ? (
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{loanData.guarantor1.name}</p>
                          <p className="text-sm text-gray-600">{loanData.guarantor1.account_number}</p>
                          <p className="text-sm text-green-600">
                            Balance: {formatCurrency(loanData.guarantor1.balance || 0)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setLoanData({ ...loanData, guarantor1: null })}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : selectedGuarantor === 1 && (
                  <div className="space-y-2">
                    <Input
                      placeholder="Search by name or account number"
                      value={guarantorSearch}
                      onChange={(e) => setGuarantorSearch(e.target.value)}
                    />
                    {searchResults.length > 0 && (
                      <div className="border rounded-lg max-h-48 overflow-y-auto">
                        {searchResults.map((member) => (
                          <div
                            key={member.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                            onClick={() => selectGuarantor(member)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-gray-600">{member.account_number}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Balance</p>
                                <p className="font-medium text-green-600">{formatCurrency(member.balance || 0)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Second Guarantor (if needed) */}
              {!canUseOneGuarantor() && loanAmount > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium">Second Guarantor *</label>
                    {!loanData.guarantor2 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedGuarantor(2)}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Search Member
                      </Button>
                    )}
                  </div>

                  {loanData.guarantor2 ? (
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{loanData.guarantor2.name}</p>
                            <p className="text-sm text-gray-600">{loanData.guarantor2.account_number}</p>
                            <p className="text-sm text-green-600">
                              Balance: {formatCurrency(loanData.guarantor2.balance || 0)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setLoanData({ ...loanData, guarantor2: null })}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : selectedGuarantor === 2 && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Search by name or account number"
                        value={guarantorSearch}
                        onChange={(e) => setGuarantorSearch(e.target.value)}
                      />
                      {searchResults.length > 0 && (
                        <div className="border rounded-lg max-h-48 overflow-y-auto">
                          {searchResults.map((member) => (
                            <div
                              key={member.id}
                              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                              onClick={() => selectGuarantor(member)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-sm text-gray-600">{member.account_number}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Balance</p>
                                  <p className="font-medium text-green-600">{formatCurrency(member.balance || 0)}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={
                  loading ||
                  !loanData.amount || 
                  !loanData.purpose || 
                  !loanData.guarantor1 || 
                  (!canUseOneGuarantor() && !loanData.guarantor2)
                }
              >
                {loading ? 'Submitting...' : 'Submit Loan Application'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoanApplication;