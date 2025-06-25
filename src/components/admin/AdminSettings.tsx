
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Clock, Shield, Users, Save } from 'lucide-react';
import { useSessionManager } from '@/hooks/useSessionManager';

const AdminSettings = () => {
  const { sessionSettings, updateSessionSettings } = useSessionManager();
  const [tempSettings, setTempSettings] = useState(sessionSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSessionSettings(tempSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-slide-in-right">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Settings</h1>
        <p className="text-gray-600">Configure system settings and security preferences</p>
      </div>

      <div className="space-y-6">
        {/* Session Management */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Session Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Admin Session Timeout (minutes)
              </label>
              <Input
                type="number"
                min="10"
                max="180"
                value={tempSettings.adminTimeoutMinutes}
                onChange={(e) => setTempSettings({
                  ...tempSettings,
                  adminTimeoutMinutes: parseInt(e.target.value) || 60
                })}
                className="w-32"
              />
              <p className="text-xs text-gray-600 mt-1">
                Admin will be automatically logged out after this period of inactivity (minimum 10 minutes)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Keep Members Logged In</p>
                <p className="text-sm text-gray-600">
                  Members stay logged in until they manually logout
                </p>
              </div>
              <Switch
                checked={tempSettings.memberPersistentLogin}
                onCheckedChange={(checked) => setTempSettings({
                  ...tempSettings,
                  memberPersistentLogin: checked
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Investment Grace Period */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Investment Grace Period
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Grace Period (weeks)
              </label>
              <Input
                type="number"
                min="1"
                max="8"
                defaultValue="3"
                className="w-32"
              />
              <p className="text-xs text-gray-600 mt-1">
                Additional time given to members before marking investment as defaulted
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Current Session</p>
                <Badge variant="secondary">Admin Active</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">System Status</p>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700"
            disabled={saved}
          >
            <Save className="h-4 w-4 mr-2" />
            {saved ? 'Settings Saved!' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
