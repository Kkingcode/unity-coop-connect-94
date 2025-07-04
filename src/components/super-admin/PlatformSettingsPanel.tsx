
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Globe, 
  CreditCard, 
  Shield, 
  Bell,
  Save,
  Palette,
  Database
} from 'lucide-react';
import { useSuperAdminState } from '@/hooks/useSuperAdminState';

const PlatformSettingsPanel = () => {
  const { platformSettings, setPlatformSettings } = useSuperAdminState();
  const [settings, setSettings] = useState(platformSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (section: string, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [section]: {
        ...settings[section as keyof typeof settings],
        [key]: value
      }
    };
    setSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    setPlatformSettings(settings);
    setHasChanges(false);
    console.log('Platform settings saved:', settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600">Configure global platform settings and preferences</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={settings.general.platformName}
                    onChange={(e) => handleSettingChange('general', 'platformName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => handleSettingChange('general', 'supportEmail', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.general.supportPhone}
                    onChange={(e) => handleSettingChange('general', 'supportPhone', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={settings.general.timezone}
                    onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="Africa/Lagos">Africa/Lagos</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <select
                    id="currency"
                    value={settings.general.currency}
                    onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="NGN">Nigerian Naira (NGN)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <select
                    id="language"
                    value={settings.general.language}
                    onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="en">English</option>
                    <option value="yo">Yoruba</option>
                    <option value="ha">Hausa</option>
                    <option value="ig">Igbo</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="gracePeriod">Grace Period (Days)</Label>
                  <Input
                    id="gracePeriod"
                    type="number"
                    value={settings.billing.gracePeriodDays}
                    onChange={(e) => handleSettingChange('billing', 'gracePeriodDays', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-600">Days after due date before suspension warning</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="warningDays">Warning Period (Days)</Label>
                  <Input
                    id="warningDays"
                    type="number"
                    value={settings.billing.suspensionWarningDays}
                    onChange={(e) => handleSettingChange('billing', 'suspensionWarningDays', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-600">Days before automatic suspension</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="autoSuspend">Auto-Suspend After (Days)</Label>
                  <Input
                    id="autoSuspend"
                    type="number"
                    value={settings.billing.autoSuspendAfterDays}
                    onChange={(e) => handleSettingChange('billing', 'autoSuspendAfterDays', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-600">Days after due date for automatic suspension</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Payment Gateways</Label>
                <div className="space-y-2">
                  {['paystack', 'flutterwave', 'stripe', 'paypal'].map((gateway) => (
                    <div key={gateway} className="flex items-center space-x-2">
                      <Switch
                        checked={settings.billing.paymentGateways.includes(gateway)}
                        onCheckedChange={(checked) => {
                          const gateways = checked 
                            ? [...settings.billing.paymentGateways, gateway]
                            : settings.billing.paymentGateways.filter(g => g !== gateway);
                          handleSettingChange('billing', 'paymentGateways', gateways);
                        }}
                      />
                      <Label className="capitalize">{gateway}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Password Policy</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={settings.security.passwordPolicy.minLength}
                      onChange={(e) => handleSettingChange('security', 'passwordPolicy', {
                        ...settings.security.passwordPolicy,
                        minLength: parseInt(e.target.value)
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (Minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.security.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => handleSettingChange('security', 'passwordPolicy', {
                        ...settings.security.passwordPolicy,
                        requireUppercase: checked
                      })}
                    />
                    <Label>Require Uppercase Letters</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.security.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => handleSettingChange('security', 'passwordPolicy', {
                        ...settings.security.passwordPolicy,
                        requireNumbers: checked
                      })}
                    />
                    <Label>Require Numbers</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.security.passwordPolicy.requireSpecialChars}
                      onCheckedChange={(checked) => handleSettingChange('security', 'passwordPolicy', {
                        ...settings.security.passwordPolicy,
                        requireSpecialChars: checked
                      })}
                    />
                    <Label>Require Special Characters</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Platform Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Trial Period</Label>
                    <p className="text-sm text-gray-600">Allow new cooperatives to start with a trial period</p>
                  </div>
                  <Switch
                    checked={settings.features.enableTrialPeriod}
                    onCheckedChange={(checked) => handleSettingChange('features', 'enableTrialPeriod', checked)}
                  />
                </div>
                
                {settings.features.enableTrialPeriod && (
                  <div className="ml-4 space-y-2">
                    <Label htmlFor="trialDuration">Trial Duration (Days)</Label>
                    <Input
                      id="trialDuration"
                      type="number"
                      value={settings.features.trialDurationDays}
                      onChange={(e) => handleSettingChange('features', 'trialDurationDays', parseInt(e.target.value))}
                      className="w-32"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Referral Program</Label>
                    <p className="text-sm text-gray-600">Enable referral bonuses for existing cooperatives</p>
                  </div>
                  <Switch
                    checked={settings.features.enableReferralProgram}
                    onCheckedChange={(checked) => handleSettingChange('features', 'enableReferralProgram', checked)}
                  />
                </div>
                
                {settings.features.enableReferralProgram && (
                  <div className="ml-4 space-y-2">
                    <Label htmlFor="referralBonus">Referral Bonus (NGN)</Label>
                    <Input
                      id="referralBonus"
                      type="number"
                      value={settings.features.referralBonus}
                      onChange={(e) => handleSettingChange('features', 'referralBonus', parseInt(e.target.value))}
                      className="w-32"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900">System Information</h3>
                  <div className="mt-2 space-y-1 text-sm text-blue-800">
                    <p>Platform Version: v2.1.0</p>
                    <p>Database Status: Connected</p>
                    <p>Last Backup: 2 hours ago</p>
                    <p>Server Status: Operational</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 text-left">
                    <div>
                      <h4 className="font-medium">Database Backup</h4>
                      <p className="text-sm text-gray-600">Create a manual backup</p>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 text-left">
                    <div>
                      <h4 className="font-medium">System Logs</h4>
                      <p className="text-sm text-gray-600">View system activity logs</p>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 text-left">
                    <div>
                      <h4 className="font-medium">Cache Management</h4>
                      <p className="text-sm text-gray-600">Clear system cache</p>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 text-left">
                    <div>
                      <h4 className="font-medium">Performance Monitor</h4>
                      <p className="text-sm text-gray-600">Check system performance</p>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlatformSettingsPanel;
