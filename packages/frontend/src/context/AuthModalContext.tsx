'use client';

import { createContext, useCallback, useContext, useState } from 'react';

export type AuthMode = 'login' | 'signup';

interface AuthModalContextValue {
  isOpen: boolean;
  mode: AuthMode;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  setMode: (mode: AuthMode) => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');

  const openAuth = useCallback((initialMode: AuthMode = 'login') => {
    setMode(initialMode);
    setIsOpen(true);
  }, []);
  const closeAuth = useCallback(() => setIsOpen(false), []);

  return (
    <AuthModalContext.Provider
      value={{ isOpen, mode, openAuth, closeAuth, setMode }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return ctx;
}
