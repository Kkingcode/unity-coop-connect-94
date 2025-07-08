import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Building2, Mail, Phone, MapPin, Users, Target } from 'lucide-react';
import { cooperativeService } from '@/services/cooperativeService';
import { toast } from 'sonner';

const CooperativeOnboardingForm = () => {
  const [formData, setFormData] = useState({
    cooperativeName: '',
    adminName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    expectedMembers: '',
    selectedTier: 'starter',
    notes: '',
    logo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tiers = [
    { id: 'starter', name: 'Starter', price: 15000, description: 'Perfect for small cooperatives' },
    { id: 'professional', name: 'Professional', price: 35000, description: 'Ideal for growing cooperatives' },
    { id: 'enterprise', name: 'Enterprise', price: 75000, description: 'For large cooperatives and federations' }
  ];

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const logoUrl = URL.createObjectURL(file);
      setFormData({ ...formData, logo: logoUrl });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await cooperativeService.submitOnboardingRequest({
        cooperative_name: formData.cooperativeName,
        admin_name: formData.adminName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        address: formData.address,
        expected_members: parseInt(formData.expectedMembers) || 0,
        selected_tier: formData.selectedTier,
        notes: formData.notes,
        logo: formData.logo
      });

      if (success) {
        toast.success('Registration request submitted successfully! We will review your application and get back to you within 24 hours.');
        // Reset form
        setFormData({
          cooperativeName: '',
          adminName: '',
          contactEmail: '',
          contactPhone: '',
          address: '',
          expectedMembers: '',
          selectedTier: 'starter',
          notes: '',
          logo: ''
        });
      } else {
        toast.error('Failed to submit registration request. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to submit registration request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Join Alajeseku Platform</h1>
          <p className="text-gray-600 mt-2">Register your cooperative to get started with our digital platform</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-center">Cooperative Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cooperative Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Cooperative Information
                </h3>
                
                <div>
                  <Label htmlFor="cooperativeName">Cooperative Name *</Label>
                  <Input
                    id="cooperativeName"
                    value={formData.cooperativeName}
                    onChange={(e) => setFormData({ ...formData, cooperativeName: e.target.value })}
                    placeholder="Enter your cooperative name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="expectedMembers">Expected Number of Members</Label>
                  <Input
                    id="expectedMembers"
                    type="number"
                    value={formData.expectedMembers}
                    onChange={(e) => setFormData({ ...formData, expectedMembers: e.target.value })}
                    placeholder="e.g., 50"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter your cooperative's address"
                    rows={3}
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <Label>Cooperative Logo (Optional)</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {formData.logo && (
                      <img 
                        src={formData.logo} 
                        alt="Logo preview"
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                    )}
                    <label htmlFor="logo-upload">
                      <Button variant="outline" className="flex items-center gap-2" type="button">
                        <Upload className="h-4 w-4" />
                        Upload Logo
                      </Button>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Admin Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Administrator Information
                </h3>
                
                <div>
                  <Label htmlFor="adminName">Admin Full Name *</Label>
                  <Input
                    id="adminName"
                    value={formData.adminName}
                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                    placeholder="Enter admin's full name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="admin@cooperative.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="+234-xxx-xxx-xxxx"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Tier */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Select Subscription Plan
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {tiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.selectedTier === tier.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({ ...formData, selectedTier: tier.id })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="tier"
                              value={tier.id}
                              checked={formData.selectedTier === tier.id}
                              onChange={() => {}}
                              className="text-blue-600"
                            />
                            <div>
                              <h4 className="font-semibold">{tier.name}</h4>
                              <p className="text-sm text-gray-600">{tier.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{formatCurrency(tier.price)}</div>
                          <div className="text-sm text-gray-500">per month</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional information about your cooperative..."
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !formData.cooperativeName || !formData.adminName || !formData.contactEmail || !formData.contactPhone}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                size="lg"
              >
                {isSubmitting ? 'Submitting Request...' : 'Submit Registration Request'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <p>By submitting this form, you agree to our terms of service.</p>
                <p className="mt-1">We'll review your application and contact you within 24 hours.</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CooperativeOnboardingForm;