
import { useState, useCallback } from 'react';

export interface SubAdminPermission {
  id: string;
  name: string;
  description: string;
  category: 'members' | 'loans' | 'savings' | 'investments' | 'reports' | 'settings';
}

export interface SubAdmin {
  id: string;
  name: string;
  email: string;
  username: string;
  permissions: string[]; // Array of permission IDs
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  lastLogin?: string;
  lastActivity?: string;
}

export interface SubAdminAuditLog {
  id: string;
  subAdminId: string;
  subAdminName: string;
  action: string;
  module: string;
  details: string;
  affectedMember?: string;
  amount?: number;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

const ALL_PERMISSIONS: SubAdminPermission[] = [
  // Members Management
  { id: 'members.view', name: 'View Members', description: 'View member list and details', category: 'members' },
  { id: 'members.add', name: 'Add Members', description: 'Add new members', category: 'members' },
  { id: 'members.edit', name: 'Edit Members', description: 'Edit member information', category: 'members' },
  { id: 'members.suspend', name: 'Suspend Members', description: 'Suspend/activate members', category: 'members' },
  { id: 'members.delete', name: 'Delete Members', description: 'Delete member accounts', category: 'members' },
  
  // Loans Management
  { id: 'loans.view', name: 'View Loans', description: 'View loan applications and details', category: 'loans' },
  { id: 'loans.approve', name: 'Approve Loans', description: 'Approve/reject loan applications', category: 'loans' },
  { id: 'loans.payments', name: 'Record Payments', description: 'Record loan payments', category: 'loans' },
  { id: 'loans.modify', name: 'Modify Loans', description: 'Modify loan terms', category: 'loans' },
  
  // Savings Management
  { id: 'savings.view', name: 'View Savings', description: 'View savings accounts', category: 'savings' },
  { id: 'savings.allocate', name: 'Allocate Savings', description: 'Allocate member savings', category: 'savings' },
  { id: 'savings.withdraw', name: 'Process Withdrawals', description: 'Process savings withdrawals', category: 'savings' },
  
  // Investments Management
  { id: 'investments.view', name: 'View Investments', description: 'View investment products', category: 'investments' },
  { id: 'investments.create', name: 'Create Investments', description: 'Create new investment products', category: 'investments' },
  { id: 'investments.manage', name: 'Manage Investments', description: 'Manage existing investments', category: 'investments' },
  
  // Reports
  { id: 'reports.view', name: 'View Reports', description: 'View system reports', category: 'reports' },
  { id: 'reports.generate', name: 'Generate Reports', description: 'Generate custom reports', category: 'reports' },
  { id: 'reports.export', name: 'Export Reports', description: 'Export reports to files', category: 'reports' },
  
  // Settings
  { id: 'settings.view', name: 'View Settings', description: 'View system settings', category: 'settings' },
  { id: 'settings.modify', name: 'Modify Settings', description: 'Modify system settings', category: 'settings' },
  { id: 'settings.backup', name: 'Backup System', description: 'Create system backups', category: 'settings' }
];

const mockSubAdmins: SubAdmin[] = [
  {
    id: 'SUB001',
    name: 'John Assistant',
    email: 'john.assistant@oncs.com',
    username: 'john_assistant',
    permissions: ['members.view', 'members.add', 'loans.view', 'savings.view'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    createdBy: 'ADMIN001',
    lastLogin: '2024-01-20T14:30:00Z',
    lastActivity: '2024-01-20T16:45:00Z'
  }
];

const mockAuditLogs: SubAdminAuditLog[] = [
  {
    id: 'AUDIT001',
    subAdminId: 'SUB001',
    subAdminName: 'John Assistant',
    action: 'Added new member',
    module: 'Members',
    details: 'Added member: Jane Smith (ONCS004)',
    affectedMember: 'Jane Smith',
    timestamp: '2024-01-20T16:45:00Z',
    ipAddress: '192.168.1.100'
  }
];

export const useSubAdminManager = () => {
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>(mockSubAdmins);
  const [auditLogs, setAuditLogs] = useState<SubAdminAuditLog[]>(mockAuditLogs);

  const createSubAdmin = useCallback((subAdminData: Omit<SubAdmin, 'id' | 'createdAt' | 'createdBy'>) => {
    const newSubAdmin: SubAdmin = {
      ...subAdminData,
      id: `SUB${String(subAdmins.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      createdBy: 'ADMIN001' // Current admin ID
    };
    
    setSubAdmins(prev => [...prev, newSubAdmin]);
    
    // Log the creation
    logSubAdminAction(
      'ADMIN001',
      'Main Admin',
      'Created sub-admin',
      'Administration',
      `Created sub-admin: ${newSubAdmin.name} (${newSubAdmin.username})`
    );
    
    return newSubAdmin;
  }, [subAdmins.length]);

  const updateSubAdmin = useCallback((subAdminId: string, updates: Partial<SubAdmin>) => {
    setSubAdmins(prev => prev.map(subAdmin => 
      subAdmin.id === subAdminId ? { ...subAdmin, ...updates } : subAdmin
    ));
    
    const subAdmin = subAdmins.find(sa => sa.id === subAdminId);
    if (subAdmin) {
      logSubAdminAction(
        'ADMIN001',
        'Main Admin',
        'Updated sub-admin',
        'Administration',
        `Updated sub-admin: ${subAdmin.name} - ${Object.keys(updates).join(', ')}`
      );
    }
  }, [subAdmins]);

  const toggleSubAdminStatus = useCallback((subAdminId: string) => {
    const subAdmin = subAdmins.find(sa => sa.id === subAdminId);
    if (subAdmin) {
      updateSubAdmin(subAdminId, { isActive: !subAdmin.isActive });
      logSubAdminAction(
        'ADMIN001',
        'Main Admin',
        subAdmin.isActive ? 'Deactivated sub-admin' : 'Activated sub-admin',
        'Administration',
        `${subAdmin.isActive ? 'Deactivated' : 'Activated'} sub-admin: ${subAdmin.name}`
      );
    }
  }, [subAdmins, updateSubAdmin]);

  const logSubAdminAction = useCallback((
    subAdminId: string,
    subAdminName: string,
    action: string,
    module: string,
    details: string,
    affectedMember?: string,
    amount?: number
  ) => {
    const newLog: SubAdminAuditLog = {
      id: `AUDIT${String(auditLogs.length + 1).padStart(3, '0')}`,
      subAdminId,
      subAdminName,
      action,
      module,
      details,
      affectedMember,
      amount,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.100', // In real app, get actual IP
      userAgent: navigator.userAgent
    };
    
    setAuditLogs(prev => [...prev, newLog]);
  }, [auditLogs.length]);

  const hasPermission = useCallback((subAdminId: string, permissionId: string): boolean => {
    const subAdmin = subAdmins.find(sa => sa.id === subAdminId);
    return subAdmin?.permissions.includes(permissionId) || false;
  }, [subAdmins]);

  const getSubAdminPermissions = useCallback((subAdminId: string): SubAdminPermission[] => {
    const subAdmin = subAdmins.find(sa => sa.id === subAdminId);
    if (!subAdmin) return [];
    
    return ALL_PERMISSIONS.filter(permission => 
      subAdmin.permissions.includes(permission.id)
    );
  }, [subAdmins]);

  const getAuditLogsBySubAdmin = useCallback((subAdminId: string): SubAdminAuditLog[] => {
    return auditLogs.filter(log => log.subAdminId === subAdminId);
  }, [auditLogs]);

  const getRecentAuditLogs = useCallback((limit: number = 10): SubAdminAuditLog[] => {
    return auditLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }, [auditLogs]);

  return {
    subAdmins,
    auditLogs,
    allPermissions: ALL_PERMISSIONS,
    createSubAdmin,
    updateSubAdmin,
    toggleSubAdminStatus,
    logSubAdminAction,
    hasPermission,
    getSubAdminPermissions,
    getAuditLogsBySubAdmin,
    getRecentAuditLogs
  };
};
