
import { useState, useEffect, useCallback } from 'react';

interface SessionSettings {
  adminTimeoutMinutes: number;
  memberPersistentLogin: boolean;
}

const DEFAULT_SETTINGS: SessionSettings = {
  adminTimeoutMinutes: 10,
  memberPersistentLogin: true
};

export const useSessionManager = () => {
  const [sessionSettings, setSessionSettings] = useState<SessionSettings>(DEFAULT_SETTINGS);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('sessionSettings');
    if (savedSettings) {
      setSessionSettings(JSON.parse(savedSettings));
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

  // Update last activity
  const updateActivity = useCallback(() => {
    const now = Date.now();
    setLastActivity(now);
    localStorage.setItem('lastActivity', now.toString());
  }, []);

  // Check if admin session should timeout
  const shouldTimeoutAdmin = useCallback(() => {
    const timeSinceActivity = Date.now() - lastActivity;
    const timeoutMs = sessionSettings.adminTimeoutMinutes * 60 * 1000;
    return timeSinceActivity > timeoutMs;
  }, [lastActivity, sessionSettings.adminTimeoutMinutes]);

  // Enhanced persist login function
  const persistLogin = useCallback((userRole: string, userData: any) => {
    // Always persist member login if setting is enabled
    if (userRole === 'member' && sessionSettings.memberPersistentLogin) {
      localStorage.setItem('persistedUser', JSON.stringify({ 
        role: userRole, 
        data: userData,
        timestamp: Date.now()
      }));
    }
    // Don't persist admin login, but update activity
    updateActivity();
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
      
      // For admins, don't allow persistent login
      if (parsed.role === 'admin') {
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
    localStorage.removeItem('persistedUser');
    localStorage.removeItem('lastActivity');
  }, []);

  // Check if current session is valid
  const isSessionValid = useCallback((userRole: string) => {
    if (userRole === 'admin') {
      return !shouldTimeoutAdmin();
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
