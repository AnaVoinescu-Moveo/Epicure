'use client';

import { useState } from 'react';
import Image from 'next/image';
import { COPY } from '@/constants/copy';
import { useAuthModal } from '@/context/AuthModalContext';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import styles from './SignInModal.module.css';

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="1.5"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <line x1="2" y1="2" x2="22" y2="22" />}
    </svg>
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SignInModal() {
  const { isOpen, mode, setMode, closeAuth } = useAuthModal();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useScrollLock(isOpen);
  useEscapeKey(closeAuth, isOpen);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    closeAuth();
  };

  const switchMode = (next: 'login' | 'signup') => {
    resetForm();
    setMode(next);
  };

  const handleLogin = () => {
    if (!email || !password) return;
    if (!isValidEmail(email)) {
      setError(COPY.auth.loginError);
      return;
    }
    // Backend isn't wired up yet — this will call the real /auth/login
    // endpoint once that step happens. For now there's nothing to submit.
    setError(null);
  };

  const handleSignUp = () => {
    if (!isValidEmail(email)) {
      setError(COPY.auth.signUpError);
      return;
    }
    if (password.length < 8 || password.length > 64) {
      setError(COPY.auth.signUpError);
      return;
    }
    if (password !== confirmPassword) {
      setError(COPY.auth.signUpError);
      return;
    }
    setError(null);
    // Backend isn't wired up yet — this will call the real /auth/register
    // endpoint once that step happens.
  };

  const canSubmitLogin = email.length > 0 && password.length > 0;
  const canSubmitSignUp =
    email.length > 0 && password.length > 0 && confirmPassword.length > 0;

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={
          mode === 'login' ? COPY.auth.signInTitle : COPY.auth.signUpTitle
        }
      >
        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label={COPY.auth.closeAriaLabel}
            onClick={handleClose}
          >
            <Image src="/icons/x.png" alt="" width={20} height={20} />
          </button>
        </div>

        <button
          type="button"
          className={styles.desktopCloseBtn}
          aria-label={COPY.auth.closeAriaLabel}
          onClick={handleClose}
        >
          <Image src="/icons/whiteX.svg" alt="" width={18} height={18} />
        </button>

        {mode === 'login' ? (
          <div className={styles.content}>
            <h2 className={styles.title}>{COPY.auth.signInTitle}</h2>
            <p className={styles.subtitle}>{COPY.auth.signInSubtitle}</p>

            <input
              type="email"
              className={styles.input}
              placeholder={COPY.auth.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className={styles.input}
              placeholder={COPY.auth.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="button"
              className={styles.loginBtn}
              disabled={!canSubmitLogin}
              onClick={handleLogin}
            >
              {COPY.auth.loginButton}
            </button>

            <button type="button" className={styles.forgotPassword}>
              {COPY.auth.forgotPassword}
            </button>

            <div className={styles.divider}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerText}>{COPY.auth.or}</span>
              <span className={styles.dividerLine} />
            </div>

            <button
              type="button"
              className={styles.signUpBtn}
              onClick={() => switchMode('signup')}
            >
              {COPY.auth.signUpButton}
            </button>
          </div>
        ) : (
          <div className={styles.content}>
            <h2 className={styles.title}>{COPY.auth.signUpTitle}</h2>

            <input
              type="email"
              className={styles.input}
              placeholder={COPY.auth.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder={COPY.auth.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                aria-label={
                  showPassword
                    ? COPY.auth.hidePasswordAriaLabel
                    : COPY.auth.showPasswordAriaLabel
                }
                onClick={() => setShowPassword((v) => !v)}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder={COPY.auth.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                aria-label={
                  showConfirmPassword
                    ? COPY.auth.hidePasswordAriaLabel
                    : COPY.auth.showPasswordAriaLabel
                }
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="button"
              className={styles.loginBtn}
              disabled={!canSubmitSignUp}
              onClick={handleSignUp}
            >
              {COPY.auth.signUpButton}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
