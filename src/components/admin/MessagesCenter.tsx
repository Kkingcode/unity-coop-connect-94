
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Reply, Archive, MessageSquare, Plus } from 'lucide-react';

interface Message {
  id: number;
  from: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

const MessagesCenter = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState(false);

  const messages: Message[] = [
    {
      id: 1,
      from: 'John Doe (MEM001)',
      subject: 'Loan Application Follow-up',
      preview: 'Hello, I wanted to follow up on my loan application submitted last week...',
      date: '2024-06-18',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      from: 'Alice Johnson (MEM002)',
      subject: 'Account Balance Inquiry',
      preview: 'Could you please help me understand my current account balance and recent transactions...',
      date: '2024-06-17',
      read: true,
      priority: 'medium'
    },
    {
      id: 3,
      from: 'Bob Williams (MEM003)',
      subject: 'Meeting Schedule Request',
      preview: 'I would like to schedule a meeting to discuss my savings goals and investment options...',
      date: '2024-06-16',
      read: false,
      priority: 'low'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="animate-slide-in-right">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages Center</h1>
          <p className="text-gray-600">Communication with cooperative members</p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setNewMessage(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Inbox ({unreadCount} unread)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                      !message.read ? 'bg-blue-50 border-l-4 border-l-purple-500' : ''
                    } ${selectedMessage?.id === message.id ? 'bg-purple-50' : ''}`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-medium text-sm ${!message.read ? 'font-bold' : ''}`}>
                        {message.from}
                      </h3>
                      <Badge className={getPriorityColor(message.priority)} style={{ fontSize: '10px' }}>
                        {message.priority}
                      </Badge>
                    </div>
                    <p className={`font-medium text-sm mb-1 ${!message.read ? 'font-bold' : ''}`}>
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-600 mb-2 truncate">
                      {message.preview}
                    </p>
                    <p className="text-xs text-gray-500">{message.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Detail / Compose */}
        <div className="lg:col-span-2">
          {newMessage ? (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Compose New Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">To:</label>
                  <Input placeholder="Select recipient or enter member ID" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject:</label>
                  <Input placeholder="Enter subject" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message:</label>
                  <Textarea 
                    placeholder="Type your message here..." 
                    className="min-h-[200px]"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setNewMessage(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : selectedMessage ? (
            <Card className="glass-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      From: {selectedMessage.from} • {selectedMessage.date}
                    </p>
                  </div>
                  <Badge className={getPriorityColor(selectedMessage.priority)}>
                    {selectedMessage.priority} priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedMessage.preview}
                    <br /><br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                    <br /><br />
                    Best regards,<br />
                    {selectedMessage.from.split(' (')[0]}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <Button variant="outline">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card">
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No message selected</h3>
                <p className="text-gray-600">Select a message from the inbox to view its contents</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesCenter;
