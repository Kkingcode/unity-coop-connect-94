
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Bell, Clock, AlertTriangle, Calendar, CheckCircle } from 'lucide-react';
import { Screen } from '@/pages/Index';

interface NotificationsCenterProps {
  user: any;
  onNavigate: (screen: Screen) => void;
}

const NotificationsCenter = ({ user, onNavigate }: NotificationsCenterProps) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'loan_reminder',
      title: 'Loan Payment Due',
      message: 'Your loan payment of ₦25,000 is due in 3 days',
      time: '2 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'savings_goal',
      title: 'Savings Goal Update',
      message: 'You\'re 80% towards your savings goal!',
      time: '1 day ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'event',
      title: 'Monthly Meeting',
      message: 'Monthly cooperative meeting scheduled for Dec 25th',
      time: '2 days ago',
      read: true,
      priority: 'low'
    },
    {
      id: 4,
      type: 'fine',
      title: 'Fine Applied',
      message: 'Late payment fine of ₦500 has been applied',
      time: '3 days ago',
      read: true,
      priority: 'high'
    }
  ]);

  const [settings, setSettings] = useState({
    loanReminders: true,
    savingsGoals: true,
    events: true,
    fines: true,
    pushNotifications: true
  });

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'loan_reminder': return <Clock className="h-5 w-5 text-orange-500" />;
      case 'savings_goal': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'event': return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'fine': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-200';
      case 'medium': return 'bg-yellow-100 border-yellow-200';
      case 'low': return 'bg-gray-100 border-gray-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('member-dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Notifications</h1>
            <p className="text-sm text-gray-600">Manage your alerts & reminders</p>
          </div>
        </div>

        {/* Notification Settings */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Notification Settings</CardTitle>
            <CardDescription>Configure your reminder preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Loan Reminders</span>
              <Switch 
                checked={settings.loanReminders}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, loanReminders: checked }))}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Savings Goals</span>
              <Switch 
                checked={settings.savingsGoals}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, savingsGoals: checked }))}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Events & Meetings</span>
              <Switch 
                checked={settings.events}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, events: checked }))}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Fine Notifications</span>
              <Switch 
                checked={settings.fines}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, fines: checked }))}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Push Notifications</span>
              <Switch 
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`glass-card cursor-pointer transition-all duration-200 ${
                !notification.read ? 'border-l-4 border-l-blue-500' : ''
              } ${getPriorityColor(notification.priority)}`}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-sm">{notification.title}</h3>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {notification.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Clear All Button */}
        <div className="mt-6 text-center">
          <Button variant="outline" className="w-full">
            Mark All as Read
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsCenter;
