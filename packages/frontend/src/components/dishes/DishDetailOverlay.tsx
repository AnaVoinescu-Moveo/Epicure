'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { strapiUrl } from '@/lib/strapi';
import { COPY } from '@/constants/copy';
import { useDishModal } from '@/context/DishModalContext';
import { useCart } from '@/context/CartContext';
import { useAuthModal } from '@/context/AuthModalContext';
import { useSearch } from '@/context/SearchContext';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import styles from './DishDetailOverlay.module.css';

interface DishDetailOverlayProps {
  footer: ReactNode;
}

export function DishDetailOverlay({ footer }: DishDetailOverlayProps) {
  const { selectedDish, closeDish } = useDishModal();
  const { addItem } = useCart();
  const { closeAuth } = useAuthModal();
  const { closeSearch } = useSearch();
  const [selectedSide, setSelectedSide] = useState<string | null>(null);
  const [selectedChanges, setSelectedChanges] = useState<Set<string>>(
    new Set(),
  );
  const [quantity, setQuantity] = useState(1);
  const isDesktop = useIsDesktop();
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedDish) return;
    setSelectedSide(null);
    setSelectedChanges(new Set());
    setQuantity(1);
    // Only the desktop layout needs this: that overlay is position: absolute
    // anchored at the document's top, so the page must scroll up to reveal
    // it. On mobile the overlay is position: fixed (covers the viewport),
    // so scrolling the real page underneath just strands the user at the
    // top once they close it, for no visible benefit while it's open.
    if (window.matchMedia('(min-width: 1024px)').matches) {
      window.scrollTo({ top: 0 });
    }
    scrollRef.current?.scrollTo({ top: 0 });
  }, [selectedDish?.documentId]);

  // Desktop renders the modal `position: absolute` over the page flow and
  // relies on scrolling the page itself to reach content below the
  // viewport (see the scrollTo comment above) — locking body scroll there
  // would make that content unreachable. Mobile is `position: fixed` with
  // its own internal scroll container, so locking the body is safe there.
  useScrollLock(!!selectedDish && !isDesktop);
  useEscapeKey(closeDish, !!selectedDish);
  useFocusTrap(pageRef, !!selectedDish);

  if (!selectedDish) return null;

  const { name, description, image, price, isSpicy, isVegetarian, isVegan } =
    selectedDish;
  const imageUrl = image ? strapiUrl(image.url) : null;

  const toggleChange = (option: string) => {
    setSelectedChanges((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  };

  return (
    <div className={styles.page} role="dialog" aria-modal="true" ref={pageRef}>
      <div className={styles.desktopModal}>
        <button
          type="button"
          className={styles.desktopCloseBtn}
          aria-label={COPY.dishDetail.closeAriaLabel}
          onClick={closeDish}
        >
          <Image src="/icons/whiteX.svg" alt="" width={18} height={18} />
        </button>

        <div className={styles.scroll} ref={scrollRef}>
          <div className={styles.header}>
            <button
              type="button"
              className={styles.closeBtn}
              aria-label={COPY.dishDetail.closeAriaLabel}
              onClick={closeDish}
            >
              <Image src="/icons/x.png" alt="" width={20} height={20} />
            </button>
          </div>

          <div className={styles.imageWrapper}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={image?.alternativeText ?? name}
                fill
                className={styles.image}
              />
            ) : (
              <div className={styles.imagePlaceholder} />
            )}
          </div>

          <div className={styles.content}>
            <h2 className={styles.title}>{name}</h2>
            {description && <p className={styles.description}>{description}</p>}

            {(isSpicy || isVegetarian || isVegan) && (
              <div className={styles.attributeIcons}>
                {isSpicy && (
                  <Image
                    src="/icons/Spicy.svg"
                    alt={COPY.signatureDishes.spicyAlt}
                    width={39}
                    height={30}
                  />
                )}
                {isVegetarian && (
                  <Image
                    src="/icons/Vegetarian.svg"
                    alt={COPY.signatureDishes.vegetarianAlt}
                    width={39}
                    height={30}
                  />
                )}
                {isVegan && (
                  <Image
                    src="/icons/Vegan.svg"
                    alt={COPY.signatureDishes.veganAlt}
                    width={39}
                    height={30}
                  />
                )}
              </div>
            )}

            <div className={styles.priceRow}>
              <span className={styles.priceLine} />
              <span className={styles.price}>
                {COPY.dishDetail.shekelSign}
                {price}
              </span>
              <span className={styles.priceLine} />
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  {COPY.dishDetail.chooseASideTitle}
                </h3>
                <div className={styles.divider} />
              </div>
              <div className={styles.optionsList}>
                {COPY.dishDetail.sideOptions.map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={styles.optionRow}
                    onClick={() => setSelectedSide(option)}
                  >
                    <Image
                      src={
                        selectedSide === option
                          ? '/images/full_circle.png'
                          : '/images/circle.png'
                      }
                      alt=""
                      width={18}
                      height={18}
                    />
                    <span className={styles.optionText}>{option}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  {COPY.dishDetail.changesTitle}
                </h3>
                <div className={styles.divider} />
              </div>
              <div className={styles.optionsList}>
                {COPY.dishDetail.changeOptions.map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={styles.optionRow}
                    onClick={() => toggleChange(option)}
                  >
                    <Image
                      src={
                        selectedChanges.has(option)
                          ? '/images/full_square.png'
                          : '/images/square.png'
                      }
                      alt=""
                      width={18}
                      height={18}
                    />
                    <span className={styles.optionText}>{option}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                {COPY.dishDetail.quantityTitle}
              </h3>
              <div className={styles.quantityRow}>
                <button
                  type="button"
                  aria-label={COPY.dishDetail.decreaseAriaLabel}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Image
                    src="/icons/minus.svg"
                    alt=""
                    width={17.5}
                    height={17.5}
                  />
                </button>
                <span className={styles.quantityValue}>{quantity}</span>
                <button
                  type="button"
                  aria-label={COPY.dishDetail.increaseAriaLabel}
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Image
                    src="/icons/plus.svg"
                    alt=""
                    width={17.5}
                    height={17.5}
                  />
                </button>
              </div>
            </div>

            <button
              type="button"
              className={styles.addToBagBtn}
              onClick={() => {
                closeAuth();
                closeSearch();
                addItem(
                  selectedDish,
                  selectedSide,
                  Array.from(selectedChanges),
                  quantity,
                );
                closeDish();
              }}
            >
              <Image
                src="/images/AddToBag.png"
                alt={COPY.dishDetail.addToBagAlt}
                width={206}
                height={48}
              />
            </button>
          </div>

          <div className={styles.mobileFooterSlot}>
            <div className={styles.fullWidthDivider} />
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
