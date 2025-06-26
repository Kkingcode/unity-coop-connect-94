import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { UserX, Clock, AlertTriangle, Mail, Phone, Search } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const InactiveMemberTracker = () => {
  const { members, sendBroadcastMessage, addAdminLog } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  const getInactivityPeriod = (member: any) => {
    const lastActivity = new Date(member.lastActivityDate || member.joinDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const categorizeMembers = () => {
    const categories = {
      dormant: members.filter(m => m.status === 'dormant'),
      inactive: members.filter(m => m.status === 'inactive'),
      recentlyInactive: members.filter(m => {
        const days = getInactivityPeriod(m);
        return m.status === 'active' && days >= 14 && days < 21;
      }),
      atRisk: members.filter(m => {
        const days = getInactivityPeriod(m);
        return m.status === 'active' && days >= 7 && days < 14;
      })
    };
    return categories;
  };

  const categories = categorizeMembers();

  const filteredMembers = (memberList: any[]) => {
    return memberList.filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.membershipId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSendReminder = (memberIds: number[], type: string) => {
    const reminderMessages = {
      atRisk: {
        title: "We Miss You!",
        message: "We noticed you haven't been active recently. Please check in with us or make your regular contributions."
      },
      recentlyInactive: {
        title: "Activity Reminder",
        message: "Your account has been inactive for a while. Please contact us to discuss your membership status."
      },
      inactive: {
        title: "Membership Status Update",
        message: "Your membership is currently inactive. Please contact the admin to reactivate your account."
      },
      dormant: {
        title: "Account Reactivation",
        message: "Your account is dormant. Please visit our office or contact us to discuss reactivating your membership."
      }
    };

    const message = reminderMessages[type as keyof typeof reminderMessages];
    sendBroadcastMessage(message.title, message.message, memberIds);
    
    addAdminLog(`Sent ${type} reminder to ${memberIds.length} members`, 'members', 'reminder_sent', [new Date().toISOString()]);
  };

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  }

  function getCategoryColor(category: string) {
    switch (category) {
      case 'atRisk': return 'bg-yellow-100 text-yellow-800';
      case 'recentlyInactive': return 'bg-orange-100 text-orange-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'dormant': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <div className="animate-slide-in-right">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Inactive Member Tracker</h1>
        <p className="text-gray-600">Monitor and manage inactive members</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">At Risk</p>
                <p className="text-2xl font-bold text-yellow-600">{categories.atRisk.length}</p>
                <p className="text-xs text-gray-500">7-14 days inactive</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recently Inactive</p>
                <p className="text-2xl font-bold text-orange-600">{categories.recentlyInactive.length}</p>
                <p className="text-xs text-gray-500">14-21 days inactive</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-red-600">{categories.inactive.length}</p>
                <p className="text-xs text-gray-500">Status: Inactive</p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dormant</p>
                <p className="text-2xl font-bold text-gray-600">{categories.dormant.length}</p>
                <p className="text-xs text-gray-500">Status: Dormant</p>
              </div>
              <UserX className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search members by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {Object.entries(categories).map(([categoryKey, memberList]) => {
          const filteredList = filteredMembers(memberList);
          if (filteredList.length === 0) return null;

          return (
            <Card key={categoryKey} className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <UserX className="h-5 w-5" />
                    {categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1).replace(/([A-Z])/g, ' $1')} Members ({filteredList.length})
                  </CardTitle>
                  <Button
                    onClick={() => handleSendReminder(filteredList.map(m => m.id), categoryKey)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reminder
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredList.map((member) => {
                    const inactiveDays = getInactivityPeriod(member);
                    return (
                      <div key={member.id} className="border-l-4 border-gray-300 pl-4 py-3 bg-gray-50 rounded-r-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{member.name}</h4>
                              <Badge className={getCategoryColor(categoryKey)}>
                                {member.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                              <span>ID: {member.membershipId}</span>
                              <span>Balance: {formatCurrency(member.balance)}</span>
                              <span>Inactive: {inactiveDays} days</span>
                              <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
                            </div>
                            {member.lastActivityDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                Last Activity: {new Date(member.lastActivityDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendReminder([member.id], categoryKey)}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`tel:${member.phone}`)}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="glass-card mt-6">
        <CardHeader>
          <CardTitle>Inactivity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Total Impact</h4>
              <div className="space-y-2 text-sm">
                <p>Total Inactive Members: {categories.inactive.length + categories.dormant.length}</p>
                <p>Members at Risk: {categories.atRisk.length + categories.recentlyInactive.length}</p>
                <p>Total Affected Balance: {formatCurrency(
                  [...categories.inactive, ...categories.dormant, ...categories.atRisk, ...categories.recentlyInactive]
                    .reduce((sum, member) => sum + member.balance, 0)
                )}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Recommended Actions</h4>
              <div className="space-y-2 text-sm">
                <p>• Send weekly reminders to at-risk members</p>
                <p>• Contact inactive members personally</p>
                <p>• Review membership terms for dormant accounts</p>
                <p>• Implement reactivation incentives</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InactiveMemberTracker;
