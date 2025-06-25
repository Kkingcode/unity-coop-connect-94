
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Eye, 
  Edit, 
  UserCheck, 
  UserX, 
  Shield, 
  Activity,
  Search,
  Settings,
  Users,
  Calendar,
  Clock
} from 'lucide-react';
import { useSubAdminManager, SubAdmin } from '@/hooks/useSubAdminManager';
import CreateSubAdminModal from './CreateSubAdminModal';
import SubAdminDetailsModal from './SubAdminDetailsModal';
import SubAdminAuditLog from './SubAdminAuditLog';

const SubAdminManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubAdmin, setSelectedSubAdmin] = useState<SubAdmin | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    subAdmins, 
    auditLogs, 
    toggleSubAdminStatus, 
    getRecentAuditLogs 
  } = useSubAdminManager();

  const filteredSubAdmins = subAdmins.filter(subAdmin =>
    subAdmin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subAdmin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subAdmin.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentAuditLogs = getRecentAuditLogs(5);

  const handleViewSubAdmin = (subAdmin: SubAdmin) => {
    setSelectedSubAdmin(subAdmin);
    setShowDetailsModal(true);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sub-Admin Management</h1>
          <p className="text-gray-600">Manage sub-administrators and their permissions</p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Sub-Admin
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sub-admins">Sub-Admins</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sub-Admins</p>
                    <p className="text-2xl font-bold text-gray-900">{subAdmins.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Sub-Admins</p>
                    <p className="text-2xl font-bold text-green-600">
                      {subAdmins.filter(sa => sa.isActive).length}
                    </p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Recent Actions</p>
                    <p className="text-2xl font-bold text-blue-600">{auditLogs.length}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Sub-Admin Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAuditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{log.action}</p>
                      <p className="text-xs text-gray-600">{log.details}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{log.subAdminName}</span>
                        <span>•</span>
                        <span>{formatDate(log.timestamp)}</span>
                        <span>•</span>
                        <Badge variant="secondary" className="text-xs">{log.module}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sub-admins" className="space-y-6">
          {/* Search Bar */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search sub-admins by name, email, or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sub-Admins List */}
          <div className="grid gap-4">
            {filteredSubAdmins.map((subAdmin) => (
              <Card key={subAdmin.id} className="glass-card hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{subAdmin.name}</h3>
                        <Badge className={getStatusColor(subAdmin.isActive)}>
                          {subAdmin.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {subAdmin.permissions.length} permissions
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><span className="font-medium">Username:</span> {subAdmin.username}</p>
                          <p><span className="font-medium">Email:</span> {subAdmin.email}</p>
                          <p><span className="font-medium">Created:</span> {formatDate(subAdmin.createdAt)}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Last Login:</span> {subAdmin.lastLogin ? formatDate(subAdmin.lastLogin) : 'Never'}</p>
                          <p><span className="font-medium">Last Activity:</span> {subAdmin.lastActivity ? formatDate(subAdmin.lastActivity) : 'Never'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSubAdmin(subAdmin)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewSubAdmin(subAdmin)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSubAdminStatus(subAdmin.id)}
                        className={subAdmin.isActive ? 'text-red-600' : 'text-green-600'}
                      >
                        {subAdmin.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit-logs">
          <SubAdminAuditLog />
        </TabsContent>
      </Tabs>

      <CreateSubAdminModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <SubAdminDetailsModal 
        subAdmin={selectedSubAdmin}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedSubAdmin(null);
        }}
      />
    </div>
  );
};

export default SubAdminManagement;
