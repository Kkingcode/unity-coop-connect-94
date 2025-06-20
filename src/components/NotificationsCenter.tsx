
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Screen } from '@/pages/Index';

interface NotificationsCenterProps {
  user: any;
  onNavigate: (screen: Screen) => void;
}

interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
}

const NotificationsCenter = ({ user, onNavigate }: NotificationsCenterProps) => {
  const [filter, setFilter] = useState<string>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'success',
      title: 'Loan Application Approved',
      message: 'Your loan application for ₦150,000 has been approved. Funds will be disbursed within 24 hours.',
      timestamp: '2024-06-20 10:30 AM',
      read: false,
      actionRequired: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Payment Reminder',
      message: 'Your weekly loan repayment of ₦6,250 is due tomorrow. Please ensure sufficient balance.',
      timestamp: '2024-06-20 09:15 AM',
      read: false,
      actionRequired: true
    },
    {
      id: 3,
      type: 'info',
      title: 'Monthly Meeting Notice',
      message: 'The monthly cooperative meeting is scheduled for June 25th at 2:00 PM. Venue: Community Hall.',
      timestamp: '2024-06-19 04:00 PM',
      read: true,
      actionRequired: false
    },
    {
      id: 4,
      type: 'success',
      title: 'Savings Deposit Confirmed',
      message: 'Your savings deposit of ₦50,000 has been successfully recorded to your account.',
      timestamp: '2024-06-18 02:45 PM',
      read: true,
      actionRequired: false
    },
    {
      id: 5,
      type: 'info',
      title: 'System Maintenance',
      message: 'Scheduled system maintenance on June 22nd from 12:00 AM to 6:00 AM. Services may be temporarily unavailable.',
      timestamp: '2024-06-17 11:00 AM',
      read: true,
      actionRequired: false
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error': return <X className="h-5 w-5 text-red-600" />;
      case 'info': 
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'info': 
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('member-dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">Stay updated with important information</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-100 text-red-800">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        {/* Filter Tabs */}
        <Card className="glass-card mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2 flex-wrap">
              {['all', 'unread', 'info', 'success', 'warning', 'error'].map((filterType) => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(filterType)}
                  className={filter === filterType ? 'bg-primary text-white' : ''}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  {filterType === 'unread' && unreadCount > 0 && (
                    <Badge className="ml-2 bg-red-100 text-red-800 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`glass-card hover:shadow-lg transition-all duration-200 border-l-4 ${getNotificationColor(notification.type)}`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 rounded-lg bg-white">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{notification.title}</h3>
                        {!notification.read && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">New</Badge>
                        )}
                        {notification.actionRequired && (
                          <Badge className="bg-red-100 text-red-800 text-xs">Action Required</Badge>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{notification.message}</p>
                      <p className="text-sm text-gray-500">{notification.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs"
                      >
                        Mark Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteNotification(notification.id)}
                      className="text-xs text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'You have no notifications at the moment.' 
                  : `No ${filter} notifications found.`}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        {unreadCount > 0 && (
          <Card className="glass-card mt-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  You have {unreadCount} unread notifications
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    setNotifications(prev => 
                      prev.map(notif => ({ ...notif, read: true }))
                    );
                  }}
                >
                  Mark All as Read
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NotificationsCenter;
