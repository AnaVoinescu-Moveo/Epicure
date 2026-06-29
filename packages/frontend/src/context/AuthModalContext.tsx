'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export type AuthMode = 'login' | 'signup';

const TOKEN_STORAGE_KEY = 'epicure_token';

interface AuthModalContextValue {
  isOpen: boolean;
  mode: AuthMode;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  setMode: (mode: AuthMode) => void;
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

interface DecodedToken {
  email?: string;
  firstName?: string;
  exp?: number;
}

// The JWT is signed but not encrypted — decoding the payload client-side to
// read these fields is safe; it's the same data the server already vouched
// for when it issued the token. Returns null for a malformed OR expired token.
function decodeToken(token: string): DecodedToken | null {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    const decoded = JSON.parse(json) as DecodedToken;
    if (decoded.exp && Date.now() >= decoded.exp * 1000) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const openAuth = useCallback((initialMode: AuthMode = 'login') => {
    setMode(initialMode);
    setIsOpen(true);
  }, []);
  const closeAuth = useCallback(() => setIsOpen(false), []);

  const login = useCallback((token: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    const decoded = decodeToken(token);
    setUserEmail(decoded?.email ?? null);
    setUserName(decoded?.firstName ?? null);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // Storage may be unavailable (e.g. Safari private mode) — state reset still happens below.
    }
    setUserEmail(null);
    setUserName(null);
  }, []);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return;
    }
    if (!stored) return;
    const decoded = decodeToken(stored);
    if (!decoded) {
      logout();
      return;
    }
    setUserEmail(decoded.email ?? null);
    setUserName(decoded.firstName ?? null);
  }, [logout]);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        openAuth,
        closeAuth,
        setMode,
        isAuthenticated: userEmail !== null,
        userEmail,
        userName,
        login,
        logout,
      }}
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
