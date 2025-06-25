
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, Calendar } from 'lucide-react';
import { useSubAdminManager } from '@/hooks/useSubAdminManager';

const SubAdminAuditLog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [filterSubAdmin, setFilterSubAdmin] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  
  const { auditLogs, subAdmins } = useSubAdminManager();

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.subAdminName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = filterModule === 'all' || log.module === filterModule;
    const matchesSubAdmin = filterSubAdmin === 'all' || log.subAdminId === filterSubAdmin;
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      
      switch (dateRange) {
        case 'today':
          matchesDate = logDate.toDateString() === now.toDateString();
          break;
        case 'week':
          matchesDate = logDate > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          matchesDate = logDate > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }
    }
    
    return matchesSearch && matchesModule && matchesSubAdmin && matchesDate;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action: string) => {
    if (action.includes('Created') || action.includes('Added')) return 'bg-green-100 text-green-800';
    if (action.includes('Updated') || action.includes('Modified')) return 'bg-blue-100 text-blue-800';
    if (action.includes('Deleted') || action.includes('Removed')) return 'bg-red-100 text-red-800';
    if (action.includes('Approved')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const modules = [...new Set(auditLogs.map(log => log.module))];

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Sub-Admin', 'Action', 'Module', 'Details', 'Affected Member', 'Amount', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.subAdminName,
        log.action,
        log.module,
        log.details,
        log.affectedMember || '',
        log.amount || '',
        log.ipAddress || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sub-admin-audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search audit logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {modules.map(module => (
                  <SelectItem key={module} value={module}>{module}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterSubAdmin} onValueChange={setFilterSubAdmin}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sub-Admin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sub-Admins</SelectItem>
                {subAdmins.map(subAdmin => (
                  <SelectItem key={subAdmin.id} value={subAdmin.id}>{subAdmin.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={exportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{filteredLogs.length}</p>
              <p className="text-sm text-gray-600">Total Actions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {filteredLogs.filter(log => log.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).length}
              </p>
              <p className="text-sm text-gray-600">Today</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {[...new Set(filteredLogs.map(log => log.subAdminId))].length}
              </p>
              <p className="text-sm text-gray-600">Active Sub-Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {filteredLogs.filter(log => log.amount && log.amount > 0).length}
              </p>
              <p className="text-sm text-gray-600">Financial Actions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Audit Log Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {log.module}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        by {log.subAdminName}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{log.details}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(log.timestamp)}
                      </div>
                      {log.affectedMember && (
                        <span>Member: {log.affectedMember}</span>
                      )}
                      {log.amount && (
                        <span className="font-medium text-green-600">
                          ₦{log.amount.toLocaleString()}
                        </span>
                      )}
                      {log.ipAddress && (
                        <span>IP: {log.ipAddress}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No audit log entries found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubAdminAuditLog;
