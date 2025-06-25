
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  Shield, 
  Activity,
  Edit,
  UserCheck,
  UserX
} from 'lucide-react';
import { useSubAdminManager, SubAdmin } from '@/hooks/useSubAdminManager';

interface SubAdminDetailsModalProps {
  subAdmin: SubAdmin | null;
  isOpen: boolean;
  onClose: () => void;
}

const SubAdminDetailsModal = ({ subAdmin, isOpen, onClose }: SubAdminDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState('details');
  
  const { 
    getSubAdminPermissions, 
    getAuditLogsBySubAdmin, 
    toggleSubAdminStatus,
    allPermissions 
  } = useSubAdminManager();

  if (!subAdmin) return null;

  const permissions = getSubAdminPermissions(subAdmin.id);
  const auditLogs = getAuditLogsBySubAdmin(subAdmin.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <User className="h-5 w-5" />
              {subAdmin.name}
              <Badge className={getStatusColor(subAdmin.isActive)}>
                {subAdmin.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleSubAdminStatus(subAdmin.id)}
                className={subAdmin.isActive ? 'text-red-600' : 'text-green-600'}
              >
                {subAdmin.isActive ? (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Full Name</p>
                        <p className="text-gray-600">{subAdmin.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600">{subAdmin.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Username</p>
                        <p className="text-gray-600">{subAdmin.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Created</p>
                        <p className="text-gray-600">{formatDate(subAdmin.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Last Login</p>
                      <p className="text-gray-600">
                        {subAdmin.lastLogin ? formatDate(subAdmin.lastLogin) : 'Never'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Last Activity</p>
                      <p className="text-gray-600">
                        {subAdmin.lastActivity ? formatDate(subAdmin.lastActivity) : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Permissions</p>
                      <p className="text-2xl font-bold text-gray-900">{permissions.length}</p>
                    </div>
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Permission Coverage</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round((permissions.length / allPermissions.length) * 100)}%
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                <Card key={category} className="glass-card">
                  <CardHeader>
                    <CardTitle className="capitalize text-lg">
                      {category.replace('_', ' ')} Permissions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categoryPermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <Shield className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="font-medium text-sm">{permission.name}</p>
                            <p className="text-xs text-gray-600">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Activity Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{auditLogs.length}</p>
                    <p className="text-sm text-gray-600">Total Actions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {auditLogs.filter(log => log.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()).length}
                    </p>
                    <p className="text-sm text-gray-600">This Week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {auditLogs.filter(log => log.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).length}
                    </p>
                    <p className="text-sm text-gray-600">Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.slice(0, 10).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{log.action}</p>
                        <p className="text-xs text-gray-600">{log.details}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>{formatDate(log.timestamp)}</span>
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">{log.module}</Badge>
                          {log.amount && (
                            <>
                              <span>•</span>
                              <span className="font-medium">₦{log.amount.toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No activity recorded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SubAdminDetailsModal;
