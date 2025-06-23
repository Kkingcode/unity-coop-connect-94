
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

  // Persist user login state
  const persistLogin = useCallback((userRole: string, userData: any) => {
    if (userRole === 'member' && sessionSettings.memberPersistentLogin) {
      localStorage.setItem('persistedUser', JSON.stringify({ role: userRole, data: userData }));
    }
    updateActivity();
  }, [sessionSettings.memberPersistentLogin, updateActivity]);

  // Get persisted login
  const getPersistedLogin = useCallback(() => {
    const persisted = localStorage.getItem('persistedUser');
    return persisted ? JSON.parse(persisted) : null;
  }, []);

  // Clear persisted login
  const clearPersistedLogin = useCallback(() => {
    localStorage.removeItem('persistedUser');
    localStorage.removeItem('lastActivity');
  }, []);

  return {
    sessionSettings,
    updateSessionSettings,
    updateActivity,
    shouldTimeoutAdmin,
    persistLogin,
    getPersistedLogin,
    clearPersistedLogin
  };
};
