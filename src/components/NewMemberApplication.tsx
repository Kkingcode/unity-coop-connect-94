import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Upload, Download, Check } from 'lucide-react';
import SignatureCanvas from './SignatureCanvas';
import { generateMembershipApplicationPDF } from '../utils/pdfGenerator';

interface NewMemberApplicationProps {
  onBack: () => void;
}

interface FormData {
  // Applicant Info
  fullName: string;
  sex: string;
  homeAddress: string;
  townLgaState: string;
  occupation: string;
  jobAddress: string;
  phoneNumber: string;
  introducedBy: string;
  
  // Next of Kin
  nokName: string;
  nokAddress: string;
  nokPhone: string;
  nokAltPhone: string;
  
  // Identification
  idType: string;
  idNumber: string;
  idImage: File | null;
  passportPhoto: File | null;
  utilityBill: File | null;
  
  // Guarantors
  guarantor1Name: string;
  guarantor1Address: string;
  guarantor1Phone: string;
  guarantor2Name: string;
  guarantor2Address: string;
  guarantor2Phone: string;
  
  // Declaration
  declarationAccepted: boolean;
}

const NewMemberApplication = ({ onBack }: NewMemberApplicationProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    sex: '',
    homeAddress: '',
    townLgaState: '',
    occupation: '',
    jobAddress: '',
    phoneNumber: '',
    introducedBy: '',
    nokName: '',
    nokAddress: '',
    nokPhone: '',
    nokAltPhone: '',
    idType: '',
    idNumber: '',
    idImage: null,
    passportPhoto: null,
    utilityBill: null,
    guarantor1Name: '',
    guarantor1Address: '',
    guarantor1Phone: '',
    guarantor2Name: '',
    guarantor2Address: '',
    guarantor2Phone: '',
    declarationAccepted: false,
  });

  const [signatures, setSignatures] = useState({
    applicant: '',
    guarantor1: '',
    guarantor2: '',
    president: '',
    secretary: '',
  });

  const handleInputChange = (field: keyof FormData, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: keyof FormData, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSignatureChange = (role: string, signature: string) => {
    setSignatures(prev => ({ ...prev, [role]: signature }));
  };

  const validateStep1 = () => {
    const requiredFields = [
      'fullName', 'sex', 'homeAddress', 'townLgaState', 'occupation', 
      'jobAddress', 'phoneNumber', 'introducedBy', 'nokName', 'nokAddress', 
      'nokPhone', 'idType', 'idNumber', 'guarantor1Name', 'guarantor1Address', 
      'guarantor1Phone', 'guarantor2Name', 'guarantor2Address', 'guarantor2Phone'
    ];

    return requiredFields.every(field => formData[field as keyof FormData]) &&
           formData.idImage && formData.passportPhoto && formData.utilityBill &&
           formData.declarationAccepted;
  };

  const validateStep2 = () => {
    return signatures.applicant && signatures.guarantor1 && signatures.guarantor2 && 
           signatures.president && signatures.secretary;
  };

  const generatePDF = () => {
    try {
      const pdf = generateMembershipApplicationPDF(formData, signatures);
      pdf.save(`${formData.fullName}_Application.pdf`);
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
      return false;
    }
  };

  const handleSubmit = () => {
    if (generatePDF()) {
      // Save to backend/cloud storage
      console.log('Application submitted successfully');
      
      // Add member to the system
      const memberData = {
        name: formData.fullName,
        email: `${formData.fullName.toLowerCase().replace(/\s+/g, '.')}@temp.com`, // Temporary email
        phone: formData.phoneNumber,
        sex: formData.sex,
        homeAddress: formData.homeAddress,
        town: formData.townLgaState.split('/')[0]?.trim() || '',
        lga: formData.townLgaState.split('/')[1]?.trim() || '',
        stateOfOrigin: formData.townLgaState.split('/')[2]?.trim() || '',
        occupation: formData.occupation,
        jobAddress: formData.jobAddress,
        introducedBy: formData.introducedBy,
        status: 'active' as const,
        nextOfKin: {
          name: formData.nokName,
          address: formData.nokAddress,
          phone: formData.nokPhone,
          altPhone: formData.nokAltPhone
        },
        guarantors: [
          {
            name: formData.guarantor1Name,
            address: formData.guarantor1Address,
            phone: formData.guarantor1Phone
          },
          {
            name: formData.guarantor2Name,
            address: formData.guarantor2Address,
            phone: formData.guarantor2Phone
          }
        ],
        signatures: signatures
      };
      
      // This would normally add the member to the system
      console.log('New member data:', memberData);
      onBack();
    }
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Applicant Info */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-primary">Applicant Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="sex">Sex *</Label>
              <Select value={formData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="homeAddress">Home Address *</Label>
            <Input
              id="homeAddress"
              value={formData.homeAddress}
              onChange={(e) => handleInputChange('homeAddress', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="townLgaState">Town / L.G.A / State of Origin *</Label>
            <Input
              id="townLgaState"
              value={formData.townLgaState}
              onChange={(e) => handleInputChange('townLgaState', e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="occupation">Occupation *</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="jobAddress">Job Address *</Label>
              <Input
                id="jobAddress"
                value={formData.jobAddress}
                onChange={(e) => handleInputChange('jobAddress', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="introducedBy">Who Introduced You? *</Label>
              <Input
                id="introducedBy"
                value={formData.introducedBy}
                onChange={(e) => handleInputChange('introducedBy', e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next of Kin */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-primary">Next of Kin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nokName">Name *</Label>
              <Input
                id="nokName"
                value={formData.nokName}
                onChange={(e) => handleInputChange('nokName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="nokAddress">Address *</Label>
              <Input
                id="nokAddress"
                value={formData.nokAddress}
                onChange={(e) => handleInputChange('nokAddress', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nokPhone">Phone *</Label>
              <Input
                id="nokPhone"
                value={formData.nokPhone}
                onChange={(e) => handleInputChange('nokPhone', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="nokAltPhone">Alternative Phone</Label>
              <Input
                id="nokAltPhone"
                value={formData.nokAltPhone}
                onChange={(e) => handleInputChange('nokAltPhone', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identification */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-primary">Identification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="idType">ID Type *</Label>
              <Select value={formData.idType} onValueChange={(value) => handleInputChange('idType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national_id">National ID</SelectItem>
                  <SelectItem value="drivers_license">Driver's License</SelectItem>
                  <SelectItem value="nin">NIN</SelectItem>
                  <SelectItem value="voters_card">Voter's Card</SelectItem>
                  <SelectItem value="international_passport">International Passport</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="idNumber">ID Number *</Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="idImage">ID Image *</Label>
              <Input
                id="idImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('idImage', e.target.files?.[0] || null)}
                required
              />
            </div>
            <div>
              <Label htmlFor="passportPhoto">Passport Photograph *</Label>
              <Input
                id="passportPhoto"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('passportPhoto', e.target.files?.[0] || null)}
                required
              />
            </div>
            <div>
              <Label htmlFor="utilityBill">Utility Bill *</Label>
              <Input
                id="utilityBill"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileUpload('utilityBill', e.target.files?.[0] || null)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guarantors */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-primary">Guarantors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Guarantor 1</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="guarantor1Name">Name *</Label>
                <Input
                  id="guarantor1Name"
                  value={formData.guarantor1Name}
                  onChange={(e) => handleInputChange('guarantor1Name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guarantor1Address">Home Address *</Label>
                <Input
                  id="guarantor1Address"
                  value={formData.guarantor1Address}
                  onChange={(e) => handleInputChange('guarantor1Address', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guarantor1Phone">Phone *</Label>
                <Input
                  id="guarantor1Phone"
                  value={formData.guarantor1Phone}
                  onChange={(e) => handleInputChange('guarantor1Phone', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Guarantor 2</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="guarantor2Name">Name *</Label>
                <Input
                  id="guarantor2Name"
                  value={formData.guarantor2Name}
                  onChange={(e) => handleInputChange('guarantor2Name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guarantor2Address">Home Address *</Label>
                <Input
                  id="guarantor2Address"
                  value={formData.guarantor2Address}
                  onChange={(e) => handleInputChange('guarantor2Address', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guarantor2Phone">Phone *</Label>
                <Input
                  id="guarantor2Phone"
                  value={formData.guarantor2Phone}
                  onChange={(e) => handleInputChange('guarantor2Phone', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Declaration */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="declaration"
              checked={formData.declarationAccepted}
              onCheckedChange={(checked) => handleInputChange('declarationAccepted', checked === true)}
            />
            <Label htmlFor="declaration" className="text-sm">
              I confirm that the information provided is true and correct. *
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-primary">Digital Signatures</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Applicant Signature *</Label>
            <SignatureCanvas
              onSignatureChange={(signature) => handleSignatureChange('applicant', signature)}
              width={400}
              height={150}
            />
          </div>
          
          <div>
            <Label>1st Guarantor Signature *</Label>
            <SignatureCanvas
              onSignatureChange={(signature) => handleSignatureChange('guarantor1', signature)}
              width={400}
              height={150}
            />
          </div>
          
          <div>
            <Label>2nd Guarantor Signature *</Label>
            <SignatureCanvas
              onSignatureChange={(signature) => handleSignatureChange('guarantor2', signature)}
              width={400}
              height={150}
            />
          </div>
          
          <div>
            <Label>President Signature * (Admin Only)</Label>
            <SignatureCanvas
              onSignatureChange={(signature) => handleSignatureChange('president', signature)}
              width={400}
              height={150}
            />
          </div>
          
          <div>
            <Label>Secretary Signature * (Admin Only)</Label>
            <SignatureCanvas
              onSignatureChange={(signature) => handleSignatureChange('secretary', signature)}
              width={400}
              height={150}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-primary">Review & Submit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Application Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Applicant:</strong> {formData.fullName}</p>
                <p><strong>Phone:</strong> {formData.phoneNumber}</p>
                <p><strong>Occupation:</strong> {formData.occupation}</p>
              </div>
              <div>
                <p><strong>Next of Kin:</strong> {formData.nokName}</p>
                <p><strong>Guarantor 1:</strong> {formData.guarantor1Name}</p>
                <p><strong>Guarantor 2:</strong> {formData.guarantor2Name}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={generatePDF}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>
          </div>
          
          <div className="border-t pt-4">
            <Button
              onClick={handleSubmit}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Check className="h-4 w-4 mr-2" />
              Submit Application
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">ONCS Membership Application</h1>
              <p className="text-muted-foreground">OLORUN NI NSOGO Co-operative Society</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep
                    ? 'bg-primary text-white'
                    : step < currentStep
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step < currentStep ? <Check className="h-4 w-4" /> : step}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="animate-fade-in-up">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < 3 ? (
            <Button
              onClick={() => {
                if (currentStep === 1 && !validateStep1()) {
                  alert('Please fill in all required fields');
                  return;
                }
                if (currentStep === 2 && !validateStep2()) {
                  alert('Please complete all signatures');
                  return;
                }
                setCurrentStep(currentStep + 1);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NewMemberApplication;
