import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { UserRole } from '@/pages/Index';

interface LoginScreenProps {
  onLogin: (role: UserRole, userData: any) => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [memberID, setMemberID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate login delay
    setTimeout(() => {
      // Mock login logic with validation
      if (memberID === 'superadmin' && password === 'super123') {
        onLogin('super_admin', { id: 'superadmin', name: 'Super Admin', role: 'super_admin' });
      } else if (memberID === 'admin' && password === 'admin123') {
        onLogin('admin', { id: 'admin', name: 'Admin User', role: 'admin' });
      } else if (memberID && password) {
        // Check if password is correct (basic validation)
        if (password.length < 3) {
          setError('Incorrect login details. Please check and try again.');
          setIsLoading(false);
          return;
        }
        onLogin('member', { 
          id: memberID, 
          name: 'John Doe', 
          role: 'member',
          balance: 125000,
          savings: 45000,
          loanBalance: 25000
        });
      } else {
        setError('Incorrect login details. Please check and try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your ONCS account</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your member ID and password to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="memberID">Member ID</Label>
                <Input
                  id="memberID"
                  type="text"
                  placeholder="Enter your member ID"
                  value={memberID}
                  onChange={(e) => setMemberID(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-primary hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Demo credentials: <br />
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                  Member: any ID + password (min 3 chars)
                </span>
                <br />
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                  Admin: admin + admin123
                </span>
                <br />
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                  Super Admin: superadmin + super123
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
