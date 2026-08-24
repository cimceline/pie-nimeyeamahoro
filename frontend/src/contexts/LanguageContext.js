import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LanguageContext = createContext(null);

const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'EN' },
  { code: 'fr', name: 'French', nativeName: 'FR' },
  { code: 'la', name: 'Latin', nativeName: 'LA' },
];

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  const loadTranslations = useCallback(async (lang) => {
    setLoading(true);
    try {
      const response = await import(`../locales/${lang}.json`);
      setTranslations(response.default);
    } catch {
      try {
        const fallback = await import('../locales/en.json');
        setTranslations(fallback.default);
      } catch {
        setTranslations({});
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTranslations(currentLanguage);
  }, [currentLanguage, loadTranslations]);

  const setLanguage = (code) => {
    setCurrentLanguage(code);
    localStorage.setItem('language', code);
    document.documentElement.lang = code;
  };

  const t = (key, defaultValue = '') => {
    if (!key) return defaultValue;
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }
    return typeof value === 'string' ? value : defaultValue;
  };

  const value = {
    currentLanguage,
    availableLanguages: AVAILABLE_LANGUAGES,
    translations,
    loading,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
