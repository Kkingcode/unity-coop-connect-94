
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { UserRole } from '@/pages/Index';
import { authService, AuthUser } from '@/services/authService';
import { toast } from 'sonner';

interface LoginScreenProps {
  onLogin: (role: UserRole, userData: AuthUser) => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Demo accounts for testing
      if (accountNumber === 'SUPER001' && password === 'super123') {
        onLogin('super_admin', { 
          id: 'super001', 
          name: 'Super Administrator', 
          role: 'super_admin',
          phone: '+2348000000001',
          account_number: 'SUPER001',
          status: 'active'
        } as AuthUser);
        setIsLoading(false);
        return;
      }
      
      if (accountNumber === 'ADMIN001' && password === 'admin123') {
        onLogin('admin', { 
          id: 'admin001', 
          name: 'Main Administrator', 
          role: 'admin',
          phone: '+2348000000002',
          account_number: 'ADMIN001',
          status: 'active'
        } as AuthUser);
        setIsLoading(false);
        return;
      }

      // Real authentication with Supabase
      const user = await authService.login({
        accountNumber,
        password
      });

      if (user) {
        toast.success(`Welcome back, ${user.name || 'User'}!`);
        onLogin(user.role, user);
      } else {
        setError('Invalid account number or password. Please check and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Alajeseku.com</h1>
          <p className="text-gray-600">Your Cooperative Management Platform</p>
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
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="Enter your account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
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
                  Super Admin: SUPER001 + super123
                </span>
                <br />
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                  Admin: ADMIN001 + admin123
                </span>
                <br />
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                  Members: Use account number + phone as password
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
