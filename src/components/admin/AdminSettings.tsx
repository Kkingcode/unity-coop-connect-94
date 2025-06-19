
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Bell, Palette, DollarSign, Shield, Save } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    loanReminders: true,
    paymentAlerts: true,
    
    // App Settings
    defaultCurrency: 'NGN',
    interestRate: 10,
    maxLoanAmount: 500000,
    minSavingsBalance: 5000,
    
    // Theme Settings
    primaryColor: '#6C4AB6',
    enableDarkMode: false,
    
    // Security Settings
    sessionTimeout: 30,
    requireTwoFactor: false,
    passwordExpiry: 90
  });

  const handleSwitchChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleInputChange = (key: string, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  return (
    <div className="animate-slide-in-right">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600">Configure application preferences and policies</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Notification Settings */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <label className="font-medium">Email Notifications</label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <label className="font-medium">SMS Notifications</label>
                  <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                </div>
                <Switch 
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSwitchChange('smsNotifications', checked)}
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <label className="font-medium">Push Notifications</label>
                  <p className="text-sm text-gray-600">Browser push notifications</p>
                </div>
                <Switch 
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSwitchChange('pushNotifications', checked)}
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <label className="font-medium">Loan Reminders</label>
                  <p className="text-sm text-gray-600">Automatic payment reminders</p>
                </div>
                <Switch 
                  checked={settings.loanReminders}
                  onCheckedChange={(checked) => handleSwitchChange('loanReminders', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Configuration */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Application Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2">Default Currency</label>
                <Input 
                  value={settings.defaultCurrency}
                  onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
                  placeholder="NGN"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Default Interest Rate (%)</label>
                <Input 
                  type="number"
                  value={settings.interestRate}
                  onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Maximum Loan Amount</label>
                <Input 
                  type="number"
                  value={settings.maxLoanAmount}
                  onChange={(e) => handleInputChange('maxLoanAmount', Number(e.target.value))}
                />
                <p className="text-sm text-gray-600 mt-1">Current: {formatCurrency(settings.maxLoanAmount)}</p>
              </div>

              <div>
                <label className="block font-medium mb-2">Minimum Savings Balance</label>
                <Input 
                  type="number"
                  value={settings.minSavingsBalance}
                  onChange={(e) => handleInputChange('minSavingsBalance', Number(e.target.value))}
                />
                <p className="text-sm text-gray-600 mt-1">Current: {formatCurrency(settings.minSavingsBalance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <Input 
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Badge style={{ backgroundColor: settings.primaryColor, color: 'white' }}>
                    {settings.primaryColor}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <label className="font-medium">Dark Mode</label>
                  <p className="text-sm text-gray-600">Enable dark theme</p>
                </div>
                <Switch 
                  checked={settings.enableDarkMode}
                  onCheckedChange={(checked) => handleSwitchChange('enableDarkMode', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2">Session Timeout (minutes)</label>
                <Input 
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Password Expiry (days)</label>
                <Input 
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) => handleInputChange('passwordExpiry', Number(e.target.value))}
                />
              </div>

              <div className="flex justify-between items-center md:col-span-2">
                <div>
                  <label className="font-medium">Require Two-Factor Authentication</label>
                  <p className="text-sm text-gray-600">Enhanced security for admin accounts</p>
                </div>
                <Switch 
                  checked={settings.requireTwoFactor}
                  onCheckedChange={(checked) => handleSwitchChange('requireTwoFactor', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
