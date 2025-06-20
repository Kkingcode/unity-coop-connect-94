
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Users, CheckCircle, User, AlertCircle } from 'lucide-react';
import { Screen } from '@/pages/Index';

interface LoanApplicationProps {
  user: any;
  onNavigate: (screen: Screen) => void;
}

interface Guarantor {
  accountNumber: string;
  name: string;
  balance: number;
}

const LoanApplication = ({ user, onNavigate }: LoanApplicationProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [guarantor1, setGuarantor1] = useState<Guarantor | null>(null);
  const [guarantor2, setGuarantor2] = useState<Guarantor | null>(null);
  const [guarantor1Account, setGuarantor1Account] = useState('');
  const [guarantor2Account, setGuarantor2Account] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    collateral: ''
  });

  // Mock user data - in real app this would come from props
  const memberSavings = 150000; // Member's current savings
  const maxLoanAmount = memberSavings * 3; // 3x savings rule

  // Mock guarantor database
  const guarantorDatabase = [
    { accountNumber: '1234567890', name: 'Alice Johnson', balance: 200000 },
    { accountNumber: '0987654321', name: 'Bob Williams', balance: 180000 },
    { accountNumber: '1122334455', name: 'Carol Davis', balance: 250000 },
    { accountNumber: '5566778899', name: 'David Brown', balance: 120000 },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const lookupGuarantor = (accountNumber: string, guarantorNumber: 1 | 2) => {
    const found = guarantorDatabase.find(g => g.accountNumber === accountNumber);
    if (guarantorNumber === 1) {
      setGuarantor1(found || null);
    } else {
      setGuarantor2(found || null);
    }
  };

  const calculateWeeklyPayment = (amount: number) => {
    return Math.ceil(amount / 24); // 0% interest, 24 weeks
  };

  const canApprove = () => {
    const loanAmount = parseInt(formData.amount || '0');
    const totalGuarantorBalance = (guarantor1?.balance || 0) + (guarantor2?.balance || 0);
    return loanAmount <= maxLoanAmount && totalGuarantorBalance >= loanAmount;
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    console.log('Loan application submitted:', {
      ...formData,
      guarantor1,
      guarantor2,
      weeklyPayment: calculateWeeklyPayment(parseInt(formData.amount || '0'))
    });
    setCurrentStep(4);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Your Loan Eligibility</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>Your Savings: ₦{memberSavings.toLocaleString()}</p>
          <p>Maximum Loan: ₦{maxLoanAmount.toLocaleString()} (3x your savings)</p>
          <p>Interest Rate: 0% (No interest)</p>
          <p>Repayment: 24 weeks (weekly payments)</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Loan Amount (₦)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="Enter loan amount"
          value={formData.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          max={maxLoanAmount}
        />
        <p className="text-sm text-gray-600">
          Maximum eligible: ₦{maxLoanAmount.toLocaleString()}
        </p>
        {formData.amount && (
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-800">
              Weekly Payment: ₦{calculateWeeklyPayment(parseInt(formData.amount)).toLocaleString()}
            </p>
            <p className="text-xs text-green-600">
              You can pay up to 4 weeks in advance to avoid fines
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose">Purpose of Loan</Label>
        <Select onValueChange={(value) => handleInputChange('purpose', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select loan purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="business">Business Investment</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="medical">Medical Emergency</SelectItem>
            <SelectItem value="agriculture">Agriculture</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="collateral">Collateral Description</Label>
        <Textarea
          id="collateral"
          placeholder="Describe the collateral you're offering..."
          value={formData.collateral}
          onChange={(e) => handleInputChange('collateral', e.target.value)}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Users className="h-12 w-12 mx-auto text-blue-600 mb-2" />
        <h3 className="text-lg font-semibold">Select Your Guarantors</h3>
        <p className="text-sm text-gray-600">
          Guarantors must have combined balance of ₦{parseInt(formData.amount || '0').toLocaleString()}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>First Guarantor Account Number</Label>
          <Input
            placeholder="Enter account number"
            value={guarantor1Account}
            onChange={(e) => {
              setGuarantor1Account(e.target.value);
              if (e.target.value.length === 10) {
                lookupGuarantor(e.target.value, 1);
              } else {
                setGuarantor1(null);
              }
            }}
          />
          {guarantor1 && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">{guarantor1.name}</span>
              </div>
              <p className="text-sm text-green-600">
                Balance: ₦{guarantor1.balance.toLocaleString()}
              </p>
            </div>
          )}
          {guarantor1Account.length === 10 && !guarantor1 && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-800">Account not found</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Second Guarantor Account Number</Label>
          <Input
            placeholder="Enter account number"
            value={guarantor2Account}
            onChange={(e) => {
              setGuarantor2Account(e.target.value);
              if (e.target.value.length === 10) {
                lookupGuarantor(e.target.value, 2);
              } else {
                setGuarantor2(null);
              }
            }}
          />
          {guarantor2 && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">{guarantor2.name}</span>
              </div>
              <p className="text-sm text-green-600">
                Balance: ₦{guarantor2.balance.toLocaleString()}
              </p>
            </div>
          )}
          {guarantor2Account.length === 10 && !guarantor2 && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-800">Account not found</span>
              </div>
            </div>
          )}
        </div>

        {guarantor1 && guarantor2 && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Guarantor Summary</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>Combined Balance: ₦{(guarantor1.balance + guarantor2.balance).toLocaleString()}</p>
              <p>Required: ₦{parseInt(formData.amount || '0').toLocaleString()}</p>
              {canApprove() ? (
                <p className="text-green-600 font-medium">✓ Sufficient guarantor balance</p>
              ) : (
                <p className="text-red-600 font-medium">✗ Insufficient guarantor balance</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-center">Review Your Application</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Loan Details</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Amount:</span> ₦{parseInt(formData.amount || '0').toLocaleString()}</p>
            <p><span className="font-medium">Purpose:</span> {formData.purpose}</p>
            <p><span className="font-medium">Interest Rate:</span> 0%</p>
            <p><span className="font-medium">Duration:</span> 24 weeks</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Guarantors</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">First:</span> {guarantor1?.name}</p>
            <p><span className="font-medium">Second:</span> {guarantor2?.name}</p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Repayment Schedule</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>Weekly Payment: ₦{calculateWeeklyPayment(parseInt(formData.amount || '0')).toLocaleString()}</p>
            <p>Total Duration: 24 weeks</p>
            <p>Total Repayment: ₦{parseInt(formData.amount || '0').toLocaleString()} (0% interest)</p>
          </div>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="font-medium text-orange-900 mb-2">Important Notes</h4>
          <div className="text-sm text-orange-800 space-y-1">
            <p>• You can pay up to 4 weeks in advance</p>
            <p>• Late payments incur 2% fine of loan amount</p>
            <p>• Payments less than 50% of expected amount go to savings and incur fine</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-6 py-8">
      <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">Application Submitted!</h3>
        <p className="text-gray-600 mb-4">
          Your loan application has been submitted successfully. 
          Guarantor approval notifications have been sent.
        </p>
        <div className="p-4 bg-blue-50 rounded-lg text-left">
          <h4 className="font-medium mb-2">Next Steps:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Guarantors will receive approval requests</li>
            <li>• Admin review will begin after guarantor approval</li>
            <li>• You'll receive notifications on progress</li>
            <li>• Processing time: 3-5 business days</li>
          </ul>
        </div>
      </div>
      <Button 
        onClick={() => onNavigate('member-dashboard')}
        className="w-full"
      >
        Return to Dashboard
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => currentStep === 1 ? onNavigate('member-dashboard') : handlePrevious()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Loan Application</h1>
            {currentStep < 4 && (
              <p className="text-sm text-gray-600">Step {currentStep} of 3</p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {currentStep < 4 && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && 'Loan Information'}
              {currentStep === 2 && 'Guarantor Selection'}
              {currentStep === 3 && 'Review & Submit'}
              {currentStep === 4 && 'Application Complete'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Enter your loan requirements'}
              {currentStep === 2 && 'Enter guarantor account numbers'}
              {currentStep === 3 && 'Verify all details before submission'}
              {currentStep === 4 && 'Your application is being processed'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {currentStep < 4 && (
              <div className="flex gap-4 mt-6">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handlePrevious} className="flex-1">
                    Previous
                  </Button>
                )}
                <Button 
                  onClick={currentStep === 3 ? handleSubmit : handleNext}
                  className="flex-1"
                  disabled={
                    (currentStep === 1 && (!formData.amount || !formData.purpose)) ||
                    (currentStep === 2 && (!guarantor1 || !guarantor2 || !canApprove()))
                  }
                >
                  {currentStep === 3 ? 'Submit Application' : 'Next'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoanApplication;
