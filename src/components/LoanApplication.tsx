
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CreditCard, User, FileText } from 'lucide-react';
import { Screen } from '@/pages/Index';

interface LoanApplicationProps {
  user: any;
  onNavigate: (screen: Screen) => void;
}

const LoanApplication = ({ user, onNavigate }: LoanApplicationProps) => {
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    duration: '24',
    guarantor1Name: '',
    guarantor1Phone: '',
    guarantor1Address: '',
    guarantor2Name: '',
    guarantor2Phone: '',
    guarantor2Address: '',
    employmentStatus: '',
    monthlyIncome: '',
    additionalInfo: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Loan application submitted successfully! You will be notified once reviewed.');
    onNavigate('member-dashboard');
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(Number(amount));
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
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Guarantor 1 */}
              <div>
                <h4 className="font-medium mb-3">First Guarantor *</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input
                      value={formData.guarantor1Name}
                      onChange={(e) => handleInputChange('guarantor1Name', e.target.value)}
                      placeholder="Guarantor's full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      value={formData.guarantor1Phone}
                      onChange={(e) => handleInputChange('guarantor1Phone', e.target.value)}
                      placeholder="Phone number"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <Textarea
                    value={formData.guarantor1Address}
                    onChange={(e) => handleInputChange('guarantor1Address', e.target.value)}
                    placeholder="Full address"
                    required
                  />
                </div>
              </div>

              {/* Guarantor 2 */}
              <div>
                <h4 className="font-medium mb-3">Second Guarantor *</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input
                      value={formData.guarantor2Name}
                      onChange={(e) => handleInputChange('guarantor2Name', e.target.value)}
                      placeholder="Guarantor's full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      value={formData.guarantor2Phone}
                      onChange={(e) => handleInputChange('guarantor2Phone', e.target.value)}
                      placeholder="Phone number"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <Textarea
                    value={formData.guarantor2Address}
                    onChange={(e) => handleInputChange('guarantor2Address', e.target.value)}
                    placeholder="Full address"
                    required
                  />
                </div>
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
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanApplication;
