import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { User, Phone, Mail, MapPin, Briefcase, Heart } from 'lucide-react';
import { authService, CreateMemberData } from '@/services/authService';
import { toast } from 'sonner';

interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberCreated: (accountNumber: string) => void;
}

const CreateMemberModal = ({ isOpen, onClose, onMemberCreated }: CreateMemberModalProps) => {
  const [formData, setFormData] = useState<CreateMemberData>({
    name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    address: '',
    occupation: '',
    next_of_kin_name: '',
    next_of_kin_phone: '',
    next_of_kin_relationship: '',
    monthly_contribution: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CreateMemberData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await authService.createMember(formData);
      
      if (result) {
        toast.success(`Member created successfully! Account Number: ${result.accountNumber}`, {
          description: `${formData.name} can now login with account number ${result.accountNumber} and phone number as password.`
        });
        onMemberCreated(result.accountNumber);
        onClose();
        setFormData({
          name: '',
          phone: '',
          email: '',
          date_of_birth: '',
          address: '',
          occupation: '',
          next_of_kin_name: '',
          next_of_kin_phone: '',
          next_of_kin_relationship: '',
          monthly_contribution: 0
        });
      } else {
        toast.error('Failed to create member account. Please try again.');
      }
    } catch (error) {
      console.error('Create member error:', error);
      toast.error('An error occurred while creating the member account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Create New Member Account
          </DialogTitle>
          <DialogDescription>
            Fill in the member's details. An account number will be generated automatically, and their phone number will be their initial password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+234XXXXXXXXXX"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="email@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      placeholder="Job title or profession"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthly_contribution">Monthly Contribution (₦)</Label>
                  <Input
                    id="monthly_contribution"
                    type="number"
                    value={formData.monthly_contribution}
                    onChange={(e) => handleInputChange('monthly_contribution', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    step="100"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Complete address"
                    className="pl-10"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next of Kin Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Next of Kin Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="next_of_kin_name">Next of Kin Name</Label>
                  <Input
                    id="next_of_kin_name"
                    value={formData.next_of_kin_name}
                    onChange={(e) => handleInputChange('next_of_kin_name', e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="next_of_kin_phone">Next of Kin Phone</Label>
                  <Input
                    id="next_of_kin_phone"
                    value={formData.next_of_kin_phone}
                    onChange={(e) => handleInputChange('next_of_kin_phone', e.target.value)}
                    placeholder="+234XXXXXXXXXX"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="next_of_kin_relationship">Relationship</Label>
                  <Input
                    id="next_of_kin_relationship"
                    value={formData.next_of_kin_relationship}
                    onChange={(e) => handleInputChange('next_of_kin_relationship', e.target.value)}
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create Member Account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMemberModal;