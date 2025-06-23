
import { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import LoginScreen from '@/components/LoginScreen';
import MemberDashboard from '@/components/MemberDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import LoanApplication from '@/components/LoanApplication';
import TransactionHistory from '@/components/TransactionHistory';
import NotificationsCenter from '@/components/NotificationsCenter';
import MemberInvestmentDashboard from '@/components/MemberInvestmentDashboard';
import { useSessionManager } from '@/hooks/useSessionManager';

export type UserRole = 'member' | 'admin' | null;
export type Screen = 'splash' | 'login' | 'member-dashboard' | 'admin-dashboard' | 'loan-application' | 'transaction-history' | 'notifications-center' | 'member-investments';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [user, setUser] = useState<any>(null);
  const { 
    updateActivity, 
    shouldTimeoutAdmin, 
    persistLogin, 
    getPersistedLogin, 
    clearPersistedLogin 
  } = useSessionManager();

  useEffect(() => {
    // Check for persisted login first
    const persistedUser = getPersistedLogin();
    if (persistedUser) {
      setUserRole(persistedUser.role);
      setUser(persistedUser.data);
      setCurrentScreen(persistedUser.role === 'member' ? 'member-dashboard' : 'admin-dashboard');
    } else {
      // Show splash screen for 3 seconds only if no persisted login
      const timer = setTimeout(() => {
        setCurrentScreen('login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [getPersistedLogin]);

  // Check admin timeout
  useEffect(() => {
    if (userRole === 'admin') {
      const interval = setInterval(() => {
        if (shouldTimeoutAdmin()) {
          handleLogout();
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [userRole, shouldTimeoutAdmin]);

  // Track user activity for admin timeout
  useEffect(() => {
    if (userRole === 'admin') {
      const handleActivity = () => updateActivity();
      
      window.addEventListener('mousedown', handleActivity);
      window.addEventListener('keydown', handleActivity);
      window.addEventListener('scroll', handleActivity);
      
      return () => {
        window.removeEventListener('mousedown', handleActivity);
        window.removeEventListener('keydown', handleActivity);
        window.removeEventListener('scroll', handleActivity);
      };
    }
  }, [userRole, updateActivity]);

  const handleLogin = (role: UserRole, userData: any) => {
    setUserRole(role);
    setUser(userData);
    persistLogin(role, userData);
    setCurrentScreen(role === 'member' ? 'member-dashboard' : 'admin-dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setUser(null);
    clearPersistedLogin();
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
      case 'notifications-center':
        return <NotificationsCenter user={user} onNavigate={navigateToScreen} />;
      case 'member-investments':
        return <MemberInvestmentDashboard user={user} onNavigate={navigateToScreen} />;
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
