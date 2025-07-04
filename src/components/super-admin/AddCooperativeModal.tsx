
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Upload } from 'lucide-react';
import { useSuperAdminState } from '@/hooks/useSuperAdminState';
import { Cooperative, CooperativeSettings } from '@/types/multiTenant';

interface AddCooperativeModalProps {
  onClose: () => void;
}

const AddCooperativeModal = ({ onClose }: AddCooperativeModalProps) => {
  const { addCooperative, subscriptionTiers } = useSuperAdminState();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    motto: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    logo: '/placeholder.svg',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    subscriptionTier: 'starter' as 'starter' | 'professional' | 'enterprise' | 'custom'
  });

  const [settings, setSettings] = useState<CooperativeSettings>({
    loanSettings: {
      maxLoanAmount: 200000,
      defaultInterestRate: 10,
      maxLoanTerm: 12,
      collateralRequired: false,
      guarantorsRequired: 1,
      autoApprovalLimit: 25000,
      latePaymentGracePeriod: 7
    },
    savingsSettings: {
      minimumBalance: 2000,
      interestRate: 6,
      withdrawalLimits: {
        daily: 20000,
        monthly: 80000
      },
      compoundingFrequency: 'monthly'
    },
    membershipSettings: {
      registrationFee: 1000,
      monthlyDues: 500,
      minimumAge: 18,
      maximumAge: 65,
      documentRequirements: ['National ID', 'Passport Photo'],
      approvalWorkflow: 'manual',
      probationPeriod: 90
    },
    fineStructure: {
      latePaymentFine: 300,
      missedMeetingFine: 100,
      defaultLoanFine: 500,
      documentationFine: 50,
      customFines: []
    },
    meetingSettings: {
      frequency: 'monthly',
      quorumPercentage: 60,
      votingThreshold: 75,
      allowVirtualAttendance: true
    }
  });

  const selectedTier = subscriptionTiers.find(tier => tier.id === formData.subscriptionTier);

  const handleSubmit = () => {
    const cooperativeData: Omit<Cooperative, 'id' | 'createdDate' | 'currentMembers'> = {
      ...formData,
      memberLimit: selectedTier?.memberLimit || 100,
      status: 'trial',
      lastPayment: new Date().toISOString(),
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      monthlyFee: selectedTier?.price || 15000,
      settings,
      customization: {
        theme: {
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor,
          accentColor: '#10B981',
          backgroundColor: '#F9FAFB',
          textColor: '#111827'
        },
        branding: {
          logo: formData.logo,
          favicon: '/favicon.ico',
          motto: formData.motto,
          tagline: 'Building wealth together'
        },
        features: {
          enabledModules: ['loans', 'savings', 'meetings'],
          customFields: [],
          dashboardLayout: 'default'
        }
      }
    };

    addCooperative(cooperativeData);
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Cooperative Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter cooperative name"
            required
          />
        </div>
        <div>
          <Label htmlFor="motto">Motto</Label>
          <Input
            id="motto"
            value={formData.motto}
            onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
            placeholder="Enter motto"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="contactEmail">Contact Email *</Label>
        <Input
          id="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
          placeholder="admin@cooperative.com"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactPhone">Contact Phone *</Label>
          <Input
            id="contactPhone"
            value={formData.contactPhone}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            placeholder="+234-xxx-xxx-xxxx"
            required
          />
        </div>
        <div>
          <Label htmlFor="subscriptionTier">Subscription Plan</Label>
          <select
            id="subscriptionTier"
            value={formData.subscriptionTier}
            onChange={(e) => setFormData({ ...formData, subscriptionTier: e.target.value as any })}
            className="w-full px-3 py-2 border rounded-md"
          >
            {subscriptionTiers.map(tier => (
              <option key={tier.id} value={tier.id}>
                {tier.name} - ₦{tier.price.toLocaleString()}/month
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Enter full address"
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label>Logo Upload</Label>
        <div className="mt-2 flex items-center gap-4">
          <img 
            src={formData.logo} 
            alt="Logo preview"
            className="w-16 h-16 rounded-lg object-cover border"
          />
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Logo
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-2">Recommended: 200x200px, PNG or JPG</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="color"
              id="primaryColor"
              value={formData.primaryColor}
              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
              className="w-12 h-10 rounded border"
            />
            <Input
              value={formData.primaryColor}
              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
              placeholder="#3B82F6"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="secondaryColor">Secondary Color</Label>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="color"
              id="secondaryColor"
              value={formData.secondaryColor}
              onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
              className="w-12 h-10 rounded border"
            />
            <Input
              value={formData.secondaryColor}
              onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
              placeholder="#1E40AF"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h4 className="font-medium mb-2">Brand Preview</h4>
        <div 
          className="p-4 rounded-lg text-white"
          style={{ backgroundColor: formData.primaryColor }}
        >
          <div className="flex items-center gap-3">
            <img 
              src={formData.logo} 
              alt="Logo"
              className="w-8 h-8 rounded"
            />
            <div>
              <h5 className="font-bold">{formData.name || 'Cooperative Name'}</h5>
              <p className="text-sm opacity-90">{formData.motto || 'Cooperative Motto'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-4">Loan Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Max Loan Amount (₦)</Label>
            <Input
              type="number"
              value={settings.loanSettings.maxLoanAmount}
              onChange={(e) => setSettings({
                ...settings,
                loanSettings: { ...settings.loanSettings, maxLoanAmount: Number(e.target.value) }
              })}
            />
          </div>
          <div>
            <Label>Default Interest Rate (%)</Label>
            <Input
              type="number"
              value={settings.loanSettings.defaultInterestRate}
              onChange={(e) => setSettings({
                ...settings,
                loanSettings: { ...settings.loanSettings, defaultInterestRate: Number(e.target.value) }
              })}
            />
          </div>
          <div>
            <Label>Max Loan Term (months)</Label>
            <Input
              type="number"
              value={settings.loanSettings.maxLoanTerm}
              onChange={(e) => setSettings({
                ...settings,
                loanSettings: { ...settings.loanSettings, maxLoanTerm: Number(e.target.value) }
              })}
            />
          </div>
          <div>
            <Label>Guarantors Required</Label>
            <Input
              type="number"
              value={settings.loanSettings.guarantorsRequired}
              onChange={(e) => setSettings({
                ...settings,
                loanSettings: { ...settings.loanSettings, guarantorsRequired: Number(e.target.value) }
              })}
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-4">Membership Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Registration Fee (₦)</Label>
            <Input
              type="number"
              value={settings.membershipSettings.registrationFee}
              onChange={(e) => setSettings({
                ...settings,
                membershipSettings: { ...settings.membershipSettings, registrationFee: Number(e.target.value) }
              })}
            />
          </div>
          <div>
            <Label>Monthly Dues (₦)</Label>
            <Input
              type="number"
              value={settings.membershipSettings.monthlyDues}
              onChange={(e) => setSettings({
                ...settings,
                membershipSettings: { ...settings.membershipSettings, monthlyDues: Number(e.target.value) }
              })}
            />
          </div>
          <div>
            <Label>Minimum Age</Label>
            <Input
              type="number"
              value={settings.membershipSettings.minimumAge}
              onChange={(e) => setSettings({
                ...settings,
                membershipSettings: { ...settings.membershipSettings, minimumAge: Number(e.target.value) }
              })}
            />
          </div>
          <div>
            <Label>Savings Interest Rate (%)</Label>
            <Input
              type="number"
              value={settings.savingsSettings.interestRate}
              onChange={(e) => setSettings({
                ...settings,
                savingsSettings: { ...settings.savingsSettings, interestRate: Number(e.target.value) }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Add New Cooperative</CardTitle>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div 
                    className={`w-12 h-1 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Step {currentStep}: {
              currentStep === 1 ? 'Basic Information' :
              currentStep === 2 ? 'Branding & Design' :
              'Business Rules'
            }
          </div>
        </CardHeader>
        
        <CardContent>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          
          <div className="flex justify-between pt-6 border-t mt-6">
            <Button
              variant="outline"
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            <Button
              onClick={() => {
                if (currentStep < 3) {
                  setCurrentStep(currentStep + 1);
                } else {
                  handleSubmit();
                }
              }}
              disabled={currentStep === 1 && (!formData.name || !formData.contactEmail)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {currentStep === 3 ? 'Create Cooperative' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCooperativeModal;
