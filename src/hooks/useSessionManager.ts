
import { useState, useEffect, useCallback } from 'react';

interface SessionSettings {
  adminTimeoutMinutes: number;
  memberPersistentLogin: boolean;
}

const DEFAULT_SETTINGS: SessionSettings = {
  adminTimeoutMinutes: 480, // 8 hours
  memberPersistentLogin: true
};

export const useSessionManager = () => {
  const [sessionSettings, setSessionSettings] = useState<SessionSettings>(DEFAULT_SETTINGS);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('sessionSettings');
    if (savedSettings) {
      try {
        setSessionSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error parsing session settings:', error);
      }
    }

    const savedActivity = localStorage.getItem('lastActivity');
    if (savedActivity) {
      setLastActivity(parseInt(savedActivity));
    }
  }, []);

  // Save settings to localStorage
  const updateSessionSettings = useCallback((newSettings: Partial<SessionSettings>) => {
    const updated = { ...sessionSettings, ...newSettings };
    setSessionSettings(updated);
    localStorage.setItem('sessionSettings', JSON.stringify(updated));
  }, [sessionSettings]);

  // Update last activity - less frequent updates
  const updateActivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastActivity;
    
    // Only update if it's been more than 5 minutes since last update
    if (timeSinceLastUpdate > 300000) { // 5 minutes
      console.log('Updating activity timestamp');
      setLastActivity(now);
      localStorage.setItem('lastActivity', now.toString());
    }
  }, [lastActivity]);

  // Much more lenient timeout check
  const shouldTimeoutAdmin = useCallback(() => {
    const timeSinceActivity = Date.now() - lastActivity;
    const timeoutMs = sessionSettings.adminTimeoutMinutes * 60 * 1000;
    
    console.log(`Session check - Time since activity: ${Math.floor(timeSinceActivity / 60000)} minutes, Timeout threshold: ${Math.floor(timeoutMs / 60000)} minutes`);
    
    // Only timeout if significantly past the threshold
    const shouldTimeout = timeSinceActivity > (timeoutMs * 1.5); // 1.5x the timeout duration for safety
    
    if (shouldTimeout) {
      console.log('Session should timeout');
    }
    
    return shouldTimeout;
  }, [lastActivity, sessionSettings.adminTimeoutMinutes]);

  // Enhanced persist login function
  const persistLogin = useCallback((userRole: string, userData: any) => {
    console.log('Persisting login for role:', userRole);
    
    if (userRole === 'member' && sessionSettings.memberPersistentLogin) {
      localStorage.setItem('persistedUser', JSON.stringify({ 
        role: userRole, 
        data: userData,
        timestamp: Date.now()
      }));
    } else if (userRole === 'admin' || userRole === 'super_admin') {
      // For admins, don't persist but update activity
      updateActivity();
    }
  }, [sessionSettings.memberPersistentLogin, updateActivity]);

  // Enhanced get persisted login
  const getPersistedLogin = useCallback(() => {
    const persisted = localStorage.getItem('persistedUser');
    if (!persisted) return null;
    
    try {
      const parsed = JSON.parse(persisted);
      
      // For members, check if persistent login is enabled
      if (parsed.role === 'member' && sessionSettings.memberPersistentLogin) {
        return parsed;
      }
      
      // For admins/super_admins, don't allow persistent login but check session validity
      if (parsed.role === 'admin' || parsed.role === 'super_admin') {
        console.log('Admin session found, but not allowing persistent login');
        localStorage.removeItem('persistedUser');
        return null;
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing persisted user:', error);
      localStorage.removeItem('persistedUser');
      return null;
    }
  }, [sessionSettings.memberPersistentLogin]);

  // Clear persisted login
  const clearPersistedLogin = useCallback(() => {
    console.log('Clearing persisted login');
    localStorage.removeItem('persistedUser');
    localStorage.removeItem('lastActivity');
  }, []);

  // More lenient session validation
  const isSessionValid = useCallback((userRole: string) => {
    if (userRole === 'admin' || userRole === 'super_admin') {
      const isValid = !shouldTimeoutAdmin();
      console.log(`Session validation for ${userRole}:`, isValid);
      return isValid;
    }
    // Members don't timeout unless they manually log out
    return true;
  }, [shouldTimeoutAdmin]);

  return {
    sessionSettings,
    updateSessionSettings,
    updateActivity,
    shouldTimeoutAdmin,
    persistLogin,
    getPersistedLogin,
    clearPersistedLogin,
    isSessionValid
  };
};
