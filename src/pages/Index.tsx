
import { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import LoginScreen from '@/components/LoginScreen';
import MemberDashboard from '@/components/MemberDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import SuperAdminDashboard from '@/components/super-admin/SuperAdminDashboard';
import LoanApplication from '@/components/LoanApplication';
import TransactionHistory from '@/components/TransactionHistory';
import NotificationsCenter from '@/components/NotificationsCenter';
import MemberInvestmentDashboard from '@/components/MemberInvestmentDashboard';
import { useSessionManager } from '@/hooks/useSessionManager';

export type UserRole = 'member' | 'admin' | 'super_admin' | null;
export type Screen = 'splash' | 'login' | 'member-dashboard' | 'admin-dashboard' | 'super-admin-dashboard' | 'loan-application' | 'transaction-history' | 'notifications-center' | 'member-investments';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [user, setUser] = useState<any>(null);
  const [loginError, setLoginError] = useState<string>('');
  const { 
    updateActivity, 
    shouldTimeoutAdmin, 
    persistLogin, 
    getPersistedLogin, 
    clearPersistedLogin,
    isSessionValid
  } = useSessionManager();

  useEffect(() => {
    // Check for persisted login first
    const persistedUser = getPersistedLogin();
    if (persistedUser) {
      // Validate session
      if (isSessionValid(persistedUser.role)) {
        console.log('Restoring session for:', persistedUser.role);
        setUserRole(persistedUser.role);
        setUser(persistedUser.data);
        setCurrentScreen(persistedUser.role === 'member' ? 'member-dashboard' : 
                        persistedUser.role === 'super_admin' ? 'super-admin-dashboard' : 'admin-dashboard');
        return;
      } else {
        // Session expired, clear it
        console.log('Session expired, clearing persisted login');
        clearPersistedLogin();
      }
    }
    
    // Show splash screen for 3 seconds only if no valid persisted login
    const timer = setTimeout(() => {
      setCurrentScreen('login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [getPersistedLogin, isSessionValid, clearPersistedLogin]);

  // Much less frequent admin timeout check - every 10 minutes
  useEffect(() => {
    if (userRole === 'admin' || userRole === 'super_admin') {
      console.log('Setting up session timeout check for:', userRole);
      
      const interval = setInterval(() => {
        console.log('Checking session timeout...');
        if (shouldTimeoutAdmin()) {
          console.log('Session timed out, logging out');
          handleLogout();
        }
      }, 600000); // Check every 10 minutes instead of 5 minutes

      return () => {
        console.log('Clearing session timeout interval');
        clearInterval(interval);
      };
    }
  }, [userRole, shouldTimeoutAdmin]);

  // Less aggressive activity tracking for admins
  useEffect(() => {
    if (userRole === 'admin' || userRole === 'super_admin') {
      const handleActivity = () => {
        updateActivity();
      };
      
      // Only track significant user interactions
      const events = ['click', 'keydown'];
      
      events.forEach(event => {
        window.addEventListener(event, handleActivity, { passive: true });
      });
      
      return () => {
        events.forEach(event => {
          window.removeEventListener(event, handleActivity);
        });
      };
    }
  }, [userRole, updateActivity]);

  const handleLogin = (role: UserRole, userData: any, loginCredentials?: { username: string; password: string }) => {
    console.log('Handling login for role:', role);
    
    // Clear any previous login errors
    setLoginError('');
    
    // Simple credential validation (replace with real authentication)
    if (loginCredentials) {
      const validCredentials = {
        admin: { username: 'admin', password: 'admin123' },
        member: { username: 'member', password: 'member123' },
        super_admin: { username: 'superadmin', password: 'super123' }
      };
      
      const expectedCreds = validCredentials[role as keyof typeof validCredentials];
      if (!expectedCreds || 
          loginCredentials.username !== expectedCreds.username || 
          loginCredentials.password !== expectedCreds.password) {
        setLoginError('Incorrect login details. Please check and try again.');
        return;
      }
    }
    
    setUserRole(role);
    setUser(userData);
    persistLogin(role, userData);
    
    // Handle routing based on role
    if (role === 'super_admin') {
      setCurrentScreen('super-admin-dashboard');
    } else {
      setCurrentScreen(role === 'member' ? 'member-dashboard' : 'admin-dashboard');
    }
    
    console.log(`${role} logged in successfully:`, userData);
  };

  const handleLogout = () => {
    console.log('User logged out');
    setUserRole(null);
    setUser(null);
    setLoginError('');
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
      case 'super-admin-dashboard':
        return <SuperAdminDashboard />;
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
