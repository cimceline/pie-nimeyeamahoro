import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SHORTCUTS = [
  { keys: ['g', 'd'], action: 'Go to Dashboard', path: '/admin/dashboard', admin: true },
  { keys: ['g', 'p'], action: 'Go to Publications', path: '/admin/publications', admin: true },
  { keys: ['g', 's'], action: 'Go to Settings', path: '/admin/settings', admin: true },
  { keys: ['g', 'h'], action: 'Go to Home', path: '/', admin: false },
  { keys: ['?'], action: 'Show shortcuts', path: null, admin: false },
];

let shortcutBuffer = [];
let bufferTimeout = null;
let modalOpen = false;
let setModalOpenFn = null;

export function useKeyboardShortcuts(isAdmin = false) {
  const navigate = useNavigate();

  const handleKeyDown = useCallback((e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'Escape' && modalOpen && setModalOpenFn) {
      setModalOpenFn(false);
      modalOpen = false;
      return;
    }

    shortcutBuffer.push(e.key.toLowerCase());
    clearTimeout(bufferTimeout);
    bufferTimeout = setTimeout(() => { shortcutBuffer = []; }, 800);

    if (e.key === '?') {
      e.preventDefault();
      if (setModalOpenFn) {
        modalOpen = true;
        setModalOpenFn(true);
      }
      return;
    }

    const matched = SHORTCUTS.find(s => {
      if (s.admin && !isAdmin) return false;
      if (s.keys.length !== shortcutBuffer.length) return false;
      return s.keys.every((k, i) => k === shortcutBuffer[i]);
    });

    if (matched && matched.path) {
      e.preventDefault();
      navigate(matched.path);
      shortcutBuffer = [];
    }
  }, [navigate, isAdmin]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function ShortcutModal({ open, onClose }) {
  if (!open) return null;

  const adminShortcuts = SHORTCUTS.filter(s => s.admin);
  const generalShortcuts = SHORTCUTS.filter(s => !s.admin);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Keyboard Shortcuts</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <div className="space-y-4">
          {generalShortcuts.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Navigation</h4>
              {generalShortcuts.map(s => (
                <div key={s.keys.join('')} className="flex justify-between py-1">
                  <span className="text-sm">{s.action}</span>
                  <kbd className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{s.keys.join(' ')}</kbd>
                </div>
              ))}
            </div>
          )}
          {adminShortcuts.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Admin</h4>
              {adminShortcuts.map(s => (
                <div key={s.keys.join('')} className="flex justify-between py-1">
                  <span className="text-sm">{s.action}</span>
                  <kbd className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{s.keys.join(' ')}</kbd>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function useShortcutModal() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setModalOpenFn = setOpen;
    return () => { setModalOpenFn = null; };
  }, [setOpen]);
  return { open, setOpen };
}
