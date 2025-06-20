
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, Edit, UserCheck, UserX } from 'lucide-react';
import NewMemberApplication from '../NewMemberApplication';

interface Member {
  id: number;
  name: string;
  membershipId: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  balance: number;
  loanBalance: number;
}

const MembersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showNewMemberForm, setShowNewMemberForm] = useState(false);

  const members: Member[] = [
    {
      id: 1,
      name: 'John Doe',
      membershipId: 'MEM001',
      email: 'john@example.com',
      phone: '+234 800 123 4567',
      joinDate: '2023-01-15',
      status: 'active',
      balance: 450000,
      loanBalance: 150000
    },
    {
      id: 2,
      name: 'Alice Johnson',
      membershipId: 'MEM002',
      email: 'alice@example.com',
      phone: '+234 800 234 5678',
      joinDate: '2023-02-20',
      status: 'active',
      balance: 320000,
      loanBalance: 0
    },
    {
      id: 3,
      name: 'Bob Williams',
      membershipId: 'MEM003',
      email: 'bob@example.com',
      phone: '+234 800 345 6789',
      joinDate: '2023-03-10',
      status: 'suspended',
      balance: 125000,
      loanBalance: 75000
    }
  ];

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.membershipId.toLowerCase().includes(searchTerm.toLowerCase())
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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showNewMemberForm) {
    return <NewMemberApplication onBack={() => setShowNewMemberForm(false)} />;
  }

  return (
    <div className="animate-slide-in-right">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Members Management</h1>
          <p className="text-muted-foreground">Manage ONCS members and their accounts</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowNewMemberForm(true)}
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
      <div className="grid gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="glass-card hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p><span className="font-medium">ID:</span> {member.membershipId}</p>
                      <p><span className="font-medium">Email:</span> {member.email}</p>
                      <p><span className="font-medium">Phone:</span> {member.phone}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Joined:</span> {member.joinDate}</p>
                      <p><span className="font-medium">Balance:</span> {formatCurrency(member.balance)}</p>
                      <p><span className="font-medium">Loan:</span> {formatCurrency(member.loanBalance)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMember(member)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {member.status === 'active' ? (
                    <Button variant="outline" size="sm" className="text-red-600">
                      <UserX className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="text-green-600">
                      <UserCheck className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MembersManagement;
