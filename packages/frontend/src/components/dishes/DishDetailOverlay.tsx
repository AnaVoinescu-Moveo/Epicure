'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { strapiUrl } from '@/lib/strapi';
import { COPY } from '@/constants/copy';
import { useDishModal } from '@/context/DishModalContext';
import styles from './DishDetailOverlay.module.css';

interface DishDetailOverlayProps {
  footer: ReactNode;
}

export function DishDetailOverlay({ footer }: DishDetailOverlayProps) {
  const { selectedDish, closeDish } = useDishModal();
  const [selectedSide, setSelectedSide] = useState<string | null>(null);
  const [selectedChanges, setSelectedChanges] = useState<Set<string>>(
    new Set(),
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedSide(null);
    setSelectedChanges(new Set());
    setQuantity(1);
  }, [selectedDish?.documentId]);

  if (!selectedDish) return null;

  const { name, description, image } = selectedDish;
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
    <div className={styles.page} role="dialog" aria-modal="true">
      <div className={styles.scroll}>
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
            onClick={closeDish}
          >
            <Image
              src="/images/AddToBag.png"
              alt={COPY.dishDetail.addToBagAlt}
              width={206}
              height={48}
            />
          </button>
        </div>

        <div className={styles.fullWidthDivider} />

        {footer}
      </div>
    </div>
  );
}
