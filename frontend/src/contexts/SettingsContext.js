import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import client from '../api/client';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/settings/public');
      setSettings(data.data || {});
    } catch {
      setSettings({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const getSetting = (key, defaultValue = '') => {
    if (!key) return defaultValue;
    if (settings && key in settings) {
      return settings[key];
    }
    return defaultValue;
  };

  const value = {
    settings,
    loading,
    getSetting,
    refreshSettings: fetchSettings,
  };

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export default SettingsContext;
