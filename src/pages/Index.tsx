
import { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import LoginScreen from '@/components/LoginScreen';
import MemberDashboard from '@/components/MemberDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import LoanApplication from '@/components/LoanApplication';
import TransactionHistory from '@/components/TransactionHistory';

export type UserRole = 'member' | 'admin' | null;
export type Screen = 'splash' | 'login' | 'member-dashboard' | 'admin-dashboard' | 'loan-application' | 'transaction-history';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setCurrentScreen('login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (role: UserRole, userData: any) => {
    setUserRole(role);
    setUser(userData);
    setCurrentScreen(role === 'member' ? 'member-dashboard' : 'admin-dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setUser(null);
    setCurrentScreen('login');
  };

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'member-dashboard':
        return <MemberDashboard user={user} onNavigate={navigateToScreen} onLogout={handleLogout} />;
      case 'admin-dashboard':
        return <AdminDashboard user={user} onNavigate={navigateToScreen} onLogout={handleLogout} />;
      case 'loan-application':
        return <LoanApplication user={user} onNavigate={navigateToScreen} />;
      case 'transaction-history':
        return <TransactionHistory user={user} onNavigate={navigateToScreen} />;
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderScreen()}
    </div>
  );
};

export default Index;
