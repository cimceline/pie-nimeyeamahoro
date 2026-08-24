import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

jest.mock('./contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }) => <>{children}</>,
  useTheme: () => ({ theme: 'light', setTheme: () => {} }),
}));

jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => <>{children}</>,
  useAuth: () => ({ user: null, isAuthenticated: false, loading: false }),
}));

jest.mock('./contexts/LanguageContext', () => ({
  LanguageProvider: ({ children }) => <>{children}</>,
  useLanguage: () => ({
    t: (key, fallback) => fallback || key,
    language: 'en',
    currentLanguage: 'en',
    availableLanguages: [{ code: 'en', name: 'English' }],
    setLanguage: () => {},
    translations: {},
    loading: false,
  }),
}));

jest.mock('./contexts/SettingsContext', () => ({
  SettingsProvider: ({ children }) => <>{children}</>,
  useSettings: () => ({ settings: {} }),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

test('renders without crashing', () => {
  render(
    <MemoryRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </MemoryRouter>
  );
});
