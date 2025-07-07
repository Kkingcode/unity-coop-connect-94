
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, Edit, UserCheck, UserX, Download } from 'lucide-react';
import { authService, AuthUser } from '@/services/authService';
import CreateMemberModal from './CreateMemberModal';
import MemberDetailsModal from './MemberDetailsModal';
import { toast } from 'sonner';

const MembersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<AuthUser | null>(null);
  const [showCreateMemberModal, setShowCreateMemberModal] = useState(false);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const allMembers = await authService.getAllMembers();
      setMembers(allMembers);
    } catch (error) {
      console.error('Error loading members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.account_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewMember = (member: AuthUser) => {
    setSelectedMember(member);
    setShowMemberDetails(true);
  };

  const handleStatusChange = async (member: AuthUser, newStatus: 'active' | 'suspended') => {
    try {
      const success = await authService.updateMemberStatus(member.id, newStatus);
      if (success) {
        toast.success(`${member.name} has been ${newStatus}.`);
        loadMembers(); // Reload the list
      } else {
        toast.error('Failed to update member status');
      }
    } catch (error) {
      console.error('Error updating member status:', error);
      toast.error('Failed to update member status');
    }
  };

  const generateMemberStatement = async (member: AuthUser) => {
    try {
      // Import PDF generator dynamically
      const { generateMemberStatement } = await import('@/utils/pdfGenerator');
      await generateMemberStatement(member);
      toast.success('Statement generated successfully');
    } catch (error) {
      console.error('Error generating statement:', error);
      toast.error('Failed to generate statement');
    }
  };

  const handleMemberCreated = () => {
    setShowCreateMemberModal(false);
    loadMembers(); // Reload the list
    toast.success('Member created successfully');
  };

  return (
    <div className="animate-slide-in-right">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Members Management</h1>
          <p className="text-muted-foreground">Manage ONCS members and their accounts</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowCreateMemberModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="glass-card mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search members by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading members...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No members found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                      {(member.loan_balance || 0) > 0 && (
                        <Badge className="bg-red-100 text-red-800 animate-pulse">ON LOAN</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <p><span className="font-medium">Account:</span> {member.account_number}</p>
                        <p><span className="font-medium">Email:</span> {member.email || 'N/A'}</p>
                        <p><span className="font-medium">Phone:</span> {member.phone}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Role:</span> {member.role}</p>
                        <p><span className="font-medium">Balance:</span> {formatCurrency(member.balance || 0)}</p>
                        <p><span className="font-medium">Loan:</span> {formatCurrency(member.loan_balance || 0)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewMember(member)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => generateMemberStatement(member)}
                      title="Download Member Statement"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.info('Edit feature coming soon!')}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {member.status === 'active' ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600" 
                        onClick={() => {
                          if (confirm(`Suspend ${member.name}?`)) {
                            handleStatusChange(member, 'suspended');
                          }
                        }}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600" 
                        onClick={() => {
                          if (confirm(`Activate ${member.name}?`)) {
                            handleStatusChange(member, 'active');
                          }
                        }}
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateMemberModal 
        isOpen={showCreateMemberModal}
        onClose={() => setShowCreateMemberModal(false)}
        onSuccess={handleMemberCreated}
      />

      <MemberDetailsModal 
        member={selectedMember}
        isOpen={showMemberDetails}
        onClose={() => {
          setShowMemberDetails(false);
          setSelectedMember(null);
        }}
      />
    </div>
  );
};

export default MembersManagement;
