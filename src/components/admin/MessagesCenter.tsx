
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, MessageSquare, Users, Bell } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

interface Message {
  id: number;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'private' | 'broadcast';
}

const MessagesCenter = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: ''
  });
  const { members, addActivity } = useAppState();

  const [messages] = useState<Message[]>([
    {
      id: 1,
      from: 'John Doe',
      to: 'Admin',
      subject: 'Loan Application Query',
      content: 'Hello, I would like to inquire about the status of my loan application submitted last week.',
      timestamp: '2024-06-20 10:30 AM',
      read: false,
      type: 'private'
    },
    {
      id: 2,
      from: 'Alice Johnson',
      to: 'Admin',
      subject: 'Savings Withdrawal Request',
      content: 'I need to make an emergency withdrawal from my savings. Please advise on the process.',
      timestamp: '2024-06-20 09:15 AM',
      read: true,
      type: 'private'
    }
  ]);

  const handleSendMessage = () => {
    if (newMessage.to && newMessage.subject && newMessage.content) {
      addActivity({
        type: 'member',
        description: `Message sent to ${newMessage.to}: ${newMessage.subject}`,
        time: 'Just now'
      });
      
      setNewMessage({ to: '', subject: '', content: '' });
      alert('Message sent successfully!');
    }
  };

  const handleBroadcast = () => {
    if (newMessage.subject && newMessage.content) {
      addActivity({
        type: 'member',
        description: `Broadcast message sent: ${newMessage.subject}`,
        time: 'Just now'
      });
      
      setNewMessage({ to: '', subject: '', content: '' });
      alert('Broadcast message sent to all members!');
    }
  };

  return (
    <div className="animate-slide-in-right">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages Center</h1>
        <p className="text-gray-600">Communicate with members and send announcements</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="mt-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id} className="glass-card hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{message.subject}</h3>
                      {!message.read && (
                        <Badge className="bg-red-100 text-red-800">New</Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{message.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">From: {message.from}</p>
                  <p className="text-gray-700">{message.content}</p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">Reply</Button>
                    <Button size="sm" variant="outline">Mark as Read</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compose" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Compose Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">To:</label>
                <select 
                  className="w-full p-2 border rounded-lg"
                  value={newMessage.to}
                  onChange={(e) => setNewMessage({...newMessage, to: e.target.value})}
                >
                  <option value="">Select Member</option>
                  {members.map(member => (
                    <option key={member.id} value={member.name}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject:</label>
                <Input
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  placeholder="Enter subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message:</label>
                <Textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  placeholder="Type your message here..."
                  rows={6}
                />
              </div>
              <Button onClick={handleSendMessage} className="bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="broadcast" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Broadcast to All Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject:</label>
                <Input
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  placeholder="Enter announcement subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Announcement:</label>
                <Textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  placeholder="Type your announcement here..."
                  rows={6}
                />
              </div>
              <Button onClick={handleBroadcast} className="bg-primary hover:bg-primary/90">
                <Bell className="h-4 w-4 mr-2" />
                Send Broadcast
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessagesCenter;
