
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Shield, Bell, Database, Users, Mail } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { addActivity } = useAppState();
  
  const [settings, setSettings] = useState({
    organizationName: 'OLORUN NI NSOGO CO-OPERATIVE SOCIETY',
    maxLoanAmount: 500000,
    interestRate: 0,
    loanTerm: 24,
    minimumSavings: 10000,
    emailNotifications: true,
    smsNotifications: false,
    autoApproval: false,
    backupFrequency: 'weekly'
  });

  const handleSaveSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    addActivity({
      type: 'approval',
      description: `System setting updated: ${key}`,
      time: 'Just now'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  return (
    <div className="animate-slide-in-right">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Settings</h1>
        <p className="text-gray-600">Configure system settings and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Organization Name</label>
                <Input
                  value={settings.organizationName}
                  onChange={(e) => handleSaveSetting('organizationName', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Minimum Savings Amount</label>
                <Input
                  type="number"
                  value={settings.minimumSavings}
                  onChange={(e) => handleSaveSetting('minimumSavings', Number(e.target.value))}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Current: {formatCurrency(settings.minimumSavings)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Backup Frequency</label>
                <select 
                  className="w-full p-2 border rounded-lg"
                  value={settings.backupFrequency}
                  onChange={(e) => handleSaveSetting('backupFrequency', e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <Button className="bg-primary hover:bg-primary/90">
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Loan Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Maximum Loan Amount</label>
                <Input
                  type="number"
                  value={settings.maxLoanAmount}
                  onChange={(e) => handleSaveSetting('maxLoanAmount', Number(e.target.value))}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Current: {formatCurrency(settings.maxLoanAmount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Interest Rate (%)</label>
                <Input
                  type="number"
                  value={settings.interestRate}
                  onChange={(e) => handleSaveSetting('interestRate', Number(e.target.value))}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Current: {settings.interestRate}% annually
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Default Loan Term (weeks)</label>
                <Input
                  type="number"
                  value={settings.loanTerm}
                  onChange={(e) => handleSaveSetting('loanTerm', Number(e.target.value))}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Current: {settings.loanTerm} weeks
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium">Auto-approve small loans</label>
                  <p className="text-xs text-gray-600">Automatically approve loans under certain conditions</p>
                </div>
                <Switch
                  checked={settings.autoApproval}
                  onCheckedChange={(value) => handleSaveSetting('autoApproval', value)}
                />
              </div>

              <Button className="bg-primary hover:bg-primary/90">
                Save Loan Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium">Email Notifications</label>
                  <p className="text-xs text-gray-600">Send email notifications for important events</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(value) => handleSaveSetting('emailNotifications', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium">SMS Notifications</label>
                  <p className="text-xs text-gray-600">Send SMS notifications for urgent matters</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(value) => handleSaveSetting('smsNotifications', value)}
                />
              </div>

              <Button className="bg-primary hover:bg-primary/90">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Password Requirements</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                    <span>Minimum 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                    <span>Require uppercase and lowercase</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">✓</Badge>
                    <span>Require numbers</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Session Management</h4>
                <p className="text-sm text-gray-600 mb-3">Configure user session timeouts and security</p>
                <Button variant="outline" size="sm">
                  View Active Sessions
                </Button>
              </div>

              <div>
                <h4 className="font-medium mb-3">Data Backup</h4>
                <p className="text-sm text-gray-600 mb-3">Last backup: Today at 3:00 AM</p>
                <Button variant="outline" size="sm">
                  Backup Now
                </Button>
              </div>

              <Button className="bg-primary hover:bg-primary/90">
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
