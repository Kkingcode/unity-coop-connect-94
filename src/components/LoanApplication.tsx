
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Users, CheckCircle } from 'lucide-react';
import { Screen } from '@/pages/Index';

interface LoanApplicationProps {
  user: any;
  onNavigate: (screen: Screen) => void;
}

const LoanApplication = ({ user, onNavigate }: LoanApplicationProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    duration: '',
    guarantor1: '',
    guarantor2: '',
    guarantor1Phone: '',
    guarantor2Phone: '',
    collateral: ''
  });

  const guarantors = [
    { id: 'G001', name: 'Alice Johnson', memberSince: '2020' },
    { id: 'G002', name: 'Bob Williams', memberSince: '2019' },
    { id: 'G003', name: 'Carol Davis', memberSince: '2021' },
    { id: 'G004', name: 'David Brown', memberSince: '2018' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    // Simulate loan application submission
    console.log('Loan application submitted:', formData);
    setCurrentStep(4); // Success step
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Loan Amount (₦)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="Enter loan amount"
          value={formData.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
        />
        <p className="text-sm text-gray-600">Maximum eligible: ₦500,000</p>
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
        <Label htmlFor="duration">Repayment Period</Label>
        <Select onValueChange={(value) => handleInputChange('duration', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 months</SelectItem>
            <SelectItem value="6">6 months</SelectItem>
            <SelectItem value="12">12 months</SelectItem>
            <SelectItem value="24">24 months</SelectItem>
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
        <p className="text-sm text-gray-600">Choose 2 active members as guarantors</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>First Guarantor</Label>
          <Select onValueChange={(value) => handleInputChange('guarantor1', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select first guarantor" />
            </SelectTrigger>
            <SelectContent>
              {guarantors.map(guarantor => (
                <SelectItem key={guarantor.id} value={guarantor.id}>
                  {guarantor.name} (Member since {guarantor.memberSince})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guarantor1Phone">First Guarantor Phone</Label>
          <Input
            id="guarantor1Phone"
            type="tel"
            placeholder="Enter phone number"
            value={formData.guarantor1Phone}
            onChange={(e) => handleInputChange('guarantor1Phone', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Second Guarantor</Label>
          <Select onValueChange={(value) => handleInputChange('guarantor2', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select second guarantor" />
            </SelectTrigger>
            <SelectContent>
              {guarantors
                .filter(g => g.id !== formData.guarantor1)
                .map(guarantor => (
                  <SelectItem key={guarantor.id} value={guarantor.id}>
                    {guarantor.name} (Member since {guarantor.memberSince})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guarantor2Phone">Second Guarantor Phone</Label>
          <Input
            id="guarantor2Phone"
            type="tel"
            placeholder="Enter phone number"
            value={formData.guarantor2Phone}
            onChange={(e) => handleInputChange('guarantor2Phone', e.target.value)}
          />
        </div>
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
            <p><span className="font-medium">Duration:</span> {formData.duration} months</p>
            <p><span className="font-medium">Interest Rate:</span> 2.5% per month</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Guarantors</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">First:</span> {guarantors.find(g => g.id === formData.guarantor1)?.name}</p>
            <p><span className="font-medium">Second:</span> {guarantors.find(g => g.id === formData.guarantor2)?.name}</p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Repayment Schedule</h4>
          <div className="text-sm text-blue-800">
            <p>Monthly Payment: ₦{Math.ceil((parseInt(formData.amount || '0') * 1.025) / parseInt(formData.duration || '1')).toLocaleString()}</p>
            <p>Total Repayment: ₦{Math.ceil(parseInt(formData.amount || '0') * 1.025 * parseInt(formData.duration || '1')).toLocaleString()}</p>
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
              {currentStep === 2 && 'Select two guarantors for your loan'}
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
