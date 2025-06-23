
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, User, FileText, Search, AlertTriangle, Check } from 'lucide-react';
import { Screen } from '@/pages/Index';
import { useAppState } from '@/hooks/useAppState';

interface LoanApplicationProps {
  user: any;
  onNavigate: (screen: Screen) => void;
}

const LoanApplication = ({ user, onNavigate }: LoanApplicationProps) => {
  const { searchMemberByName, canMemberBeGuarantor, submitLoanApplication } = useAppState();
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    duration: '24',
    guarantor1Search: '',
    guarantor1Selected: null as any,
    guarantor2Search: '',
    guarantor2Selected: null as any,
    employmentStatus: '',
    monthlyIncome: '',
    additionalInfo: ''
  });

  const [guarantor1Results, setGuarantor1Results] = useState<any[]>([]);
  const [guarantor2Results, setGuarantor2Results] = useState<any[]>([]);
  const [showGuarantor1Results, setShowGuarantor1Results] = useState(false);
  const [showGuarantor2Results, setShowGuarantor2Results] = useState(false);

  // Search for guarantor 1
  useEffect(() => {
    if (formData.guarantor1Search.length > 2) {
      const results = searchMemberByName(formData.guarantor1Search)
        .filter(member => member.id !== user.id);
      setGuarantor1Results(results);
      setShowGuarantor1Results(true);
    } else {
      setShowGuarantor1Results(false);
    }
  }, [formData.guarantor1Search, user.id, searchMemberByName]);

  // Search for guarantor 2
  useEffect(() => {
    if (formData.guarantor2Search.length > 2) {
      const results = searchMemberByName(formData.guarantor2Search)
        .filter(member => member.id !== user.id && member.id !== formData.guarantor1Selected?.id);
      setGuarantor2Results(results);
      setShowGuarantor2Results(true);
    } else {
      setShowGuarantor2Results(false);
    }
  }, [formData.guarantor2Search, formData.guarantor1Selected, user.id, searchMemberByName]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGuarantorSelect = (guarantor: any, guarantorNumber: 1 | 2) => {
    const canBeGuarantor = canMemberBeGuarantor(guarantor.id);
    
    if (!canBeGuarantor) {
      alert('This member cannot be a guarantor as they currently have an active loan.');
      return;
    }

    if (guarantorNumber === 1) {
      setFormData(prev => ({
        ...prev,
        guarantor1Selected: guarantor,
        guarantor1Search: guarantor.name
      }));
      setShowGuarantor1Results(false);
    } else {
      setFormData(prev => ({
        ...prev,
        guarantor2Selected: guarantor,
        guarantor2Search: guarantor.name
      }));
      setShowGuarantor2Results(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.guarantor1Selected || !formData.guarantor2Selected) {
      alert('Please select valid guarantors before submitting.');
      return;
    }

    const loanData = {
      memberId: user.id,
      memberName: user.name,
      amount: Number(formData.amount),
      purpose: formData.purpose,
      duration: Number(formData.duration),
      guarantors: [
        { id: formData.guarantor1Selected.id, name: formData.guarantor1Selected.name },
        { id: formData.guarantor2Selected.id, name: formData.guarantor2Selected.name }
      ],
      employmentStatus: formData.employmentStatus,
      monthlyIncome: Number(formData.monthlyIncome),
      additionalInfo: formData.additionalInfo
    };

    submitLoanApplication(loanData);
    alert('Loan application submitted successfully! Your guarantors will be notified.');
    onNavigate('member-dashboard');
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(Number(amount));
  };

  const blurBalance = (balance: number) => {
    return `₦${'*'.repeat(balance.toString().length)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('member-dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loan Application</h1>
            <p className="text-gray-600">Apply for a loan from ONCS</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Loan Details */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Loan Amount *</label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="Enter amount"
                    required
                  />
                  {formData.amount && (
                    <p className="text-xs text-gray-600 mt-1">
                      {formatCurrency(formData.amount)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (weeks) *</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    required
                  >
                    <option value="12">12 weeks</option>
                    <option value="24">24 weeks</option>
                    <option value="36">36 weeks</option>
                    <option value="48">48 weeks</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Purpose of Loan *</label>
                <Textarea
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  placeholder="Describe the purpose of this loan"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Guarantor Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Guarantor Information
              </CardTitle>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">Important Notice:</p>
                    <p className="text-amber-700">
                      Your guarantors cannot apply for loans while you have an outstanding loan balance. 
                      Make sure they understand this commitment before accepting.
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Guarantor 1 */}
              <div>
                <h4 className="font-medium mb-3">First Guarantor *</h4>
                <div className="relative">
                  <label className="block text-sm font-medium mb-2">Search by Name or Account Number</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      value={formData.guarantor1Search}
                      onChange={(e) => handleInputChange('guarantor1Search', e.target.value)}
                      placeholder="Type member name or account number..."
                      className="pl-10"
                      required
                    />
                  </div>
                  
                  {showGuarantor1Results && guarantor1Results.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                      {guarantor1Results.map((member) => {
                        const canBeGuarantor = canMemberBeGuarantor(member.id);
                        return (
                          <div
                            key={member.id}
                            className={`p-3 hover:bg-gray-50 cursor-pointer border-b ${
                              !canBeGuarantor ? 'opacity-50' : ''
                            }`}
                            onClick={() => canBeGuarantor && handleGuarantorSelect(member, 1)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-gray-600">{member.membershipId}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Balance: {blurBalance(member.balance)}</p>
                                {!canBeGuarantor && (
                                  <Badge className="bg-red-100 text-red-800 text-xs">Has Active Loan</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {formData.guarantor1Selected && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Selected Guarantor</span>
                    </div>
                    <p className="text-sm"><strong>Name:</strong> {formData.guarantor1Selected.name}</p>
                    <p className="text-sm"><strong>ID:</strong> {formData.guarantor1Selected.membershipId}</p>
                    <p className="text-sm"><strong>Balance:</strong> {blurBalance(formData.guarantor1Selected.balance)}</p>
                  </div>
                )}
              </div>

              {/* Guarantor 2 */}
              <div>
                <h4 className="font-medium mb-3">Second Guarantor *</h4>
                <div className="relative">
                  <label className="block text-sm font-medium mb-2">Search by Name or Account Number</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      value={formData.guarantor2Search}
                      onChange={(e) => handleInputChange('guarantor2Search', e.target.value)}
                      placeholder="Type member name or account number..."
                      className="pl-10"
                      required
                    />
                  </div>
                  
                  {showGuarantor2Results && guarantor2Results.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                      {guarantor2Results.map((member) => {
                        const canBeGuarantor = canMemberBeGuarantor(member.id);
                        return (
                          <div
                            key={member.id}
                            className={`p-3 hover:bg-gray-50 cursor-pointer border-b ${
                              !canBeGuarantor ? 'opacity-50' : ''
                            }`}
                            onClick={() => canBeGuarantor && handleGuarantorSelect(member, 2)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-gray-600">{member.membershipId}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Balance: {blurBalance(member.balance)}</p>
                                {!canBeGuarantor && (
                                  <Badge className="bg-red-100 text-red-800 text-xs">Has Active Loan</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {formData.guarantor2Selected && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Selected Guarantor</span>
                    </div>
                    <p className="text-sm"><strong>Name:</strong> {formData.guarantor2Selected.name}</p>
                    <p className="text-sm"><strong>ID:</strong> {formData.guarantor2Selected.membershipId}</p>
                    <p className="text-sm"><strong>Balance:</strong> {blurBalance(formData.guarantor2Selected.balance)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Employment & Income */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Employment & Income Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Employment Status *</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={formData.employmentStatus}
                    onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="business-owner">Business Owner</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Income *</label>
                  <Input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                    placeholder="Enter monthly income"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Additional Information</label>
                <Textarea
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  placeholder="Any additional information that supports your application"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate('member-dashboard')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={!formData.guarantor1Selected || !formData.guarantor2Selected}
            >
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanApplication;
