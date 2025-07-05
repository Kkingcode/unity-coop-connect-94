import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Send, 
  Reply, 
  Archive, 
  Star,
  Search,
  Plus,
  Bell,
  Users,
  AlertCircle
} from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const MessagesCenter = () => {
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('inbox');
  
  const { activities, addActivity } = useAppState();

  const handleSendMessage = () => {
    if (!newMessage.recipient || !newMessage.subject || !newMessage.content) {
      return;
    }

    // Add activity for message sent
    addActivity(
      `Message sent to ${newMessage.recipient}: ${newMessage.subject}`,
      'message',
      newMessage.recipient
    );

    // Clear form
    setNewMessage({
      recipient: '',
      subject: '',
      content: ''
    });
  };

  const handleReplyMessage = (messageId: string) => {
    // Add activity for message reply
    addActivity(
      `Replied to message ID: ${messageId}`,
      'message'
    );
  };

  const mockMessages = [
    {
      id: 'MSG001',
      sender: 'John Doe',
      recipient: 'Admin',
      subject: 'Loan Application Status',
      content: 'Dear Admin, I am writing to inquire about the status of my loan application submitted on January 5, 2024. My membership ID is ONCS001. Thank you for your assistance.',
      timestamp: '2024-01-20T10:00:00Z',
      status: 'unread',
      isStarred: false
    },
    {
      id: 'MSG002',
      sender: 'Admin',
      recipient: 'Alice Johnson',
      subject: 'Investment Opportunity',
      content: 'Dear Alice, We are excited to announce a new investment opportunity with guaranteed returns. Please visit the investment dashboard for more details.',
      timestamp: '2024-01-18T14:30:00Z',
      status: 'read',
      isStarred: true
    },
    {
      id: 'MSG003',
      sender: 'Michael Johnson',
      recipient: 'Admin',
      subject: 'Savings Withdrawal Request',
      content: 'Dear Admin, I would like to request a withdrawal of ₦50,000 from my savings account. My membership ID is ONCS003. Please let me know the next steps.',
      timestamp: '2024-01-15T09:15:00Z',
      status: 'read',
      isStarred: false
    }
  ];

  const filteredMessages = mockMessages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.recipient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="animate-slide-in-right">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages Center</h1>
          <p className="text-gray-600">Communicate with members and manage notifications</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setActiveTab('compose')}>
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Compose New Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Recipient</label>
                <Input
                  placeholder="Enter recipient email or member ID"
                  value={newMessage.recipient}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, recipient: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input
                  placeholder="Enter message subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  placeholder="Type your message here..."
                  value={newMessage.content}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                />
              </div>
              <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbox" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Inbox</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="space-y-3 mt-4">
                {filteredMessages.map(message => (
                  <Card key={message.id} className="glass-card hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{message.subject}</h3>
                            {message.status === 'unread' && (
                              <Badge variant="secondary">Unread</Badge>
                            )}
                            {message.isStarred && (
                              <Star className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            From: {message.sender} | Sent: {formatDate(message.timestamp)}
                          </p>
                          <p className="text-gray-700 mt-2">{message.content.substring(0, 100)}...</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleReplyMessage(message.id)}>
                            <Reply className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => alert(`Message ${message.id} archived`)}>
                            <Archive className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Sent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search sent messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="space-y-3 mt-4">
                {filteredMessages.map(message => (
                  <Card key={message.id} className="glass-card hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{message.subject}</h3>
                            {message.isStarred && (
                              <Star className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            To: {message.recipient} | Sent: {formatDate(message.timestamp)}
                          </p>
                          <p className="text-gray-700 mt-2">{message.content.substring(0, 100)}...</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => alert(`Message ${message.id} archived`)}>
                            <Archive className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Bell className="h-4 w-4" />
                  <span>Stay informed about important updates and alerts</span>
                </div>
              </CardContent>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Loan Approval
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Your loan application has been approved. Please check your account for details.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Investment Opportunity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      A new investment opportunity is now available with high returns.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <AlertCircle className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">5 days ago</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessagesCenter;
