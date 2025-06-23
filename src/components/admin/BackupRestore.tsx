
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Download, Upload, Database, Calendar, Clock, Shield } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const BackupRestore = () => {
  const { members, loans, investments, activities, adminLogs, feedback, addAdminLog } = useAppState();
  const [backupName, setBackupName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const createBackup = () => {
    const timestamp = new Date().toISOString();
    const backupData = {
      timestamp,
      version: '1.0',
      data: {
        members,
        loans,
        investments,
        activities,
        adminLogs,
        feedback
      },
      metadata: {
        totalMembers: members.length,
        totalLoans: loans.length,
        totalInvestments: investments.length,
        totalActivities: activities.length,
        backupName: backupName || `Backup-${new Date().toLocaleDateString()}`
      }
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ONCS-backup-${timestamp.split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    addAdminLog('ADMIN001', 'Admin User', 'Data Backup', 
      `Created system backup: ${backupName || 'Unnamed backup'}`);

    setBackupName('');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid JSON backup file');
    }
  };

  const restoreFromBackup = async () => {
    if (!selectedFile) return;

    try {
      const fileContent = await selectedFile.text();
      const backupData = JSON.parse(fileContent);
      
      // Validate backup structure
      if (!backupData.data || !backupData.timestamp) {
        throw new Error('Invalid backup file format');
      }

      // In a real app, this would restore data to the database
      console.log('Backup data:', backupData);
      
      addAdminLog('ADMIN001', 'Admin User', 'Data Restore', 
        `Restored system from backup: ${backupData.metadata?.backupName || 'Unknown'}`);

      alert('Backup restore completed successfully!');
      setSelectedFile(null);
    } catch (error) {
      console.error('Restore error:', error);
      alert('Failed to restore backup. Please check the file format.');
    }
  };

  const exportData = (dataType: string) => {
    let data: any[] = [];
    let filename = '';

    switch (dataType) {
      case 'members':
        data = members;
        filename = 'members-export';
        break;
      case 'loans':
        data = loans;
        filename = 'loans-export';
        break;
      case 'investments':
        data = investments;
        filename = 'investments-export';
        break;
      case 'activities':
        data = activities;
        filename = 'activities-export';
        break;
      default:
        return;
    }

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    addAdminLog('ADMIN001', 'Admin User', 'Data Export', 
      `Exported ${dataType} data (${data.length} records)`);
  };

  // Mock backup history (in real app, this would come from server)
  const backupHistory = [
    {
      id: 1,
      name: 'Daily Backup - June 23',
      date: '2024-06-23T08:00:00Z',
      size: '2.3 MB',
      type: 'automatic',
      status: 'completed'
    },
    {
      id: 2,
      name: 'Pre-Update Backup',
      date: '2024-06-22T15:30:00Z',
      size: '2.1 MB',
      type: 'manual',
      status: 'completed'
    },
    {
      id: 3,
      name: 'Weekly Backup - June 16',
      date: '2024-06-16T08:00:00Z',
      size: '2.0 MB',
      type: 'automatic',
      status: 'completed'
    }
  ];

  return (
    <div className="animate-slide-in-right">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Backup & Restore</h1>
        <p className="text-gray-600">Manage system backups and data recovery</p>
      </div>

      {/* Warning Banner */}
      <Card className="glass-card mb-6 bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">Important Notice</p>
              <p className="text-sm text-yellow-700">
                Always create a backup before making major changes. Restore operations cannot be undone.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Backup */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Create Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Backup Name (Optional)</label>
              <Input
                placeholder="Enter backup name"
                value={backupName}
                onChange={(e) => setBackupName(e.target.value)}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Backup will include:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• All member data ({members.length} records)</li>
                <li>• Loan information ({loans.length} records)</li>
                <li>• Investment data ({investments.length} records)</li>
                <li>• Activity logs ({activities.length} records)</li>
                <li>• Admin logs ({adminLogs.length} records)</li>
                <li>• Feedback & suggestions ({feedback.length} records)</li>
              </ul>
            </div>

            <Button 
              onClick={createBackup}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Create Full Backup
            </Button>
          </CardContent>
        </Card>

        {/* Restore Backup */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Restore from Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Backup File</label>
              <Input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
              />
              {selectedFile && (
                <p className="text-sm text-green-600 mt-1">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Warning</p>
                  <p className="text-sm text-red-700">
                    This will replace all current data with the backup data. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={restoreFromBackup}
              disabled={!selectedFile}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Restore from Backup
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Data Export Options */}
      <Card className="glass-card mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Individual Data Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: 'members', label: 'Members', count: members.length },
              { type: 'loans', label: 'Loans', count: loans.length },
              { type: 'investments', label: 'Investments', count: investments.length },
              { type: 'activities', label: 'Activities', count: activities.length }
            ].map((item) => (
              <div key={item.type} className="border rounded-lg p-4 text-center">
                <h4 className="font-medium mb-2">{item.label}</h4>
                <p className="text-sm text-gray-600 mb-3">{item.count} records</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportData(item.type)}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card className="glass-card mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Backup History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backupHistory.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{backup.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(backup.date).toLocaleString()}</span>
                      <span>• {backup.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={backup.type === 'automatic' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                    {backup.type}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800">
                    {backup.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupRestore;
