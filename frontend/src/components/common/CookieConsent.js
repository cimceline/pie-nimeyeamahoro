import React, { useState, useEffect } from 'react';

const CONSENT_KEY = 'cookie_consent';

const DEFAULT_PREFS = {
  necessary: true,
  analytics: false,
  marketing: false,
  external: false,
};

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  const acceptAll = () => {
    const all = { necessary: true, analytics: true, marketing: true, external: true };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(all));
    setVisible(false);
  };

  const acceptSelected = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs));
    setVisible(false);
  };

  const rejectAll = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(DEFAULT_PREFS));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-white border shadow-2xl rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Cookie Preferences</h3>
            <p className="text-sm text-gray-600 mb-4">
              We use cookies to improve your experience. Choose which cookies you allow.
            </p>

            {showDetails && (
              <div className="space-y-3 mb-4">
                {[
                  { key: 'necessary', label: 'Necessary', desc: 'Required for the site to function', disabled: true },
                  { key: 'analytics', label: 'Analytics', desc: 'Help us understand how visitors use the site' },
                  { key: 'marketing', label: 'Marketing', desc: 'Used to deliver relevant advertisements' },
                  { key: 'external', label: 'External Services', desc: 'Third-party integrations' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={prefs[item.key]}
                      disabled={item.disabled}
                      onChange={(e) => setPrefs(p => ({ ...p, [item.key]: e.target.checked }))}
                      className="rounded"
                    />
                    <div>
                      <span className="text-sm font-medium">{item.label}</span>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button onClick={acceptAll} className="px-4 py-2 bg-primary-700 text-white text-sm rounded-lg hover:bg-primary-800">
                Accept All
              </button>
              <button onClick={rejectAll} className="px-4 py-2 border text-sm rounded-lg hover:bg-gray-50">
                Reject All
              </button>
              <button onClick={() => setShowDetails(!showDetails)} className="px-4 py-2 border text-sm rounded-lg hover:bg-gray-50">
                {showDetails ? 'Hide' : 'Customize'}
              </button>
              {showDetails && (
                <button onClick={acceptSelected} className="px-4 py-2 bg-primary-100 text-primary-700 text-sm rounded-lg hover:bg-primary-200">
                  Save Preferences
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
