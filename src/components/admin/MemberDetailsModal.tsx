
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, User, Phone, Mail, MapPin, Briefcase, Users, CreditCard, Calendar, AlertTriangle } from 'lucide-react';
import { Member } from '@/hooks/useAppState';

interface MemberDetailsModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

const MemberDetailsModal = ({ member, isOpen, onClose }: MemberDetailsModalProps) => {
  if (!member) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOnLoan = member.loanBalance > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Member Details
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Status */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div>
              <h2 className="text-xl font-semibold">{member.name}</h2>
              <p className="text-gray-600">{member.membershipId}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
              {isOnLoan && (
                <Badge className="bg-red-100 text-red-800 animate-pulse">
                  <CreditCard className="h-3 w-3 mr-1" />
                  ON LOAN
                </Badge>
              )}
            </div>
          </div>

          {/* Financial Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Savings Balance</p>
                    <p className="font-semibold">{formatCurrency(member.balance)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <CreditCard className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Loan Balance</p>
                    <p className="font-semibold">{formatCurrency(member.loanBalance)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Join Date</p>
                    <p className="font-semibold">{member.joinDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Last Payment Info */}
          {member.lastPaymentDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Last Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{member.lastPaymentDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-medium">{formatCurrency(member.lastPaymentAmount || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{member.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sex</p>
                  <p className="font-medium">{member.sex}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{member.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{member.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Home Address</p>
                  <p className="font-medium">{member.homeAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Town</p>
                  <p className="font-medium">{member.town}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">L.G.A</p>
                  <p className="font-medium">{member.lga}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">State of Origin</p>
                  <p className="font-medium">{member.stateOfOrigin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Occupation</p>
                  <p className="font-medium">{member.occupation}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Job Address</p>
                  <p className="font-medium">{member.jobAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Introduced By</p>
                  <p className="font-medium">{member.introducedBy}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next of Kin */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Next of Kin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{member.nextOfKin.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{member.nextOfKin.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Alternative Phone</p>
                  <p className="font-medium">{member.nextOfKin.altPhone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{member.nextOfKin.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guarantors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Guarantors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {member.guarantors.map((guarantor, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Guarantor {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Name</p>
                        <p className="font-medium">{guarantor.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Phone</p>
                        <p className="font-medium">{guarantor.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Address</p>
                        <p className="font-medium">{guarantor.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Signatures */}
          {member.signatures && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Signatures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {member.signatures.applicant && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Applicant Signature</p>
                      <div className="border rounded-lg p-2 bg-white">
                        <img 
                          src={member.signatures.applicant} 
                          alt="Applicant Signature" 
                          className="max-w-full h-20 mx-auto object-contain"
                        />
                      </div>
                    </div>
                  )}
                  {member.signatures.guarantor1 && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Guarantor 1 Signature</p>
                      <div className="border rounded-lg p-2 bg-white">
                        <img 
                          src={member.signatures.guarantor1} 
                          alt="Guarantor 1 Signature" 
                          className="max-w-full h-20 mx-auto object-contain"
                        />
                      </div>
                    </div>
                  )}
                  {member.signatures.guarantor2 && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Guarantor 2 Signature</p>
                      <div className="border rounded-lg p-2 bg-white">
                        <img 
                          src={member.signatures.guarantor2} 
                          alt="Guarantor 2 Signature" 
                          className="max-w-full h-20 mx-auto object-contain"
                        />
                      </div>
                    </div>
                  )}
                  {member.signatures.president && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">President Signature</p>
                      <div className="border rounded-lg p-2 bg-white">
                        <img 
                          src={member.signatures.president} 
                          alt="President Signature" 
                          className="max-w-full h-20 mx-auto object-contain"
                        />
                      </div>
                    </div>
                  )}
                  {member.signatures.secretary && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Secretary Signature</p>
                      <div className="border rounded-lg p-2 bg-white">
                        <img 
                          src={member.signatures.secretary} 
                          alt="Secretary Signature" 
                          className="max-w-full h-20 mx-auto object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDetailsModal;
