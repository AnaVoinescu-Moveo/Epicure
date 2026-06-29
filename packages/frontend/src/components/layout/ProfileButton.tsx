'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { COPY } from '../../constants/copy';
import { useAuthModal } from '../../context/AuthModalContext';
import { useCart } from '../../context/CartContext';
import { useSearch } from '../../context/SearchContext';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useIsClickedOutside } from '../../hooks/useIsClickedOutside';
import headerStyles from './HeaderIcons.module.css';
import styles from './ProfileButton.module.css';

export function ProfileButton() {
  const { openAuth, isAuthenticated, userName, logout } = useAuthModal();
  const { closeCart } = useCart();
  const { closeSearch } = useSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEscapeKey(() => setIsMenuOpen(false), isMenuOpen);
  useIsClickedOutside(wrapperRef, () => setIsMenuOpen(false), isMenuOpen);

  const handleClick = () => {
    if (isAuthenticated) {
      if (!isMenuOpen) {
        closeCart();
        closeSearch();
      }
      setIsMenuOpen((open) => !open);
      return;
    }
    closeCart();
    closeSearch();
    openAuth('login');
  };

  const handleLogOut = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={headerStyles.iconBtn}
        aria-label={COPY.header.profileAriaLabel}
        onClick={handleClick}
      >
        <Image
          src="/icons/profile.png"
          alt=""
          width={20}
          height={20}
          className={`${headerStyles.iconSm} ${headerStyles.profileIcon}`}
        />
        {isAuthenticated && (
          <span className={headerStyles.authDot} aria-hidden="true" />
        )}
      </button>

      {isMenuOpen && (
        <div className={styles.dropdown} role="menu">
          <p className={styles.greeting}>
            {COPY.auth.helloName(userName ?? '')}
          </p>
          <button
            type="button"
            className={styles.logOutBtn}
            onClick={handleLogOut}
          >
            {COPY.auth.signOutLabel}
          </button>
        </div>
      )}
    </div>
  );
}
