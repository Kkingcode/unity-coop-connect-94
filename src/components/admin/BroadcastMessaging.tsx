
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageSquare, Send, Users, Filter, Megaphone } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const BroadcastMessaging = () => {
  const { members, sendBroadcastMessage, addAdminLog } = useAppState();
  const [messageData, setMessageData] = useState({
    title: '',
    message: '',
    targetMembers: [] as string[]
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectAll, setSelectAll] = useState(false);

  const filteredMembers = members.filter(member => {
    if (filterStatus === 'all') return true;
    return member.status === filterStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setMessageData({
        ...messageData,
        targetMembers: filteredMembers.map(m => m.id)
      });
    } else {
      setMessageData({
        ...messageData,
        targetMembers: []
      });
    }
  };

  const handleMemberSelect = (memberId: string, checked: boolean) => {
    if (checked) {
      setMessageData({
        ...messageData,
        targetMembers: [...messageData.targetMembers, memberId]
      });
    } else {
      setMessageData({
        ...messageData,
        targetMembers: messageData.targetMembers.filter(id => id !== memberId)
      });
    }
  };

  const handleSendMessage = () => {
    if (!messageData.title || !messageData.message) return;

    const targetMemberIds = messageData.targetMembers.length > 0 
      ? messageData.targetMembers
      : [];

    console.log('BroadcastMessaging - Debugging function signatures:');
    console.log('sendBroadcastMessage type:', typeof sendBroadcastMessage);
    console.log('addAdminLog type:', typeof addAdminLog);
    console.log('Parameters being passed to sendBroadcastMessage:', {
      title: messageData.title,
      message: messageData.message,
      targetMemberIds: targetMemberIds,
      types: {
        title: typeof messageData.title,
        message: typeof messageData.message,
        targetMemberIds: typeof targetMemberIds,
        isArray: Array.isArray(targetMemberIds)
      }
    });

    // Fix: Call sendBroadcastMessage with correct parameters (memberIds, message, subject)
    try {
      sendBroadcastMessage(targetMemberIds, messageData.message, messageData.title);
      console.log('sendBroadcastMessage called successfully');
    } catch (error) {
      console.error('Error calling sendBroadcastMessage:', error);
    }
    
    // Fix: Call addAdminLog with correct parameters (adminId, adminName, action, details)
    const logMessage = `Sent "${messageData.title}" to ${targetMemberIds.length > 0 ? targetMemberIds.length : 'all'} members`;
    
    try {
      addAdminLog('ADMIN001', 'Admin User', 'Broadcast Message', logMessage);
      console.log('addAdminLog called successfully');
    } catch (error) {
      console.error('Error calling addAdminLog:', error);
    }

    // Reset form
    setMessageData({ title: '', message: '', targetMembers: [] });
    setSelectAll(false);
  };

  function getStatusBadgeColor(status: string) {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'dormant': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <div className="animate-slide-in-right">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Broadcast Messaging</h1>
        <p className="text-gray-600">Send messages to members or specific groups</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Compose Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Message Title</label>
              <Input
                placeholder="Enter message title"
                value={messageData.title}
                onChange={(e) => setMessageData({ ...messageData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message Content</label>
              <Textarea
                placeholder="Enter your message content"
                value={messageData.message}
                onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                rows={6}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                {messageData.targetMembers.length > 0 
                  ? `${messageData.targetMembers.length} members selected`
                  : 'All members will receive this message'
                }
              </div>
              <Button 
                onClick={handleSendMessage}
                disabled={!messageData.title || !messageData.message}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select Recipients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="all">All Members</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                    <option value="suspended">Suspended Only</option>
                    <option value="dormant">Dormant Only</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Select All ({filteredMembers.length} members)
                </label>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={messageData.targetMembers.includes(member.id)}
                      onCheckedChange={(checked) => handleMemberSelect(member.id, checked as boolean)}
                    />
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-gray-600">{member.membershipId}</p>
                    </div>
                  </div>
                  <Badge className={getStatusBadgeColor(member.status)}>
                    {member.status}
                  </Badge>
                </div>
              ))}

              {filteredMembers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No Members Found</h3>
                  <p className="text-gray-600">No members match the selected filter</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Quick Message Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                title: "Meeting Reminder",
                content: "Reminder: Our monthly meeting is scheduled for tomorrow. Please confirm your attendance."
              },
              {
                title: "Payment Due",
                content: "This is a friendly reminder that your loan payment is due this week. Please make your payment on time."
              },
              {
                title: "New Investment",
                content: "Exciting news! A new investment opportunity is now available. Check your dashboard for details."
              },
              {
                title: "System Maintenance",
                content: "The system will undergo maintenance this weekend. Services may be temporarily unavailable."
              }
            ].map((template, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-3 text-left justify-start"
                onClick={() => setMessageData({
                  ...messageData,
                  title: template.title,
                  message: template.content
                })}
              >
                <div>
                  <p className="font-medium text-sm">{template.title}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{template.content}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BroadcastMessaging;
